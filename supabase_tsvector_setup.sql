-- Create documents table with tsvector full-text search (from todo.md)
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  full_text TEXT,        -- OCR text here
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  -- Auto-generated search index using tsvector
  search_index tsvector GENERATED ALWAYS AS (
    to_tsvector('english', coalesce(full_text, ''))
  ) STORED
);

-- Create GIN index for fast full-text search
CREATE INDEX IF NOT EXISTS documents_search_idx ON documents USING GIN(search_index);

-- Enable Row Level Security
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own documents" ON documents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own documents" ON documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own documents" ON documents
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own documents" ON documents
  FOR DELETE USING (auth.uid() = user_id);
