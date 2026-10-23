import type { Chapter } from "@/content";

// What each project looks like in one picture: SCOUT's route in miniature, VALKYRIE's real
// dashboard, and the poll shuttle-poll posts.
export function ProjectVisual({ c, large = false }: { c: Chapter; large?: boolean }) {
  if (c.slug === "valkyrie") {
    return (
      <picture>
        {!large && <source media="(max-width: 760px)" srcSet="/img/valkyrie-trace-phone.webp" width={900} height={702} />}
        <img className="vis-img" src="/img/valkyrie-trace.webp" width={1600} height={1085} loading={large ? "eager" : "lazy"}
          alt="VALKYRIE dashboard: the reasoning trace for one message from my phone, with one tool call and its result" />
      </picture>
    );
  }
  if (c.slug === "shuttle-poll") {
    return (
      <div className="vis-poll" aria-hidden="true">
        <div className="bubble">
          <b>Playing tomorrow?</b>
          <span className="opt">Yes<i className="bar"><i style={{ "--w": "72%" } as React.CSSProperties} /></i></span>
          <span className="opt">No<i className="bar"><i style={{ "--w": "28%" } as React.CSSProperties} /></i></span>
          <span className="when">17:30</span>
        </div>
      </div>
    );
  }
  const stages = ["Search", "Curate", "Resume", "Approve", "Track"];
  return (
    <div className="vis-mini" aria-hidden="true">
      <svg viewBox="0 0 410 140">
        <path className="trk" d="M38 70 H372" />
        {stages.map((s, i) => (
          <g key={s}>
            <rect className={s === "Approve" ? "st st-you" : "st"} x={6 + i * 82} y={48} width={66} height={44} rx={10} />
            <text x={39 + i * 82} y={75} textAnchor="middle">{s}</text>
          </g>
        ))}
        <circle className="job" r="7" cy="38">
          <animate attributeName="cx" values="39;121;203;285;285;285;367" keyTimes="0;.18;.36;.54;.7;.82;1" dur="6s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  );
}
