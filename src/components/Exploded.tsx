import type { Glyph, Layer } from "@/content";

// A service-manual exploded view drawn in code. "stack": one isometric plate per layer,
// pulled apart vertically. "chain": the same plates in a row, for a system that is a
// relay of separate services. Labels live in the HTML list beside it, so they stay
// readable on a phone.

// Line marks drawn on each plate (centred on 0,0, squashed onto the plate by the transform).
const GLYPHS: Partial<Record<Glyph, string>> = {
  mail: "M-34 -16 h68 v32 h-68 z M-34 -16 l34 19 l34 -19",
  doc: "M-22 -20 h30 l14 14 v32 h-44 z M-12 -8 h16 M-12 2 h12 M0 14 l6 6 l14 -16",
  log: "M-30 -14 h60 M-30 -2 h60 M-30 10 h36",
  chat: "M-30 -18 h60 v28 h-36 l-14 12 v-12 h-10 z",
  shield: "M0 -22 l24 8 v10 c0 14 -10 22 -24 28 c-14 -6 -24 -14 -24 -28 v-10 z M-9 0 l6 6 l12 -12",
  mic: "M-8 -22 h16 v26 a8 8 0 0 1 -16 0 z M-18 0 a18 18 0 0 0 36 0 M0 18 v8",
  tools: "M-26 -18 h20 v20 h-20 z M6 -18 h20 v20 h-20 z M-26 8 h20 v14 h-20 z M6 8 h20 v14 h-20 z",
  screen: "M-34 -20 h68 v36 h-68 z M-12 24 h24 M-24 4 l12 -10 l10 6 l16 -14",
  code: "M-12 -14 l-16 14 l16 14 M12 -14 l16 14 l-16 14 M5 -20 l-10 40",
  send: "M-30 0 l60 -22 l-18 44 l-12 -16 z M-0 6 l30 -28",
};

// Marks that say what this particular part does, not just what kind of thing it is.
function Mark({ glyph }: { glyph: Glyph }) {
  switch (glyph) {
    case "filter": // three jobs in, one out
      return (
        <>
          <path className="plate-glyph" d="M-40 -18 h80 l-28 22 v16 l-24 0 v-16 z" />
          <circle className="mark-dot" cx="-24" cy="-30" r="5" /><circle className="mark-dot" cx="0" cy="-30" r="5" /><circle className="mark-dot" cx="24" cy="-30" r="5" />
          <circle className="mark-dot" cx="0" cy="34" r="5" />
        </>
      );
    case "check": // the approval card, waiting for a person
      return (
        <>
          <rect className="mark-pill" x="-44" y="-16" width="88" height="32" rx="16" />
          <text className="mark-pill-text" x="0" y="6" textAnchor="middle">Approve</text>
        </>
      );
    case "clock": // the one time that matters
      return <text className="mark-time" x="0" y="12" textAnchor="middle">17:30</text>;
    case "play": // a workflow run: three steps, all green
      return <path className="plate-glyph" d="M-40 -10 h22 v20 h-22 z M-11 -10 h22 v20 h-22 z M18 -10 h22 v20 h-22 z M-34 0 l4 4 l8 -8 M-5 0 l4 4 l8 -8 M24 0 l4 4 l8 -8" />;
    case "poll": // Yes / No
      return (
        <>
          <rect className="mark-bar" x="-36" y="-16" width="56" height="10" rx="3" />
          <rect className="mark-bar-2" x="-36" y="4" width="28" height="10" rx="3" />
        </>
      );
    default:
      return <path className="plate-glyph" d={GLYPHS[glyph]} />;
  }
}

function Plate({ cx, cy, w, d, i, glyph, scale = 1, lit }: { cx: number; cy: number; w: number; d: number; i: number; glyph: Glyph; scale?: number; lit?: boolean }) {
  const x0 = cx - w / 2, x1 = cx + w / 2;
  return (
    <g className={lit ? "plate-g plate-lit" : "plate-g"} style={{ "--i": i } as React.CSSProperties}>
      <path className="plate-side" d={`M${x0} ${cy} L${cx} ${cy - d} L${x1} ${cy} L${x1} ${cy + 12} L${cx} ${cy + d + 12} L${x0} ${cy + 12} Z`} />
      <path className="plate-top" d={`M${x0} ${cy} L${cx} ${cy - d} L${x1} ${cy} L${cx} ${cy + d} Z`} />
      <g transform={`translate(${cx} ${cy}) scale(${scale} ${scale * 0.62})`}><Mark glyph={glyph} /></g>
      <circle className="plate-badge" cx={x0 + 6} cy={cy} r="14" />
      <text className="plate-num" x={x0 + 6} y={cy + 5.5} textAnchor="middle">{i + 1}</text>
    </g>
  );
}

export function Exploded({ layers, label, variant = "stack", className = "" }: { layers: Layer[]; label: string; variant?: "stack" | "chain"; className?: string }) {
  const lit = (g: Glyph) => g === "check";
  if (variant === "chain") {
    const step = 200, w = 170, d = 46, h = 170;
    const width = step * (layers.length - 1) + w + 40;
    return (
      <svg className={`exploded exploded-chain ${className}`} viewBox={`0 0 ${width} ${h}`} role="img" aria-label={label}>
        <path className="chain-link" d={`M${20 + w / 2} ${h / 2} H${20 + w / 2 + step * (layers.length - 1)}`} />
        {layers.map((l, i) => (
          <Plate key={l.title} cx={20 + w / 2 + i * step} cy={h / 2 - 6} w={w} d={d} i={i} glyph={l.glyph} scale={0.8} />
        ))}
      </svg>
    );
  }
  const W = 420, D = 44, STEP = 118;
  const h = D + 20 + (layers.length - 1) * STEP + D + 30;
  return (
    <svg className={`exploded ${className}`} viewBox={`0 0 ${W + 40} ${h}`} role="img" aria-label={label}>
      {layers.map((l, i) => (
        <Plate key={l.title} cx={20 + W / 2} cy={D + 20 + i * STEP} w={W} d={D} i={i} glyph={l.glyph} lit={lit(l.glyph)} />
      ))}
    </svg>
  );
}
