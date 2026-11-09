"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import { useThree3D } from "./ThreeProvider";

const ToothCanvas = dynamic(() => import("./ToothCanvas"), { ssr: false });

/** Palco do dente: cena 3D no desktop; imagem pré-renderizada no celular e como fallback. */
export function ToothStage({ className = "" }: { className?: string }) {
  const { mode, rendered, setRendered, setMode } = useThree3D();
  return (
    <div className={`relative ${className}`} aria-hidden="true">
      <Image
        src={siteConfig.media.toothFallback}
        alt=""
        fill
        sizes="(min-width:1024px) 40vw, 80vw"
        className={`object-contain transition-opacity duration-700 ${mode === "3d" && rendered ? "opacity-0" : "opacity-100"}`}
      />
      {mode === "3d" && <ToothCanvas onReady={() => setRendered(true)} onFail={() => setMode("static")} />}
    </div>
  );
}

/** Objetos dos diferenciais: imagens pré-renderizadas com flutuação e giro em CSS (leve). */
export function PillarStage({ index, className = "" }: { index: number; className?: string }) {
  return (
    <div className={`pillar-object relative ${className}`} aria-hidden="true">
      <div className="pillar-float absolute inset-0" style={{ animationDelay: `${index * -1.3}s` }}>
        <Image src={siteConfig.media.pillarsFallback[index]} alt="" fill sizes="180px" className="object-contain" />
      </div>
    </div>
  );
}
