import { Router } from "express";
import multer from "multer";
import { randomUUID } from "node:crypto";
import { detectAiGenerated, SightEngineError } from "../services/sightengine.js";
import { runHeuristics } from "../heuristics/index.js";
import { mergeSignals } from "../services/merge.js";
import { persistScan } from "../services/persistence.js";
import { requireAuth } from "../middleware/auth.js";
import { enforceDailyCap } from "../middleware/dailyCap.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
});

export const scanRouter = Router();

scanRouter.post("/scan", requireAuth, enforceDailyCap, upload.single("image"), async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: "Missing 'image' file field." });
  }

  const scanId = randomUUID();

  try {
    const [detectorSignal, heuristicSignals] = await Promise.all([
      detectAiGenerated(file.buffer, file.originalname || "upload.jpg"),
      runHeuristics(file.buffer),
    ]);

    const result = await mergeSignals({
      scanId,
      detectorSignal,
      heuristicSignals,
      imageBuffer: file.buffer,
    });

    const persisted = await persistScan(req.userId!, result, file.buffer);

    return res.json(persisted);
  } catch (err) {
    if (err instanceof SightEngineError) {
      return res.status(502).json({ error: err.message });
    }
    console.error("Scan failed", err);
    return res.status(500).json({ error: "Scan failed unexpectedly." });
  }
});
