import sharp from "sharp";
import convert from "heic-convert";

// iOS captures/library photos default to HEIC, which sharp's bundled libvips
// build cannot decode in production (no libheif plugin). Anything downstream
// that needs sharp to actually decode pixels (ELA, dimension reads) must be
// normalized to JPEG first. EXIF/C2PA parsing don't go through sharp and
// read HEIC natively, so they intentionally keep using the original buffer.
const HEIC_BRANDS = new Set(["heic", "heix", "hevc", "hevx", "heim", "heis", "hevm", "hevs", "mif1", "msf1"]);

// Thrown for any image the pipeline genuinely cannot read — surfaced to the
// user as a clear message instead of a generic "scan failed" 500.
export class UnsupportedImageFormatError extends Error {}

function isHeic(buffer: Buffer): boolean {
  if (buffer.length < 12 || buffer.toString("ascii", 4, 8) !== "ftyp") return false;
  const brand = buffer.toString("ascii", 8, 12).trim().toLowerCase();
  return HEIC_BRANDS.has(brand);
}

export async function toSharpCompatibleJpeg(imageBuffer: Buffer): Promise<Buffer> {
  let buffer = imageBuffer;

  if (isHeic(imageBuffer)) {
    try {
      const output = await convert({ buffer: imageBuffer, format: "JPEG", quality: 0.92 });
      buffer = Buffer.from(output);
    } catch {
      throw new UnsupportedImageFormatError(
        "We couldn't read this photo. It may be corrupted — try a different photo."
      );
    }
  }

  // Catches everything else sharp can't decode (unsupported/corrupt formats)
  // before the pipeline sinks time into detection work that would only fail later.
  try {
    await sharp(buffer).metadata();
  } catch {
    throw new UnsupportedImageFormatError(
      "This image format isn't supported. Try a JPEG, PNG, or HEIC photo instead."
    );
  }

  return buffer;
}
