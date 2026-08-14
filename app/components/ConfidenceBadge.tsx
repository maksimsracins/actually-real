import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { radius, spacing, typography } from "../constants/theme";
import { useTheme } from "../hooks/useTheme";
import type { ConfidenceBand, Verdict } from "../lib/types";

const VERDICT_LABEL: Record<Verdict, string> = {
  likely_ai: "Likely AI-generated",
  likely_real: "Likely real",
  uncertain: "Uncertain",
};

// Every verdict is a (icon, label, color) triad, never color alone —
// see DESIGN.md's Evidence-Color Rule.
const VERDICT_GLYPH: Record<Verdict, string> = {
  likely_ai: "✦",
  likely_real: "✓",
  uncertain: "?",
};

const BAND_LABEL: Record<ConfidenceBand, string> = {
  high: "High confidence",
  medium: "Moderate confidence",
  low: "Low confidence",
};

export function ConfidenceBadge({ verdict, band }: { verdict: Verdict; band: ConfidenceBand }) {
  const theme = useTheme();
  const tone =
    verdict === "likely_ai"
      ? { fg: theme.aiLikely, bg: theme.aiLikelySurface }
      : verdict === "likely_real"
        ? { fg: theme.realLikely, bg: theme.realLikelySurface }
        : { fg: theme.uncertain, bg: theme.uncertainSurface };

  return (
    <View style={styles.wrap}>
      <View style={[styles.pill, { backgroundColor: tone.bg }]}>
        <View style={[styles.glyphRing, { borderColor: tone.fg }]}>
          <Text style={[styles.glyph, { color: tone.fg }]}>{VERDICT_GLYPH[verdict]}</Text>
        </View>
        <Text style={[styles.verdictText, { color: tone.fg }]}>{VERDICT_LABEL[verdict]}</Text>
      </View>
      <Text style={[styles.bandText, { color: theme.textMuted }]}>{BAND_LABEL[band]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", gap: spacing.sm },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md + 2,
    borderRadius: radius.pill,
  },
  glyphRing: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  glyph: { fontSize: 12, fontWeight: "700" },
  verdictText: { ...typography.verdict, fontSize: 19 },
  bandText: { ...typography.caption },
});
