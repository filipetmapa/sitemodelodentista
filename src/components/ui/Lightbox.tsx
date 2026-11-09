"use client";

import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import type { GalleryImage } from "@/config/site";
import { siteConfig } from "@/config/site";
import { bezier } from "@/lib/motion";
import { useSmoothScroll } from "@/components/layout/SmoothScrollProvider";

type Props = {
  images: GalleryImage[];
  index: number | null;
  onChange: (i: number | null) => void;
};

/** Lightbox acessível: setas e teclado (← → Esc), foco preso no modal, legendas e contador. */
export function Lightbox({ images, index, onChange }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const { lock } = useSmoothScroll();
  const open = index !== null;

  const go = useCallback(
    (dir: 1 | -1) => {
      if (index === null) return;
      onChange((index + dir + images.length) % images.length);
    },
    [index, images.length, onChange],
  );

  useEffect(() => {
    if (!open) return;
    returnFocus.current = document.activeElement as HTMLElement;
    lock(true);
    requestAnimationFrame(() => dialogRef.current?.querySelector<HTMLElement>("[data-close]")?.focus());
    return () => {
      lock(false);
      returnFocus.current?.focus({ preventScroll: true });
    };
  }, [open, lock]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onChange(null);
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "Tab" && dialogRef.current) {
        const f = Array.from(dialogRef.current.querySelectorAll<HTMLElement>("button"));
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, go, onChange]);

  const img = index !== null ? images[index] : null;

  return (
    <AnimatePresence>
      {open && img && (
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Galeria do consultório"
          data-lenis-prevent=""
          className="fixed inset-0 z-[70] flex flex-col bg-primary-deep/[0.97] text-bg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: bezier.out3 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onChange(null);
          }}
        >
          <div className="flex h-[var(--nav-h)] items-center justify-between px-[var(--gutter)]">
            <p className="eyebrow text-accent-soft" aria-live="polite">
              {index! + 1} / {images.length}
            </p>
            <button
              type="button"
              data-close=""
              onClick={() => onChange(null)}
              aria-label="Fechar galeria"
              className="inline-flex h-11 w-11 items-center justify-center text-bg transition-colors hover:text-accent"
            >
              <X size={22} strokeWidth={1.25} aria-hidden="true" />
            </button>
          </div>

          <div className="relative flex flex-1 items-center justify-center px-[var(--gutter)]" onClick={(e) => e.target === e.currentTarget && onChange(null)}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.figure
                key={img.src}
                className="relative flex h-full max-h-[78svh] w-full max-w-[1200px] flex-col items-center justify-center"
                initial={{ opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.985 }}
                transition={{ duration: 0.4, ease: bezier.out3 }}
              >
                <div className="relative h-full w-full">
                  <Image src={img.src} alt={img.alt} fill sizes="90vw" className="object-contain" />
                </div>
                <figcaption className="mt-4 text-center text-[0.8125rem] text-bg/75">
                  {img.alt}
                  {siteConfig.isDemo && <span className="ml-2 text-accent-soft">· {img.caption}</span>}
                </figcaption>
              </motion.figure>
            </AnimatePresence>

            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Imagem anterior"
              className="absolute left-2 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-accent-soft/30 text-bg transition-colors hover:border-accent hover:text-accent md:left-[var(--gutter)]"
            >
              <ChevronLeft size={20} strokeWidth={1.25} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Próxima imagem"
              className="absolute right-2 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-accent-soft/30 text-bg transition-colors hover:border-accent hover:text-accent md:right-[var(--gutter)]"
            >
              <ChevronRight size={20} strokeWidth={1.25} aria-hidden="true" />
            </button>
          </div>
          <div className="h-10" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
