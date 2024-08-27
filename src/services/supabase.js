import { createClient } from '@supabase/supabase-js'
export const supabaseUrl = 'https://hjcnwavumjijgeuzrjdm.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPA_BASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey)
export default supabase;