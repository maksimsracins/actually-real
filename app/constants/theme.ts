export const colors = {
  light: {
    background: "#F7F8FA",
    surface: "#FFFFFF",
    surfaceRaised: "#FFFFFF",
    border: "#E4E7EC",
    textPrimary: "#12141A",
    textSecondary: "#5B6270",
    textMuted: "#8A909E",
    accent: "#3550C4",
    accentDeep: "#1E2E82",
    accentSurface: "#EEF1FF",
    aiLikely: "#C7333B",
    aiLikelySurface: "#FBEAEA",
    realLikely: "#127A54",
    realLikelySurface: "#E7F6EF",
    uncertain: "#A5720E",
    uncertainSurface: "#FBF2DF",
  },
  dark: {
    background: "#0B0C0F",
    surface: "#16181D",
    surfaceRaised: "#1D2028",
    border: "#272A31",
    textPrimary: "#F4F5F7",
    textSecondary: "#A7ADBA",
    textMuted: "#6E7480",
    accent: "#8CA3FF",
    accentDeep: "#3550C4",
    accentSurface: "#1A2247",
    aiLikely: "#F27373",
    aiLikelySurface: "#2E1717",
    realLikely: "#4FCE9B",
    realLikelySurface: "#122A20",
    uncertain: "#E0AC4E",
    uncertainSurface: "#2E2410",
  },
} as const;

export type ThemeColors = typeof colors.light;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radius = {
  sm: 10,
  md: 16,
  lg: 22,
  pill: 999,
} as const;

// Reserved for exactly two places: the app wordmark, and the verdict label.
// Never use display/verdict elsewhere — see DESIGN.md's Two-Voice Rule.
export const fonts = {
  display: "Fraunces_600SemiBold",
  verdict: "Fraunces_700Bold",
};

export const typography = {
  display: { fontFamily: fonts.display, fontSize: 34, fontWeight: "600" as const, letterSpacing: -0.4 },
  verdict: { fontFamily: fonts.verdict, fontSize: 26, fontWeight: "700" as const, letterSpacing: -0.2 },
  title: { fontSize: 28, fontWeight: "700" as const },
  heading: { fontSize: 20, fontWeight: "600" as const },
  body: { fontSize: 16, fontWeight: "400" as const },
  caption: { fontSize: 13, fontWeight: "500" as const },
  label: { fontSize: 12, fontWeight: "600" as const, letterSpacing: 0.4 },
};

// Shadow is reserved for the primary button and the scanned photo only —
// see DESIGN.md's Flat-Card Rule. Everything else stays flat with a hairline border.
export const shadows = {
  instrument: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 20,
  }),
  instrumentPressed: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.34,
    shadowRadius: 10,
  }),
  photoLift: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.16,
    shadowRadius: 28,
  },
} as const;
