import sharp from "sharp";
import type { ElaSignal, HeatmapRegion } from "../types.js";

const ELA_QUALITY = 90;
const GRID_SIZE = 8;
// Grid cells whose mean error is this many stddevs above the image's own
// mean are flagged as hotspots. Relative-to-self, not an absolute threshold,
// since baseline noise varies a lot by camera/source.
const HOTSPOT_STDDEV_MULTIPLIER = 1.25;

export interface ElaResult {
  signal: ElaSignal;
  regions: HeatmapRegion[];
}

export async function runElaHeuristic(imageBuffer: Buffer): Promise<ElaResult> {
  const base = sharp(imageBuffer).rotate(); // normalize EXIF orientation
  const { data: originalRaw, info } = await base
    .clone()
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const recompressed = await base
    .clone()
    .jpeg({ quality: ELA_QUALITY })
    .toBuffer();

  const { data: recompressedRaw } = await sharp(recompressed)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const cellW = Math.max(1, Math.floor(width / GRID_SIZE));
  const cellH = Math.max(1, Math.floor(height / GRID_SIZE));

  const cellSums = new Float64Array(GRID_SIZE * GRID_SIZE);
  const cellCounts = new Int32Array(GRID_SIZE * GRID_SIZE);

  const len = Math.min(originalRaw.length, recompressedRaw.length);
  for (let px = 0; px < len; px += channels) {
    const pixelIndex = px / channels;
    const x = pixelIndex % width;
    const y = Math.floor(pixelIndex / width);
    const gx = Math.min(GRID_SIZE - 1, Math.floor(x / cellW));
    const gy = Math.min(GRID_SIZE - 1, Math.floor(y / cellH));
    const cell = gy * GRID_SIZE + gx;

    let diff = 0;
    for (let c = 0; c < channels; c++) {
      diff += Math.abs(originalRaw[px + c] - recompressedRaw[px + c]);
    }
    cellSums[cell] += diff / channels;
    cellCounts[cell] += 1;
  }

  const cellMeans = Array.from(cellSums).map((sum, i) => (cellCounts[i] ? sum / cellCounts[i] : 0));
  const overallMean = cellMeans.reduce((a, b) => a + b, 0) / cellMeans.length;
  const variance = cellMeans.reduce((a, b) => a + (b - overallMean) ** 2, 0) / cellMeans.length;
  const stddev = Math.sqrt(variance);
  const threshold = overallMean + stddev * HOTSPOT_STDDEV_MULTIPLIER;

  const regions: HeatmapRegion[] = [];
  cellMeans.forEach((mean, i) => {
    if (mean > threshold && stddev > 0.01) {
      const gx = i % GRID_SIZE;
      const gy = Math.floor(i / GRID_SIZE);
      const intensity = Math.min(1, (mean - overallMean) / (stddev * 3 || 1));
      regions.push({
        id: `ela-${gx}-${gy}`,
        source: "ela",
        x: gx / GRID_SIZE,
        y: gy / GRID_SIZE,
        w: 1 / GRID_SIZE,
        h: 1 / GRID_SIZE,
        intensity: Number(intensity.toFixed(2)),
        label: "Unusual compression pattern",
      });
    }
  });

  // Normalized 0-1 score: more hotspots + stronger deviation -> higher score.
  const score = Math.min(1, (regions.length / (GRID_SIZE * GRID_SIZE)) * 2 + (stddev > 0 ? Math.min(0.4, stddev / 50) : 0));

  return {
    signal: {
      type: "ela",
      label: "Compression Artifacts",
      score: Number(score.toFixed(2)),
      detail: {
        meanError: Number(overallMean.toFixed(2)),
        hotspotCount: regions.length,
      },
    },
    regions,
  };
}
