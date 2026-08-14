import Constants from "expo-constants";
import Purchases, { LOG_LEVEL, type CustomerInfo } from "react-native-purchases";

const API_KEY = Constants.expoConfig?.extra?.revenueCatApiKeyIos as string | undefined;
export const ENTITLEMENT_ID =
  (Constants.expoConfig?.extra?.revenueCatEntitlementId as string | undefined) ?? "unlimited";

let configured = false;

export function configurePurchases() {
  if (configured || !API_KEY) return;
  if (__DEV__) Purchases.setLogLevel(LOG_LEVEL.WARN);
  try {
    Purchases.configure({ apiKey: API_KEY });
    configured = true;
  } catch (err) {
    // Expo Go's Preview API Mode can't use a real Apple key (it needs a
    // separate Test Store key) — this is expected in Expo Go and only
    // matters for actual purchase testing, which requires a dev build anyway.
    console.warn("RevenueCat configure failed (expected in Expo Go)", err);
  }
}

export function hasUnlimitedEntitlement(info: CustomerInfo): boolean {
  return info.entitlements.active[ENTITLEMENT_ID] !== undefined;
}

export async function getIsUnlimited(): Promise<boolean> {
  try {
    const info = await Purchases.getCustomerInfo();
    return hasUnlimitedEntitlement(info);
  } catch (err) {
    console.warn("Failed to fetch RevenueCat customer info", err);
    return false;
  }
}
