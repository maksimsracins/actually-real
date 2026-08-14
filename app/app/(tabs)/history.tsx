import React, { useEffect } from "react";
import { FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { radius, spacing, typography } from "../../constants/theme";
import { useTheme } from "../../hooks/useTheme";
import { useScanStore } from "../../lib/scanStore";
import { fetchHistory } from "../../lib/api";

const VERDICT_LABEL: Record<string, string> = {
  likely_ai: "Likely AI",
  likely_real: "Likely real",
  uncertain: "Uncertain",
};

export default function HistoryScreen() {
  const theme = useTheme();
  const router = useRouter();
  const history = useScanStore((s) => s.history);
  const results = useScanStore((s) => s.results);
  const hydrateHistory = useScanStore((s) => s.hydrateHistory);

  useEffect(() => {
    fetchHistory()
      .then(hydrateHistory)
      .catch((err) => console.warn("Failed to load remote history", err));
  }, []);

  if (history.length === 0) {
    return (
      <View style={[styles.empty, { backgroundColor: theme.background }]}>
        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
          Your scanned photos will show up here.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={styles.list}
      data={history}
      keyExtractor={(id) => id}
      renderItem={({ item: scanId }) => {
        const result = results[scanId];
        if (!result) return null;
        return (
          <Pressable
            onPress={() => router.push({ pathname: "/scan/[scanId]/result", params: { scanId } })}
            style={[styles.row, { borderColor: theme.border, backgroundColor: theme.surface }]}
          >
            <Image source={{ uri: result.imageUri }} style={styles.thumb} />
            <View style={styles.rowText}>
              <Text style={[styles.rowVerdict, { color: theme.textPrimary }]}>
                {VERDICT_LABEL[result.verdict]}
              </Text>
              <Text style={[styles.rowDate, { color: theme.textMuted }]}>
                {new Date(result.createdAt).toLocaleString()}
              </Text>
            </View>
          </Pressable>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  empty: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.lg },
  emptyText: { ...typography.body, textAlign: "center" },
  list: { padding: spacing.lg, gap: spacing.sm },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.sm,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: spacing.sm,
  },
  thumb: { width: 56, height: 56, borderRadius: radius.sm },
  rowText: { gap: 2 },
  rowVerdict: { ...typography.heading, fontSize: 15 },
  rowDate: { ...typography.caption },
});
