-- Create medications table with user isolation
CREATE TABLE medications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  time TEXT NOT NULL,
  frequency TEXT DEFAULT 'daily',
  taken BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX medications_user_id_idx ON medications(user_id);
CREATE INDEX medications_taken_idx ON medications(taken);

-- Enable Row Level Security
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can only see their own medications" ON medications
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert with their own user_id" ON medications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

