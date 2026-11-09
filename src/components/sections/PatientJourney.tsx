"use client";

import { useRef } from "react";
import { siteConfig } from "@/config/site";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsoLayoutEffect } from "@/lib/hooks";
import { links, pad2 } from "@/lib/links";
import { durations, eases } from "@/lib/motion";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { RevealText } from "@/components/ui/RevealText";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { DotTrack } from "@/components/layout/ScrollProgressDot";

const R = 30;
const CIRC = 2 * Math.PI * R;

export function PatientJourney() {
  const ref = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const c = siteConfig.copy.journey;
  const steps = siteConfig.journey;

  useIsoLayoutEffect(() => {
    const el = ref.current;
    const pin = pinRef.current;
    if (!el || !pin) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();
    const stepsEls = q("[data-dot-lit-target]");

    if (reduced) {
      stepsEls.forEach((s) => s.classList.add("is-dot-lit"));
      return;
    }

    // Desktop: storytelling com pin; o ponto percorre a linha e ativa cada etapa
    mm.add("(min-width: 1024px) and (min-height: 640px)", () => {
      ScrollTrigger.create({
        id: "journey-pin",
        trigger: pin,
        pin: pin,
        start: "top top",
        end: () => `+=${Math.round(window.innerHeight * 1.6)}`,
        invalidateOnRefresh: true,
      });
    });

    // Desktop baixo (sem pin): as etapas acendem pelo ponto, sem fixar a seção
    // Mobile: linha vertical desenhada e etapas ativadas pelo scroll
    mm.add("(max-width: 1023.98px)", () => {
      const line = q("[data-vline]")[0];
      const t1 = gsap.fromTo(
        line,
        { scaleY: 0 },
        { scaleY: 1, ease: "none", scrollTrigger: { trigger: q("[data-steps]")[0], start: "top 65%", end: "bottom 65%", scrub: 0.8 } },
      );
      const ts = stepsEls.map((s) =>
        ScrollTrigger.create({ trigger: s, start: "top 65%", toggleClass: { targets: s, className: "is-dot-lit" } }),
      );
      return () => {
        t1.scrollTrigger?.kill();
        t1.kill();
        ts.forEach((t) => t.kill());
      };
    });

    const ctx = gsap.context(() => {
      gsap.from(q("[data-fade]"), {
        opacity: 0,
        y: 20,
        duration: durations.base,
        ease: eases.out3,
        stagger: 0.08,
        scrollTrigger: { trigger: el, start: "top 70%" },
      });
    }, el);

    return () => {
      ctx.revert();
      mm.revert();
    };
  }, []);

  return (
    <section ref={ref} id="jornada" aria-labelledby="jornada-title" data-dot-section="journey" className="relative bg-bg">
      <div ref={pinRef} className="relative overflow-hidden lg:min-h-[100svh]">
        <DotTrack />
        <div className="container-site relative flex flex-col py-28 md:py-36 lg:min-h-[100svh] lg:justify-center lg:py-[8vh] lg:pt-[calc(var(--nav-h)+4vh)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p data-fade="" className="eyebrow mb-6 text-primary">
                {c.eyebrow}
              </p>
              <RevealText id="jornada-title" text={c.headline} className="h2 max-w-[14ch] text-primary-deep" />
            </div>
          </div>

          {/* Linha do tempo */}
          <div data-steps="" className="relative mt-16 lg:mt-[9vh]">
            {/* desktop: linha horizontal (base) */}
            <span className="absolute left-0 right-0 top-[30px] hidden h-px bg-accent-soft lg:block" aria-hidden="true" />
            <span data-dot-anchor="line-start" className="absolute left-0 top-[30px] hidden h-px w-px lg:block" aria-hidden="true" />
            <span data-dot-anchor="line-end" className="absolute right-0 top-[30px] hidden h-px w-px lg:block" aria-hidden="true" />
            {/* mobile: linha vertical */}
            <span className="absolute bottom-0 left-[30px] top-0 w-px bg-accent-soft lg:hidden" aria-hidden="true" />
            <span data-vline="" className="absolute bottom-0 left-[30px] top-0 w-px origin-top bg-accent lg:hidden" aria-hidden="true" />

            <ol className="relative grid grid-cols-1 gap-12 lg:grid-cols-4 lg:gap-10">
              {steps.map((s, i) => (
                <li key={s.title} data-dot-lit-target="" className="journey-step relative flex gap-6 lg:block">
                  <div className="relative h-[60px] w-[60px] shrink-0 lg:ml-[18%]">
                    <svg viewBox="0 0 64 64" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
                      <circle cx="32" cy="32" r={R} fill="var(--color-bg)" stroke="var(--color-accent-soft)" strokeWidth="1" />
                      <circle
                        className="journey-ring"
                        cx="32"
                        cy="32"
                        r={R}
                        fill="none"
                        stroke="var(--color-accent)"
                        strokeWidth="1.2"
                        strokeDasharray={CIRC}
                        strokeDashoffset={CIRC}
                      />
                    </svg>
                    <span data-dot-anchor={`node${i + 1}`} className="absolute left-1/2 top-1/2 h-px w-px" aria-hidden="true" />
                    <span className="journey-num absolute inset-0 flex items-center justify-center font-serif text-[1.6rem] font-light text-accent-soft transition-colors duration-700">
                      {pad2(i + 1)}
                    </span>
                  </div>
                  <div className="journey-text pt-2 transition-opacity duration-700 lg:mt-8 lg:pt-0">
                    <h3 className="font-serif text-[1.65rem] font-normal leading-tight text-primary-deep">{s.title}</h3>
                    <p className="mt-3 max-w-[20rem] text-[1rem] leading-relaxed text-ink">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div data-fade="" className="mt-16 lg:mt-[8vh]">
            <MagneticButton href={links.booking} className="btn-gold">
              <WhatsAppIcon size={17} /> {c.cta}
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
}
