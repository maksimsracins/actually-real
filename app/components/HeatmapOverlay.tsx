import React from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Defs, Rect, RadialGradient, Stop } from "react-native-svg";
import type { HeatmapRegion } from "../lib/types";

interface Props {
  regions: HeatmapRegion[];
  visible: boolean;
}

// Regions are stored as 0-1 fractions of image width/height, so a 0-100
// viewBox with preserveAspectRatio="none" lets the overlay stretch exactly
// over the displayed <Image> regardless of its rendered size.
export function HeatmapOverlay({ regions, visible }: Props) {
  if (!visible || regions.length === 0) return null;

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <Defs>
          <RadialGradient id="hotspot" cx="50%" cy="50%" r="60%">
            <Stop offset="0%" stopColor="#C7333B" stopOpacity={0.55} />
            <Stop offset="100%" stopColor="#C7333B" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        {regions.map((region) => (
          <Rect
            key={region.id}
            x={region.x * 100}
            y={region.y * 100}
            width={region.w * 100}
            height={region.h * 100}
            fill="url(#hotspot)"
            opacity={Math.max(0.35, region.intensity)}
          />
        ))}
      </Svg>
    </View>
  );
}
