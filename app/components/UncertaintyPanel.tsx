import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { radius, spacing, typography } from "../constants/theme";
import { useTheme } from "../hooks/useTheme";
import type { ScanSignal } from "../lib/types";

export function UncertaintyPanel({ signals }: { signals: ScanSignal[] }) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={[styles.card, { backgroundColor: theme.accentSurface, borderColor: theme.border }]}>
      <Pressable onPress={() => setExpanded((v) => !v)} style={styles.header}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Why we're not 100% sure</Text>
        <Text style={[styles.chevron, { color: theme.textMuted }]}>{expanded ? "−" : "+"}</Text>
      </Pressable>
      {expanded && (
        <View style={styles.body}>
          <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
            No detector can prove an image is or isn't AI-generated with certainty. Accuracy drops on
            screenshots, compressed or re-saved files, and edited images. We show every signal that fed into
            this verdict below, including where they disagree.
          </Text>
          {signals.map((signal) => (
            <View key={signal.type} style={styles.signalRow}>
              <Text style={[styles.signalLabel, { color: theme.textPrimary }]}>{signal.label}</Text>
              <Text style={[styles.signalScore, { color: theme.textMuted }]}>
                {signal.score === null ? "no signal" : `${Math.round(signal.score * 100)}%`}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  title: { ...typography.heading, fontSize: 15 },
  chevron: { fontSize: 18, fontWeight: "600" },
  body: { marginTop: spacing.sm, gap: spacing.sm },
  paragraph: { ...typography.body, fontSize: 13, lineHeight: 19 },
  signalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: spacing.xs,
  },
  signalLabel: { ...typography.caption, fontSize: 13 },
  signalScore: { ...typography.caption, fontSize: 13 },
});
