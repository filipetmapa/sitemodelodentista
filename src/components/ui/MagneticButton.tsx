"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { forwardRef, useCallback, type ReactNode } from "react";
import { springs } from "@/lib/motion";
import { useFinePointer, useReducedMotion } from "@/lib/hooks";

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
  radius?: number;
  strength?: number;
  ariaLabel?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
};

/**
 * Botão magnético: segue levemente o cursor dentro de um raio (~80px)
 * e volta com mola suave ao sair.
 */
export const MagneticButton = forwardRef<HTMLAnchorElement, Props>(function MagneticButton(
  { href, children, className = "", external = true, radius = 80, strength = 0.32, ariaLabel, onClick },
  ref,
) {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, springs.magnetic);
  const sy = useSpring(y, springs.magnetic);
  const active = fine && !reduced;

  const onMove = useCallback(
    (e: React.PointerEvent<HTMLSpanElement>) => {
      if (!active) return;
      const r = e.currentTarget.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const dist = Math.hypot(dx, dy);
      const reach = Math.max(r.width, r.height) / 2 + radius;
      if (dist < reach) {
        x.set(dx * strength);
        y.set(dy * strength);
      } else {
        x.set(0);
        y.set(0);
      }
    },
    [active, radius, strength, x, y],
  );

  const reset = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    // Área de captura ampliada (raio magnético) ao redor do botão
    <span
      className="relative inline-flex"
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ padding: active ? radius / 2 : 0, margin: active ? -radius / 2 : 0 }}
    >
      <motion.a
        ref={ref}
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        aria-label={ariaLabel}
        onClick={onClick}
        className={className}
        style={{ x: sx, y: sy }}
        whileTap={{ scale: 0.97 }}
      >
        {children}
      </motion.a>
    </span>
  );
});
