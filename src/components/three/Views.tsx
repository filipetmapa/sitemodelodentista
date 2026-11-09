"use client";

import { View } from "@react-three/drei";
import { PillarScene, ToothScene } from "./Scenes";

export function ToothView({ className = "", detail = 1, interactive = true }: { className?: string; detail?: number; interactive?: boolean }) {
  return (
    <View className={className}>
      <ToothScene detail={detail} interactive={interactive} />
    </View>
  );
}

export function PillarView({ index, className = "", detail = 1 }: { index: number; className?: string; detail?: number }) {
  return (
    <View className={className}>
      <PillarScene index={index} detail={detail} />
    </View>
  );
}
