"use client";

import Lenis from "lenis";
import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

type Ctx = { scrollTo: (target: string | HTMLElement | number) => void; lock: (locked: boolean) => void };

const SmoothScrollContext = createContext<Ctx>({ scrollTo: () => {}, lock: () => {} });

export const useSmoothScroll = () => useContext(SmoothScrollContext);

function navOffset() {
  const v = getComputedStyle(document.documentElement).getPropertyValue("--nav-h");
  return parseInt(v, 10) || 80;
}

/**
 * Smooth scroll com Lenis integrado ao ScrollTrigger.
 * Desativado com prefers-reduced-motion e em dispositivos de toque.
 * Também recalcula o ScrollTrigger após fontes, imagens e mudanças de layout.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    let tick: ((time: number) => void) | null = null;

    if (!reduced && !coarse) {
      const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
      lenisRef.current = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    // Recalcular posições (debounce) após mudanças de layout
    let timer: ReturnType<typeof setTimeout> | undefined;
    const refresh = () => {
      clearTimeout(timer);
      timer = setTimeout(() => ScrollTrigger.refresh(), 220);
    };
    let lastH = document.body.scrollHeight;
    let lastW = window.innerWidth;
    const ro = new ResizeObserver(() => {
      const h = document.body.scrollHeight;
      const w = window.innerWidth;
      // ignora variações causadas pelos próprios pin-spacers
      if (Math.abs(h - lastH) > 40 || w !== lastW) {
        lastH = h;
        lastW = w;
        refresh();
      }
    });
    ro.observe(document.body);
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);

    return () => {
      clearTimeout(timer);
      ro.disconnect();
      window.removeEventListener("load", refresh);
      if (tick) gsap.ticker.remove(tick);
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };
  }, []);

  const scrollTo = useCallback((target: string | HTMLElement | number) => {
    const el = typeof target === "string" ? (document.querySelector(target) as HTMLElement | null) : target;
    if (el === null) return;
    const offset = typeof el === "number" ? 0 : el.id === "inicio" ? 0 : -navOffset() + 1;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(el, { offset, duration: 1.4 });
    } else {
      const y = typeof el === "number" ? el : el.getBoundingClientRect().top + window.scrollY + offset;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: y, behavior: reduced ? "auto" : "smooth" });
    }
    if (typeof el !== "number") {
      el.setAttribute("tabindex", "-1");
      el.focus({ preventScroll: true });
    }
  }, []);

  const lock = useCallback((locked: boolean) => {
    document.documentElement.style.overflow = locked ? "hidden" : "";
    if (locked) lenisRef.current?.stop();
    else lenisRef.current?.start();
  }, []);

  return <SmoothScrollContext.Provider value={{ scrollTo, lock }}>{children}</SmoothScrollContext.Provider>;
}

/** Link âncora que usa o Lenis (com offset da navbar). */
export function AnchorLink({
  href,
  className,
  children,
  onNavigate,
  ...rest
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; onNavigate?: () => void }) {
  const { scrollTo } = useSmoothScroll();
  return (
    <a
      href={href}
      className={className}
      onClick={(e) => {
        if (!href.startsWith("#")) return;
        e.preventDefault();
        onNavigate?.();
        scrollTo(href);
        history.replaceState(null, "", href);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
