import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { chapterBySlug, chapters } from "@/content";
import { Book } from "@/components/Book";
import { FlowDiagram } from "@/components/FlowDiagram";
import { GitHubIcon } from "@/components/Icons";
import { ProjectVisual } from "@/components/ProjectVisual";
import { formatDay, getStreak } from "@/lib/shuttle";

export function generateStaticParams() {
  return chapters.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = chapterBySlug((await params).slug);
  return c ? { title: c.name, description: `${c.tagline} ${c.story[0]}` } : {};
}

export default async function CaseStudy({ params }: { params: Promise<{ slug: string }> }) {
  const c = chapterBySlug((await params).slug);
  if (!c) notFound();
  const next = chapters[(chapters.indexOf(c) + 1) % chapters.length];
  const streak = c.slug === "shuttle-poll" ? await getStreak() : null;

  return (
    <main className="case">
      <header className="case-head">
        <Link className="back" href="/#work"><span aria-hidden="true">←</span> All work</Link>
        <p className="eyebrow">Case study {c.number}</p>
        <ViewTransition name={`title-${c.slug}`} share="morph" default="none">
          <h1>{c.name}</h1>
        </ViewTransition>
        <p className="case-tag">{c.tagline}</p>
        <div className="acts">
          <a className="btn" href={c.repo}><GitHubIcon />View the code on GitHub</a>
          <Book className="btn btn-ghost" />
        </div>
        <dl className="case-meta">
          <div><dt>Built with</dt><dd>{c.stack}</dd></div>
          <div><dt>In numbers</dt><dd>{c.facts}</dd></div>
          <div><dt>Code</dt><dd><a href={c.repo}>{c.repoLabel}</a></dd></div>
        </dl>
      </header>

      <ViewTransition name={`vis-${c.slug}`} share="morph" default="none">
        <div className={`case-vis case-vis-${c.slug}`}><ProjectVisual c={c} large /></div>
      </ViewTransition>
      {streak && (
        <p className="streak" data-reveal>
          {streak.live && <span className="live" aria-hidden="true" />}
          <b>{streak.count} evenings in a row</b> on time at 5:30 PM, {formatDay(streak.since)} to {formatDay(streak.until)}
          {streak.live ? ", read from GitHub Actions." : "."}
        </p>
      )}

      <section className="case-sec case-story" aria-labelledby="story-h">
        <h2 id="story-h" data-reveal>What it does</h2>
        <div>{c.story.map((p) => <p key={p.slice(0, 24)} data-reveal>{p}</p>)}</div>
      </section>

      <section className="case-sec" aria-labelledby="flow-h">
        <h2 id="flow-h" data-reveal>{c.flowTitle}</h2>
        <p className="sec-intro" data-reveal>{c.flowIntro}</p>
        <div className="diagram" data-reveal><FlowDiagram flow={c.flow} /></div>
      </section>

      <section className="case-sec" aria-labelledby="dec-h">
        <h2 id="dec-h" data-reveal>Decisions, and why</h2>
        <div className="decisions">
          {c.decisions.map((d, i) => (
            <article key={d.title} data-reveal style={{ "--d": i } as React.CSSProperties}>
              <p className="dec-no">{String(i + 1).padStart(2, "0")}</p>
              <h3>{d.title}</h3>
              <p>{d.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="case-sec broke" aria-labelledby="broke-h">
        <h2 id="broke-h" data-reveal>{c.brokeTitle}</h2>
        <div className="broke-list">
          {c.broke.map((b) => (
            <article key={b.title} data-reveal>
              <h3>{b.title}</h3>
              <p>{b.body}</p>
            </article>
          ))}
        </div>
      </section>

      <nav className="next" aria-label="Next case study" data-reveal>
        <Link href={`/work/${next.slug}`}>
          <span className="next-k">Next case study</span>
          <span className="next-name">{next.name}</span>
          <span className="next-tag">{next.tagline} <span aria-hidden="true">→</span></span>
        </Link>
      </nav>
    </main>
  );
}
