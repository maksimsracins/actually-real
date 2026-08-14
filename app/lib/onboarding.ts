import * as SecureStore from "expo-secure-store";

const KEY = "has_completed_onboarding";

export async function hasCompletedOnboarding(): Promise<boolean> {
  return (await SecureStore.getItemAsync(KEY)) === "true";
}

export async function setCompletedOnboarding(): Promise<void> {
  await SecureStore.setItemAsync(KEY, "true");
}
