"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";
import { links } from "@/lib/links";
import { bezier } from "@/lib/motion";
import { InstagramIcon, WhatsAppIcon } from "./Icons";

/**
 * Botão flutuante de WhatsApp (+ Instagram secundário).
 * Aparece depois da hero e some sobre o CTA final e o footer.
 */
export function WhatsAppButton() {
  const [show, setShow] = useState(false);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("inicio");
    const ends = [document.getElementById("agendar"), document.querySelector("footer")].filter(Boolean) as Element[];
    let heroVisible = true;
    const endVisible = new Set<Element>();
    const update = () => setShow(!heroVisible && endVisible.size === 0);
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.target === hero) heroVisible = e.isIntersecting;
        else if (e.isIntersecting) endVisible.add(e.target);
        else endVisible.delete(e.target);
      });
      update();
    });
    if (hero) io.observe(hero);
    ends.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 md:bottom-8 md:right-8"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.5, ease: bezier.expo }}
        >
          <InstagramButton />
          <a
            href={links.booking}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Agendar consulta pelo WhatsApp"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onFocus={() => setHover(true)}
            onBlur={() => setHover(false)}
            className="flex h-14 items-center overflow-hidden rounded-full bg-accent text-primary-deep shadow-[0_8px_30px_-12px_rgba(50,17,28,0.45)]"
          >
            <AnimatePresence initial={false}>
              {hover && (
                <motion.span
                  key="label"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "auto", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.45, ease: bezier.expo }}
                  className="whitespace-nowrap pl-6 text-[0.75rem] font-semibold uppercase tracking-[0.14em]"
                  aria-hidden="true"
                >
                  Agendar pelo WhatsApp
                </motion.span>
              )}
            </AnimatePresence>
            <span className="flex h-14 w-14 shrink-0 items-center justify-center">
              <WhatsAppIcon size={24} strokeWidth={1.6} />
            </span>
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Botão secundário discreto do Instagram (oculto no mobile para evitar excesso de botões). */
export function InstagramButton() {
  return (
    <a
      href={links.instagram}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Abrir Instagram da ${siteConfig.clinic.name}`}
      className="mr-1.5 hidden h-11 w-11 items-center justify-center rounded-full border border-accent bg-bg/80 text-primary-deep backdrop-blur transition-colors hover:bg-accent md:flex"
    >
      <InstagramIcon size={17} />
    </a>
  );
}
