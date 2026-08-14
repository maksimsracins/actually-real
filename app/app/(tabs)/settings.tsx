import React from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import Purchases from "react-native-purchases";
import { radius, shadows, spacing, typography } from "../../constants/theme";
import { useTheme } from "../../hooks/useTheme";
import { useEntitlement } from "../../hooks/useEntitlement";

const PRIVACY_POLICY_URL = "https://ai-scanner-backend-production.up.railway.app/privacy";
// We use Apple's standard EULA (no custom terms), so we link to it directly.
const TERMS_OF_USE_URL = "https://www.apple.com/legal/internet-services/itunes/dev/stdeula/";

export default function SettingsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { isUnlimited, loading } = useEntitlement();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.textPrimary }]}>Settings</Text>

      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>
          {loading ? "Checking plan…" : isUnlimited ? "Unlimited plan" : "Free plan"}
        </Text>
        <Text style={[styles.cardBody, { color: theme.textSecondary }]}>
          {isUnlimited
            ? "You have unlimited scans."
            : "A limited number of free scans per day. Upgrade for unlimited scans."}
        </Text>
        {!isUnlimited && !loading && (
          <Pressable
            testID="upgrade-button"
            onPress={() => router.push("/paywall")}
            style={({ pressed }) => [
              styles.upgradeButton,
              {
                backgroundColor: pressed ? theme.accentDeep : theme.accent,
                ...(pressed
                  ? shadows.instrumentPressed(theme.accentDeep)
                  : shadows.instrument(theme.accentDeep)),
              },
            ]}
          >
            <Text style={styles.upgradeButtonText}>Upgrade to Unlimited</Text>
          </Pressable>
        )}
        {isUnlimited && !loading && (
          <Pressable testID="manage-subscription-button" onPress={() => Purchases.showManageSubscriptions()}>
            <Text style={[styles.manageText, { color: theme.accent }]}>Manage subscription</Text>
          </Pressable>
        )}
      </View>

      <Pressable testID="restore-purchases-button" onPress={() => Purchases.restorePurchases()}>
        <Text style={[styles.restoreText, { color: theme.accent }]}>Restore purchases</Text>
      </Pressable>

      <View style={styles.legalRow}>
        <Pressable testID="settings-privacy-link" onPress={() => Linking.openURL(PRIVACY_POLICY_URL)}>
          <Text style={[styles.legalText, { color: theme.textSecondary }]}>Privacy Policy</Text>
        </Pressable>
        <Text style={[typography.caption, { color: theme.textSecondary }]}>·</Text>
        <Pressable testID="settings-terms-link" onPress={() => Linking.openURL(TERMS_OF_USE_URL)}>
          <Text style={[styles.legalText, { color: theme.textSecondary }]}>Terms of Use</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg, gap: spacing.lg },
  title: { ...typography.title, fontSize: 24 },
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  cardTitle: { ...typography.heading },
  cardBody: { ...typography.body, fontSize: 14, lineHeight: 20 },
  upgradeButton: {
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: "center",
    marginTop: spacing.sm,
  },
  upgradeButtonText: { color: "#FFFFFF", ...typography.heading, fontSize: 15 },
  manageText: { ...typography.body, fontSize: 14, marginTop: spacing.sm },
  restoreText: { ...typography.body, fontSize: 14 },
  legalRow: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.sm },
  legalText: { ...typography.caption, textDecorationLine: "underline" },
});
