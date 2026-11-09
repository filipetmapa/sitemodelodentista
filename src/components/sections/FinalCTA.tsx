"use client";

import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import { siteConfig } from "@/config/site";
import { gsap } from "@/lib/gsap";
import { useIsoLayoutEffect } from "@/lib/hooks";
import { links } from "@/lib/links";
import { durations, eases } from "@/lib/motion";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { RevealText } from "@/components/ui/RevealText";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { DotTrack } from "@/components/layout/ScrollProgressDot";

export function FinalCTA() {
  const ref = useRef<HTMLElement>(null);
  const c = siteConfig.copy.finalCta;

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
        scrollTrigger: { trigger: el, start: "top 65%" },
      });
      if (!reduced)
        gsap.fromTo(
          q("[data-glow]"),
          { opacity: 0, scale: 0.7 },
          { opacity: 1, scale: 1, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "center center", scrub: true } },
        );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      id="agendar"
      aria-labelledby="agendar-title"
      data-dot-section="final"
      className="final-cta relative overflow-hidden bg-primary-deep py-32 text-bg md:py-44"
    >
      <div
        data-glow=""
        className="pointer-events-none absolute left-1/2 top-1/2 h-[80vmax] w-[80vmax] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(closest-side,rgba(197,164,109,0.16),rgba(197,164,109,0.05)_45%,transparent_70%)]"
        aria-hidden="true"
      />
      <DotTrack />
      <div className="container-site relative flex flex-col items-center text-center">
        <RevealText
          id="agendar-title"
          text={c.headline}
          className="display max-w-[16ch] text-[clamp(2.5rem,1.4rem+4.4vw,5.5rem)] text-bg"
        />
        <p data-fade="" className="mt-8 max-w-[32rem] text-[1.0625rem] leading-relaxed text-bg/85">
          {c.subtitle}
        </p>
        <div data-fade="" className="mt-14">
          <span data-dot-anchor="button" className="final-cta__btn relative inline-flex">
            <MagneticButton href={links.booking} className="btn-gold min-h-[64px] px-10 text-[0.875rem] md:px-14">
              <WhatsAppIcon size={18} /> {c.cta}
            </MagneticButton>
          </span>
        </div>
        <div data-fade="" className="mt-12 flex flex-col items-center gap-3 sm:flex-row sm:gap-10">
          <a href={links.emergency} target="_blank" rel="noopener noreferrer" className="link-underline text-sm text-bg/90 hover:text-bg">
            {c.emergencyLink}
            <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" />
          </a>
          <a
            href={links.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${c.instagramLink} — abrir Instagram da ${siteConfig.clinic.name}`}
            className="link-underline text-sm text-accent-soft hover:text-bg"
          >
            <InstagramIcon size={16} /> {c.instagramLink}
          </a>
        </div>
      </div>
    </section>
  );
}
