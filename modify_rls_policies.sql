-- Modify RLS policies to allow agent access to documents and medications

-- Drop existing policies for documents
DROP POLICY IF EXISTS "Users can only see their own documents" ON documents;
DROP POLICY IF EXISTS "Users can only insert with their own user_id" ON documents;

-- Create new policies that allow both user access and agent access
CREATE POLICY "Users and agents can see documents" ON documents
  FOR SELECT USING (
    auth.uid() = user_id OR 
    auth.role() = 'anon'
  );

CREATE POLICY "Users and agents can insert documents" ON documents
  FOR INSERT WITH CHECK (
    auth.uid() = user_id OR 
    auth.role() = 'anon'
  );

CREATE POLICY "Users and agents can update documents" ON documents
  FOR UPDATE USING (
    auth.uid() = user_id OR 
    auth.role() = 'anon'
  );

CREATE POLICY "Users and agents can delete documents" ON documents
  FOR DELETE USING (
    auth.uid() = user_id OR 
    auth.role() = 'anon'
  );

-- Drop existing policies for medications
DROP POLICY IF EXISTS "Users can only see their own medications" ON medications;
DROP POLICY IF EXISTS "Users can only insert with their own user_id" ON medications;

-- Create new policies for medications
CREATE POLICY "Users and agents can see medications" ON medications
  FOR SELECT USING (
    auth.uid() = user_id OR 
    auth.role() = 'anon'
  );

CREATE POLICY "Users and agents can insert medications" ON medications
  FOR INSERT WITH CHECK (
    auth.uid() = user_id OR 
    auth.role() = 'anon'
  );

CREATE POLICY "Users and agents can update medications" ON medications
  FOR UPDATE USING (
    auth.uid() = user_id OR 
    auth.role() = 'anon'
  );

CREATE POLICY "Users and agents can delete medications" ON medications
  FOR DELETE USING (
    auth.uid() = user_id OR 
    auth.role() = 'anon'
  );
