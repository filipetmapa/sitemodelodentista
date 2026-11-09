"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useRef, useState } from "react";
import { siteConfig } from "@/config/site";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsoLayoutEffect } from "@/lib/hooks";
import { links, pad2 } from "@/lib/links";
import { bezier, durations, eases } from "@/lib/motion";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { RevealText } from "@/components/ui/RevealText";
import { DotTrack } from "@/components/layout/ScrollProgressDot";
import { ToothStage } from "@/components/three/Stage";
import { markToothKick, toothState } from "@/components/three/store";

export function TreatmentsSection() {
  const ref = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const hoverRef = useRef<number | null>(null);
  const autoRef = useRef(0);
  const [active, setActive] = useState(0);
  const c = siteConfig.copy.treatments;
  const items = siteConfig.treatments;

  const select = (i: number) => {
    setActive(i);
    markToothKick(i);
  };

  useIsoLayoutEffect(() => {
    const el = ref.current;
    const pin = pinRef.current;
    if (!el || !pin) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();

    // Desktop com altura suficiente: pin da seção enquanto a lista é lida
    mm.add("(min-width: 1024px) and (min-height: 700px)", () => {
      if (reduced) return;
      ScrollTrigger.create({
        id: "treatments-pin",
        trigger: pin,
        pin: pin,
        start: "top top",
        end: () => `+=${Math.round(window.innerHeight * 2.4)}`,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          toothState.progress = self.progress;
          const idx = Math.min(items.length - 1, Math.floor(self.progress * items.length * 0.999));
          if (idx !== autoRef.current) {
            autoRef.current = idx;
            if (hoverRef.current === null) select(idx);
          }
        },
      });
    });

    // Sem pin: o progresso da seção ainda conduz a perspectiva 3D
    mm.add("(max-width: 1023.98px), (max-height: 699.98px)", () => {
      ScrollTrigger.create({
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => (toothState.progress = self.progress),
      });
    });

    const ctx = gsap.context(() => {
      if (reduced) return; // conteúdo já visível, sem animação
      gsap.from(q("[data-fade]"), {
        opacity: 0,
        y: 24,
        duration: durations.base,
        ease: eases.out3,
        stagger: 0.06,
        scrollTrigger: { trigger: el, start: "top 70%" },
      });
    }, el);

    return () => {
      ctx.revert();
      mm.revert();
    };
  }, []);

  return (
    <section
      ref={ref}
      id="tratamentos"
      aria-labelledby="tratamentos-title"
      data-dot-section="treatments"
      data-three-section=""
      className="relative bg-primary-deep text-bg"
    >
      <div ref={pinRef} className="noise relative overflow-hidden lg:min-h-[100svh]">
        <DotTrack className="z-[1]" />
        <div className="container-site relative z-[2] grid grid-cols-1 gap-12 py-24 md:py-32 lg:min-h-[100svh] lg:grid-cols-[55fr_45fr] lg:gap-0 lg:py-0 lg:pt-[calc(var(--nav-h)+4vh)] lg:pb-[5vh]">
          {/* Lista editorial */}
          <div className="order-2 flex flex-col justify-center lg:order-1 lg:pr-[6vw]">
            <p data-fade="" className="eyebrow mb-5 text-accent-soft">
              {c.eyebrow}
            </p>
            <RevealText
              id="tratamentos-title"
              text={c.headline}
              className="font-serif text-[clamp(2.25rem,1.3rem+2.6vw,3.9rem)] font-light leading-[1.04] text-bg"
            />
            <p data-fade="" className="mt-5 max-w-[30rem] text-[1rem] leading-relaxed text-bg/80">
              {c.subtitle}
            </p>

            {/* DEMO: confirmar tratamentos realmente oferecidos pelo cliente */}
            <ul className="mt-8 border-t border-accent-soft/20 lg:mt-[4vh]" onPointerLeave={() => (hoverRef.current = null)}>
              {items.map((t, i) => {
                const isActive = active === i;
                return (
                  <li key={t.name} data-fade="" className="relative border-b border-accent-soft/20">
                    <h3>
                      <button
                        type="button"
                        id={`trat-btn-${i}`}
                        aria-expanded={isActive}
                        aria-controls={`trat-panel-${i}`}
                        onClick={() => select(i)}
                        onPointerEnter={(e) => {
                          if (e.pointerType !== "mouse") return;
                          hoverRef.current = i;
                          select(i);
                        }}
                        onFocus={() => select(i)}
                        className="group flex min-h-[56px] w-full items-baseline gap-5 py-3 text-left lg:min-h-[52px] lg:py-[1.1vh]"
                      >
                        <span
                          className={`w-7 shrink-0 font-serif text-[1rem] transition-colors duration-500 ${
                            isActive ? "text-accent" : "text-bg/50"
                          }`}
                        >
                          {pad2(i + 1)}
                        </span>
                        <span
                          className={`font-serif text-[1.55rem] font-light leading-tight transition-colors duration-500 md:text-[1.75rem] ${
                            isActive ? "text-bg" : "text-bg/60 group-hover:text-bg/85"
                          }`}
                        >
                          {t.name}
                        </span>
                      </button>
                    </h3>
                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.div
                          id={`trat-panel-${i}`}
                          role="region"
                          aria-labelledby={`trat-btn-${i}`}
                          key="panel"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.5, ease: bezier.expo }}
                          className="overflow-hidden"
                        >
                          <div className="flex flex-col gap-3 pb-5 pl-12 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
                            <p className="max-w-[26rem] text-[1rem] leading-relaxed text-bg/80">{t.description}</p>
                            <a
                              href={links.treatment(t.name)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex min-h-[44px] shrink-0 items-center gap-2 text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-accent hover:text-accent-soft"
                            >
                              {c.itemCta}
                              <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" />
                              <span className="sr-only">sobre {t.name}</span>
                            </a>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {/* linha decorativa que se expande */}
                    <span
                      className="absolute -bottom-px left-0 h-px origin-left bg-accent transition-transform duration-700 ease-out-expo"
                      style={{ width: "100%", transform: `scaleX(${isActive ? 1 : 0})` }}
                      aria-hidden="true"
                    />
                  </li>
                );
              })}
            </ul>
            <div data-fade="" className="mt-8 lg:mt-[4vh]">
              <MagneticButton href={links.booking} className="btn-gold">
                {c.cta}
              </MagneticButton>
            </div>
          </div>

          {/* Cena 3D */}
          <div className="order-1 flex items-center justify-center lg:order-2">
            <div data-dot-anchor="orbit" className="relative aspect-square w-[min(78vw,420px)] lg:w-full lg:max-w-[560px]">
              <ToothStage className="h-full w-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
