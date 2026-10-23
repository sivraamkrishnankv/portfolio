"use client";

import { useEffect, useRef, useState } from "react";

// The signature: SCOUT's approval gate, playable. Jobs roll along the pipeline,
// the ones that don't fit drop out, and every other one waits until you press Approve.
// The track is SVG (visible without JS); the marbles are a canvas on top.
// Wide screens get a left-to-right run; phones get a zigzag that reads top to bottom.

type Pt = [number, number];
type Layout = { w: number; h: number; main: Pt[]; skip: Pt[]; gateSegs: number };

const WIDE: Layout = {
  w: 1000, h: 230, gateSegs: 3,
  main: [[20, 70], [250, 96], [264, 128], [600, 152], [618, 186], [980, 200]],
  skip: [[20, 70], [250, 96], [236, 112], [236, 186]],
};
const TALL: Layout = {
  w: 400, h: 430, gateSegs: 5,
  main: [[30, 50], [290, 90], [276, 124], [70, 180], [58, 214], [300, 282], [312, 316], [60, 390]],
  skip: [[30, 50], [290, 90], [330, 104], [330, 140]],
};
const CHIP = { w: 112, h: 32 }; // a job card riding the track, in viewBox units
const ROLES = ["AI Engineer", "Backend SDE", "ML Engineer", "Platform SDE", "Applied AI", "Data Engineer"];

type Path = { seg: { a: Pt; b: Pt; l: number; s: number }[]; L: number };
const build = (pts: Pt[]): Path => {
  const seg: Path["seg"] = [];
  let L = 0;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i], l = Math.hypot(b[0] - a[0], b[1] - a[1]);
    seg.push({ a, b, l, s: L });
    L += l;
  }
  return { seg, L };
};
const at = (p: Path, s: number): Pt => {
  for (const g of p.seg) if (s <= g.s + g.l) {
    const t = (s - g.s) / g.l;
    return [g.a[0] + (g.b[0] - g.a[0]) * t, g.a[1] + (g.b[1] - g.a[1]) * t];
  }
  return p.seg[p.seg.length - 1].b;
};
const pts = (p: Pt[]) => p.map((q) => q.join(" ")).join(" ");

type Marble = { s: number; v: number; skip: boolean; role: string; doneAt?: number };

function Track({ l, className, sent }: { l: Layout; className: string; sent: number }) {
  const wide = l === WIDE;
  const [gx, gy] = l.main[l.gateSegs];
  return (
    <svg className={className} viewBox={`0 0 ${l.w} ${l.h}`} aria-hidden="true">
      <polyline className="gate-track" points={pts(l.main)} />
      <polyline className="gate-track" points={pts(l.skip.slice(1))} />
      <path className="gate-tray" d={wide ? "M206 210 H266 M206 210 V196 M266 210 V196" : "M300 150 H360 M300 150 V136 M360 150 V136"} />
      <rect className="gate-bar" x={gx - 1} y={gy - 34} width={10} height={34} rx={2} />
      {wide && <line className="gate-stem" x1={gx + 4} y1={106} x2={gx + 4} y2={gy - 34} />}
      {wide ? (
        <>
          <text className="gate-lab" x={20} y={104}>Job alert in</text>
          <text className="gate-lab" x={262} y={86}>Fits?</text>
          <text className="gate-lab" x={236} y={228} textAnchor="middle">Not a fit</text>
          <text className="gate-lab" x={420} y={178} textAnchor="middle">Resume, fact-checked</text>
          <text className="gate-lab" x={980} y={228} textAnchor="end">Sent and logged{sent > 0 ? ` (${sent})` : ""}</text>
        </>
      ) : (
        <>
          <text className="gate-lab" x={30} y={86}>Job alert in</text>
          <text className="gate-lab" x={292} y={72} textAnchor="end">Fits?</text>
          <text className="gate-lab" x={330} y={174} textAnchor="middle">Not a fit</text>
          <text className="gate-lab" x={138} y={206} textAnchor="middle">Resume, fact-checked</text>
          <text className="gate-lab" x={60} y={420}>Sent and logged{sent > 0 ? ` (${sent})` : ""}</text>
        </>
      )}
    </svg>
  );
}

