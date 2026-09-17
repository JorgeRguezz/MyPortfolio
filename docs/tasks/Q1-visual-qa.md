# Task Q1 — Visual and interaction QA on a real mobile viewport

You are reviewing an integrated build, not writing features. You may fix
clear defects directly in `src/sections/**` (any file) as long as each fix is
small, local and explained in your report. Do not touch `src/content.ts`,
`src/index.css`, `src/components/*` or `src/App.tsx`; propose changes there
instead.

Read first: `docs/00-brief.md`, `docs/01-design-system.md`.

## Setup

1. `npm install -D playwright && npx playwright install chromium` (Chromium only).
2. `npm run build && npx vite preview --port 4173 --strictPort &` (or serve `dist/`).
3. Write a throwaway script `scripts/qa-shots.mjs` that, for each of
   - viewport 390×844 @ 3x (iPhone 14/15), light
   - viewport 390×844 @ 3x, dark (`colorScheme: 'dark'`)
   - viewport 360×780 @ 3x (small Android), light
   - viewport 390×844, `reducedMotion: 'reduce'`, light
   - viewport 1280×900 @ 2x (desktop sanity), light

   loads `http://localhost:4173/`, waits for `document.fonts.ready`, then
   takes: (a) an above-the-fold screenshot, (b) a full-page screenshot after
   scrolling to the bottom in ~600px steps with 150ms pauses (so in-view
   animations have fired), (c) one screenshot per section scrolled to the
   top of the viewport (`#glance`, `#work`, `#experience`, `#awards`,
   `#education`, `#skills`, `#beyond`, `#contact`). Also shoot
   `http://localhost:4173/qr.html` at 390×844 in both themes.
   Save everything under `qa/shots/<viewport>-<theme>/<name>.png`.
   (`qa/` should be added to `.gitignore` by you if not present — you may edit
   `.gitignore` for this one line.)

4. Look at every screenshot (use the Read tool on the PNGs).

## What to check

- Hero fits in one 390×844 viewport with both CTAs visible; nothing clipped.
- Typography hierarchy is consistent: eyebrow → serif title → body everywhere.
- Accent color appears only on: availability chip, active pipeline node,
  filled gutter line, active diagram dots, primary-button hover. Flag any other use.
- Pipeline gutter line: starts at hero node, ends at contact node, does not
  overlap text, nodes align with the line, fill progress plausible.
- Featured-work diagrams: legible, no truncation, no horizontal scroll,
  rails and dots aligned to text baselines, sequence ends in final state.
- Cards, dividers, spacing rhythm consistent across sections.
- Dark mode: contrast, hairlines visible, QR still scannable-looking.
- Reduced motion: everything visible in final state (no invisible content).
- Sticky bar: appears after hero, doesn't overlap section headings on
  anchor jump (scroll-mt), hidden state does not block taps.
- Tap targets ≥ 44px for all links/buttons. Report any smaller.
- Desktop: column centered, nothing stretched, gutter still sane.
- `/qr`: QR centered, high contrast, host text correct.

## Report

Return a prioritized list: **P0** (blocks shipping), **P1** (visible polish),
**P2** (nice). For each: viewport/theme, section, what is wrong, the exact
screenshot path, and either "fixed in <file>" or a proposed change. Attach a
list of all screenshot paths at the end. Also give an overall one-paragraph
verdict on whether the page feels elegant and consistent, and the single
highest-leverage improvement.
