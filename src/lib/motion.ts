/** Tokens de motion centralizados — reutilizados em GSAP e Motion for React. */
export const durations = { fast: 0.4, base: 0.8, slow: 1.2 } as const;

export const eases = {
  out3: "power3.out",
  out4: "power4.out",
  expo: "expo.out",
} as const;

/** Equivalentes em cubic-bezier para Motion for React. */
export const bezier = {
  out3: [0.215, 0.61, 0.355, 1] as [number, number, number, number],
  out4: [0.165, 0.84, 0.44, 1] as [number, number, number, number],
  expo: [0.16, 1, 0.3, 1] as [number, number, number, number],
};

export const springs = {
  magnetic: { type: "spring", stiffness: 180, damping: 14, mass: 0.4 } as const,
  soft: { type: "spring", stiffness: 120, damping: 20 } as const,
};

/** Scrub padrão do ponto narrativo e das animações ligadas ao scroll. */
export const SCRUB = 0.8;
