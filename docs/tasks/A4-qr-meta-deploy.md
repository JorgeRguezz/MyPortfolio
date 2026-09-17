# Task A4 — QR page, QR/OG assets, meta tags, deploy config, README

Owner files: `src/qr.tsx`, `scripts/*`, `public/og.png`, `public/qr.svg`,
`public/qr.png`, `public/qr-card.png`, `vercel.json`, `README.md`, and the
`<meta>` block in `index.html` (only between the comment line and `</head>`).
You may also add `scripts` entries to `package.json` (`"qr"`, `"og"`) and
install **dev** dependencies needed for image generation (prefer `sharp` or
`@resvg/resvg-js`; do not add runtime deps).

Read first: `docs/00-brief.md`, `docs/01-design-system.md`,
`docs/02-architecture.md`, `src/content.ts`, `qr.html`.

## Goal

Everything around the page that makes the career-fair moment work:

1. A `/qr` page Jorge opens on his phone and shows to recruiters.
2. Printable / lock-screen QR assets.
3. Social preview so the link looks good when a recruiter pastes it in Slack.
4. Vercel config so `/qr` resolves and the SPA deploys correctly.
5. A README that tells Jorge how to deploy and regenerate assets.

The final URL is not known yet (Vercel assigns it on first deploy). Therefore:
- The `/qr` page must build its QR **at runtime from `window.location.origin`**
  (use the `qrcode` package's `toString(text, { type: 'svg' })` or `toDataURL`).
  Whatever domain it is served from is what it encodes. Zero config.
- The static assets script takes the URL as an argument with a default:
  `npm run qr -- https://<final-url>` (default `https://jorge-ruigomez.vercel.app`).

## `/qr` page (`src/qr.tsx`)

Standalone React entry (no `App.tsx`). Full-viewport, centered, `bg-bg`:

- Top: `person.shortName` in `display-lg` serif; under it `person.roleLine`
  in `.eyebrow`.
- Middle: the QR, rendered as inline SVG, `w-[min(78vw,340px)]`, dark modules
  `currentColor` (`text-fg`) on a `bg-bg-elevated rounded-3xl p-5 border
  border-line` card. Error correction `M`, margin 1 module. Because it uses
  `currentColor`, dark mode inverts automatically — verify scannability in dark
  mode (dark modules on light background scan best; if in doubt force the QR
  card to light colors in both themes).
- Below: the URL text in mono `text-fg-subtle text-sm` (host only, no
  protocol), and a line "Scan to open my portfolio" in `text-fg-muted`.
- Bottom: a `ButtonLink variant="ghost"` "Open portfolio" → `/`.
- Add `<meta name="robots" content="noindex">` (already in `qr.html`).
- Keep the screen awake if possible: request `navigator.wakeLock` on a user
  tap (wrap in try/catch; it is optional).

## Static assets (`scripts/make-qr.mjs`)

Node ESM script using `qrcode`:
- `public/qr.svg` — QR only, black on transparent, EC level `M`.
- `public/qr.png` — 1024×1024, white background, for messages/print.
- `public/qr-card.png` — 1080×1920 lock-screen card: warm off-white
  background (#FAFAF7), the QR centered (~620px), name above in a serif
  (system Georgia is fine for a raster; do not add font deps), role line in a
  mono under it, URL host at the bottom. Compose with `sharp` (SVG overlay →
  PNG). If `sharp` fails to install on this machine, fall back to producing
  only `qr.svg` and `qr.png` and say so.

## Social preview (`scripts/make-og.mjs` → `public/og.png`)

1200×630 PNG, same palette: name in serif large, `person.headline` under it,
role line in mono, a small "JR" mark matching `public/favicon.svg`. Generate
from an SVG template via `sharp`. Add to `index.html`:

```html
<meta property="og:type" content="website" />
<meta property="og:title" content="Jorge Rodríguez Ruigómez — Applied AI Engineer" />
<meta property="og:description" content="…person.headline…" />
<meta property="og:image" content="/og.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" … /> <meta name="twitter:description" … /> <meta name="twitter:image" content="/og.png" />
```

Use a relative `/og.png`; Vercel resolves it. Also add a `<link rel="canonical">`
placeholder is NOT needed (unknown URL). Add `<meta name="author">`.

## Vercel (`vercel.json`)

```json
{
  "cleanUrls": true,
  "trailingSlash": false,
  "rewrites": [{ "source": "/qr", "destination": "/qr.html" }],
  "headers": [
    { "source": "/assets/(.*)", "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }] },
    { "source": "/(.*)\\.(vcf)", "headers": [{ "key": "Content-Type", "value": "text/vcard; charset=utf-8" }, { "key": "Content-Disposition", "value": "attachment; filename=\"jorge-rodriguez-ruigomez.vcf\"" }] }
  ]
}
```

Verify the rewrite is actually needed with `cleanUrls` (Vercel serves
`/qr.html` at `/qr` with cleanUrls on; keep the explicit rewrite anyway, it is
harmless). Build output dir is `dist` (Vite default; Vercel auto-detects).

## README (`README.md`)

Replace the current two-line README with: what this is, stack, `npm run dev`,
`npm run build`, deploy steps (import repo in Vercel dashboard → framework
Vite → deploy; or `npx vercel`), how to regenerate QR assets after the URL is
known (`npm run qr -- https://…`), where copy lives (`src/content.ts`), and a
short "day-of checklist" (open `/qr` on phone, max brightness, lock-screen
card set, PDF up to date). Keep it under 80 lines.

## Acceptance

- [ ] `/qr` renders the QR of the current origin; scannable in both themes
      (test by opening the page in preview and scanning with a phone camera if
      you can; otherwise decode `public/qr.png` with the `jsqr`/`zxing` dev
      package in a quick script to prove round-trip).
- [ ] `npm run qr` and `npm run og` produce the files; report their sizes.
- [ ] `index.html` has complete OG/Twitter tags.
- [ ] `vercel.json` is valid JSON and `/qr` will resolve.
- [ ] `npx tsc -p tsconfig.app.json --noEmit` clean for your files.
- [ ] `npx vite build --outDir /tmp/build-a4 --emptyOutDir` succeeds and emits
      both `index.html` and `qr.html`.

Report back: files produced with sizes, dev deps added, anything that failed
(for example native `sharp` install), and the exact commands Jorge runs after
the first deploy.
