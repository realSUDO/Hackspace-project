import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing env vars:', { supabaseUrl, supabaseAnonKey });
  throw new Error('Supabase URL or Anon Key is missing. Check .env file');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
