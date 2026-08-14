import "react-native-url-polyfill/auto";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";
import { createClient, type Session } from "@supabase/supabase-js";

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl as string | undefined;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing supabaseUrl/supabaseAnonKey in app.json extra config.");
}

// expo-secure-store has a ~2KB value-size limit; Supabase sessions are
// larger, so this adapter is the documented workaround: chunk the value
// across multiple keys instead of storing it as one blob.
const CHUNK_SIZE = 1800;

const SecureStoreAdapter = {
  async getItem(key: string): Promise<string | null> {
    const chunkCount = await SecureStore.getItemAsync(`${key}_chunks`);
    if (!chunkCount) return SecureStore.getItemAsync(key);
    const parts = await Promise.all(
      Array.from({ length: Number(chunkCount) }, (_, i) => SecureStore.getItemAsync(`${key}_${i}`))
    );
    return parts.join("");
  },
  async setItem(key: string, value: string): Promise<void> {
    if (value.length <= CHUNK_SIZE) {
      await SecureStore.setItemAsync(key, value);
      return;
    }
    const chunks: string[] = [];
    for (let i = 0; i < value.length; i += CHUNK_SIZE) {
      chunks.push(value.slice(i, i + CHUNK_SIZE));
    }
    await Promise.all(chunks.map((chunk, i) => SecureStore.setItemAsync(`${key}_${i}`, chunk)));
    await SecureStore.setItemAsync(`${key}_chunks`, String(chunks.length));
  },
  async removeItem(key: string): Promise<void> {
    const chunkCount = await SecureStore.getItemAsync(`${key}_chunks`);
    if (chunkCount) {
      await Promise.all(
        Array.from({ length: Number(chunkCount) }, (_, i) => SecureStore.deleteItemAsync(`${key}_${i}`))
      );
      await SecureStore.deleteItemAsync(`${key}_chunks`);
    }
    await SecureStore.deleteItemAsync(key);
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: SecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export async function ensureAnonymousSession(): Promise<Session> {
  const { data } = await supabase.auth.getSession();
  if (data.session) return data.session;

  const { data: signInData, error } = await supabase.auth.signInAnonymously();
  if (error || !signInData.session) {
    throw new Error(error?.message ?? "Failed to start anonymous session.");
  }
  return signInData.session;
}
