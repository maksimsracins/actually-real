export type Verdict = "likely_ai" | "likely_real" | "uncertain";
export type ConfidenceBand = "low" | "medium" | "high";

export interface ScanSignal {
  type: "detector_api" | "exif" | "ela" | "c2pa";
  label: string;
  score: number | null;
  detail: Record<string, unknown>;
}

export interface HeatmapRegion {
  id: string;
  source: string;
  x: number;
  y: number;
  w: number;
  h: number;
  intensity: number;
  label: string;
}

export interface ExplanationCard {
  title: string;
  body: string;
  signalRef: string;
}

export interface ScanResult {
  scanId: string;
  verdict: Verdict;
  confidenceScore: number;
  confidenceBand: ConfidenceBand;
  signals: ScanSignal[];
  heatmap: {
    imageWidth: number;
    imageHeight: number;
    regions: HeatmapRegion[];
  };
  explanationCards: ExplanationCard[];
  createdAt: string;
  /** Signed Supabase Storage URL returned by the backend, if persistence succeeded. */
  imageUrl?: string;
  /** Local device URI (fresh scan) or falls back to imageUrl (loaded from history). */
  imageUri: string;
}
