import { createClient } from '@supabase/supabase-js';

// --- SIH Supabase Client ---
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://twmpcuomjllixninxldz.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3bXBjdW9tamxsaXhuaW54bGR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0MzM3MzgsImV4cCI6MjEwMjAwOTczOH0.FIlCEPbuKJ4U3rNJej-4yQrYe9CwoIFfT7G8Px9iUX4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- Aavishkar Supabase Client ---
const aavishkarUrl = import.meta.env.VITE_AAVISHKAR_SUPABASE_URL;
const aavishkarAnonKey = import.meta.env.VITE_AAVISHKAR_SUPABASE_ANON_KEY;

export const aavishkarSupabase = createClient(aavishkarUrl, aavishkarAnonKey);

export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';
