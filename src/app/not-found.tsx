import Link from "next/link";

export default function NotFound() {
  return (
    <main className="case">
      <p className="eyebrow">404</p>
      <h1>Nothing here.</h1>
      <p className="case-tag">That page does not exist. The work is one click away.</p>
      <div className="acts"><Link className="btn" href="/#work">See the work</Link></div>
    </main>
  );
}
