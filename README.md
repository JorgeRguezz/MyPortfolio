# Jorge Rodríguez Ruigómez — portfolio

Single-page, mobile-first portfolio built for a career fair: a recruiter scans
a QR code on Jorge's phone and lands here. Concept: *Input → System → Output*.

**Stack:** Vite 8 · React 19 · TypeScript (strict) · Tailwind CSS v4 · `motion`
· `qrcode`. Deployed on Vercel.

## Develop

```bash
npm install
npm run dev        # http://localhost:5173  (the QR screen is at /qr.html)
npm run build      # type-check + production build → dist/
npm run preview    # serve dist/ locally
```

All copy and facts live in **`src/content.ts`**. Components never hardcode a
name, date, number or link; edit that one file to change anything on the page.
Design tokens live in `src/index.css`.

## Deploy (Vercel)

1. Push this repo to GitHub.
2. Vercel dashboard → *Add New Project* → import the repo. Framework preset
   **Vite**, build `npm run build`, output `dist` (auto-detected). Deploy.
3. Or from the terminal: `npx vercel` (preview) then `npx vercel --prod`.

`vercel.json` turns on clean URLs (so `/qr` serves `qr.html`), caches hashed
assets for a year, and serves the `.vcf` as a downloadable vCard.

## After the first deploy: bake in the real URL

The `/qr` page needs nothing: it encodes whatever origin it is served from.
The static assets and the social preview do need the final URL once:

```bash
npm run qr -- https://<your-project>.vercel.app   # public/qr.svg, qr.png, qr-card.png
                                                  # + points og:image at the absolute URL
npm run og                                        # public/og.png (1200×630), only if copy changed
npm run verify:qr -- https://<your-project>.vercel.app   # decodes the PNGs, proves they scan
git add public index.html && git commit -m "Bake in deploy URL" && git push
```

`npm run verify:qr -- --page http://localhost:5173/qr.html` also screenshots the
live `/qr` page in light and dark mode and decodes it.

Assets (all generated from `src/content.ts`, system fonts, no font deps):

| File | Use |
| --- | --- |
| `public/qr.svg` | QR only, black on transparent. Print, slides. |
| `public/qr.png` | 1024×1024, black on white. Paste into messages. |
| `public/qr-card.png` | 1080×1920 lock-screen wallpaper. |
| `public/og.png` | 1200×630 social preview (Slack, LinkedIn, iMessage). |

## Day-of checklist

- [ ] Open `https://<your-project>.vercel.app/qr` on the phone. Add it to the
      home screen so it is one tap away. Brightness to max; tap once so the
      screen stays awake (Wake Lock).
- [ ] Set `public/qr-card.png` as the lock-screen wallpaper as a backup.
- [ ] Paste the link into a Slack DM to yourself and check the preview card.
- [ ] Scan the QR from a second phone in both light and dark mode.
- [ ] `public/Jorge_Rodriguez_Ruigomez_Resume.pdf` and the `.vcf` are current.
- [ ] `src/content.ts` → `person.availability` says what you want it to say.
