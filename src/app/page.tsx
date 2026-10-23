import { about, chapters, contact, person, work, type Chapter } from "@/content";
import { Exploded } from "@/components/Exploded";
import { Gate } from "@/components/Gate";
import { bookHref, bookProps } from "@/lib/booking";
import { formatDay, getStreak } from "@/lib/shuttle";

function Book({ className = "btn" }: { className?: string }) {
  return (
    <a className={className} href={bookHref} {...bookProps}>
      Book a 30-min call
    </a>
  );
}

function ChapterSection({ c, children }: { c: Chapter; children?: React.ReactNode }) {
  return (
    <section className={c.compact ? "chapter chapter-compact" : "chapter"} id={c.id} aria-labelledby={`${c.id}-h`}>
      <header className="chapter-head">
        <p className="chapter-no">{c.number}</p>
        <h2 id={`${c.id}-h`}>{c.name}</h2>
        <p className="chapter-tag">{c.tagline}</p>
      </header>
      <div className="chapter-story">
        {c.story.map((p) => <p key={p.slice(0, 24)}>{p}</p>)}
      </div>

      <figure className={`explode explode-${c.drawing}`}>
        <Exploded variant={c.drawing} layers={c.layers} label={`${c.layersTitle}: ${c.layers.map((l) => l.title).join(", ")}`} />
        {c.drawing === "chain" && <Exploded className="phone-only" layers={c.layers} label={`${c.layersTitle}: ${c.layers.map((l) => l.title).join(", ")}`} />}
        <figcaption>
          <p className="explode-title">{c.layersTitle}</p>
          <ol>
            {c.layers.map((l) => (
              <li key={l.title}><b>{l.title}</b> {l.detail}</li>
            ))}
          </ol>
        </figcaption>
      </figure>

      {children}

      <div className="decisions">
        <h3 className="sr-only">Decisions</h3>
        {c.decisions.map((d) => (
          <div key={d.title}>
            <h4>{d.title}</h4>
            <p>{d.body}</p>
          </div>
        ))}
      </div>

      <div className="broke">
        <h3>{c.brokeTitle}</h3>
        <div className="broke-list">
          {c.broke.map((b) => (
            <div key={b.title}>
              <h4>{b.title}</h4>
              <p>{b.body}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="chapter-facts">
        {c.facts} <span className="stack">Built with {c.stack}.</span>{" "}
        <a href={c.repo}>Code on GitHub<span className="sr-only">: {c.repoLabel}</span></a>
      </p>
    </section>
  );
}

export default async function Home() {
  const streak = await getStreak();
  const ticks = Math.min(streak.count, 42);
  const [first, second, third] = chapters;

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <main id="main">
        <section className="scene" aria-labelledby="name">
          <picture>
            <source media="(max-width: 760px)" srcSet="/img/hero-tall.webp" width={900} height={1176} />
            <img className="scene-img" src="/img/hero-wide.webp" width={2000} height={1873} alt="Siv Raam Krishnan K.V in a navy suit, standing in a wood-panelled lecture hall" fetchPriority="high" />
          </picture>
          <nav className="top" aria-label="Primary">
            <a className="mark" href="#main">Siv Raam Krishnan K.V</a>
            <span className="top-links">
              <a href="#scout">Work</a>
              <a href="#at-work">Experience</a>
              <a href="#contact">Contact</a>
            </span>
          </nav>
          <div className="title">
            <p className="kicker"><b>{person.role}</b> at {person.employer}</p>
            <h1 id="name">{person.name}</h1>
            <p className="lede">{person.lede}</p>
            <div className="actions">
              <Book />
              <span className="links">
                <a href={person.whatsapp}>WhatsApp</a>
                <a href={`mailto:${person.email}`}>Email</a>
                <a href={person.cv} download>Download CV</a>
              </span>
            </div>
          </div>
          <div className="credits">
            <a className="reel" href="#shuttle-poll">
              <span className="reel-text">
                <b>shuttle-poll</b> ran at 5:30 PM, {streak.count} evenings in a row
                <span className="reel-dates"> ({formatDay(streak.since)} to {formatDay(streak.until)})</span>
              </span>
              <span className="runs" aria-hidden="true">
                {Array.from({ length: ticks }, (_, i) => <i key={i} style={{ "--n": i } as React.CSSProperties} />)}
              </span>
            </a>
            <ul className="roll" aria-label="Three chapters">
              {chapters.map((c) => (
                <li key={c.id}><a href={`#${c.id}`}><b>{c.name}</b>{c.tagline}</a></li>
              ))}
            </ul>
          </div>
        </section>

        <ChapterSection c={first}>
          <Gate />
        </ChapterSection>

        <ChapterSection c={second}>
          <figure className="shot">
            <picture>
              <source media="(max-width: 760px)" srcSet="/img/valkyrie-trace-phone.webp" width={900} height={702} />
              <img src="/img/valkyrie-trace.webp" width={1600} height={1085} loading="lazy" alt="VALKYRIE dashboard, reasoning trace for the message 'Launch chrome than': one launch_application tool call with app_name chrome, its result, and the reply" />
            </picture>
            <figcaption>A real trace from my development log: one message from my phone, one tool call, then the reply. Private entries were removed from the log before this screenshot.</figcaption>
          </figure>
        </ChapterSection>

        <ChapterSection c={third} />

        <section className="atwork" id="at-work" aria-labelledby="at-work-h">
          <h2 id="at-work-h">{work.heading}</h2>
          <div className="jobs">
            {work.jobs.map((j) => (
              <article key={j.org} className="job">
                <header>
                  <h3>{j.org}</h3>
                  <p>{j.role} <span className="dates">{j.dates}</span></p>
                </header>
                <div>
                  <p>{j.body}</p>
                  {j.items.length > 0 && (
                    <dl>
                      {j.items.map((it) => (
                        <div key={it.name}><dt>{it.name}</dt><dd>{it.body}</dd></div>
                      ))}
                    </dl>
                  )}
                </div>
              </article>
            ))}
          </div>
          <p className="note">{work.note}</p>
          <div className="smaller">
            <h3>Also on my GitHub and PyPI</h3>
            <dl>
              {work.smaller.map((s) => (
                <div key={s.name}><dt>{s.name}</dt><dd>{s.body}</dd></div>
              ))}
            </dl>
          </div>
        </section>

        <section className="about" id="about" aria-labelledby="about-h">
          <div>
            <h2 id="about-h">{about.heading}</h2>
            {about.body.map((p) => <p key={p.slice(0, 20)} className="about-lede">{p}</p>)}
          </div>
          <dl>
            {about.facts.map((f) => (
              <div key={f.label}><dt>{f.label}</dt><dd>{f.body}</dd></div>
            ))}
          </dl>
        </section>

        <section className="contact" id="contact" aria-labelledby="contact-h">
          <h2 id="contact-h">{contact.heading}</h2>
          <p>{contact.body}</p>
          <Book className="btn btn-lg" />
          <ul className="contact-list">
            <li><span>Email</span><a href={`mailto:${person.email}`}>{person.email}</a></li>
            <li><span>Phone and WhatsApp</span><a href={person.phoneHref}>{person.phone}</a> <a href={person.whatsapp}>Open WhatsApp</a></li>
            <li><span>CV</span><a href={person.cv} download>Download the PDF</a></li>
            <li><span>Elsewhere</span><a href={person.linkedin}>LinkedIn</a> <a href={person.github}>GitHub</a></li>
          </ul>
        </section>
      </main>
      <footer className="foot">
        <p>{person.name}. Designed and built by me.</p>
        <a href="#main">Back to top</a>
      </footer>
    </>
  );
}

