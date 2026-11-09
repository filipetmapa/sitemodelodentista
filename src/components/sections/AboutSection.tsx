"use client";

import Image from "next/image";
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

export function AboutSection() {
  const ref = useRef<HTMLElement>(null);
  const c = siteConfig.copy.about;
  const p = siteConfig.professional;
  const photo = siteConfig.media.about.photoSrc;

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const q = gsap.utils.selector(el);
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.from(q("[data-fade]"), { opacity: 0, duration: 0.4, stagger: 0.05, scrollTrigger: { trigger: el, start: "top 75%" } });
        return;
      }
      // Foto revelada com clip-path de baixo para cima
      gsap.fromTo(
        q("[data-photo]"),
        { clipPath: "inset(100% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.6,
          ease: eases.expo,
          scrollTrigger: { trigger: q("[data-photo]")[0], start: "top 80%" },
        },
      );
      // Parallax sutil: imagem e moldura em sentidos opostos
      gsap.fromTo(q("[data-photo-inner]"), { yPercent: -6 }, {
        yPercent: 6,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
      });
      gsap.fromTo(q("[data-frame]"), { y: 24 }, {
        y: -24,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
      });
      gsap.from(q("[data-fade]"), {
        opacity: 0,
        y: 24,
        duration: durations.base,
        ease: eases.out3,
        stagger: 0.1,
        scrollTrigger: { trigger: q("[data-text]")[0], start: "top 75%" },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      id="sobre"
      aria-labelledby="sobre-title"
      data-dot-section="about"
      className="relative overflow-hidden bg-bg py-28 md:py-36 lg:py-44"
    >
      <DotTrack />
      <div className="container-site relative grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-x-0">
        {/* Fotografia (placeholder) */}
        <div className="relative mx-auto w-full max-w-[520px] lg:col-span-5 lg:mx-0 lg:max-w-none">
          <div data-frame="" className="absolute inset-0 translate-x-4 translate-y-4 border border-accent" aria-hidden="true" />
          <figure data-photo="" className="relative aspect-[4/5] overflow-hidden bg-primary">
            <div data-photo-inner="" className="absolute inset-[-7%_0] will-change-transform">
              {photo ? (
                <Image src={photo} alt={siteConfig.media.about.photoAlt} fill sizes="(min-width:1024px) 40vw, 90vw" className="object-cover" />
              ) : (
                // PLACEHOLDER: substituir por foto profissional real
                <div className="noise absolute inset-0 flex flex-col items-center justify-center gap-5 bg-[radial-gradient(90%_70%_at_50%_35%,#6b2738_0%,#581c2b_45%,#3d1420_100%)] text-accent-soft">
                  <Monogram className="h-24 w-24 text-accent-soft/80 md:h-28 md:w-28" />
                  <span className="eyebrow text-accent-soft/70">{c.photoPlaceholder}</span>
                </div>
              )}
            </div>
            <figcaption className="sr-only">Espaço reservado para a fotografia profissional</figcaption>
          </figure>
          {/* linha vertical que o ponto narrativo desenha */}
          <span
            data-dot-anchor="line"
            className="absolute bottom-[6%] right-[calc(-1*clamp(28px,4.2vw,64px))] top-[6%] hidden w-px lg:block"
            aria-hidden="true"
          />
        </div>

        {/* Texto */}
        <div data-text="" className="lg:col-span-6 lg:col-start-7 lg:self-center">
          <p data-fade="" className="eyebrow mb-6 text-primary">
            {c.eyebrow}
          </p>
          <RevealText id="sobre-title" text={c.headline} className="h2 max-w-[14ch] text-primary-deep" />
          <div className="mt-10 max-w-[34rem] space-y-6 text-[1.0625rem] leading-[1.8] text-ink">
            {c.paragraphs.map((t) => (
              <p data-fade="" key={t}>
                {t}
              </p>
            ))}
          </div>

          {p.qualifications.length > 0 && (
            <ul data-fade="" className="mt-8 space-y-2 border-l border-accent-soft pl-5 text-[0.9375rem] text-ink">
              {p.qualifications.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ul>
          )}

          <div data-fade="" className="relative mt-12 inline-block">
            {/* arco dourado girando lentamente atrás da assinatura */}
            <svg
              className="spin-slow pointer-events-none absolute -left-8 -top-10 h-36 w-36 text-accent/50"
              viewBox="0 0 100 100"
              aria-hidden="true"
            >
              <path d="M10 50 A40 40 0 0 1 78 22" fill="none" stroke="currentColor" strokeWidth="0.6" />
              <circle cx="78" cy="22" r="1.4" fill="currentColor" />
            </svg>
            <p className="relative font-script text-[3.2rem] leading-none text-accent">{p.signature}</p>
          </div>
          <p data-fade="" className="mt-4 text-[0.8125rem] uppercase tracking-[0.18em] text-ink/80">
            {p.profession} · {p.cro}
          </p>

          <div data-fade="" className="mt-12">
            <a href={links.evaluation} target="_blank" rel="noopener noreferrer" className="btn-outline group text-primary-deep hover:bg-primary-deep hover:text-bg">
              <WhatsAppIcon size={17} /> {c.cta}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
