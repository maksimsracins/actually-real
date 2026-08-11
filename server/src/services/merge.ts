import sharp from "sharp";
import { runHeuristics } from "../heuristics/index.js";
import type {
  C2paSignal,
  ConfidenceBand,
  DetectorSignal,
  ElaSignal,
  ExifSignal,
  ExplanationCard,
  ScanResult,
  ScanSignal,
  Verdict,
} from "../types.js";

interface MergeInput {
  scanId: string;
  detectorSignal: DetectorSignal;
  heuristicSignals: Awaited<ReturnType<typeof runHeuristics>>;
  imageBuffer: Buffer;
}

// Weights reflect trust in each signal: the trained classifier is the
// strongest single predictor, ELA hotspots are real but noisy, EXIF absence
// is only a weak nudge (plenty of legitimately-real images strip it too).
const WEIGHT_DETECTOR = 0.6;
const WEIGHT_ELA = 0.25;
const WEIGHT_EXIF = 0.15;

export async function mergeSignals({
  scanId,
  detectorSignal,
  heuristicSignals,
  imageBuffer,
}: MergeInput): Promise<ScanResult> {
  const { signals: hSignals, regions } = heuristicSignals;
  const elaSignal = hSignals.find((s): s is ElaSignal => s.type === "ela")!;
  const exifSignal = hSignals.find((s): s is ExifSignal => s.type === "exif")!;
  const c2paSignal = hSignals.find((s): s is C2paSignal => s.type === "c2pa")!;

  let score =
    detectorSignal.score * WEIGHT_DETECTOR +
    elaSignal.score * WEIGHT_ELA +
    exifSignal.score * WEIGHT_EXIF;

  // A present+valid C2PA manifest is strong, mostly-unfakeable evidence of
  // real/attributed capture, so it overrides rather than just averages in.
  if (c2paSignal.detail.manifestFound) {
    score = c2paSignal.score! < 0.15 ? score * 0.3 : Math.min(1, score * 1.2);
  }
  score = Math.max(0, Math.min(1, score));

  const verdict: Verdict = score >= 0.65 ? "likely_ai" : score <= 0.35 ? "likely_real" : "uncertain";

  const agreement = 1 - Math.abs(detectorSignal.score - elaSignal.score);
  const distanceFromMid = Math.abs(score - 0.5) * 2;
  const confidenceBand: ConfidenceBand =
    distanceFromMid > 0.6 && agreement > 0.6 ? "high" : distanceFromMid > 0.3 ? "medium" : "low";

  const metadata = await sharp(imageBuffer).metadata();

  const signals: ScanSignal[] = [detectorSignal, ...hSignals];
  const explanationCards = buildExplanationCards({ detectorSignal, elaSignal, exifSignal, c2paSignal, verdict });

  return {
    scanId,
    verdict,
    confidenceScore: Number(score.toFixed(2)),
    confidenceBand,
    signals,
    heatmap: {
      imageWidth: metadata.width ?? 0,
      imageHeight: metadata.height ?? 0,
      regions,
    },
    explanationCards,
    createdAt: new Date().toISOString(),
  };
}

function buildExplanationCards(args: {
  detectorSignal: DetectorSignal;
  elaSignal: ElaSignal;
  exifSignal: ExifSignal;
  c2paSignal: C2paSignal;
  verdict: Verdict;
}): ExplanationCard[] {
  const { detectorSignal, elaSignal, exifSignal, c2paSignal } = args;
  const cards: ExplanationCard[] = [];

  if (detectorSignal.detail.topGenerator) {
    cards.push({
      title: `Pattern matches ${detectorSignal.detail.topGenerator}`,
      body: `Our detection model found this image's visual patterns most similar to output from ${detectorSignal.detail.topGenerator}.`,
      signalRef: "detector_api",
    });
  } else if (detectorSignal.score >= 0.65) {
    cards.push({
      title: "Detection model flagged this image",
      body: "Our trained detection model rates this image's visual patterns as consistent with AI generation, without pinpointing a specific generator.",
      signalRef: "detector_api",
    });
  } else if (detectorSignal.score <= 0.15) {
    cards.push({
      title: "Detection model found no AI signature",
      body: "Our trained detection model found no patterns consistent with known AI generators in this image.",
      signalRef: "detector_api",
    });
  }

  if (elaSignal.detail.hotspotCount > 0) {
    cards.push({
      title: "Unusual compression pattern",
      body: `${elaSignal.detail.hotspotCount} region(s) of this image compress differently than the rest — a pattern often seen where content was synthesized or edited rather than captured in one shot. See the highlighted areas above.`,
      signalRef: "ela",
    });
  }

  if (!exifSignal.detail.present) {
    cards.push({
      title: "No camera metadata",
      body: "This image has no embedded camera/capture information. Most AI generators produce none, but sharing or re-saving a real photo can strip it too — this alone isn't conclusive.",
      signalRef: "exif",
    });
  } else if (exifSignal.detail.camera) {
    cards.push({
      title: `Captured on ${exifSignal.detail.camera}`,
      body: "This image carries camera metadata consistent with a real capture device.",
      signalRef: "exif",
    });
  }

  if (c2paSignal.detail.manifestFound) {
    cards.push({
      title: "Content credentials found",
      body: "This image includes a C2PA content credentials manifest, which records its origin and edit history.",
      signalRef: "c2pa",
    });
  }

  return cards;
}
