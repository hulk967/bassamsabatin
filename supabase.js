import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const SUPABASE_URL = 'https://ellrkhgatpwopnmlmaht.supabase.co'

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsbHJraGdhdHB3b3BubWxtYWh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4NTU3OTgsImV4cCI6MjA5NDQzMTc5OH0.y5IJrojgulN0pPsgpw8q6zODn6riJ8LMcXTddhZrAMc'

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
)
