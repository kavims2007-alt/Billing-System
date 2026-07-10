import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Configured through Vite env vars (see .env.example). When they are absent the
// app transparently falls back to the built-in localStorage auth, so the UI
// keeps working before Supabase is set up.
const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient | null =
  url && anonKey ? createClient(url, anonKey) : null;

export const isSupabaseEnabled = Boolean(supabase);
