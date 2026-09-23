// ============================================================
// Supabase Config — Zorvex Store
// ============================================================
const SUPABASE_URL = "https://mebsxocivxrcfkzpbgii.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lYnN4b2NpdnhyY2ZrenBiZ2lpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAxNDgxNzcsImV4cCI6MjEwNTcyNDE3N30.7euPLgf0RNqyWpqct7cT61XRM1sSPdfpYuncV2z8Dc0";

// Do not edit below this line
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
