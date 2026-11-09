"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

let registered = false;

/** Registra os plugins do GSAP uma única vez. */
export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
  registered = true;
}

registerGsap();

export { gsap, ScrollTrigger, MotionPathPlugin };
