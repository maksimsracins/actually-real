import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { spacing, typography } from "../../../constants/theme";
import { useTheme } from "../../../hooks/useTheme";
import { scanImage, ScanApiError } from "../../../lib/api";
import { useScanStore } from "../../../lib/scanStore";

export default function ScanLoadingScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { imageUri } = useLocalSearchParams<{ imageUri: string }>();
  const addResult = useScanStore((s) => s.addResult);
  const [error, setError] = useState<string | null>(null);
  const [capReached, setCapReached] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    if (started.current || !imageUri) return;
    started.current = true;

    scanImage(imageUri)
      .then((result) => {
        addResult(result);
        router.replace({ pathname: "/scan/[scanId]/result", params: { scanId: result.scanId } });
      })
      .catch((err) => {
        console.error("scanImage failed:", err);
        if (err instanceof ScanApiError && err.status === 429) {
          setCapReached(true);
          setError("You've used today's free scans. Come back tomorrow, or upgrade for unlimited scans.");
        } else {
          setError(err instanceof ScanApiError ? err.message : "Something went wrong while scanning.");
        }
      });
  }, [imageUri]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {imageUri && <Image source={{ uri: imageUri }} style={styles.preview} />}
      {error ? (
        <View style={styles.statusBlock}>
          <Text style={[styles.errorText, { color: theme.aiLikely }]}>{error}</Text>
          {capReached && (
            <Text
              style={[styles.retryText, { color: theme.accent }]}
              onPress={() => router.push("/paywall")}
            >
              Upgrade to unlimited
            </Text>
          )}
          <Text
            style={[styles.retryText, { color: theme.textMuted }]}
            onPress={() => router.back()}
          >
            Go back
          </Text>
        </View>
      ) : (
        <View style={styles.statusBlock}>
          <ActivityIndicator size="large" color={theme.accent} />
          <Text style={[styles.statusText, { color: theme.textSecondary }]}>Analyzing image…</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.lg, gap: spacing.xl },
  preview: { width: 240, height: 240, borderRadius: 20 },
  statusBlock: { alignItems: "center", gap: spacing.md },
  statusText: { ...typography.body },
  errorText: { ...typography.body, textAlign: "center" },
  retryText: { ...typography.heading, fontSize: 16 },
});
