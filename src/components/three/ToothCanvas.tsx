"use client";

import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { ToothScene } from "./Scenes";
import { toothState } from "./store";

/**
 * Canvas WebGL do tamanho exato do palco do dente (não ocupa a tela inteira).
 * O render loop só roda enquanto o palco está visível.
 */
export default function ToothCanvas({ onReady, onFail }: { onReady: () => void; onFail: () => void }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "80px 0px" });
    io.observe(el);
    const onMove = (e: PointerEvent) => {
      toothState.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      toothState.pointerY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0">
      <Canvas
        frameloop={visible ? "always" : "never"}
        dpr={[1, 1.25]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance", stencil: false }}
        style={{ pointerEvents: "none" }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener("webglcontextlost", (e) => {
            e.preventDefault();
            onFail();
          });
          requestAnimationFrame(() => requestAnimationFrame(onReady));
        }}
      >
        <ToothScene detail={0.7} interactive />
      </Canvas>
    </div>
  );
}
