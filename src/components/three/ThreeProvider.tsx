"use client";

import dynamic from "next/dynamic";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supportsWebGL } from "./store";

type Mode = "pending" | "3d" | "static";
type Ctx = { mode: Mode; rendered: boolean; setRendered: (v: boolean) => void };

const ThreeContext = createContext<Ctx>({ mode: "pending", rendered: false, setRendered: () => {} });
export const useThree3D = () => useContext(ThreeContext);

// Canvas único, carregado sob demanda e somente no cliente
const ThreeCanvas = dynamic(() => import("./ThreeCanvas"), { ssr: false });

/**
 * Decide entre cena 3D e fallback estático e carrega o Canvas apenas quando a
 * seção de tratamentos se aproxima da viewport.
 */
export function ThreeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>("pending");
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !supportsWebGL()) {
      setMode("static");
      return;
    }
    const target = document.querySelector("[data-three-section]");
    if (!target) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setMode("3d");
          io.disconnect();
        }
      },
      { rootMargin: "900px 0px" },
    );
    io.observe(target);
    return () => io.disconnect();
  }, []);

  return (
    <ThreeContext.Provider value={{ mode, rendered, setRendered }}>
      {children}
      {mode === "3d" && <ThreeCanvas onReady={() => setRendered(true)} onFail={() => setMode("static")} />}
    </ThreeContext.Provider>
  );
}
