"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { siteConfig } from "@/config/site";
import { bezier } from "@/lib/motion";
import { RevealText } from "@/components/ui/RevealText";
import { DotTrack } from "@/components/layout/ScrollProgressDot";

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);
  const c = siteConfig.copy.faq;
  return (
    <section id="duvidas" aria-labelledby="duvidas-title" data-dot-section="rail" className="relative bg-bg pb-28 md:pb-36 lg:pb-44">
      <DotTrack />
      <div className="container-site relative grid grid-cols-1 gap-12 border-t border-accent-soft pt-28 md:pt-36 lg:grid-cols-12 lg:pt-40">
        <div className="lg:col-span-4">
          <p className="eyebrow mb-6 text-primary">{c.eyebrow}</p>
          <RevealText id="duvidas-title" text={c.headline} className="h2 max-w-[11ch] text-primary-deep" />
        </div>
        <div className="lg:col-span-7 lg:col-start-6">
          <ul className="border-t border-accent-soft">
            {siteConfig.faq.map((item, i) => {
              const isOpen = open === i;
              return (
                <li key={item.question} className="border-b border-accent-soft">
                  <h3>
                    <button
                      type="button"
                      id={`faq-btn-${i}`}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${i}`}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="group flex min-h-[64px] w-full items-center justify-between gap-6 py-5 text-left"
                    >
                      <span className="font-serif text-[1.35rem] font-normal leading-snug text-primary-deep transition-transform duration-500 ease-out-expo group-hover:translate-x-1 md:text-[1.55rem]">
                        {item.question}
                      </span>
                      <span className="relative h-4 w-4 shrink-0" aria-hidden="true">
                        <span className="absolute left-0 top-1/2 h-px w-4 bg-primary" />
                        <motion.span
                          className="absolute left-1/2 top-0 h-4 w-px bg-primary"
                          animate={{ rotate: isOpen ? 90 : 0, opacity: isOpen ? 0 : 1 }}
                          transition={{ duration: 0.4, ease: bezier.expo }}
                        />
                      </span>
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-panel-${i}`}
                        role="region"
                        aria-labelledby={`faq-btn-${i}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: bezier.expo }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-[40rem] pb-7 pr-10 text-[1rem] leading-[1.8] text-ink">{item.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
