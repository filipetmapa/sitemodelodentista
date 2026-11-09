"use client";

import { ArrowDownRight } from "lucide-react";
import { useRef } from "react";
import { siteConfig } from "@/config/site";
import { gsap } from "@/lib/gsap";
import { useIsoLayoutEffect } from "@/lib/hooks";
import { links } from "@/lib/links";
import { durations, eases } from "@/lib/motion";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { RevealText } from "@/components/ui/RevealText";
import { DotTrack } from "@/components/layout/ScrollProgressDot";
import { AnchorLink } from "@/components/layout/SmoothScrollProvider";
import Image from "next/image";
import { HeroMedia } from "./HeroMedia";

const announceReady = () => {
  (window as unknown as { __orvelleHeroReady?: boolean }).__orvelleHeroReady = true;
  window.dispatchEvent(new Event("orvelle:hero-ready"));
};

export function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const c = siteConfig.copy.hero;

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const q = gsap.utils.selector(el);

    const ctx = gsap.context(() => {
      const media = q("[data-hero-media]");
      const words = q("h1 [data-word]:not([data-script])");
      const script = q("h1 [data-word][data-script]");
      const fades = q("[data-hero-fade]");
      const buttons = q("[data-hero-btn]");
      const cue = q("[data-hero-cue]");
      const portrait = q("[data-hero-portrait]");

      if (reduced) {
        gsap.set(media, { opacity: 1 });
        gsap.set(portrait, { opacity: 1 });
        gsap.set(q("h1"), { visibility: "visible" });
        gsap.fromTo(
          [q("h1"), ...fades, ...buttons, ...cue],
          { opacity: 0 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.04, onComplete: announceReady },
        );
        return;
      }

      // Timeline única (~2,6s)
      const tl = gsap.timeline({ defaults: { ease: eases.out4 }, onComplete: announceReady });
      tl.set(words, { yPercent: 115 })
        .set(script, { clipPath: "inset(-20% 100% -30% 0%)" })
        .set(fades, { opacity: 0, y: 24 })
        .set(buttons, { opacity: 0, y: 18 })
        .set(cue, { opacity: 0 })
        .set(q("h1"), { visibility: "visible" })
        // 1–2. mídia surge com fade e zoom 1.08 → 1.0 (2,4s)
        .fromTo(media, { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: 2.4, ease: "power2.out" }, 0)
        // foto da profissional surge com fade e leve subida
        .fromTo(portrait, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.8, ease: eases.out3 }, 0.5)
        .to(q("[data-hero-eyebrow]"), { opacity: 1, y: 0, duration: durations.base, ease: eases.out3 }, 0.35)
        // 3. título por linhas
        .to(
          words,
          {
            yPercent: 0,
            duration: durations.slow,
            stagger: (i: number, t: HTMLElement) => Number(t.dataset.line || 0) * 0.12 + i * 0.015,
          },
          0.45,
        )
        // 4. "sorriso" escrito da esquerda para a direita + brilho
        .to(script, { clipPath: "inset(-20% 0% -30% 0%)", duration: 1.0, ease: "power2.inOut" }, 1.05)
        .fromTo(
          script,
          { textShadow: "0 0 0px rgba(224,204,170,0)" },
          { textShadow: "0 0 18px rgba(224,204,170,0.65)", duration: 0.35, yoyo: true, repeat: 1, ease: "sine.inOut" },
          1.85,
        )
        // 5. subtítulo
        .to(q("[data-hero-sub]"), { opacity: 1, y: 0, duration: durations.base, ease: eases.out3 }, 1.35)
        // 6. botões em stagger
        .to(buttons, { opacity: 1, y: 0, duration: durations.base, stagger: 0.1, ease: eases.out3 }, 1.55)
        .to(q("[data-hero-note]"), { opacity: 1, y: 0, duration: durations.base, ease: eases.out3 }, 1.8)
        // 7. indicador de scroll (o ponto narrativo nasce nele)
        .to(cue, { opacity: 1, duration: durations.base, ease: eases.out3 }, 2.0);

      // Parallax lento da mídia
      gsap.to(q("[data-hero-parallax]"), {
        yPercent: 10,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
      });
      // Foto com parallax mais lento que o texto
      gsap.to(q("[data-hero-portrait-inner]"), {
        yPercent: 6,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
      });
      // Conteúdo se afasta suavemente ao rolar
      gsap.to(q("[data-hero-content]"), {
        y: -60,
        opacity: 0.2,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      id="inicio"
      aria-labelledby="hero-title"
      data-dot-section="hero"
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-primary-deep text-bg"
    >
      <HeroMedia />
      {siteConfig.media.hero.portraitSrc && (
        // Foto da profissional sobre o fundo atual
        <div
          data-hero-portrait=""
          className="pointer-events-none relative z-[1] mt-[var(--nav-h)] h-[44svh] w-full opacity-0 md:h-[50svh] lg:absolute lg:bottom-0 lg:left-auto lg:right-[6vw] lg:mt-0 lg:h-[88svh] lg:w-[44vw]"
        >
          <div data-hero-portrait-inner="" className="relative h-full w-full">
            <Image
              src={siteConfig.media.hero.portraitSrc}
              alt={siteConfig.media.hero.portraitAlt}
              fill
              priority
              sizes="(min-width:1024px) 44vw, 100vw"
              className="object-contain object-bottom"
            />
          </div>
          {/* leve sombra na base para assentar a foto e manter o texto legível no celular */}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-primary-deep/80 to-transparent lg:from-primary-deep/50" />
        </div>
      )}
      <DotTrack className="z-[2]" />

      {/* Linha editorial lateral */}
      <div className="pointer-events-none absolute right-[var(--gutter)] top-0 z-[2] hidden h-full w-px bg-accent-soft/20 lg:block" aria-hidden="true" />
      <p
        className="pointer-events-none absolute right-[calc(var(--gutter)-0.6rem)] top-1/2 z-[2] hidden origin-center -translate-y-1/2 translate-x-1/2 rotate-90 whitespace-nowrap text-[0.6875rem] uppercase tracking-label text-accent-soft/70 lg:block"
        aria-hidden="true"
      >
        Odontologia · {siteConfig.address.city}
      </p>

      <div
        data-hero-content=""
        className={`container-site relative z-[3] flex flex-1 flex-col md:justify-center md:pb-[14svh] ${
          siteConfig.media.hero.portraitSrc
            ? "justify-start pb-28 pt-4 lg:pt-[calc(var(--nav-h)+10svh)]"
            : "justify-end pb-[18svh] pt-[calc(var(--nav-h)+10svh)]"
        }`}
      >
        <p data-hero-eyebrow="" data-hero-fade="" className="eyebrow mb-7 text-accent-soft md:mb-9">
          {c.eyebrow}
        </p>
        <RevealText
          as="h1"
          id="hero-title"
          manual
          text={c.headline}
          className="display max-w-[13ch] text-[clamp(2.75rem,min(1.2rem+6.4vw,11.5svh),6.5rem)] text-bg"
        />
        <p data-hero-sub="" data-hero-fade="" className="mt-7 max-w-[34rem] text-[1.0625rem] leading-relaxed text-bg/85 md:mt-9 md:text-lg">
          {c.subtitle}
        </p>
        <div className="mt-9 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-9 md:mt-11">
          <span data-hero-btn="" className="inline-flex">
            <MagneticButton href={links.booking} className="btn-gold">
              {c.primaryCta}
              <ArrowDownRight size={16} strokeWidth={1.5} className="-rotate-90" aria-hidden="true" />
            </MagneticButton>
          </span>
          <span data-hero-btn="">
            <AnchorLink href="#sobre" className="link-underline text-sm font-medium tracking-[0.08em] text-bg">
              {c.secondaryCta}
            </AnchorLink>
          </span>
        </div>
        <p data-hero-note="" data-hero-fade="" className="mt-8 flex items-center gap-3 text-[0.8125rem] text-bg/75">
          <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
          {c.emergencyNote}
        </p>
      </div>

      {/* Indicador de scroll — o ponto narrativo nasce aqui */}
      <div
        data-hero-cue=""
        className="absolute bottom-6 left-1/2 z-[3] flex -translate-x-1/2 flex-col items-center gap-3 md:bottom-8"
        aria-hidden="true"
      >
        <span className="text-[0.625rem] uppercase tracking-label text-accent-soft/80">{c.scrollLabel}</span>
        <span className="relative block h-12 w-px bg-accent-soft/30">
          <span className="scroll-cue-dot absolute -left-[2px] top-0 h-[5px] w-[5px] rounded-full bg-accent-soft" />
          <span data-dot-anchor="origin" className="absolute -left-[4px] bottom-[-4px] h-2 w-2" />
        </span>
      </div>
    </section>
  );
}
