import { createClient } from "@supabase/supabase-js";
import { Database } from "./supabase";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY as string;
const supabaseClient = createClient<Database>(SUPABASE_URL, SUPABASE_KEY);

export default supabaseClient;
