import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { SCAN_IMAGES_BUCKET, supabaseAdmin } from "../services/supabase.js";
import type { ScanResult } from "../types.js";

export const historyRouter = Router();

const PAGE_SIZE = 30;
const SIGNED_URL_TTL_SECONDS = 60 * 60 * 24;

historyRouter.get("/scans", requireAuth, async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from("scans")
    .select("id, result, image_path, created_at")
    .eq("user_id", req.userId!)
    .order("created_at", { ascending: false })
    .limit(PAGE_SIZE);

  if (error) {
    console.error("History fetch failed", error);
    return res.status(500).json({ error: "Could not load scan history." });
  }

  const results: ScanResult[] = await Promise.all(
    data.map(async (row) => {
      const { data: signed } = await supabaseAdmin.storage
        .from(SCAN_IMAGES_BUCKET)
        .createSignedUrl(row.image_path, SIGNED_URL_TTL_SECONDS);
      return { ...(row.result as ScanResult), imageUrl: signed?.signedUrl };
    })
  );

  return res.json({ scans: results });
});
