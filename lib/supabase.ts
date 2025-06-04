import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hyphvhyngrqpkgjmrvdm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5cGh2aHluZ3JxcGtnam1ydmRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNTI3MDgsImV4cCI6MjA2NDYyODcwOH0.U_8mhdbVypDyesYWvcvF29VDfcLzHrP7RrECu_MTo-M';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
