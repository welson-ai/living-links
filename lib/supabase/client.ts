import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createBrowserClient(
  supabaseUrl ?? 'https://pqkdbbyyxjzwronsrxsy.supabase.co',
  supabaseKey ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxa2RiYnl5eGp6d3JvbnNyeHN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY1NjA0NDcsImV4cCI6MjEwMjEzNjQ0N30.xe8IoG_B13-xrdt4fG1jNrZJ71PesgU89F5zaaTzSco',
)
