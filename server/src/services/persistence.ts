import { SCAN_IMAGES_BUCKET, supabaseAdmin } from "./supabase.js";
import type { ScanResult } from "../types.js";

const SIGNED_URL_TTL_SECONDS = 60 * 60 * 24; // 24h, regenerated fresh on each history read

// Persistence is best-effort and must never block returning the scan result
// to the user — a storage/DB hiccup shouldn't make an otherwise-successful
// scan look like a failure.
export async function persistScan(
  userId: string,
  result: ScanResult,
  imageBuffer: Buffer
): Promise<ScanResult> {
  const imagePath = `${userId}/${result.scanId}.jpg`;

  try {
    const { error: uploadError } = await supabaseAdmin.storage
      .from(SCAN_IMAGES_BUCKET)
      .upload(imagePath, imageBuffer, { contentType: "image/jpeg", upsert: true });
    if (uploadError) throw uploadError;

    const { data: signed, error: signedError } = await supabaseAdmin.storage
      .from(SCAN_IMAGES_BUCKET)
      .createSignedUrl(imagePath, SIGNED_URL_TTL_SECONDS);
    if (signedError) throw signedError;

    const { error: insertError } = await supabaseAdmin.from("scans").insert({
      id: result.scanId,
      user_id: userId,
      verdict: result.verdict,
      confidence_score: result.confidenceScore,
      confidence_band: result.confidenceBand,
      result,
      image_path: imagePath,
    });
    if (insertError) throw insertError;

    return { ...result, imageUrl: signed.signedUrl };
  } catch (err) {
    console.error("Scan persistence failed (non-fatal)", err);
    return result;
  }
}
