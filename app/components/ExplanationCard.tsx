import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { radius, spacing, typography } from "../constants/theme";
import { useTheme } from "../hooks/useTheme";
import type { ExplanationCard as ExplanationCardData } from "../lib/types";

export function ExplanationCard({ card }: { card: ExplanationCardData }) {
  const theme = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <Text style={[styles.title, { color: theme.textPrimary }]}>{card.title}</Text>
      <Text style={[styles.body, { color: theme.textSecondary }]}>{card.body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.md,
    padding: spacing.md + 4,
    gap: spacing.xs + 2,
  },
  title: { ...typography.heading, fontSize: 16 },
  body: { ...typography.body, fontSize: 14, lineHeight: 21 },
});
