"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import { useIsDesktop } from "@/lib/hooks";
import { useThree3D } from "./ThreeProvider";
import { isLowPower } from "./store";

const ToothView = dynamic(() => import("./Views").then((m) => m.ToothView), { ssr: false });
const PillarView = dynamic(() => import("./Views").then((m) => m.PillarView), { ssr: false });

/** Palco do dente: cena 3D quando disponível; imagem pré-renderizada como fallback. */
export function ToothStage({ className = "" }: { className?: string }) {
  const { mode, rendered } = useThree3D();
  const desktop = useIsDesktop();
  const detail = desktop && !isLowPower() ? 1 : 0.55;
  return (
    <div className={`relative ${className}`} aria-hidden="true">
      <Image
        src={siteConfig.media.toothFallback}
        alt=""
        fill
        sizes="(min-width:1024px) 40vw, 80vw"
        className={`object-contain transition-opacity duration-700 ${mode === "3d" && rendered ? "opacity-0" : "opacity-100"}`}
      />
      {mode === "3d" && <ToothView className="absolute inset-0" detail={detail} interactive={desktop} />}
    </div>
  );
}

export function PillarStage({ index, className = "" }: { index: number; className?: string }) {
  const { mode, rendered } = useThree3D();
  const desktop = useIsDesktop();
  const detail = desktop && !isLowPower() ? 1 : 0.5;
  return (
    <div className={`relative ${className}`} aria-hidden="true">
      <Image
        src={siteConfig.media.pillarsFallback[index]}
        alt=""
        fill
        sizes="200px"
        className={`object-contain transition-opacity duration-700 ${mode === "3d" && rendered ? "opacity-0" : "opacity-100"}`}
      />
      {mode === "3d" && <PillarView index={index} className="absolute inset-0" detail={detail} />}
    </div>
  );
}
