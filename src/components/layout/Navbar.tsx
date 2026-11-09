"use client";

import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useCallback, useState } from "react";
import { siteConfig } from "@/config/site";
import { links } from "@/lib/links";
import { bezier } from "@/lib/motion";
import { Wordmark } from "@/components/ui/Brand";
import { InstagramIcon } from "@/components/ui/Icons";
import { AnchorLink } from "./SmoothScrollProvider";
import { MobileMenu } from "./MobileMenu";

export function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 80);
    const delta = y - prev;
    // recolhe ao rolar para baixo rapidamente; reaparece ao rolar para cima
    if (y > 400 && delta > 12) setHidden(true);
    else if (delta < -4 || y < 400) setHidden(false);
  });

  const light = !scrolled || open;

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50"
        initial={false}
        animate={{
          y: hidden && !open ? "-100%" : "0%",
          backgroundColor: scrolled && !open ? "rgba(247,244,238,0.96)" : "rgba(247,244,238,0)",
          borderColor: scrolled && !open ? "rgba(224,204,170,0.7)" : "rgba(224,204,170,0)",
        }}
        transition={{ duration: 0.5, ease: bezier.expo }}
        style={{
          borderBottomWidth: 1,
          borderBottomStyle: "solid",
        }}
      >
        <nav
          aria-label="Navegação principal"
          className="container-site flex h-[var(--nav-h)] items-center justify-between gap-6"
        >
          <AnchorLink href="#inicio" aria-label={`${siteConfig.clinic.name} — início`} className="relative z-[60]">
            <Wordmark tone={light ? "light" : "dark"} size="sm" />
          </AnchorLink>

          <ul className="hidden items-center gap-9 lg:flex">
            {siteConfig.copy.nav.map((item) => (
              <li key={item.href}>
                <AnchorLink
                  href={item.href}
                  className={`group relative inline-flex min-h-[44px] items-center text-[0.8125rem] font-medium tracking-[0.06em] transition-colors duration-500 ${
                    light ? "text-bg/90 hover:text-bg" : "text-ink/80 hover:text-ink"
                  }`}
                >
                  {item.label}
                  <span className="absolute bottom-2.5 left-0 h-px w-0 bg-accent transition-[width] duration-500 ease-out-expo group-hover:w-full" />
                </AnchorLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2 lg:gap-4">
            <a
              href={links.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Abrir Instagram da ${siteConfig.clinic.name}`}
              className={`hidden h-11 w-11 items-center justify-center transition-colors duration-500 hover:text-accent lg:inline-flex ${
                light ? "text-bg" : "text-primary-deep"
              }`}
            >
              <InstagramIcon size={19} />
            </a>
            <a
              href={links.booking}
              target="_blank"
              rel="noopener noreferrer"
              className={`btn-outline hidden sm:inline-flex ${
                light
                  ? "text-bg hover:bg-accent hover:text-primary-deep"
                  : "text-primary-deep hover:bg-primary-deep hover:text-bg"
              }`}
            >
              Agendar consulta
            </a>
            <button
              type="button"
              className="relative z-[60] inline-flex h-11 w-11 items-center justify-center lg:hidden"
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
            >
              <span className="relative block h-3 w-7">
                <motion.span
                  className={`absolute left-0 top-0 h-px w-full ${light ? "bg-bg" : "bg-primary-deep"}`}
                  animate={open ? { y: 6, rotate: 45 } : { y: 0, rotate: 0 }}
                  transition={{ duration: 0.4, ease: bezier.expo }}
                />
                <motion.span
                  className={`absolute bottom-0 left-0 h-px w-full ${light ? "bg-bg" : "bg-primary-deep"}`}
                  animate={open ? { y: -5, rotate: -45 } : { y: 0, rotate: 0 }}
                  transition={{ duration: 0.4, ease: bezier.expo }}
                />
              </span>
            </button>
          </div>
        </nav>
      </motion.header>
      <MobileMenu open={open} onClose={close} />
    </>
  );
}
