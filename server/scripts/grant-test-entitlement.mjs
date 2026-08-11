import "dotenv/config";

const userId = process.argv[2];
if (!userId) {
  console.error("Usage: node grant-test-entitlement.mjs <userId>");
  process.exit(1);
}

const entitlementId = process.env.REVENUECAT_ENTITLEMENT_ID || "unlimited";
const response = await fetch(
  `https://api.revenuecat.com/v1/subscribers/${encodeURIComponent(userId)}/entitlements/${entitlementId}/promotional`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.REVENUECAT_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ duration: "monthly" }),
  }
);

const body = await response.json();
console.log("status:", response.status);
console.log(JSON.stringify(body, null, 2));
