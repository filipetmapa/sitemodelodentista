"use client";

import { View } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { isLowPower, toothState } from "./store";

/**
 * Canvas WebGL único (fixo, transparente, sem eventos de ponteiro).
 * As cenas são desenhadas nas regiões dos elementos <View> de cada seção.
 * O render loop é pausado quando nenhuma seção 3D está visível.
 */
export default function ThreeCanvas({ onReady, onFail }: { onReady: () => void; onFail: () => void }) {
  const [loop, setLoop] = useState<"always" | "never">("always");
  const [dpr] = useState<[number, number]>(() => {
    if (typeof window === "undefined") return [1, 1.5];
    const desktop = window.matchMedia("(min-width: 1024px)").matches;
    if (isLowPower()) return [1, 1.25];
    return desktop ? [1, 1.75] : [1, 1.5];
  });

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll("[data-three-section]"));
    const visible = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
        setLoop(visible.size > 0 ? "always" : "never");
      },
      { rootMargin: "120px 0px" },
    );
    sections.forEach((s) => io.observe(s));

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const onMove = (e: PointerEvent) => {
      toothState.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      toothState.pointerY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    if (fine) window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <Canvas
      aria-hidden="true"
      frameloop={loop}
      dpr={dpr}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ position: "fixed", inset: 0, width: "100vw", height: "100lvh", zIndex: 10, pointerEvents: "none" }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener("webglcontextlost", (e) => {
          e.preventDefault();
          onFail();
        });
        requestAnimationFrame(() => requestAnimationFrame(onReady));
      }}
    >
      <View.Port />
    </Canvas>
  );
}
