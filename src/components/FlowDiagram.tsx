"use client";

import { useEffect, useRef } from "react";
import type { Flow, NodeKind } from "@/content";

// A system drawn as what it really is: named parts on a grid, connectors labelled with what
// passes along them, and one item travelling the real route with a caption at every stop.
// Nodes are server-rendered HTML (readable without JavaScript, reflow on a phone); the
// connectors are SVG measured from the node boxes; the travelling chip is the only motion.

const KIND: Record<NodeKind, string> = { source: "Source", code: "Code", model: "Model", you: "Me", fail: "What broke" };
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const frame = () => new Promise(requestAnimationFrame);

type Edge = { from: string; to: string; back: boolean; base: SVGPathElement; lit: SVGPathElement; head: SVGPathElement; lab: HTMLSpanElement; len: number };

export function FlowDiagram({ flow }: { flow: Flow }) {
  const root = useRef<HTMLDivElement>(null);
  const kinds = { ...KIND, ...flow.kinds };
  const used = (["code", "model", "you", "fail"] as NodeKind[]).filter((k) => flow.nodes.some((n) => n.kind === k));

  useEffect(() => {
    const el = root.current!;
    const stage = el.querySelector<HTMLDivElement>(".flow-stage")!;
    const svg = el.querySelector<SVGSVGElement>(".flow-svg")!;
    const labels = el.querySelector<HTMLDivElement>(".flow-labels")!;
    const chip = el.querySelector<HTMLSpanElement>(".flow-chip")!;
    const stepEl = el.querySelector<HTMLSpanElement>(".flow-step")!;
    const textEl = el.querySelector<HTMLSpanElement>(".flow-text")!;
    const pauseBtn = el.querySelector<HTMLButtonElement>(".flow-pause")!;
    const approveBtn = el.querySelector<HTMLButtonElement>(".node-approve");
    const nodeEl: Record<string, HTMLElement> = Object.fromEntries([...el.querySelectorAll<HTMLElement>(".node")].map((n) => [n.dataset.id!, n]));
    const NS = "http://www.w3.org/2000/svg";
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

    svg.replaceChildren(); labels.replaceChildren();
    const edges: Edge[] = flow.edges.map(([from, to, label, style]) => {
      const back = style === "back";
      const mk = (cls: string) => { const p = document.createElementNS(NS, "path"); p.setAttribute("class", cls); svg.append(p); return p; };
      const base = mk(back ? "edge edge-back" : "edge"), lit = mk("edge-lit"), head = mk(back ? "edge-head edge-back" : "edge-head");
      const lab = document.createElement("span");
      lab.className = back ? "edge-label edge-label-back" : nodeKind(to) === "fail" ? "edge-label edge-label-fail" : "edge-label";
      lab.textContent = label;
      labels.append(lab);
      return { from, to, back, base, lit, head, lab, len: 0 };
    });
    function nodeKind(id: string) { return flow.nodes.find((n) => n.id === id)?.kind; }

    const box = (n: HTMLElement) => {
      const s = stage.getBoundingClientRect(), r = n.getBoundingClientRect();
      return { x: r.left - s.left, y: r.top - s.top, w: r.width, h: r.height, cx: r.left - s.left + r.width / 2, cy: r.top - s.top + r.height / 2 };
    };

    function layout() {
      const s = stage.getBoundingClientRect();
      svg.setAttribute("viewBox", `0 0 ${s.width} ${s.height}`);
      for (const e of edges) {
        const a = box(nodeEl[e.from]), b = box(nodeEl[e.to]);
        const sameRow = Math.abs(a.cy - b.cy) < Math.min(a.h, b.h) / 2;
        const sameCol = Math.abs(a.cx - b.cx) < Math.min(a.w, b.w) / 2;
        // a straight line would cross another box: route around it instead
        const blocked = Object.entries(nodeEl).some(([id, n]) => {
          if (id === e.from || id === e.to) return false;
          const c = box(n);
          return sameRow ? Math.abs(c.cy - a.cy) < c.h / 2 && c.cx > Math.min(a.cx, b.cx) && c.cx < Math.max(a.cx, b.cx)
            : sameCol ? Math.abs(c.cx - a.cx) < c.w / 2 && c.cy > Math.min(a.cy, b.cy) && c.cy < Math.max(a.cy, b.cy) : false;
        });
        let d: string, end: [number, number], dir: [number, number];
        if ((e.back || blocked) && sameRow) {
          // over the top of the boxes in between (or of both, for a loop back)
          const x1 = e.back ? a.cx - a.w * 0.2 : a.cx + a.w * 0.2, x2 = e.back ? b.cx + b.w * 0.2 : b.cx - b.w * 0.2;
          const y = Math.min(a.y, b.y), lift = e.back ? 44 : 40;
          d = `M${x1} ${y} C${x1} ${y - lift} ${x2} ${y - lift} ${x2} ${y - 6}`; end = [x2, y - 6]; dir = [0, 1];
        } else if ((e.back || blocked) && sameCol) {
          // out to the right of the column and back in
          const y1 = a.cy + (e.back ? 0 : a.h * 0.15), y2 = b.cy + (e.back ? b.h * 0.15 : -b.h * 0.15), x = Math.max(a.x + a.w, b.x + b.w), out = 34;
          d = `M${x} ${y1} C${x + out} ${y1} ${x + out} ${y2} ${x + 6} ${y2}`; end = [x + 6, y2]; dir = [-1, 0];
        } else if (sameRow) {
          const right = b.cx > a.cx, x1 = right ? a.x + a.w : a.x, x2 = right ? b.x - 6 : b.x + b.w + 6;
          d = `M${x1} ${a.cy} L${x2} ${b.cy}`; end = [x2, b.cy]; dir = [right ? 1 : -1, 0];
        } else if (sameCol) {
          const down = b.cy > a.cy, y1 = down ? a.y + a.h : a.y, y2 = down ? b.y - 6 : b.y + b.h + 6;
          d = `M${a.cx} ${y1} L${b.cx} ${y2}`; end = [b.cx, y2]; dir = [0, down ? 1 : -1];
        } else {
          const down = b.cy > a.cy, y1 = down ? a.y + a.h : a.y, y2 = down ? b.y - 6 : b.y + b.h + 6, my = (y1 + y2) / 2;
          d = `M${a.cx} ${y1} C${a.cx} ${my} ${b.cx} ${my} ${b.cx} ${y2}`; end = [b.cx, y2]; dir = [0, down ? 1 : -1];
        }
        e.base.setAttribute("d", d); e.lit.setAttribute("d", d);
        e.len = e.base.getTotalLength();
        e.lit.style.strokeDasharray = `${e.len} ${e.len}`;
        if (!e.lit.style.strokeDashoffset) e.lit.style.strokeDashoffset = String(e.len);
        const [x, y] = end, [dx, dy] = dir, k = 7;
        e.head.setAttribute("d", `M${x - dx * k - dy * k * 0.7} ${y - dy * k - dx * k * 0.7} L${x} ${y} L${x - dx * k + dy * k * 0.7} ${y - dy * k + dx * k * 0.7}`);
        const mid = e.base.getPointAtLength(e.len / 2);
        e.lab.style.transform = `translate(${mid.x}px, ${mid.y}px) translate(-50%, -50%)`;
      }
    }

    layout();
    const ro = new ResizeObserver(layout); ro.observe(stage);
    document.fonts?.ready.then(layout);
    el.classList.add("flow-live");

    if (reduce) {
      for (const e of edges) e.lit.style.strokeDashoffset = "0";
      return () => ro.disconnect();
    }

    // speed > 1 while the visitor has asked to skip ahead to the approval card
    let alive = true, paused = false, visible = false, started = false, speed = 1;
    let approveNow: ((byYou: boolean) => void) | null = null;
    let runHasGate = false;
    const onPause = () => { paused = !paused; pauseBtn.textContent = paused ? "Play" : "Pause"; pauseBtn.setAttribute("aria-pressed", String(paused)); };
    pauseBtn.addEventListener("click", onPause);
    const hold = async () => { while (alive && (paused || !visible || document.hidden)) await sleep(120); };

    // the chip rides the line, then settles on the top edge of the node it reached
    let cx = 0, cy = 0;
    const place = (x: number, y: number) => { cx = x; cy = y; chip.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`; };
    const park = (id: string) => { const b = box(nodeEl[id]); place(b.cx, b.y); };
    const travel = async (e: Edge, ms: number) => {
      const t0 = performance.now();
      for (;;) {
        await frame(); if (!alive) return;
        if (paused || !visible) await hold();
        const t = Math.min(1, (performance.now() - t0) / (ms / speed)), k = ease(t);
        const p = e.base.getPointAtLength(k * e.len);
        place(p.x, p.y);
        e.lit.style.strokeDashoffset = String(e.len * (1 - k));
        if (t >= 1) break;
      }
      e.base.classList.add("done"); e.head.classList.add("done");
    };
    const hop = async (id: string) => {
      const b = box(nodeEl[id]), x0 = cx, y0 = cy, t0 = performance.now();
      for (;;) {
        await frame(); if (!alive) return;
        const t = Math.min(1, (performance.now() - t0) / (280 / speed)), k = ease(t);
        place(x0 + (b.cx - x0) * k, y0 + (b.y - y0) * k);
        if (t >= 1) break;
      }
    };
    // Approve works at any time: at the gate it approves; before the job gets there it
    // fast-forwards the job to the gate, so nobody has to wait for the interactive moment.
    const onApprove = () => {
      if (approveNow) return approveNow(true);
      if (runHasGate) { speed = 5; textEl.textContent = "Skipping ahead to the approval card..."; }
      else textEl.textContent = "Nothing is waiting for you: this job was not a fit.";
    };
    if (approveBtn) { approveBtn.disabled = false; approveBtn.addEventListener("click", onApprove); }
    const waitApprove = () =>
      new Promise<boolean>((resolve) => {
        if (!approveBtn) return resolve(false);
        speed = 1;
        const gateNode = approveBtn.closest(".node")!;
        gateNode.classList.add("waiting");
        let left = 8;
        const tick = setInterval(() => { if (!paused && visible && --left <= 0) finish(false); }, 1000);
        function finish(byYou: boolean) {
          clearInterval(tick);
          approveNow = null;
          gateNode.classList.remove("waiting");
          resolve(byYou);
        }
        approveNow = finish;
      });
    const reset = () => {
      for (const e of edges) { e.lit.style.strokeDashoffset = String(e.len); e.base.classList.remove("done"); e.head.classList.remove("done"); }
      for (const n of Object.values(nodeEl)) n.classList.remove("on", "seen");
    };

    async function play() {
      for (let r = 0; alive; r = (r + 1) % flow.runs.length) {
        const run = flow.runs[r];
        reset();
        chip.textContent = run.item;
        runHasGate = run.steps.some(([id]) => nodeEl[id].querySelector(".node-approve"));
        let prev: string | null = null;
        for (let i = 0; i < run.steps.length && alive; i++) {
          const [id, text] = run.steps[i];
          await hold();
          if (prev) {
            nodeEl[prev].classList.remove("on");
            const e = edges.find((x) => x.from === prev && x.to === id);
            if (e) { await travel(e, 850); await hop(id); } else park(id);
          } else { park(id); chip.classList.add("on"); }
          nodeEl[id].classList.add("on", "seen");
          stepEl.textContent = `${run.item} · step ${i + 1} of ${run.steps.length}`;
          textEl.textContent = text;
          if (nodeEl[id].querySelector(".node-approve")) {
            const byYou = await waitApprove();
            textEl.textContent = byYou ? "Approved by you." : "Approved for you, so the demo keeps moving.";
            await sleep(900);
          } else await sleep((700 + text.length * 38) / speed);
          prev = id;
        }
        await sleep(1200);
        if (prev) nodeEl[prev].classList.remove("on");
        chip.classList.remove("on");
        await sleep(500);
      }
    }

    const io = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
      if (visible && !started) { started = true; play(); }
    }, { threshold: 0.3 });
    io.observe(el);
    return () => { alive = false; ro.disconnect(); io.disconnect(); pauseBtn.removeEventListener("click", onPause); approveBtn?.removeEventListener("click", onApprove); };
  }, [flow]);

  return (
    <div className="flow" ref={root} style={{ "--cols": flow.cols } as React.CSSProperties}>
      <div className="flow-legend" aria-hidden="true">
        {used.map((k) => <span key={k} className={`k k-${k}`}>{kinds[k]}</span>)}
      </div>
      <div className="flow-stage">
        <svg className="flow-svg" aria-hidden="true" />
        <ol className="flow-grid" aria-label={flow.label}>
          {flow.nodes.map((n) => (
            <li key={n.id} data-id={n.id} className={`node node-${n.kind}${n.small ? " node-small" : ""}`}
              style={{ "--c": n.d[0], "--r": n.d[1], "--mc": n.m[0], "--mr": n.m[1] } as React.CSSProperties}>
              <span className="node-kind">{kinds[n.kind]}</span>
              <b className="node-title">{n.title}</b>
              <span className="node-body">{n.body}</span>
              {n.gate && <button type="button" className="node-approve" disabled>Approve</button>}
            </li>
          ))}
        </ol>
        <div className="flow-labels" aria-hidden="true" />
        <span className="flow-chip" aria-hidden="true" />
      </div>
      <div className="flow-foot">
        <p className="flow-cap" aria-live="polite">
          <span className="flow-step" />
          <span className="flow-text">{flow.still}</span>
        </p>
        <button type="button" className="flow-pause" aria-pressed="false">Pause</button>
      </div>
    </div>
  );
}
