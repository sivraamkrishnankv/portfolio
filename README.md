# Siv Raam Krishnan K.V: portfolio

Next.js 16 (App Router, Cache Components), plain CSS, three.js for the hero. No UI library.

## Pages

- `/`: the hero (a live network sphere), three project cards, SCOUT's live diagram, experience, about and contact.
- `/work/scout`, `/work/valkyrie`, `/work/shuttle-poll`: one case study per project.

## Where things live

- **Words:** `src/content.ts`. Every headline, case study, diagram and fact on the site is here. Edit copy here, not in components.
- **Live diagrams:** the `flow` object on each project in `src/content.ts`, drawn by `src/components/FlowDiagram.tsx`.
  - `nodes`: each part of the system.
    - `kind`: one of `source`, `code`, `model`, `you` or `fail`.
    - `d`: `[column, row]` on wide screens.
    - `m`: `[column, row]` on phones.
    - `small`: a branch box.
    - `gate`: shows the Approve button.
  - `edges`: `[from, to, label]`. Add `"back"` for a loop back to an earlier step. A connector that would cross another box routes around it automatically.
  - `runs`: the route one item takes, with the caption shown at each stop.
- **Hero sphere:** `src/components/NetworkSphere.tsx`. three.js is loaded after the page paints.
- **Design tokens:** `:root` in `src/app/globals.css`.
  - Colours, with `--accent` the one lime.
  - Type steps: `--t-*`.
  - Spacing: `--s-*`.
  - Radii: `--r-*`.

  New sections should read from these tokens only.
- **Live shuttle-poll streak:** `src/lib/shuttle.ts`. It reads the public GitHub Actions API and caches the result for a day.
- **Booking:** `src/lib/booking.ts`. "Book a 30-min call" opens the Cal.com popup for `siv-raam-krishnan-k-v/30min`.
- **Images:** `public/img/`. CV: `public/Siv-Raam-Krishnan-KV-CV.pdf`. To update the CV, replace the file and keep the name.
- **Link preview and icons:** `public/og.jpg`, `favicon.svg`, `apple-touch-icon.png`, `icon-512.png`. They are rendered from `../collateral/og.html` and `../collateral/favicon.svg`.

## Environment variables (optional; set them in Vercel → Project → Settings → Environment Variables)

| Name | Example | What it does |
|---|---|---|
| `NEXT_PUBLIC_CAL_LINK` | `siv-raam-krishnan-k-v/30min` | Overrides the Cal.com event. An empty value falls back to a pre-filled email. |
| `NEXT_PUBLIC_SITE_URL` | `https://yourdomain.com` | The absolute URL for link previews. Without it, Vercel's production domain is used. |

## Run

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
```

## Adding a project

1. Add a `Chapter` object to `src/content.ts`, with its `flow`. Every fact must trace to something real.
2. Add it to the `chapters` array. The card and the `/work/<slug>` page appear automatically.
3. Add its picture to `src/components/ProjectVisual.tsx`.
