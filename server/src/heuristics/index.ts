import { runExifHeuristic } from "./exif.js";
import { runElaHeuristic } from "./ela.js";
import { runC2paHeuristic } from "./c2pa.js";
import type { HeatmapRegion, ScanSignal } from "../types.js";

export interface HeuristicResults {
  signals: ScanSignal[];
  regions: HeatmapRegion[];
}

export async function runHeuristics(originalBuffer: Buffer, sharpCompatibleBuffer: Buffer): Promise<HeuristicResults> {
  const [exifSignal, elaResult, c2paSignal] = await Promise.all([
    runExifHeuristic(originalBuffer),
    runElaHeuristic(sharpCompatibleBuffer),
    runC2paHeuristic(originalBuffer),
  ]);

  return {
    signals: [exifSignal, elaResult.signal, c2paSignal],
    regions: elaResult.regions,
  };
}
