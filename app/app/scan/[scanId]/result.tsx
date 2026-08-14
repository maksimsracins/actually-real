import React, { useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { radius, shadows, spacing, typography } from "../../../constants/theme";
import { useTheme } from "../../../hooks/useTheme";
import { useScanStore } from "../../../lib/scanStore";
import { HeatmapOverlay } from "../../../components/HeatmapOverlay";
import { ConfidenceBadge } from "../../../components/ConfidenceBadge";
import { ExplanationCard } from "../../../components/ExplanationCard";
import { UncertaintyPanel } from "../../../components/UncertaintyPanel";

export default function ScanResultScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { scanId } = useLocalSearchParams<{ scanId: string }>();
  const result = useScanStore((s) => s.getResult(scanId));
  const [showHeatmap, setShowHeatmap] = useState(true);

  if (!result) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.textSecondary }}>Scan not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={styles.content}
    >
      <View style={[styles.imageShadowWrap, shadows.photoLift]}>
        <View style={styles.imageWrap}>
          <Image source={{ uri: result.imageUri }} style={styles.image} />
          <HeatmapOverlay regions={result.heatmap.regions} visible={showHeatmap} />
        </View>
      </View>

      {result.heatmap.regions.length > 0 && (
        <Pressable
          onPress={() => setShowHeatmap((v) => !v)}
          style={[styles.toggle, { borderColor: theme.border, backgroundColor: theme.surface }]}
        >
          <Text style={[styles.toggleText, { color: theme.textPrimary }]}>
            {showHeatmap ? "Hide" : "Show"} flagged regions
          </Text>
        </Pressable>
      )}

      <ConfidenceBadge verdict={result.verdict} band={result.confidenceBand} />

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Why</Text>
        {result.explanationCards.map((card, i) => (
          <ExplanationCard key={i} card={card} />
        ))}
      </View>

      <UncertaintyPanel signals={result.signals} />

      <Pressable
        testID="scan-again-button"
        onPress={() => router.push("/")}
        style={[styles.scanAgain, { borderColor: theme.border }]}
      >
        <Text style={[styles.scanAgainText, { color: theme.accent }]}>Scan another photo</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  content: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxl },
  imageShadowWrap: { borderRadius: radius.lg },
  imageWrap: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: radius.lg,
    overflow: "hidden",
  },
  image: { width: "100%", height: "100%" },
  toggle: {
    alignSelf: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.pill,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  toggleText: { ...typography.caption },
  section: { gap: spacing.sm },
  sectionTitle: { ...typography.heading },
  scanAgain: {
    alignSelf: "center",
    marginTop: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
  },
  scanAgainText: { ...typography.heading, fontSize: 15 },
});
