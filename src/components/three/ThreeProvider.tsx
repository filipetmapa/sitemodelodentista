"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { isLowPower, supportsWebGL } from "./store";

type Mode = "pending" | "3d" | "static";
type Ctx = { mode: Mode; rendered: boolean; setRendered: (v: boolean) => void; setMode: (m: Mode) => void };

const ThreeContext = createContext<Ctx>({ mode: "pending", rendered: false, setRendered: () => {}, setMode: () => {} });
export const useThree3D = () => useContext(ThreeContext);

/**
 * Decide entre cena 3D e imagem estática.
 * 3D apenas em desktop com WebGL e sem prefers-reduced-motion; no celular e em
 * aparelhos modestos é exibida a imagem pré-renderizada (muito mais leve).
 * O 3D só é carregado quando a seção de tratamentos se aproxima.
 */
export function ThreeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>("pending");
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktop = window.matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine)").matches;
    if (reduced || !desktop || isLowPower() || !supportsWebGL()) {
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
      { rootMargin: "600px 0px" },
    );
    io.observe(target);
    return () => io.disconnect();
  }, []);

  return <ThreeContext.Provider value={{ mode, rendered, setRendered, setMode }}>{children}</ThreeContext.Provider>;
}
