import { Monogram } from "@/components/ui/Brand";

/** Mapa estilizado em SVG (modo demonstrativo): ruas abstratas em linhas douradas. */
export function StylizedMap({ caption }: { caption: string }) {
  return (
    <figure className="relative">
      <div className="relative aspect-[4/3] w-full overflow-hidden border border-accent/40 bg-primary-deep">
        <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" role="img" aria-label="Mapa ilustrativo, sem endereço real">
          <g fill="none" stroke="var(--color-accent)" strokeLinecap="round">
            <g strokeWidth="0.5" opacity="0.35">
              {Array.from({ length: 9 }).map((_, i) => (
                <path key={`h${i}`} d={`M-10 ${20 + i * 34} C 120 ${10 + i * 34}, 260 ${40 + i * 33}, 410 ${18 + i * 35}`} />
              ))}
              {Array.from({ length: 11 }).map((_, i) => (
                <path key={`v${i}`} d={`M${10 + i * 40} -10 C ${30 + i * 38} 100, ${-10 + i * 41} 200, ${20 + i * 39} 310`} />
              ))}
            </g>
            <path d="M-10 230 C 90 190, 170 210, 230 150 S 360 60, 420 40" strokeWidth="1.6" opacity="0.8" />
            <path d="M60 -10 C 90 80, 120 140, 210 160 S 330 230, 380 310" strokeWidth="1" opacity="0.6" />
            <circle cx="300" cy="80" r="34" strokeWidth="0.6" opacity="0.5" />
          </g>
        </svg>
        <div className="absolute left-[54%] top-[51%] -translate-x-1/2 -translate-y-1/2">
          <span className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/40" aria-hidden="true" />
          <span className="pulse-dot absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10" aria-hidden="true" />
          <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-primary text-accent-soft">
            <Monogram className="h-9 w-9" />
          </span>
        </div>
      </div>
      <figcaption className="mt-3 text-[0.75rem] uppercase tracking-[0.16em] text-bg/70">{caption}</figcaption>
    </figure>
  );
}
