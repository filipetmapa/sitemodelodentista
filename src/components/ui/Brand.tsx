import { siteConfig } from "@/config/site";

type WordmarkProps = { className?: string; tone?: "light" | "dark"; size?: "sm" | "md" | "lg" };

/** Wordmark tipográfico: "ORVELLE" em Cormorant + "odontologia" em Allura dourada. */
export function Wordmark({ className = "", tone = "light", size = "md" }: WordmarkProps) {
  const sizes = {
    sm: { main: "text-[1.05rem]", script: "text-[1.3rem] -mt-[0.2rem] -mr-3" },
    md: { main: "text-[1.35rem]", script: "text-[1.55rem] -mt-[0.25rem] -mr-4" },
    lg: { main: "text-[2rem]", script: "text-[2.2rem] -mt-[0.35rem] -mr-5" },
  }[size];
  return (
    <span className={`relative inline-flex flex-col items-start pb-1 leading-none ${className}`}>
      <span
        className={`font-serif font-medium uppercase tracking-brand ${sizes.main} ${
          tone === "light" ? "text-bg" : "text-primary-deep"
        } transition-colors duration-500`}
      >
        {siteConfig.clinic.brandWord}
      </span>
      <span className={`self-end font-script leading-none text-accent ${sizes.script}`} aria-hidden="true">
        odontologia
      </span>
    </span>
  );
}

/** Monograma "O" com ponto dourado (favicon e elemento recorrente). */
export function Monogram({ className = "", stroke = "currentColor" }: { className?: string; stroke?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
      <ellipse cx="30" cy="32" rx="17" ry="21" fill="none" stroke={stroke} strokeWidth="1.6" />
      <ellipse cx="30" cy="32" rx="12.5" ry="19.4" fill="none" stroke={stroke} strokeWidth="0.6" opacity="0.6" />
      <circle cx="49.5" cy="15.5" r="2.6" fill="var(--color-accent)" />
    </svg>
  );
}
