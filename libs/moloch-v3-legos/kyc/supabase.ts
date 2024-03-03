import { createClient, SupabaseClient } from '@supabase/supabase-js';

export function initiateSupabase(): SupabaseClient {
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
export async function signInUser() {

  const shamanEmail: string | undefined = process.env.NX_SUPABASE_SHAMAN_USER_NAME;
  const shamanKey: string | undefined = process.env.NX_SUPABASE_SHAMAN_KEY;

  if (!shamanEmail || !shamanKey) {
    throw new Error(
      'Supabase URL or Anon Key is undefined. Please check your environment variables.'
    );
  }

  const supabase: SupabaseClient = initiateSupabase();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: shamanEmail,
    password: shamanKey,
  });

  if (error) {
    console.error('Error signing in:', error.message);
    return null;
  }

  console.log('User signed in:', data);
  return data;
}
