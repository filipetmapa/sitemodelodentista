"use client";

import { useEffect, useRef } from "react";
import { gsap, MotionPathPlugin, ScrollTrigger } from "@/lib/gsap";
import { SCRUB } from "@/lib/motion";

/**
 * PONTO DOURADO NARRATIVO
 *
 * Um único ponto (8px) acompanha o progresso real do scroll da hero ao CTA final.
 * Cada seção marcada com [data-dot-section] contém um <svg data-dot-svg> onde
 * a trajetória da seção é gerada a partir de âncoras do layout ([data-dot-anchor]).
 *
 * - Desktop: trajetórias por seção (MotionPathPlugin), com a linha fina sendo
 *   "desenhada" (stroke-dashoffset) por onde o ponto passa. As seções com pin
 *   (tratamentos e jornada) recebem pesos explícitos para o ponto ficar
 *   sincronizado com o conteúdo fixado.
 * - Mobile: linha vertical fixa a 12px da borda esquerda, com paradas por seção.
 * - prefers-reduced-motion: ponto estático no indicador e linhas já desenhadas.
 */

type RawPath = ReturnType<typeof MotionPathPlugin.getRawPath> & { totalLength?: number };

type Piece = { d: string; weight?: number; halo?: boolean; glow?: boolean };
type Marker = { x: number; y: number; el: Element | null; action?: "lit" | "pulse" };
type Built = { pieces: Piece[]; markers?: Marker[] };

type Rect = { x: number; y: number; w: number; h: number; cx: number; cy: number; x2: number; y2: number };

type Ctx = {
  root: HTMLElement;
  svg: SVGSVGElement;
  W: number;
  H: number;
  vh: number;
  L: number;
  anchor: (name: string) => Rect | null;
  anchors: (prefix: string) => { rect: Rect; el: HTMLElement }[];
};

type Builder = {
  entry?: (c: Ctx) => number | undefined;
  build: (c: Ctx, entryX: number, exitX: number | undefined) => Built & { exitX: number };
  start?: (c: Ctx) => string | number | (() => number);
  end?: (c: Ctx) => string | number | (() => number);
};

const START_RATIO = 0.55; // o ponto vive em ~55% da altura da viewport

// ---------- helpers de geometria ----------
const f = (n: number) => Math.round(n * 10) / 10;

function vCurve(ax: number, ay: number, bx: number, by: number) {
  const k = Math.max(40, Math.abs(by - ay) * 0.5);
  return `C${f(ax)},${f(ay + k)} ${f(bx)},${f(by - k)} ${f(bx)},${f(by)}`;
}

