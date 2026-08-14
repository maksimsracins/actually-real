import { useEffect, useState } from "react";
import Purchases from "react-native-purchases";
import { hasUnlimitedEntitlement } from "../lib/revenuecat";

export function useEntitlement() {
  const [isUnlimited, setIsUnlimited] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    Purchases.getCustomerInfo()
      .then((info) => {
        if (mounted) setIsUnlimited(hasUnlimitedEntitlement(info));
      })
      .catch((err) => console.warn("getCustomerInfo failed", err))
      .finally(() => {
        if (mounted) setLoading(false);
      });

    const listener = (info: Parameters<Parameters<typeof Purchases.addCustomerInfoUpdateListener>[0]>[0]) => {
      if (mounted) setIsUnlimited(hasUnlimitedEntitlement(info));
    };
    Purchases.addCustomerInfoUpdateListener(listener);

    return () => {
      mounted = false;
      Purchases.removeCustomerInfoUpdateListener(listener);
    };
  }, []);

  return { isUnlimited, loading };
}
