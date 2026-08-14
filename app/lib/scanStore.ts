import { create } from "zustand";
import type { ScanResult } from "./types";

interface ScanStoreState {
  results: Record<string, ScanResult>;
  history: string[]; // scanIds, most recent first
  addResult: (result: ScanResult) => void;
  getResult: (scanId: string) => ScanResult | undefined;
  hydrateHistory: (results: ScanResult[]) => void;
}

export const useScanStore = create<ScanStoreState>((set, get) => ({
  results: {},
  history: [],
  addResult: (result) =>
    set((state) => ({
      results: { ...state.results, [result.scanId]: result },
      history: [result.scanId, ...state.history.filter((id) => id !== result.scanId)],
    })),
  getResult: (scanId) => get().results[scanId],
  hydrateHistory: (results) =>
    set((state) => {
      const nextResults = { ...state.results };
      for (const result of results) nextResults[result.scanId] = result;
      const ids = results.map((r) => r.scanId);
      const merged = [...ids, ...state.history.filter((id) => !ids.includes(id))];
      return { results: nextResults, history: merged };
    }),
}));
