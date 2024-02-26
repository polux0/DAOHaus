import { createClient, SupabaseClient } from '@supabase/supabase-js';

export default function initiateSupabase(): SupabaseClient {
  // Access environment variables correctly using `process.env.VAR_NAME`
  const supabaseUrl: string | undefined = process.env.NX_SUPABASE_URL;
  const supabaseAnonKey: string | undefined = process.env.NX_SUPABASE_API_KEY;

  // Check if environment variables are defined
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Supabase URL or Anon Key is undefined. Please check your environment variables.'
    );
  }

  // Initialize and return the Supabase client
  const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  return supabase;
}
