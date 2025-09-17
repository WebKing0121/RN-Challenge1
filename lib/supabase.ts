import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

console.log('🔧 Initializing Supabase client');

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Disable email confirmation for development
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  global: {
    headers: {
      'X-Client-Info': 'mindfuljournal-app',
    },
  },
});

// Export types for TypeScript support
export interface JournalEntry {
  id: number;
  user_id: string;
  content: string;
  mood: string;
  created_at: string;
}
