import Link from "next/link";
import { ViewTransition } from "react";
import type { Chapter } from "@/content";
import { GitHubIcon } from "./Icons";
import { ProjectVisual } from "./ProjectVisual";
import { Tilt } from "./Tilt";

export function ProjectCard({ c, featured = false }: { c: Chapter; featured?: boolean }) {
  return (
    <Tilt className={featured ? "card-wrap card-featured" : "card-wrap"}>
      <article className="card" aria-labelledby={`card-${c.slug}`}>
        <ViewTransition name={`vis-${c.slug}`} share="morph" default="none">
          <div className="card-vis"><ProjectVisual c={c} /></div>
        </ViewTransition>
        <div className="card-body">
          <p className="card-no">{c.number}</p>
          <ViewTransition name={`title-${c.slug}`} share="morph" default="none">
            <h3 id={`card-${c.slug}`}>{c.name}</h3>
          </ViewTransition>
          <p className="card-tag">{c.tagline}</p>
          <ul className="proof">{c.proof.map((p) => <li key={p}>{p}</li>)}</ul>
          <ul className="tags" aria-label="Built with">{c.tags.map((t) => <li key={t}>{t}</li>)}</ul>
          <div className="card-acts">
            <Link className="btn btn-sm" href={`/work/${c.slug}`}>Read the case study<span className="sr-only">: {c.name}</span></Link>
            <a className="btn btn-sm btn-ghost" href={c.repo}><GitHubIcon />Code<span className="sr-only"> for {c.name} on GitHub</span></a>
          </div>
        </div>
      </article>
    </Tilt>
  );
}
