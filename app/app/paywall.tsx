import React from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import RevenueCatUI, { PAYWALL_RESULT } from "react-native-purchases-ui";
import { spacing, typography } from "../constants/theme";
import { useTheme } from "../hooks/useTheme";

const PRIVACY_POLICY_URL = "https://ai-scanner-backend-production.up.railway.app/privacy";
// We use Apple's standard EULA (no custom terms), so we link to it directly.
const TERMS_OF_USE_URL = "https://www.apple.com/legal/internet-services/itunes/dev/stdeula/";

export default function PaywallScreen() {
  const router = useRouter();
  const theme = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <RevenueCatUI.Paywall
        style={{ flex: 1 }}
        onDismiss={() => router.back()}
        onPurchaseCompleted={() => router.back()}
        onRestoreCompleted={(result) => {
          if (result.customerInfo) router.back();
        }}
      />
      <View style={[styles.footer, { backgroundColor: theme.background, borderTopColor: theme.border }]}>
        <Pressable testID="paywall-privacy-link" onPress={() => Linking.openURL(PRIVACY_POLICY_URL)}>
          <Text style={[styles.link, { color: theme.textSecondary }]}>Privacy Policy</Text>
        </Pressable>
        <Text style={[styles.dot, { color: theme.textSecondary }]}>·</Text>
        <Pressable testID="paywall-terms-link" onPress={() => Linking.openURL(TERMS_OF_USE_URL)}>
          <Text style={[styles.link, { color: theme.textSecondary }]}>Terms of Use</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  link: { ...typography.caption, textDecorationLine: "underline" },
  dot: { ...typography.caption },
});
