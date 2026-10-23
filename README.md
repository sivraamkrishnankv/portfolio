# Siv Raam Krishnan K.V: portfolio

Next.js 16 (App Router, Cache Components), plain CSS, no UI library.

## Where things live

- **Words:** `src/content.ts`. Every headline, case study and fact on the page is here. Edit the copy here, not in components.
- **Design tokens:** `:root` in `src/app/globals.css`.
  - Colours: ground, ink, accent and the rest.
  - Type steps: `--t-*`.
  - Spacing: `--s-*`.
  - Radii: `--r-*`.

  New sections should read from these tokens only.
- **Exploded-view drawings:** `src/components/Exploded.tsx`.
- **The approval gate (the interactive piece):** `src/components/Gate.tsx`.
- **Live shuttle-poll streak:** `src/lib/shuttle.ts`. It reads the public GitHub Actions API and caches the result for a day.
- **Images:** `public/img/`. CV: `public/Siv-Raam-Krishnan-KV-CV.pdf`. To update the CV, replace the file and keep the name.

## Environment variables (set them in Vercel → Project → Settings → Environment Variables)

| Name | Example | What it does |
|---|---|---|
| `NEXT_PUBLIC_CAL_LINK` | `sivraam/30min` | Turns on the Cal.com booking popup. Without it, "Book a 30-min call" opens a pre-filled email. |
| `NEXT_PUBLIC_SITE_URL` | `https://yourdomain.com` | Optional. The absolute URL for link previews. Without it, Vercel's production domain is used automatically. |

## Run

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
```

## Adding a project chapter

1. Add a `Chapter` object to `src/content.ts`. Every fact must trace to something real.
2. Add it to the `chapters` array.
3. Render it in `src/app/page.tsx` with `<ChapterSection c={...} />`.

Use `compact: true` for anything after the first chapter, so the page does not repeat one layout.
