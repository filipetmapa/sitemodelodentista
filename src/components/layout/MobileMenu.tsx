"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";
import { siteConfig } from "@/config/site";
import { links, pad2 } from "@/lib/links";
import { bezier } from "@/lib/motion";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { AnchorLink, useSmoothScroll } from "./SmoothScrollProvider";

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const { lock } = useSmoothScroll();

  useEffect(() => {
    if (!open) return;
    lock(true);
    const first = ref.current?.querySelector<HTMLElement>("a");
    first?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      lock(false);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, lock]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="noise fixed inset-0 z-[45] flex flex-col bg-primary-deep px-[var(--gutter)] pb-8 pt-[calc(var(--nav-h)+2rem)] lg:hidden"
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.7, ease: bezier.expo }}
        >
          <ul className="flex flex-1 flex-col justify-center gap-1">
            {siteConfig.copy.nav.map((item, i) => (
              <motion.li
                key={item.href}
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{ duration: 0.6, ease: bezier.expo, delay: 0.15 + i * 0.07 }}
                className="border-b border-accent-soft/15"
              >
                <AnchorLink
                  href={item.href}
                  onNavigate={onClose}
                  className="flex items-baseline gap-4 py-3 font-serif text-[2.4rem] font-light leading-tight text-bg"
                >
                  <span className="font-sans text-xs tracking-label text-accent">{pad2(i + 1)}</span>
                  {item.label}
                </AnchorLink>
              </motion.li>
            ))}
          </ul>
          <motion.div
            className="flex flex-col gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <a href={links.booking} target="_blank" rel="noopener noreferrer" className="btn-gold w-full">
              <WhatsAppIcon size={18} /> Agendar pelo WhatsApp
            </a>
            <a
              href={links.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Abrir Instagram da ${siteConfig.clinic.name}`}
              className="inline-flex min-h-[44px] items-center justify-center gap-2 text-sm text-accent-soft"
            >
              <InstagramIcon size={18} /> {siteConfig.social.instagramHandle}
            </a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
