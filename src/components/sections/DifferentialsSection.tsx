"use client";

import { useRef } from "react";
import { siteConfig } from "@/config/site";
import { gsap } from "@/lib/gsap";
import { useIsoLayoutEffect } from "@/lib/hooks";
import { pad2 } from "@/lib/links";
import { durations, eases } from "@/lib/motion";
import { RevealText } from "@/components/ui/RevealText";
import { DotTrack } from "@/components/layout/ScrollProgressDot";
import { PillarStage } from "@/components/three/Stage";
import { pillarState } from "@/components/three/store";

export function DifferentialsSection() {
  const ref = useRef<HTMLElement>(null);
  const c = siteConfig.copy.differentials;

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      if (reduced) {
        q("[data-dot-lit-target]").forEach((p) => p.classList.add("is-dot-lit"));
        return;
      }
      // linhas surgindo horizontalmente entre os pilares
      gsap.fromTo(
        q("[data-hline]"),
        { scaleX: 0 },
        { scaleX: 1, duration: 1.4, ease: eases.expo, stagger: 0.12, scrollTrigger: { trigger: q("[data-grid]")[0], start: "top 80%" } },
      );
      gsap.from(q("[data-pillar-text]"), {
        opacity: 0,
        y: 28,
        duration: durations.base,
        ease: eases.out3,
        stagger: 0.12,
        scrollTrigger: { trigger: q("[data-grid]")[0], start: "top 75%" },
      });
    }, el);
    // Fora do desktop o ponto não percorre os pilares: cada número acende ao entrar na tela
    mm.add("(max-width: 1023.98px)", () => {
      const triggers = q("[data-dot-lit-target]").map((p) =>
        gsap.timeline({
          scrollTrigger: { trigger: p, start: "top 70%", toggleClass: { targets: p, className: "is-dot-lit" } },
        }),
      );
      return () => triggers.forEach((t) => t.kill());
    });
    return () => {
      ctx.revert();
      mm.revert();
    };
  }, []);

  return (
    <section
      ref={ref}
      id="experiencia"
      aria-labelledby="experiencia-title"
      data-dot-section="differentials"
      data-three-section=""
      className="relative bg-bg py-28 md:py-36 lg:py-44"
    >
      <DotTrack />
      <div className="container-site relative">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-6 text-primary">{c.eyebrow}</p>
            <RevealText id="experiencia-title" text={c.headline} className="h2 max-w-[15ch] text-primary-deep" />
          </div>
        </div>

        <div data-grid="" className="relative mt-20 grid grid-cols-1 md:grid-cols-2 lg:mt-28 lg:grid-cols-4">
          <span data-hline="" className="hairline absolute left-0 right-0 top-0 origin-left" aria-hidden="true" />
          {siteConfig.pillars.map((p, i) => (
            <article
              key={p.title}
              data-dot-lit-target=""
              onPointerEnter={() => (pillarState.hovered = i)}
              onPointerLeave={() => (pillarState.hovered = -1)}
              className={`pillar group relative flex flex-col pb-14 pt-10 md:px-8 lg:pb-4 ${
                i % 2 === 1 ? "md:border-l md:border-accent-soft/70" : ""
              } ${i > 0 ? "lg:border-l lg:border-accent-soft/70" : ""} ${i === 0 ? "lg:pl-0" : ""}`}
            >
              {i > 0 && <span data-hline="" className="hairline absolute left-0 right-0 top-0 origin-left md:hidden" aria-hidden="true" />}
              <div className="flex items-center gap-3">
                <span data-dot-anchor={`n${i + 1}`} className="pillar-num relative font-serif text-[2.6rem] font-light leading-none text-primary/40 transition-colors duration-700">
                  {pad2(i + 1)}
                  <span className="pillar-spark absolute -left-3 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-accent opacity-0 transition-all duration-700" aria-hidden="true" />
                </span>
                <span className="pillar-tick h-px w-0 bg-accent transition-all duration-700" aria-hidden="true" />
              </div>
              <PillarStage index={i} className="my-8 aspect-square w-40 self-center md:w-44" />
              <div data-pillar-text="">
                <h3 className="font-serif text-[1.65rem] font-normal leading-tight text-primary-deep">{p.title}</h3>
                <p className="mt-4 max-w-[22rem] text-[1rem] leading-relaxed text-ink">{p.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
