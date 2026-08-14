import Constants from "expo-constants";
import type { ScanResult } from "./types";
import { ensureAnonymousSession } from "./supabase";

const API_BASE_URL =
  (Constants.expoConfig?.extra?.apiBaseUrl as string | undefined) ?? "http://localhost:3000";

export class ScanApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.status = status;
  }
}

async function authHeaders(): Promise<Record<string, string>> {
  const session = await ensureAnonymousSession();
  return { Authorization: `Bearer ${session.access_token}` };
}

// React Native's Blob can only be built from an existing Blob/string, never
// raw bytes (see BlobManager.createFromParts) — fetch(uri).blob() goes
// through an ArrayBuffer and throws. XHR with responseType "blob" produces a
// natively-backed Blob directly, bypassing that path.
function uriToBlob(uri: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => resolve(xhr.response);
    xhr.onerror = () => reject(new Error("Failed to read file for upload."));
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });
}

export async function scanImage(uri: string): Promise<ScanResult> {
  const filename = uri.split("/").pop() || "upload.jpg";
  const match = /\.(\w+)$/.exec(filename);
  const ext = match?.[1]?.toLowerCase() ?? "jpg";
  const mimeType = ext === "png" ? "image/png" : ext === "heic" ? "image/heic" : "image/jpeg";

  const rawBlob = await uriToBlob(uri);
  const blob = rawBlob.slice(0, rawBlob.size, mimeType);

  const form = new FormData();
  form.append("image", blob, filename);

  const headers = await authHeaders();
  const response = await fetch(`${API_BASE_URL}/scan`, {
    method: "POST",
    body: form,
    headers: { ...headers, "Content-Type": "multipart/form-data" },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new ScanApiError(body?.error ?? `Scan failed with status ${response.status}`, response.status);
  }

  const result = (await response.json()) as Omit<ScanResult, "imageUri">;
  return { ...result, imageUri: result.imageUrl ?? uri };
}

export async function fetchHistory(): Promise<ScanResult[]> {
  const headers = await authHeaders();
  const response = await fetch(`${API_BASE_URL}/scans`, { headers });
  if (!response.ok) {
    throw new ScanApiError(`Failed to load history (status ${response.status})`, response.status);
  }
  const body = (await response.json()) as { scans: Omit<ScanResult, "imageUri">[] };
  return body.scans.map((r) => ({ ...r, imageUri: r.imageUrl ?? "" }));
}
