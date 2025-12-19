-- Create documents table with full-text search
CREATE TABLE IF NOT EXISTS documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Full-text search index (auto-generated from content)
  search_index tsvector GENERATED ALWAYS AS (
    to_tsvector('english', title || ' ' || content)
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

-- Function to search documents with ranking
CREATE OR REPLACE FUNCTION search_documents(
  search_query TEXT,
  user_uuid UUID DEFAULT auth.uid()
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  content TEXT,
  created_at TIMESTAMPTZ,
  rank REAL
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    d.id,
    d.title,
    d.content,
    d.created_at,
    ts_rank(d.search_index, plainto_tsquery('english', search_query)) as rank
  FROM documents d
  WHERE 
    d.user_id = user_uuid
    AND d.search_index @@ plainto_tsquery('english', search_query)
  ORDER BY rank DESC
  LIMIT 10;
END;
$$;
