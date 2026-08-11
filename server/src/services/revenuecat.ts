const ENTITLEMENT_ID = process.env.REVENUECAT_ENTITLEMENT_ID || "unlimited";

interface RevenueCatSubscriberResponse {
  subscriber?: {
    entitlements?: Record<string, { expires_date: string | null }>;
  };
}

// Server-side entitlement check via RevenueCat's REST API, keyed by the
// same id the client used for Purchases.logIn(supabaseUserId). Never trust
// a client-reported subscription flag for something that gates a paid cap.
export async function hasUnlimitedEntitlement(userId: string): Promise<boolean> {
  const secretKey = process.env.REVENUECAT_SECRET_KEY;
  if (!secretKey) return false;

  try {
    const response = await fetch(`https://api.revenuecat.com/v1/subscribers/${encodeURIComponent(userId)}`, {
      headers: { Authorization: `Bearer ${secretKey}` },
    });
    if (!response.ok) return false;

    const data = (await response.json()) as RevenueCatSubscriberResponse;
    const entitlement = data.subscriber?.entitlements?.[ENTITLEMENT_ID];
    if (!entitlement) return false;
    if (!entitlement.expires_date) return true; // lifetime/non-expiring entitlement
    return new Date(entitlement.expires_date).getTime() > Date.now();
  } catch (err) {
    console.error("RevenueCat entitlement check failed", err);
    return false;
  }
}
