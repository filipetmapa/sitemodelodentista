"use client";

import { useRef } from "react";
import { siteConfig } from "@/config/site";
import { gsap } from "@/lib/gsap";
import { useIsoLayoutEffect } from "@/lib/hooks";
import { links } from "@/lib/links";
import { durations, eases } from "@/lib/motion";
import { Monogram } from "@/components/ui/Brand";
import { RevealText } from "@/components/ui/RevealText";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { DotTrack } from "@/components/layout/ScrollProgressDot";

export function EmergencySection() {
  const ref = useRef<HTMLElement>(null);
  const c = siteConfig.copy.emergency;

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const q = gsap.utils.selector(el);
    const ctx = gsap.context(() => {
      gsap.from(q("[data-fade]"), {
        opacity: 0,
        y: reduced ? 0 : 24,
        duration: durations.base,
        ease: eases.out3,
        stagger: 0.1,
        scrollTrigger: { trigger: el, start: "top 70%" },
      });
      if (!reduced)
        gsap.from(q("[data-ring]"), {
          scale: 0.86,
          opacity: 0,
          duration: 1.6,
          ease: eases.expo,
          scrollTrigger: { trigger: el, start: "top 70%" },
        });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      id="urgencias"
      aria-labelledby="urgencias-title"
      data-dot-section="emergency"
      className="noise relative overflow-hidden bg-primary py-28 text-bg md:py-36 lg:py-40"
    >
      <DotTrack />
      <div className="container-site relative grid grid-cols-1 items-center gap-14 lg:grid-cols-12">
        <div className="flex justify-center lg:col-span-5 lg:justify-start">
          {/* símbolo circular com texto girando no contorno */}
          <div data-ring="" data-dot-anchor="ring" className="relative h-[220px] w-[220px] md:h-[260px] md:w-[260px]" aria-hidden="true">
            <svg viewBox="0 0 200 200" className="spin-slower absolute inset-0 h-full w-full">
              <defs>
                <path id="ring-path" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
              </defs>
              <circle cx="100" cy="100" r="92" fill="none" stroke="var(--color-accent)" strokeWidth="0.6" />
              <circle cx="100" cy="100" r="64" fill="none" stroke="var(--color-accent)" strokeWidth="0.4" opacity="0.6" />
              <text fill="var(--color-accent-soft)" fontSize="9.5" style={{ fontFamily: "var(--font-sans)" }}>
                <textPath href="#ring-path" textLength={486} lengthAdjust="spacing">
                  {c.ring.toUpperCase()}
                </textPath>
              </text>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Monogram className="h-16 w-16 text-accent-soft" />
            </div>
          </div>
        </div>
        <div className="lg:col-span-7">
          <RevealText id="urgencias-title" text={c.headline} className="h2 max-w-[17ch] text-bg" />
          <p data-fade="" className="mt-8 max-w-[34rem] text-[1.0625rem] leading-[1.8] text-bg/85">
            {c.text}
          </p>
          <p data-fade="" className="mt-6 flex items-center gap-3 text-[0.875rem] text-accent-soft">
            <span className="inline-block h-px w-8 bg-accent" aria-hidden="true" />
            {siteConfig.hours.emergencyShort}
          </p>
          <div data-fade="" className="mt-10">
            <a href={links.emergency} target="_blank" rel="noopener noreferrer" className="btn-outline text-bg hover:bg-accent hover:text-primary-deep">
              <WhatsAppIcon size={17} /> {c.cta}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
