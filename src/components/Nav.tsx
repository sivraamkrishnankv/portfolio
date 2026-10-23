import Link from "next/link";
import { person } from "@/content";
import { Book } from "./Book";
import { GitHubIcon } from "./Icons";

export function Nav() {
  return (
    <nav className="nav" aria-label="Primary">
      <Link className="brand" href="/">{person.short}<i>.</i></Link>
      <Link className="nav-l" href="/#work">Work</Link>
      <Link className="nav-l" href="/#experience">Experience</Link>
      <Link className="nav-l" href="/#contact">Contact</Link>
      <a className="nav-l nav-gh" href={person.github}><GitHubIcon /><span className="sr-only">GitHub</span></a>
      <Book className="btn btn-nav">Book a call</Book>
    </nav>
  );
}
