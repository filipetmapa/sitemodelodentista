"use client";

import { createElement, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsoLayoutEffect } from "@/lib/hooks";
import { splitScript } from "@/lib/links";
import { durations, eases } from "@/lib/motion";

type Props = {
  as?: "h1" | "h2" | "h3" | "p" | "span";
  text: string;
  vars?: Record<string, string>;
  className?: string;
  id?: string;
  /** Quando true, a animação é controlada por uma timeline externa (hero). */
  manual?: boolean;
  start?: string;
};

/** Agrupa as palavras em linhas reais (recalculado no resize). */
function assignLines(root: HTMLElement) {
  const masks = Array.from(root.querySelectorAll<HTMLElement>("[data-mask]"));
  let line = -1;
  let lastTop = -Infinity;
  masks.forEach((m) => {
    const top = m.offsetTop;
    if (Math.abs(top - lastTop) > 4) {
      line += 1;
      lastTop = top;
    }
    m.dataset.line = String(line);
    const inner = m.firstElementChild as HTMLElement | null;
    if (inner) inner.dataset.line = String(line);
  });
}

/**
 * Text reveal por linhas: cada palavra fica em uma máscara (overflow hidden)
 * e sobe de 100% para 0, com stagger por linha.
 * Palavras entre {chaves} são exibidas em caligrafia dourada (Allura).
 */
export function RevealText({ as = "h2", text, vars, className = "", id, manual = false, start = "top 85%" }: Props) {
  const ref = useRef<HTMLElement>(null);
  const parts = splitScript(text, vars);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    assignLines(el);
    const ro = new ResizeObserver(() => assignLines(el));
    ro.observe(el);
    if (manual) return () => ro.disconnect();

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      const words = el.querySelectorAll<HTMLElement>("[data-word]");
      if (reduced) {
        gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: durations.fast, scrollTrigger: { trigger: el, start } });
        return;
      }
      gsap.set(words, { yPercent: 115 });
      ScrollTrigger.create({
        trigger: el,
        start,
        once: true,
        onEnter: () => {
          gsap.to(words, {
            yPercent: 0,
            duration: durations.slow,
            ease: eases.out4,
            delay: 0,
            stagger: (i, target: HTMLElement) => Number(target.dataset.line || 0) * 0.12 + i * 0.012,
          });
        },
      });
    }, el);
    return () => {
      ro.disconnect();
      ctx.revert();
    };
  }, [manual, start, text]);

  const children = parts.flatMap((part, pi) =>
    part.text
      .split(/(\s+)/)
      .filter((w) => w.length > 0)
      .map((w, wi) =>
        /^\s+$/.test(w) ? (
          " "
        ) : (
          <span
            key={`${pi}-${wi}`}
            data-mask=""
            className={`inline-block overflow-hidden align-baseline ${
              part.script ? "-my-[0.3em] py-[0.3em]" : "-my-[0.14em] py-[0.14em]"
            }`}
          >
            <span
              data-word=""
              data-script={part.script ? "" : undefined}
              className={`inline-block will-change-transform ${part.script ? "script-word" : ""}`}
            >
              {w}
            </span>
          </span>
        ),
      ),
  );

  return createElement(as, { ref, id, className }, children);
}
