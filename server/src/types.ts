export type Verdict = "likely_ai" | "likely_real" | "uncertain";
export type ConfidenceBand = "low" | "medium" | "high";

export interface DetectorSignal {
  type: "detector_api";
  label: string;
  score: number;
  detail: {
    topGenerator: string | null;
    perGenerator: Record<string, number>;
  };
}

export interface ExifSignal {
  type: "exif";
  label: string;
  score: number;
  detail: {
    present: boolean;
    camera: string | null;
    gps: boolean;
  };
}

export interface ElaSignal {
  type: "ela";
  label: string;
  score: number;
  detail: {
    meanError: number;
    hotspotCount: number;
  };
}

export interface C2paSignal {
  type: "c2pa";
  label: string;
  score: number | null;
  detail: {
    manifestFound: boolean;
    issuer?: string | null;
  };
}

export type ScanSignal = DetectorSignal | ExifSignal | ElaSignal | C2paSignal;

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
  /** Signed Supabase Storage URL for the uploaded image; absent if persistence failed non-fatally. */
  imageUrl?: string;
}
