import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

const { data, error } = await supabase.auth.signInAnonymously();
if (error) {
  console.error("FAILED:", error.message);
  process.exit(1);
}
console.log("OK, user id:", data.user.id);
console.log("ACCESS_TOKEN:", data.session.access_token);
