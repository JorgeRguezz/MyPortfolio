# Task Q3 — Performance and accessibility audit

You are auditing the integrated build for speed on bad conference Wi-Fi and
for accessibility. You may make small, local fixes in `src/sections/**`,
`index.html`, `qr.html`, `vite.config.ts` and `vercel.json` if they are
clearly correct; explain each. Do not touch `src/content.ts`,
`src/index.css`, `src/components/*`, `src/App.tsx`; propose instead.

Read first: `docs/00-brief.md` (performance budget), `docs/02-architecture.md`.

## Performance

1. `npm run build`. Record every emitted asset with raw and gzip size. Budget:
   JS ≤ 90 KB gzip total, CSS ≤ 15 KB gzip, fonts actually requested by a
   latin page ≤ 120 KB total (check which woff2 files the browser would fetch:
   with Fontsource unicode-range splitting only `latin` subsets should load;
   confirm by grepping the emitted CSS for `unicode-range` and listing the
   latin files' sizes).
2. Lighthouse mobile: `npx lighthouse http://localhost:4173/ --preset=perf
   --only-categories=performance,accessibility,best-practices,seo
   --form-factor=mobile --screenEmulation.mobile --throttling-method=simulate
   --output=json --output-path=qa/lh.json --chrome-flags="--headless=new"`
   (install Chrome via `npx playwright install chromium` if needed and point
   `CHROME_PATH` at it). Serve with `npx vite preview --port 4173 --strictPort`.
   Report the four scores, LCP, CLS, TBT, and the top opportunities.
3. Check that fonts are `font-display: swap` (Fontsource default), that the
   two most critical font files (Instrument Serif normal, Inter latin) are
   `<link rel="preload" as="font" crossorigin>` in `index.html` — if not,
   propose exact tags using the hashed filenames Vite emits (or a Vite plugin
   approach) and weigh whether it is worth it.
4. `motion` bundle: confirm the build tree-shakes to the used APIs; if
   `main-*.js` exceeds budget, identify which import is heavy and propose the
   lighter API (e.g. `motion/react-m` + `LazyMotion`).
5. Any layout shift risks: font swap on the display-xl name (suggest
   `size-adjust`/fallback metrics if CLS > 0.05), late-mounting sticky bar,
   pipeline gutter measurement.
6. Confirm `vercel.json` cache headers are correct and the `.vcf` header
   works with `cleanUrls`.

## Accessibility

1. Run axe: `npm i -D @axe-core/playwright` and a script that loads the page
   at 390×844 in both color schemes and reports violations. Fix or propose.
2. Heading outline: exactly one `h1`; each section an `h2`; project names
   `h3`. Report the outline.
3. All links have discernible text (icon-only links need `aria-label`);
   external links announce they open in a new tab (visually hidden text or
   `aria-label`).
4. Contrast in both themes for `text-fg-subtle` on `bg-bg` and on
   `bg-bg-elevated`, and `text-accent` on `bg-accent-soft`. Compute ratios.
5. Reduced motion honored: grep for any `animate`/`transition` that does not
   consult `useReducedMotion` or the CSS media query.
6. Focus order and visible focus rings on every interactive element.
7. `lang`, `title`, `meta description`, `theme-color` present.

## Report

Table of asset sizes vs budget; Lighthouse scores and metrics; axe violations
with fix status; heading outline; contrast table; list of fixes applied (file +
one line each); list of proposed changes to files you do not own with exact
snippets. End with a go / no-go on performance for a conference Wi-Fi scenario.
