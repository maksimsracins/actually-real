import type { NextFunction, Request, Response } from "express";
import { supabaseAdmin } from "../services/supabase.js";
import { hasUnlimitedEntitlement } from "../services/revenuecat.js";

const FREE_WEEKLY_SCAN_LIMIT = Number(process.env.FREE_WEEKLY_SCAN_LIMIT) || 5;
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export async function enforceWeeklyCap(req: Request, res: Response, next: NextFunction) {
  const userId = req.userId!;

  if (await hasUnlimitedEntitlement(userId)) {
    return next();
  }

  const windowStart = new Date(Date.now() - WEEK_MS);

  const { count, error } = await supabaseAdmin
    .from("scans")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", windowStart.toISOString());

  if (error) {
    console.error("Weekly cap check failed", error);
    return res.status(500).json({ error: "Could not verify scan quota." });
  }

  if ((count ?? 0) >= FREE_WEEKLY_SCAN_LIMIT) {
    return res.status(429).json({
      error: "Weekly free scan limit reached.",
      limit: FREE_WEEKLY_SCAN_LIMIT,
    });
  }

  next();
}
