import type { C2paSignal } from "../types.js";

// C2PA/content-credentials support is best-effort: the library is young,
// most images (real or AI) won't have a manifest yet, and a parse failure
// must never take down a scan. Presence of a valid manifest is a strong
// signal; absence proves nothing, so this never drives the primary verdict.
export async function runC2paHeuristic(imageBuffer: Buffer): Promise<C2paSignal> {
  try {
    const { createAsset } = await import("@trustnxt/c2pa-ts/asset");
    const { SuperBox } = await import("@trustnxt/c2pa-ts/jumbf");
    const { ManifestStore } = await import("@trustnxt/c2pa-ts/manifest");

    const asset = await createAsset(imageBuffer);
    const jumbf = await asset.getManifestJUMBF();

    if (!jumbf) {
      return {
        type: "c2pa",
        label: "Content Credentials",
        score: null,
        detail: { manifestFound: false },
      };
    }

    const superBox = SuperBox.fromBuffer(jumbf);
    const manifests = ManifestStore.read(superBox);
    const validation = await manifests.validate(asset);
    const isValid = Boolean((validation as { isValid?: boolean })?.isValid ?? true);

    return {
      type: "c2pa",
      label: "Content Credentials",
      // present + valid manifest is a meaningful negative (real) signal
      score: isValid ? 0.05 : 0.3,
      detail: { manifestFound: true },
    };
  } catch {
    // No manifest, unsupported format, or library error — treat as "no signal".
    return {
      type: "c2pa",
      label: "Content Credentials",
      score: null,
      detail: { manifestFound: false },
    };
  }
}
