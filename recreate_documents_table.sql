-- Drop existing table and recreate with proper user isolation
DROP TABLE IF EXISTS documents CASCADE;

-- Create new documents table with proper user_id column
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  full_text TEXT,
  file_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  -- Auto-generated search index using tsvector
  search_index tsvector GENERATED ALWAYS AS (
    to_tsvector('english', coalesce(title, '') || ' ' || coalesce(full_text, ''))
  ) STORED
);

-- Create indexes
CREATE INDEX documents_user_id_idx ON documents(user_id);
CREATE INDEX documents_search_idx ON documents USING GIN(search_index);
CREATE INDEX documents_created_at_idx ON documents(created_at DESC);

-- Enable Row Level Security
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can only see their own documents" ON documents
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert with their own user_id" ON documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);
