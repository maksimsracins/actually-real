import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useColorScheme, View } from "react-native";
import { useEffect } from "react";
import Purchases from "react-native-purchases";
import {
  useFonts,
  Fraunces_600SemiBold,
  Fraunces_700Bold,
} from "@expo-google-fonts/fraunces";
import { colors } from "../constants/theme";
import { configurePurchases } from "../lib/revenuecat";
import { ensureAnonymousSession } from "../lib/supabase";
import { hasCompletedOnboarding } from "../lib/onboarding";

export default function RootLayout() {
  const scheme = useColorScheme();
  const theme = colors[scheme === "dark" ? "dark" : "light"];
  const router = useRouter();
  const [fontsLoaded] = useFonts({ Fraunces_600SemiBold, Fraunces_700Bold });

  useEffect(() => {
    configurePurchases();
    // Link RevenueCat's app_user_id to our Supabase user id so the backend
    // can verify entitlement status server-side (the daily cap must not
    // trust a client-reported "I'm subscribed" flag).
    ensureAnonymousSession()
      .then((session) => Purchases.logIn(session.user.id))
      .catch((err) => console.warn("Failed to link RevenueCat identity", err));

    hasCompletedOnboarding().then((done) => {
      if (!done) router.replace("/onboarding");
    });
  }, []);

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: theme.background }} />;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style={scheme === "dark" ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.background },
          headerTintColor: theme.textPrimary,
          headerShadowVisible: false,
          headerBackTitle: " ",
          headerBackButtonDisplayMode: "minimal",
          headerTitleStyle: { fontWeight: "600" },
          contentStyle: { backgroundColor: theme.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="scan/[scanId]/loading" options={{ title: "Scanning", headerBackVisible: false }} />
        <Stack.Screen name="scan/[scanId]/result" options={{ title: "Result" }} />
        <Stack.Screen name="paywall" options={{ presentation: "modal", title: "Upgrade" }} />
      </Stack>
    </SafeAreaProvider>
  );
}
