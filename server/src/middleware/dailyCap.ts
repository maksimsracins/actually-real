import type { NextFunction, Request, Response } from "express";
import { supabaseAdmin } from "../services/supabase.js";
import { hasUnlimitedEntitlement } from "../services/revenuecat.js";

const FREE_DAILY_SCAN_LIMIT = Number(process.env.FREE_DAILY_SCAN_LIMIT) || 5;

export async function enforceDailyCap(req: Request, res: Response, next: NextFunction) {
  const userId = req.userId!;

  if (await hasUnlimitedEntitlement(userId)) {
    return next();
  }

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const { count, error } = await supabaseAdmin
    .from("scans")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", startOfDay.toISOString());

  if (error) {
    console.error("Daily cap check failed", error);
    return res.status(500).json({ error: "Could not verify scan quota." });
  }

  if ((count ?? 0) >= FREE_DAILY_SCAN_LIMIT) {
    return res.status(429).json({
      error: "Daily free scan limit reached.",
      limit: FREE_DAILY_SCAN_LIMIT,
    });
  }

  next();
}
