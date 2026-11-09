"use client";

import Image from "next/image";
import { Expand } from "lucide-react";
import { useRef, useState } from "react";
import { siteConfig } from "@/config/site";
import { gsap } from "@/lib/gsap";
import { useIsoLayoutEffect } from "@/lib/hooks";
import { durations, eases } from "@/lib/motion";
import { RevealText } from "@/components/ui/RevealText";
import { Lightbox } from "@/components/ui/Lightbox";
import { DotTrack } from "@/components/layout/ScrollProgressDot";

type ItemProps = { i: number; className: string; aspect: string; speed: number; sizes: string; onOpen: (i: number) => void };

function GalleryItem({ i, className, aspect, speed, sizes, onOpen }: ItemProps) {
  const img = siteConfig.media.gallery[i];
  if (!img) return null;
  return (
    <figure className={`group relative z-[1] ${className}`} data-speed={speed}>
      <div className="relative">
      <span
        className="absolute inset-0 translate-x-3 translate-y-3 border border-accent/60 transition-transform duration-700 ease-out-expo group-hover:translate-x-5 group-hover:translate-y-5"
        aria-hidden="true"
      />
      <button
        type="button"
        onClick={() => onOpen(i)}
        className={`relative block w-full overflow-hidden bg-accent-soft/30 ${aspect}`}
        aria-label={`Ampliar imagem ${i + 1} de ${siteConfig.media.gallery.length}: ${img.alt}`}
        data-reveal=""
      >
        {/* PLACEHOLDER: substituir por fotos reais do consultório */}
        <span data-zoom="" className="absolute inset-0 block">
          <Image src={img.src} alt={img.alt} fill sizes={sizes} className="object-cover transition-transform duration-1000 ease-out-expo group-hover:scale-[1.03]" />
        </span>
        <span className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center bg-bg/80 text-primary-deep opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-within:opacity-100">
          <Expand size={15} strokeWidth={1.4} aria-hidden="true" />
        </span>
      </button>
      </div>
      {siteConfig.isDemo && (
        <figcaption className="mt-5 text-[0.75rem] uppercase tracking-[0.16em] text-ink/70">{img.caption}</figcaption>
      )}
    </figure>
  );
}

export function ClinicGallery() {
  const ref = useRef<HTMLElement>(null);
  const [index, setIndex] = useState<number | null>(null);
  const c = siteConfig.copy.gallery;

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const q = gsap.utils.selector(el);
    const ctx = gsap.context(() => {
      if (reduced) return;
      q("[data-reveal]").forEach((btn) => {
        // reveal com máscara (clip-path inset) + zoom-out 1.15 → 1.0
        gsap.fromTo(
          btn,
          { clipPath: "inset(12% 12% 12% 12%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: eases.expo, scrollTrigger: { trigger: btn, start: "top 85%" } },
        );
        gsap.fromTo(
          btn.querySelector("[data-zoom]"),
          { scale: 1.15 },
          { scale: 1, duration: 1.8, ease: eases.expo, scrollTrigger: { trigger: btn, start: "top 85%" } },
        );
      });
      // parallax com velocidades diferentes por imagem
      gsap.matchMedia().add("(min-width: 768px)", () => {
        q("[data-speed]").forEach((fig) => {
          const s = parseFloat((fig as HTMLElement).dataset.speed || "0");
          gsap.fromTo(fig, { y: 60 * s }, {
            y: -60 * s,
            ease: "none",
            scrollTrigger: { trigger: fig, start: "top bottom", end: "bottom top", scrub: true },
          });
        });
      });
      gsap.from(q("[data-fade]"), {
        opacity: 0,
        y: 24,
        duration: durations.base,
        ease: eases.out3,
        stagger: 0.1,
        scrollTrigger: { trigger: el, start: "top 70%" },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      id="consultorio"
      aria-labelledby="consultorio-title"
      data-dot-section="gallery"
      className="relative overflow-hidden bg-bg py-28 md:py-36 lg:py-44"
    >
      <DotTrack className="z-0" />
      {/* faixa bordô suave atrás de parte das imagens */}
      <div className="absolute left-0 top-[34%] h-[38%] w-[78%] bg-primary/[0.07]" aria-hidden="true" />

      <div className="container-site relative">
        {/* âncoras da trajetória sinuosa do ponto */}
        <span data-dot-anchor="g1" className="absolute right-[1%] top-[2%] h-px w-px" aria-hidden="true" />
        <span data-dot-anchor="g2" className="absolute left-[46%] top-[30%] h-px w-px" aria-hidden="true" />
        <span data-dot-anchor="g3" className="absolute left-[-1%] top-[64%] h-px w-px" aria-hidden="true" />
        <span data-dot-anchor="g4" className="absolute left-[78%] top-[92%] h-px w-px" aria-hidden="true" />

        <div className="grid grid-cols-1 gap-y-14 md:grid-cols-12 md:gap-x-8 lg:gap-x-10">
          <GalleryItem i={0} onOpen={setIndex} speed={0.6} className="md:col-span-5 md:row-span-2" aspect="aspect-[4/5]" sizes="(min-width:768px) 40vw, 92vw" />

          <div className="md:col-span-6 md:col-start-7">
            <p data-fade="" className="eyebrow mb-6 text-primary">
              {c.eyebrow}
            </p>
            <RevealText id="consultorio-title" text={c.headline} className="h2 max-w-[13ch] text-primary-deep" />
          </div>

          <GalleryItem i={1} onOpen={setIndex} speed={-0.4} className="md:col-span-6 md:col-start-7 md:self-end" aspect="aspect-[16/10]" sizes="(min-width:768px) 46vw, 92vw" />

          <div className="md:col-span-4 md:col-start-2 md:self-center lg:col-start-2">
            <span className="mb-6 block h-px w-14 bg-accent" aria-hidden="true" />
            <p data-fade="" className="max-w-[26rem] text-[1.0625rem] leading-[1.8] text-ink">
              {c.text}
            </p>
          </div>

          <GalleryItem i={2} onOpen={setIndex} speed={0.3} className="md:col-span-5 md:col-start-7 md:mt-10" aspect="aspect-[16/10]" sizes="(min-width:768px) 38vw, 92vw" />

          <GalleryItem i={4} onOpen={setIndex} speed={0.2} className="md:col-span-8 md:mt-10" aspect="aspect-[22/9]" sizes="(min-width:768px) 62vw, 92vw" />
          <GalleryItem i={3} onOpen={setIndex} speed={-0.5} className="md:col-span-3 md:col-start-10 md:-mt-16" aspect="aspect-[4/5]" sizes="(min-width:768px) 22vw, 92vw" />
        </div>
      </div>

      <Lightbox images={siteConfig.media.gallery} index={index} onChange={setIndex} />
    </section>
  );
}
