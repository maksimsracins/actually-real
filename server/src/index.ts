import "dotenv/config";
import express from "express";
import cors from "cors";
import { scanRouter } from "./routes/scan.js";
import { historyRouter } from "./routes/history.js";
import { legalRouter } from "./routes/legal.js";

const app = express();
app.use(cors());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use(scanRouter);
app.use(historyRouter);
app.use(legalRouter);

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`ai-scanner server listening on :${port}`);
});