/** Catmull-Rom → Bézier, passando por todos os pontos. */
function smoothThrough(pts: { x: number; y: number }[], tension = 0.5) {
  let d = `M${f(pts[0].x)},${f(pts[0].y)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const t = tension / 3;
    const c1x = p1.x + (p2.x - p0.x) * t;
    const c1y = p1.y + (p2.y - p0.y) * t;
    const c2x = p2.x - (p3.x - p1.x) * t;
    const c2y = p2.y - (p3.y - p1.y) * t;
    d += ` C${f(c1x)},${f(c1y)} ${f(c2x)},${f(c2y)} ${f(p2.x)},${f(p2.y)}`;
  }
  return d;
}

function ellipseOrbit(cx: number, cy: number, rx: number, ry: number, halfTurns: number) {
  // começa no topo, gira no sentido horário, termina no topo (par) ou na base (ímpar)
  let d = `M${f(cx)},${f(cy - ry)}`;
  for (let i = 0; i < halfTurns; i++) {
    const toBottom = i % 2 === 0;
    d += ` A${f(rx)},${f(ry)} 0 0 1 ${f(cx)},${f(toBottom ? cy + ry : cy - ry)}`;
  }
  return d;
}

// ---------- construtores por seção ----------
const builders: Record<string, Builder> = {
  hero: {
    start: () => 0,
    build: (c, _entry, exitX) => {
      const o = c.anchor("origin");
      const ox = o ? o.cx : c.W / 2;
      const oy = o ? o.cy : c.H * 0.9;
      const ex = exitX ?? ox;
      return { exitX: ex, pieces: [{ d: `M${f(ox)},${f(oy)} ${vCurve(ox, oy, ex, c.H)}` }] };
    },
  },

  about: {
    entry: (c) => c.anchor("line")?.cx,
    build: (c, entryX, exitX) => {
      const line = c.anchor("line");
      const lx = line ? line.cx : entryX;
      const top = line ? line.y : c.H * 0.2;
      const bottom = line ? line.y2 : c.H * 0.8;
      const ex = exitX ?? lx;
      const d =
        `M${f(entryX)},0 ${vCurve(entryX, 0, lx, top)} L${f(lx)},${f(bottom)} ` + vCurve(lx, bottom, ex, c.H);
      return { exitX: ex, pieces: [{ d }] };
    },
  },

  treatments: {
    entry: (c) => c.anchor("orbit")?.cx,
    build: (c, entryX, exitX) => {
      const o = c.anchor("orbit");
      const cx = o ? o.cx : c.W * 0.75;
      const cy = o ? o.cy : c.H * 0.5;
      const rx = o ? o.w * 0.44 : 200;
      const ry = o ? o.h * 0.36 : 160;
      const ex = exitX ?? cx;
      const pin = ScrollTrigger.getById("treatments-pin");
      const startY = cy - ry;
      const endY = cy + ry;
      if (pin) {
        const pinDur = pin.end - pin.start;
        const pre = c.vh * START_RATIO;
        return {
          exitX: ex,
          pieces: [
            { d: `M${f(entryX)},0 ${vCurve(entryX, 0, cx, startY)}`, weight: pre },
            { d: ellipseOrbit(cx, cy, rx, ry, 3), weight: pinDur, halo: true },
            { d: `M${f(cx)},${f(endY)} ${vCurve(cx, endY, ex, c.H)}`, weight: Math.max(1, c.H - pre) },
          ],
        };
      }
      return {
        exitX: ex,
        pieces: [
          { d: `M${f(entryX)},0 ${vCurve(entryX, 0, cx, startY)}` },
          { d: ellipseOrbit(cx, cy, rx, ry, 3), halo: true },
          { d: `M${f(cx)},${f(endY)} ${vCurve(cx, endY, ex, c.H)}` },
        ],
      };
    },
  },

  differentials: {
    build: (c, entryX, exitX) => {
      const nums = c.anchors("n");
      if (!nums.length) return { exitX: exitX ?? entryX, pieces: [{ d: `M${entryX},0 L${entryX},${c.H}` }] };
      const pts = nums.map((n) => ({ x: n.rect.x - 16, y: n.rect.cy }));
      const last = pts[pts.length - 1];
      const ex = exitX ?? last.x;
      // pequenas ondulações entre os números
      const through: { x: number; y: number }[] = [];
      pts.forEach((p, i) => {
        through.push(p);
        const next = pts[i + 1];
        if (next) through.push({ x: (p.x + next.x) / 2, y: p.y + 56 });
      });
      const first = through[0];
      const d1 = `M${f(entryX)},0 ${vCurve(entryX, 0, first.x, first.y)}`;
      const d2 = smoothThrough(through, 0.9);
      const d3 = `M${f(last.x)},${f(last.y)} ${vCurve(last.x, last.y, ex, c.H)}`;
      return {
        exitX: ex,
        pieces: [{ d: d1 }, { d: d2 }, { d: d3 }],
        markers: nums.map((n, i) => ({
          x: pts[i].x,
          y: pts[i].y,
          el: n.el.closest("[data-dot-lit-target]"),
          action: "lit" as const,
        })),
      };
    },
  },

  gallery: {
    entry: (c) => c.anchors("g")[0]?.rect.cx,
    build: (c, entryX, exitX) => {
      const pts = c.anchors("g").map((a) => ({ x: a.rect.cx, y: a.rect.cy }));
      const ex = exitX ?? (pts.length ? pts[pts.length - 1].x : entryX);
      const all = [{ x: entryX, y: 0 }, ...pts, { x: ex, y: c.H }];
      return { exitX: ex, pieces: [{ d: smoothThrough(all, 0.8) }] };
    },
  },

  journey: {
    build: (c, entryX, exitX) => {
      const s = c.anchor("line-start");
      const e = c.anchor("line-end");
      const nodes = c.anchors("node");
      if (!s || !e) return { exitX: exitX ?? entryX, pieces: [{ d: `M${entryX},0 L${entryX},${c.H}` }] };
      const ex = exitX ?? e.cx;
      const pin = ScrollTrigger.getById("journey-pin");
      const markers: Marker[] = nodes.map((n) => ({
        x: n.rect.cx,
        y: n.rect.cy,
        el: n.el.closest("[data-dot-lit-target]"),
        action: "lit",
      }));
      const a = `M${f(entryX)},0 ${vCurve(entryX, 0, s.cx, s.cy)}`;
      const b = `M${f(s.cx)},${f(s.cy)} L${f(e.cx)},${f(e.cy)}`;
      const cc = `M${f(e.cx)},${f(e.cy)} ${vCurve(e.cx, e.cy, ex, c.H)}`;
      if (pin) {
        const pre = c.vh * START_RATIO;
        return {
          exitX: ex,
          markers,
          pieces: [
            { d: a, weight: pre },
            { d: b, weight: pin.end - pin.start },
            { d: cc, weight: Math.max(1, c.H - pre) },
          ],
        };
      }
      return { exitX: ex, markers, pieces: [{ d: a }, { d: b }, { d: cc }] };
    },
  },

  emergency: {
    entry: (c) => {
      const r = c.anchor("ring");
      return r ? r.x2 + 40 : undefined;
    },
    build: (c, entryX, exitX) => {
      const r = c.anchor("ring");
      const px = r ? r.x2 + 40 : entryX;
      const py = r ? r.cy : c.H / 2;
      const ex = exitX ?? c.L;
      const d = `M${f(entryX)},0 ${vCurve(entryX, 0, px, py)} ${vCurve(px, py, ex, c.H)}`;
      return { exitX: ex, pieces: [{ d }], markers: [{ x: px, y: py, el: null, action: "pulse" }] };
    },
  },

  rail: {
    entry: (c) => c.L,
    build: (c, entryX, exitX) => {
      const ex = exitX ?? c.L;
      const d = `M${f(entryX)},0 ${vCurve(entryX, 0, ex, c.H)}`;
      return { exitX: ex, pieces: [{ d }] };
    },
  },

  final: {
    end: (c) => () => {
      const btn = c.root.querySelector<HTMLElement>('[data-dot-anchor="button"]');
      const max = ScrollTrigger.maxScroll(window) - 2;
      if (!btn) return max;
      const r = btn.getBoundingClientRect();
      const y = r.top + window.scrollY + r.height / 2 - window.innerHeight * START_RATIO;
      return Math.min(y, max);
    },
    build: (c, entryX) => {
      const b = c.anchor("button");
      if (!b) return { exitX: entryX, pieces: [{ d: `M${entryX},0 L${entryX},${c.H / 2}` }] };
      const pad = 10;
      const x1 = b.x - pad;
      const y1 = b.y - pad;
      const x2 = b.x2 + pad;
      const y2 = b.y2 + pad;
      const a = `M${f(entryX)},0 ${vCurve(entryX, 0, x1, b.cy)}`;
      const outline = `M${f(x1)},${f(b.cy)} L${f(x1)},${f(y1)} L${f(x2)},${f(y1)} L${f(x2)},${f(y2)} L${f(x1)},${f(y2)} L${f(x1)},${f(b.cy)}`;
      return { exitX: entryX, pieces: [{ d: a }, { d: outline, halo: true, glow: true }] };
    },
  },
};

// ---------- runtime ----------
type PieceRT = Piece & { raw: RawPath; len: number; el: SVGPathElement };
type Sample = { cost: number; piece: number; t: number; x: number; y: number };
type Segment = {
  kind: string;
  root: HTMLElement;
  svg: SVGSVGElement;
  proxy: { p: number };
  tween: gsap.core.Tween | null;
  pieces: PieceRT[];
  samples: Sample[];
  total: number;
  markers: (Marker & { cost: number; on: boolean })[];
};

function rectOf(el: Element, origin: DOMRect): Rect {
  const r = el.getBoundingClientRect();
  const x = r.left - origin.left;
  const y = r.top - origin.top;
  return { x, y, w: r.width, h: r.height, cx: x + r.width / 2, cy: y + r.height / 2, x2: x + r.width, y2: y + r.height };
}

export function ScrollProgressDot() {
  const dotRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mm = gsap.matchMedia();
    const cleanups: (() => void)[] = [];

    // ============ DESKTOP ============
    mm.add("(min-width: 1024px)", () => {
      const roots = Array.from(document.querySelectorAll<HTMLElement>("[data-dot-section]"));
      const segments: Segment[] = roots
        .map((root) => {
          const svg = root.querySelector<SVGSVGElement>("[data-dot-svg]");
          if (!svg) return null;
          return {
            kind: root.dataset.dotSection || "rail",
            root,
            svg,
            proxy: { p: 0 },
            tween: null,
            pieces: [],
            samples: [],
            total: 1,
            markers: [],
          } as Segment;
        })
        .filter(Boolean) as Segment[];

      // ScrollTriggers (um por seção), calculados depois dos pins
      segments.forEach((seg) => {
        const b = builders[seg.kind] || builders.rail;
        const fakeCtx = { root: seg.root } as Ctx;
        seg.tween = gsap.to(seg.proxy, {
          p: 1,
          ease: "none",
          scrollTrigger: {
            trigger: seg.root,
            start: (b.start?.(fakeCtx) as string | number) ?? `top ${START_RATIO * 100}%`,
            end: (b.end?.(fakeCtx) as string | number) ?? `bottom ${START_RATIO * 100}%`,
            scrub: reduced ? false : SCRUB,
            refreshPriority: -10,
            invalidateOnRefresh: true,
          },
        });
      });

      const build = () => {
        const vh = window.innerHeight;
        const ctxs: Ctx[] = segments.map((seg) => {
          const box = seg.svg.parentElement as HTMLElement;
          const W = box.clientWidth;
          const H = box.clientHeight;
          seg.svg.setAttribute("width", String(W));
          seg.svg.setAttribute("height", String(H));
          seg.svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
          const origin = seg.svg.getBoundingClientRect();
          const gutter = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--gutter")) || 48;
          const L = Math.max(16, Math.min(gutter * 0.5, 40));
          return {
            root: seg.root,
            svg: seg.svg,
            W,
            H,
            vh,
            L,
            anchor: (name: string) => {
              const el = seg.root.querySelector(`[data-dot-anchor="${name}"]`);
              return el ? rectOf(el, origin) : null;
            },
            anchors: (prefix: string) =>
              Array.from(seg.root.querySelectorAll<HTMLElement>(`[data-dot-anchor^="${prefix}"]`))
                .filter((el) => /\d+$/.test(el.dataset.dotAnchor || ""))
                .sort((a, b) => parseInt(a.dataset.dotAnchor!.replace(/\D/g, "")) - parseInt(b.dataset.dotAnchor!.replace(/\D/g, "")))
                .filter((el) => el.getClientRects().length > 0)
                .map((el) => ({ el, rect: rectOf(el, origin) })),
          };
        });

        // eixos de entrada/saída: a saída de uma seção é a entrada preferida da próxima
        const entries = segments.map((seg, i) => (builders[seg.kind] || builders.rail).entry?.(ctxs[i]));
        let prevExit: number | undefined;
        segments.forEach((seg, i) => {
          const b = builders[seg.kind] || builders.rail;
          const c = ctxs[i];
          const entryX = prevExit ?? entries[i] ?? c.L;
          const nextEntry = entries[i + 1];
          const built = b.build(c, entryX, nextEntry);
          prevExit = built.exitX;

          // desenha as peças no SVG da seção
          seg.svg.querySelectorAll("path").forEach((p) => p.remove());
          seg.pieces = built.pieces.map((piece) => {
            const el = document.createElementNS("http://www.w3.org/2000/svg", "path");
            el.setAttribute("d", piece.d);
            el.setAttribute("class", `dot-trail${piece.glow ? " dot-trail--glow" : ""}`);
            seg.svg.appendChild(el);
            const raw = MotionPathPlugin.getRawPath(piece.d) as RawPath;
            MotionPathPlugin.cacheRawPathMeasurements(raw);
            const len = raw.totalLength || el.getTotalLength();
            el.style.strokeDasharray = `${len} ${len}`;
            el.style.strokeDashoffset = reduced ? "0" : String(len);
            return { ...piece, raw, len, el };
          });

          // amostragem + custo (mantém o ponto próximo da mesma altura da tela)
          const samples: Sample[] = [];
          let cost = 0;
          seg.pieces.forEach((pc, pi) => {
            const n = Math.max(24, Math.ceil(pc.len / 6));
            const pts: { x: number; y: number }[] = [];
            for (let k = 0; k <= n; k++) {
              const pt = MotionPathPlugin.getPositionOnPath(pc.raw, k / n) as { x: number; y: number };
              pts.push(pt);
            }
            const natural: number[] = [0];
            let nat = 0;
            for (let k = 1; k <= n; k++) {
              const dx = Math.abs(pts[k].x - pts[k - 1].x);
              const dy = Math.abs(pts[k].y - pts[k - 1].y);
              nat += Math.max(dy, dx * 0.45, 0.0001);
              natural.push(nat);
            }
            const scale = pc.weight !== undefined ? pc.weight / nat : 1;
            for (let k = 0; k <= n; k++) {
              if (pi > 0 && k === 0) continue;
              samples.push({ cost: cost + natural[k] * scale, piece: pi, t: k / n, x: pts[k].x, y: pts[k].y });
            }
            cost += nat * scale;
          });
          seg.samples = samples;
          seg.total = Math.max(cost, 1);

          seg.markers = (built.markers || []).map((m) => {
            let best = samples[0];
            let bestD = Infinity;
            for (const s of samples) {
              const dd = (s.x - m.x) ** 2 + (s.y - m.y) ** 2;
              if (dd < bestD) {
                bestD = dd;
                best = s;
              }
            }
            return { ...m, cost: best.cost, on: false };
          });
          if (reduced) seg.markers.forEach((m) => m.el?.classList.add("is-dot-lit"));
        });
      };

      // posição no frame
      let born = reduced;
      const onBorn = () => {
        born = true;
        dot.classList.add("is-born");
      };
      window.addEventListener("orvelle:hero-ready", onBorn);
      if ((window as unknown as { __orvelleHeroReady?: boolean }).__orvelleHeroReady) onBorn();

      let activeHalo = false;
      let complete = false;
      const update = () => {
        if (!segments.length || !segments[0].samples.length) return;
        // segmento ativo: o último com progresso > 0
        let idx = 0;
        for (let i = 0; i < segments.length; i++) if (segments[i].proxy.p > 0) idx = i;
        const seg = segments[idx];
        const target = seg.proxy.p * seg.total;

        // busca binária no custo acumulado
        const s = seg.samples;
        let lo = 0;
        let hi = s.length - 1;
        while (lo < hi - 1) {
          const mid = (lo + hi) >> 1;
          if (s[mid].cost <= target) lo = mid;
          else hi = mid;
        }
        const a = s[lo];
        const b = s[hi];
        const span = b.cost - a.cost || 1;
        const k = Math.min(1, Math.max(0, (target - a.cost) / span));
        const pieceIdx = k < 0.5 || a.piece === b.piece ? a.piece : b.piece;
        const t = a.piece === b.piece ? a.t + (b.t - a.t) * k : k < 0.5 ? a.t : b.t;
        const piece = seg.pieces[pieceIdx];
        const pt = MotionPathPlugin.getPositionOnPath(piece.raw, t) as { x: number; y: number };

        // linhas desenhadas: todas as anteriores completas
        segments.forEach((sg, si) => {
          sg.pieces.forEach((pc, pi) => {
            let off: number;
            if (si < idx || (si === idx && pi < pieceIdx)) off = 0;
            else if (si === idx && pi === pieceIdx) off = pc.len * (1 - t);
            else off = pc.len;
            pc.el.style.strokeDashoffset = String(off);
          });
        });

        // marcadores (acendem/apagam também ao rolar para cima)
        segments.forEach((sg, si) => {
          const curCost = si < idx ? Infinity : si === idx ? target : -1;
          sg.markers.forEach((m) => {
            const on = curCost >= m.cost - 2;
            if (on !== m.on) {
              m.on = on;
              if (m.action === "pulse") {
                if (on) {
                  dot.classList.remove("is-pulsing");
                  void dot.offsetWidth;
                  dot.classList.add("is-pulsing");
                }
              } else m.el?.classList.toggle("is-dot-lit", on);
            }
          });
        });

        const halo = !!piece.halo && t > 0.01 && t < 0.99;
        if (halo !== activeHalo) {
          activeHalo = halo;
          dot.classList.toggle("has-halo", halo);
        }
        const isComplete = seg.kind === "final" && seg.proxy.p > 0.995;
        if (isComplete !== complete) {
          complete = isComplete;
          dot.classList.toggle("is-arrived", complete);
          seg.root.classList.toggle("is-dot-complete", complete);
        }

        const box = seg.svg.getBoundingClientRect();
        const x = box.left + pt.x;
        const y = box.top + pt.y;
        gsap.set(dot, { x, y, opacity: born ? 1 : 0 });
      };

      const onRefresh = () => {
        build();
        update();
      };
      ScrollTrigger.addEventListener("refresh", onRefresh);
      build();
      if (!reduced) gsap.ticker.add(update);
      else {
        // estático: o ponto permanece no indicador de progresso da hero
        dot.style.display = "none";
      }
      ScrollTrigger.refresh();

      return () => {
        ScrollTrigger.removeEventListener("refresh", onRefresh);
        gsap.ticker.remove(update);
        window.removeEventListener("orvelle:hero-ready", onBorn);
        segments.forEach((seg) => {
          seg.tween?.scrollTrigger?.kill();
          seg.tween?.kill();
          seg.svg.querySelectorAll("path").forEach((p) => p.remove());
          seg.markers.forEach((m) => m.el?.classList.remove("is-dot-lit"));
          seg.root.classList.remove("is-dot-complete");
        });
        dot.style.display = "";
        dot.className = "narrative-dot";
      };
    });

    // ============ MOBILE / TABLET ============
    mm.add("(max-width: 1023.98px)", () => {
      const svg = mobileRef.current;
      if (!svg) return;
      const roots = Array.from(document.querySelectorAll<HTMLElement>("[data-dot-section]"));
      const line = svg.querySelector<SVGLineElement>("[data-line]")!;
      const ticks = svg.querySelector<SVGGElement>("[data-ticks]")!;
      svg.style.display = "block";
      const top = 0.14;
      const bottom = 0.86;
      let stops: number[] = [];

      const build = () => {
        const max = ScrollTrigger.maxScroll(window) || 1;
        stops = roots.map((r) => {
          const y = r.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.5;
          return Math.min(1, Math.max(0, y / max));
        });
        ticks.innerHTML = "";
        roots.forEach((_, i) => {
          const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
          const yy = top + ((bottom - top) * i) / Math.max(1, roots.length - 1);
          c.setAttribute("cx", "12");
          c.setAttribute("cy", `${yy * 100}%`);
          c.setAttribute("r", "1.6");
          ticks.appendChild(c);
        });
      };

      const state = { p: 0 };
      const st = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          gsap.to(state, { p: self.progress, duration: reduced ? 0 : SCRUB, ease: "power2.out", overwrite: true });
        },
      });

      let born = reduced;
      const onBorn = () => (born = true);
      window.addEventListener("orvelle:hero-ready", onBorn);
      if ((window as unknown as { __orvelleHeroReady?: boolean }).__orvelleHeroReady) born = true;

      const update = () => {
        // mapeia o progresso para paradas: o ponto descansa no marcador de cada seção
        const p = state.p;
        let i = 0;
        for (let k = 0; k < stops.length; k++) if (p >= stops[k]) i = k;
        const a = stops[i] ?? 0;
        const b = stops[i + 1] ?? 1;
        const local = b > a ? (p - a) / (b - a) : 1;
        const eased = local < 0.4 ? 0 : gsap.parseEase("power2.inOut")((local - 0.4) / 0.6);
        const n = Math.max(1, roots.length - 1);
        const pos = Math.min(1, (i + (i < n ? eased : 0)) / n);
        const yy = (top + (bottom - top) * pos) * window.innerHeight;
        line.setAttribute("y2", `${(yy / window.innerHeight) * 100}%`);
        gsap.set(dot, { x: 12, y: yy, opacity: born ? 1 : 0 });
      };

      ScrollTrigger.addEventListener("refresh", build);
      build();
      if (reduced) {
        line.setAttribute("y2", `${bottom * 100}%`);
        dot.style.display = "none";
      } else gsap.ticker.add(update);

      return () => {
        st.kill();
        ScrollTrigger.removeEventListener("refresh", build);
        gsap.ticker.remove(update);
        window.removeEventListener("orvelle:hero-ready", onBorn);
        svg.style.display = "none";
        dot.style.display = "";
      };
    });

    cleanups.push(() => mm.revert());
    return () => cleanups.forEach((c) => c());
  }, []);

  return (
    <>
      <svg
        ref={mobileRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[34] hidden h-[100svh] w-6"
        style={{ display: "none" }}
      >
        <line x1="12" x2="12" y1="14%" y2="86%" stroke="var(--color-accent)" strokeOpacity="0.18" strokeWidth="1" />
        <line data-line="" x1="12" x2="12" y1="14%" y2="14%" stroke="var(--color-accent)" strokeOpacity="0.7" strokeWidth="1" />
        <g data-ticks="" fill="var(--color-accent)" opacity="0.6" />
      </svg>
      <div ref={dotRef} className="narrative-dot" aria-hidden="true" style={{ opacity: 0 }}>
        <span className="narrative-dot__core" />
      </div>
    </>
  );
}

/** SVG de trajetória do ponto dentro de cada seção. */
export function DotTrack({ className = "" }: { className?: string }) {
  return (
    <svg
      data-dot-svg=""
      aria-hidden="true"
      focusable="false"
      className={`pointer-events-none absolute left-0 top-0 hidden h-full w-full overflow-visible lg:block ${className}`}
    />
  );
}
