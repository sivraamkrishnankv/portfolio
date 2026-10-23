import { Fragment } from "react";
import Link from "next/link";
import { about, chapters, contact, person, scout, work } from "@/content";
import { Book } from "@/components/Book";
import { FlowDiagram } from "@/components/FlowDiagram";
import { NetworkSphere } from "@/components/NetworkSphere";
import { ProjectCard } from "@/components/ProjectCard";
import { getStreak } from "@/lib/shuttle";

function Words({ text, start = 0 }: { text: string; start?: number }) {
  // each word rises out of its own line box; screen readers get the plain name from aria-label
  return text.split(" ").map((w, i) => (
    <Fragment key={w + i}>
      {i > 0 && " "}
      <span className="w" aria-hidden="true"><span style={{ "--i": start + i } as React.CSSProperties}>{w}</span></span>
    </Fragment>
  ));
}

export default async function Home() {
  const streak = await getStreak();

  return (
    <main>
      <section className="hero" aria-labelledby="name">
        <NetworkSphere />
        <div className="hero-in">
          <div className="hero-text">
            <p className="kick"><span className="live" aria-hidden="true" />{person.role} at {person.employer}</p>
            <h1 id="name" aria-label={person.name}>
              {person.nameLines.map((l, i) => <span className="line" key={l}><Words text={l} start={i * 2} /></span>)}
            </h1>
            <p className="lede">
              {person.ledeParts.map(([t, strong], i) => (strong ? <b key={i}>{t}</b> : <span key={i}>{t}</span>))}
            </p>
            <div className="acts">
              <Book />
              <Link className="btn btn-ghost" href="#work">See the work</Link>
              <a className="btn btn-ghost" href={person.cv} download>Download CV</a>
            </div>
            <ul className="hero-facts">
              <li><Link href="/work/scout"><b>190</b> tests behind SCOUT</Link></li>
              <li><Link href="/work/valkyrie"><b>25</b> tools in VALKYRIE</Link></li>
              <li><Link href="/work/shuttle-poll"><b>{streak.count}</b> evenings in a row, shuttle-poll{streak.live && <span className="live live-sm" aria-label="live from GitHub" />}</Link></li>
            </ul>
          </div>
          <figure className="portrait">
            <img src="/img/portrait.webp" width={760} height={950} alt="Siv Raam Krishnan K.V in a navy suit" />
            <figcaption><span className="live" aria-hidden="true" />{person.portraitNote}</figcaption>
          </figure>
        </div>
        <a className="cue" href="#work" aria-hidden="true" tabIndex={-1}>Scroll<i /></a>
      </section>

      <section className="sec" id="work" aria-labelledby="work-h">
        <p className="eyebrow" data-reveal>Selected work</p>
        <h2 id="work-h" data-reveal>Three systems I built</h2>
        <p className="sec-intro" data-reveal>Each one runs by itself, and each one has a place where it stops for a person.</p>
        <div className="cards">
          {chapters.map((c, i) => (
            <div key={c.slug} data-reveal style={{ "--d": i } as React.CSSProperties} className={i === 0 ? "cards-first" : undefined}>
              <ProjectCard c={c} featured={i === 0} />
            </div>
          ))}
        </div>
      </section>

      <section className="sec" id="how" aria-labelledby="how-h">
        <p className="eyebrow" data-reveal>SCOUT, live</p>
        <h2 id="how-h" data-reveal>{scout.flowTitle}</h2>
        <p className="sec-intro" data-reveal>{scout.flowIntro}</p>
        <div className="diagram" data-reveal><FlowDiagram flow={scout.flow} /></div>
        <p className="more" data-reveal><Link href="/work/scout">Read the full SCOUT case study <span aria-hidden="true">→</span></Link></p>
      </section>

      <section className="sec" id="experience" aria-labelledby="exp-h">
        <p className="eyebrow" data-reveal>Experience</p>
        <h2 id="exp-h" data-reveal>{work.heading}</h2>
        <ol className="jobs">
          {work.jobs.map((j) => (
            <li key={j.org} className="job" data-reveal>
              <div className="job-head">
                <h3>{j.org}</h3>
                <p>{j.role}</p>
                <p className="dates">{j.dates}</p>
              </div>
              <div className="job-body">
                <p>{j.body}</p>
                {j.items.length > 0 && (
                  <dl>
                    {j.items.map((it) => <div key={it.name}><dt>{it.name}</dt><dd>{it.body}</dd></div>)}
                  </dl>
                )}
              </div>
            </li>
          ))}
        </ol>
        <p className="note" data-reveal>{work.note}</p>
        <div className="smaller" data-reveal>
          <h3>Also shipped</h3>
          <dl>
            {work.smaller.map((s) => (
              <div key={s.name}>
                <dt>{s.name}</dt>
                <dd>{s.body}{s.href && <> <a href={s.href}>{s.linkLabel}</a></>}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="sec about" id="about" aria-labelledby="about-h">
        <div>
          <p className="eyebrow" data-reveal>About</p>
          <h2 id="about-h" data-reveal>{about.heading}</h2>
          {about.body.map((p) => <p key={p.slice(0, 20)} className="about-lede" data-reveal>{p}</p>)}
        </div>
        <dl className="about-facts">
          {about.facts.map((f) => <div key={f.label} data-reveal><dt>{f.label}</dt><dd>{f.body}</dd></div>)}
        </dl>
      </section>

      <section className="sec contact" id="contact" aria-labelledby="contact-h">
        <div className="contact-card" data-reveal>
          <h2 id="contact-h">{contact.heading}</h2>
          <p>{contact.body}</p>
          <Book className="btn btn-lg" />
          <ul className="contact-list">
            <li><span>Email</span><a href={`mailto:${person.email}`}>{person.email}</a></li>
            <li><span>Phone and WhatsApp</span><a href={person.phoneHref}>{person.phone}</a> <a href={person.whatsapp}>Open WhatsApp</a></li>
            <li><span>CV</span><a href={person.cv} download>Download the PDF</a></li>
            <li><span>Elsewhere</span><a href={person.linkedin}>LinkedIn</a> <a href={person.github}>GitHub</a></li>
          </ul>
        </div>
      </section>
    </main>
  );
}
