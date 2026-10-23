import type { Metadata, Viewport } from "next";
import { Gloock, Hanken_Grotesk } from "next/font/google";
import Script from "next/script";
import { CAL_LINK } from "@/lib/booking";
import "./globals.css";

const display = Gloock({ weight: "400", subsets: ["latin"], variable: "--ff-display", display: "swap" });
const text = Hanken_Grotesk({ subsets: ["latin"], variable: "--ff-text", display: "swap" });

// Link previews need an absolute URL. On Vercel, VERCEL_PROJECT_PRODUCTION_URL is the production
// domain (the *.vercel.app one until a custom domain is added), so previews work from the first deploy.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Siv Raam Krishnan K.V, AI Engineer",
  description:
    "I build software that runs on its own, checks its own work, and stops to ask a person before anything important. Three systems I built, taken apart.",
  openGraph: {
    title: "Siv Raam Krishnan K.V, AI Engineer",
    description: "Software that runs on its own, checks its own work, and asks a person before anything important.",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Siv Raam Krishnan K.V, AI Engineer" }],
    type: "website",
  },
  icons: { icon: "/favicon.svg", apple: "/apple-touch-icon.png" },
};

export const viewport: Viewport = { themeColor: "#1b1510", colorScheme: "dark" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${text.variable}`}>
      <body>
        {children}
        {CAL_LINK && (
          <Script id="cal-embed" strategy="lazyOnload">{`
(function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if (typeof namespace === "string") { cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], ar); p(cal, ["initNamespace", namespace]); } else p(cal, ar); return; } p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");
Cal("init", { origin: "https://cal.com" });
Cal("ui", { theme: "dark", styles: { branding: { brandColor: "#f0b44c" } }, hideEventTypeDetails: false });
`}</Script>
        )}
      </body>
    </html>
  );
}
