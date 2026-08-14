import React from "react";
import { Alert, Linking, Pressable, StyleSheet, Text, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { radius, shadows, spacing, typography } from "../../constants/theme";
import { useTheme } from "../../hooks/useTheme";

export default function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();

  async function pickFromLibrary() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Photo access needed", "Enable photo library access in Settings to pick an image.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.9,
      allowsEditing: false,
    });
    if (!result.canceled && result.assets[0]) {
      goToScan(result.assets[0].uri);
    }
  }

  async function takePhoto() {
    const current = await ImagePicker.getCameraPermissionsAsync();

    if (current.granted) {
      await launchCamera();
      return;
    }

    if (!current.canAskAgain) {
      Alert.alert("Camera access needed", "Enable camera access in Settings to take a photo.", [
        { text: "Cancel", style: "cancel" },
        { text: "Open Settings", onPress: () => Linking.openSettings() },
      ]);
      return;
    }

    Alert.alert(
      "Camera Access",
      "Actually Real? uses your camera so you can photograph an image to scan.",
      [{ text: "Continue", onPress: requestCameraAndLaunch }]
    );
  }

  async function requestCameraAndLaunch() {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Camera access needed", "Enable camera access in Settings to take a photo.");
      return;
    }
    await launchCamera();
  }

  async function launchCamera() {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      quality: 0.9,
    });
    if (!result.canceled && result.assets[0]) {
      goToScan(result.assets[0].uri);
    }
  }

  function goToScan(uri: string) {
    router.push({ pathname: "/scan/[scanId]/loading", params: { scanId: "pending", imageUri: uri } });
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.hero}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Actually Real?</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Scan a photo to see whether it looks AI-generated — and exactly why.
        </Text>
      </View>

      <View pointerEvents="none" style={styles.loupeWrap}>
        <View style={[styles.loupeRing, styles.loupeRingOuter, { borderColor: theme.border }]} />
        <View style={[styles.loupeRing, styles.loupeRingInner, { borderColor: theme.accentSurface }]} />
      </View>

      <View style={styles.actions}>
        <Pressable
          testID="take-photo-button"
          onPress={takePhoto}
          style={({ pressed }) => [
            styles.primaryButton,
            {
              backgroundColor: pressed ? theme.accentDeep : theme.accent,
              ...(pressed ? shadows.instrumentPressed(theme.accentDeep) : shadows.instrument(theme.accentDeep)),
            },
          ]}
        >
          <Text style={styles.primaryButtonText}>Take Photo</Text>
        </Pressable>
        <Pressable
          testID="choose-library-button"
          onPress={pickFromLibrary}
          style={({ pressed }) => [
            styles.secondaryButton,
            { borderColor: theme.border, backgroundColor: theme.surface, opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Text style={[styles.secondaryButtonText, { color: theme.textPrimary }]}>Choose from Library</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "space-between", padding: spacing.lg, paddingBottom: spacing.xxl },
  hero: { marginTop: spacing.xxl, gap: spacing.sm },
  title: { ...typography.display },
  subtitle: { ...typography.body, fontSize: 16, lineHeight: 22, maxWidth: 320 },
  loupeWrap: { flex: 1, alignItems: "center", justifyContent: "center" },
  loupeRing: { position: "absolute", borderRadius: 999 },
  loupeRingOuter: { width: 260, height: 260, borderWidth: 1 },
  loupeRingInner: { width: 190, height: 190, borderWidth: 18 },
  actions: { gap: spacing.md },
  primaryButton: {
    borderRadius: radius.lg,
    paddingVertical: spacing.md + 2,
    alignItems: "center",
  },
  primaryButtonText: { color: "#FFFFFF", ...typography.heading, fontSize: 17 },
  secondaryButton: {
    borderRadius: radius.lg,
    paddingVertical: spacing.md + 2,
    alignItems: "center",
    borderWidth: StyleSheet.hairlineWidth,
  },
  secondaryButtonText: { ...typography.heading, fontSize: 17 },
});
