import { createClient } from '@supabase/supabase-js'


const supabaseUrl = 'https://dcrzieqrgqpisbdgrore.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjcnppZXFyZ3FwaXNiZGdyb3JlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2NTMyMDksImV4cCI6MjA5MjIyOTIwOX0.hYjnaRN1Ot_3IUoVrJKTMvdvMlhEKVUrEgBYoWcbkSM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)