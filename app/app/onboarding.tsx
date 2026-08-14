import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { radius, shadows, spacing, typography } from "../constants/theme";
import { useTheme } from "../hooks/useTheme";
import { setCompletedOnboarding } from "../lib/onboarding";

const POINTS = [
  {
    title: "Scan any photo",
    body: "Take a photo or pick one from your library to check whether it looks AI-generated.",
  },
  {
    title: "See exactly what looks synthetic",
    body: "We highlight the specific regions and signals that drove the verdict — not just a bare percentage.",
  },
  {
    title: "Honest about uncertainty",
    body: "No detector can be certain. We show you every signal, including where they disagree, so you can judge for yourself.",
  },
];

export default function OnboardingScreen() {
  const theme = useTheme();
  const router = useRouter();

  async function handleContinue() {
    await setCompletedOnboarding();
    router.replace("/");
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.hero}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Actually Real?</Text>
      </View>

      <View style={styles.points}>
        {POINTS.map((point) => (
          <View key={point.title} style={styles.point}>
            <View style={[styles.bullet, { backgroundColor: theme.accentSurface }]}>
              <View style={[styles.bulletDot, { backgroundColor: theme.accent }]} />
            </View>
            <View style={styles.pointText}>
              <Text style={[styles.pointTitle, { color: theme.textPrimary }]}>{point.title}</Text>
              <Text style={[styles.pointBody, { color: theme.textSecondary }]}>{point.body}</Text>
            </View>
          </View>
        ))}
      </View>

      <Pressable
        testID="onboarding-continue"
        onPress={handleContinue}
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: pressed ? theme.accentDeep : theme.accent,
            ...(pressed ? shadows.instrumentPressed(theme.accentDeep) : shadows.instrument(theme.accentDeep)),
          },
        ]}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg, paddingBottom: spacing.xxl, justifyContent: "space-between" },
  hero: { marginTop: spacing.xxl, alignItems: "center" },
  title: { ...typography.display, fontSize: 36 },
  points: { gap: spacing.lg },
  point: { flexDirection: "row", gap: spacing.md, alignItems: "flex-start" },
  bullet: {
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  bulletDot: { width: 8, height: 8, borderRadius: 4 },
  pointText: { flex: 1, gap: 2 },
  pointTitle: { ...typography.heading, fontSize: 16 },
  pointBody: { ...typography.body, fontSize: 14, lineHeight: 20 },
  button: { borderRadius: radius.lg, paddingVertical: spacing.md + 2, alignItems: "center" },
  buttonText: { color: "#FFFFFF", ...typography.heading, fontSize: 17 },
});
