import exifr from "exifr";
const parseExif = exifr.parse;
import type { ExifSignal } from "../types.js";

export async function runExifHeuristic(imageBuffer: Buffer): Promise<ExifSignal> {
  let present = false;
  let camera: string | null = null;
  let gps = false;

  try {
    const data = await parseExif(imageBuffer, { gps: true });
    if (data) {
      const make = typeof data.Make === "string" ? data.Make.trim() : "";
      const model = typeof data.Model === "string" ? data.Model.trim() : "";
      camera = [make, model].filter(Boolean).join(" ") || null;
      gps = typeof data.latitude === "number" && typeof data.longitude === "number";
      present = Boolean(camera || data.DateTimeOriginal || gps);
    }
  } catch {
    present = false;
  }

  // Real cameras/phones almost always embed camera + capture metadata; AI
  // generators and most re-encoders strip it. Absence is a soft positive
  // signal for "AI/synthetic", not proof — many legitimate re-shares also
  // strip EXIF, so this is intentionally a small nudge, not a verdict driver.
  const score = present ? 0.15 : 0.55;

  return {
    type: "exif",
    label: "Metadata",
    score,
    detail: { present, camera, gps },
  };
}
