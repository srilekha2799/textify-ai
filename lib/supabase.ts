import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mlpptmatynhquniwwbpu.supabase.co";
const supabaseAnonKey = "sb_publishable_ActilT4QOTeSRZrK_SJqog_jFxZyvgp";

export const supabase =
  createClient(
    supabaseUrl,
    supabaseAnonKey,
    {

      auth: {

        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    }
  );