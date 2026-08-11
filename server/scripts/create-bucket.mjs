import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const { data, error } = await supabase.storage.createBucket("scan-images", {
  public: false,
  fileSizeLimit: "15MB",
});

if (error && !error.message.includes("already exists")) {
  console.error("Bucket creation failed:", error.message);
  process.exit(1);
}
console.log("Bucket ready:", data ?? "(already existed)");
