import type { DetectorSignal } from "../types.js";

const SIGHTENGINE_ENDPOINT = "https://api.sightengine.com/1.0/check.json";

interface SightEngineResponse {
  status: string;
  type?: {
    ai_generated?: number;
  };
  // some SightEngine plans return a per-model breakdown under this key
  ai_generated?: {
    prob?: number;
    [modelName: string]: number | undefined;
  };
  error?: {
    message: string;
  };
}

export class SightEngineError extends Error {}

export async function detectAiGenerated(imageBuffer: Buffer, filename: string): Promise<DetectorSignal> {
  const apiUser = process.env.SIGHTENGINE_API_USER;
  const apiSecret = process.env.SIGHTENGINE_API_SECRET;

  if (!apiUser || !apiSecret) {
    throw new SightEngineError(
      "SightEngine credentials missing. Set SIGHTENGINE_API_USER and SIGHTENGINE_API_SECRET."
    );
  }

  const form = new FormData();
  form.append("media", new Blob([imageBuffer]), filename);
  form.append("models", "genai");
  form.append("api_user", apiUser);
  form.append("api_secret", apiSecret);

  const response = await fetch(SIGHTENGINE_ENDPOINT, {
    method: "POST",
    body: form,
  });

  const data = (await response.json()) as SightEngineResponse;

  if (data.status === "failure") {
    throw new SightEngineError(data.error?.message ?? "SightEngine request failed");
  }

  const score = data.type?.ai_generated ?? data.ai_generated?.prob ?? 0;

  const perGenerator: Record<string, number> = {};
  if (data.ai_generated) {
    for (const [key, value] of Object.entries(data.ai_generated)) {
      if (key !== "prob" && typeof value === "number") {
        perGenerator[key] = value;
      }
    }
  }

  const topGenerator =
    Object.entries(perGenerator).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  return {
    type: "detector_api",
    label: "AI Detection Model",
    score,
    detail: {
      topGenerator,
      perGenerator,
    },
  };
}
