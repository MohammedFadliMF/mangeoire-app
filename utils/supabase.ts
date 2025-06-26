import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import "react-native-url-polyfill/auto";


export const supabase = createClient(
  // Config.SUPABASE_URL as string,
  // Config.SUPABASE_ANON_KEY as string,
  supabaseUrl, 
  supabaseAnonKey, 
  
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);