export function Gate() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const opened = useRef(0);
  const onApprove = useRef<() => boolean>(() => false);
  const [approved, setApproved] = useState(0);
  const [waiting, setWaiting] = useState(false);

  useEffect(() => {
    const cv = canvas.current!, box = wrap.current!, ctx = cv.getContext("2d")!;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const narrow = matchMedia("(max-width: 760px)");
    const css = getComputedStyle(box);
    const ink = css.getPropertyValue("--ink").trim() || "#f4efe6";
    const accent = css.getPropertyValue("--accent").trim() || "#f0b44c";
    const accentInk = css.getPropertyValue("--accent-ink").trim() || "#21170e";
    const ground = css.getPropertyValue("--ground-2").trim() || "#231b14";
    let L = WIDE, M = build(L.main), S = build(L.skip), GATE = 0;
    let marbles: Marble[] = [], n = 0, lastSpawn = -1e9, prev = performance.now(), raf = 0, visible = false;
    const cw = () => (L === TALL ? 96 : CHIP.w); // chip width for the current layout
    const atGate = (m: Marble) => !m.skip && Math.abs(m.s - GATE) < 1;

    const still = () => {
      // One calm frame: a job on the way in, one waiting at the gate, one dropped.
      marbles = [{ s: M.seg[0].l * 0.45, v: 0, skip: false, role: ROLES[0] }, { s: GATE, v: 0, skip: false, role: ROLES[1] }, { s: S.L, v: 0, skip: true, role: ROLES[2] }];
    };
    const setLayout = () => {
      L = narrow.matches ? TALL : WIDE;
      M = build(L.main); S = build(L.skip);
      GATE = M.seg.slice(0, L.gateSegs).reduce((t, g) => t + g.l, 0) - cw() / 2 - 8;
      marbles = []; n = 0;
      if (reduce) still();
    };
    const resize = () => {
      const r = cv.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2);
      cv.width = r.width * d; cv.height = r.height * d;
      ctx.setTransform((d * r.width) / L.w, 0, 0, (d * r.height) / L.h, 0, 0);
    };
    const draw = () => {
      ctx.clearRect(0, 0, L.w, L.h);
      const w = cw(), h = L === TALL ? 28 : CHIP.h;
      ctx.font = `700 ${L === TALL ? 13 : 14}px ${css.fontFamily}`;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      for (const m of marbles) {
        const [x, y] = at(m.skip ? S : M, m.s);
        const waitingHere = atGate(m);
        ctx.beginPath(); ctx.roundRect(x - w / 2, y - h - 4, w, h, 6);
        ctx.fillStyle = waitingHere ? accent : ground; ctx.fill();
        ctx.lineWidth = 1.5; ctx.strokeStyle = waitingHere ? accent : ink; ctx.stroke();
        ctx.fillStyle = waitingHere ? accentInk : ink; ctx.fillText(m.role, x, y - h / 2 - 4);
      }
    };
    const step = (now: number) => {
      const dt = Math.min(48, now - prev); prev = now;
      if (now - lastSpawn > 2200 && marbles.length < 7 && !marbles.some((m) => m.s < cw() * 1.2)) {
        marbles.push({ s: cw() / 2 + 2, v: 0, skip: n % 3 === 1, role: ROLES[n % ROLES.length] }); n++; lastSpawn = now;
      }
      marbles.sort((a, b) => b.s - a.s);
      const shared = M.seg[0].l; // both paths share the first stretch
      for (let i = 0; i < marbles.length; i++) {
        const m = marbles[i], p = m.skip ? S : M;
        let limit = p.L;
        for (let j = i - 1; j >= 0; j--) {
          const o = marbles[j];
          if (o.skip === m.skip || (o.s < shared && m.s < shared)) { limit = Math.min(limit, o.s - cw() - 10); break; }
        }
        if (!m.skip && m.s <= GATE + 0.5) {
          if (opened.current > 0 && atGate(m)) { opened.current--; m.s = GATE + 1; }
          else limit = Math.min(limit, GATE);
        }
        m.v = Math.min(m.v + dt * 0.0008, 0.15);
        const next = Math.min(m.s + m.v * dt, Math.max(m.s, limit));
        if (next >= limit - 0.01) m.v *= 0.3;
        m.s = next;
        if (m.s >= p.L - 0.5) m.doneAt ??= now;
      }
      marbles = marbles.filter((m) => !m.doneAt || now - m.doneAt < (m.skip ? 2400 : 300));
      setWaiting(marbles.some(atGate));
      draw();
      if (visible && !document.hidden) raf = requestAnimationFrame(step);
    };
    const start = () => { cancelAnimationFrame(raf); prev = performance.now(); raf = requestAnimationFrame(step); };

    setLayout(); resize();
    if (reduce) { draw(); queueMicrotask(() => setWaiting(true)); } // the still frame starts with one job at the gate
    const ro = new ResizeObserver(() => { resize(); draw(); });
    ro.observe(cv);
    const onNarrow = () => { setLayout(); resize(); draw(); if (!reduce && visible) start(); };
    narrow.addEventListener("change", onNarrow);

    onApprove.current = () => {
      const m = marbles.find(atGate);
      if (!m) return false;
      if (reduce) { m.s = M.L; setWaiting(false); draw(); } else opened.current = 1;
      return true;
    };
    if (reduce) return () => { ro.disconnect(); narrow.removeEventListener("change", onNarrow); };

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); });
    io.observe(box);
    const onVis = () => { if (!document.hidden && visible) start(); };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      narrow.removeEventListener("change", onNarrow);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const approve = () => { if (onApprove.current()) setApproved((a) => a + 1); };

  return (
    <figure className="gate">
      <div className="gate-stage" ref={wrap}>
        <Track l={WIDE} className="gate-wide" sent={approved} />
        <Track l={TALL} className="gate-tall" sent={approved} />
        <canvas ref={canvas} aria-hidden="true" />
        <button type="button" className="gate-btn" onClick={approve} aria-describedby="gate-cap">
          Approve
        </button>
      </div>
      <figcaption id="gate-cap">
        <span>Try it. Every job that fits waits at the gate until you press Approve. That is how SCOUT runs on my machine.</span>
        <span className="gate-count" aria-live="polite">
          {approved === 0 ? (waiting ? "One is waiting for you." : "Nothing waiting yet.") : `You approved ${approved}.`}
        </span>
      </figcaption>
    </figure>
  );
}
