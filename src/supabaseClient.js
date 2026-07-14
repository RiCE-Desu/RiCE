import { createClient } from '@supabase/supabase-js';

// Ganti string di bawah ini dengan URL dan Key dari dashboard Supabase lu!
const supabaseUrl = 'https://rxuncgnuoejycyeescbp.supabase.co/';
const supabaseAnonKey = 'sb_publishable_TLfZLtLv5W-GV4Dysr_Flw_bu2pnl4L';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);