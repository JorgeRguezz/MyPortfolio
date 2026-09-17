# Architecture and file ownership

Stack: Vite 8 · React 19 · TypeScript (strict, `verbatimModuleSyntax`,
`noUnusedLocals`) · Tailwind CSS v4 (`@tailwindcss/vite`) · `motion` ·
`qrcode`. Two HTML entries: `index.html` → `src/main.tsx` → `App.tsx`, and
`qr.html` → `src/qr.tsx`.

```
index.html, qr.html            entries              owner: orchestrator (A4 may add <meta> tags to index.html)
vite.config.ts                 build config         owner: orchestrator (A4 may add plugins/config for OG/QR)
src/index.css                  tokens + base        owner: orchestrator (request changes, do not edit)
src/content.ts                 ALL copy and facts   owner: orchestrator (never edit)
src/components/*               primitives           owner: orchestrator (never edit)
src/App.tsx                    page composition     owner: orchestrator
src/main.tsx                   bootstrap            owner: orchestrator

src/sections/StickyBar.tsx     A1
src/sections/Hero.tsx          A1
src/sections/Glance.tsx        A1
src/sections/Contact.tsx       A1
src/sections/Footer.tsx        A1

src/sections/FeaturedWork.tsx  A2
src/sections/pipeline/*        A2  (PipelineDiagram and helpers; create the folder)

src/sections/PipelineGutter.tsx A3
src/sections/Experience.tsx    A3
src/sections/Awards.tsx        A3
src/sections/Education.tsx     A3
src/sections/Skills.tsx        A3
src/sections/Beyond.tsx        A3

src/qr.tsx                     A4
scripts/*                      A4  (QR + OG generation scripts)
public/og.png, public/qr*.png  A4
vercel.json, README.md         A4
```

Each `src/sections/X.tsx` currently exports a stub `export function X()`.
Keep the export name and signature (no props); `App.tsx` imports them by name.
You may create additional files inside your owned area (for example
`src/sections/hero/`), but do not create files elsewhere.

## Contracts between tasks

- **Section wrapper.** Every content section (not Hero, StickyBar, Footer,
  PipelineGutter) must be rendered through `<Section id="...">` so it gets the
  eyebrow and a `.pipeline-node` marker. Section ids are the ones in
  `content.ts → sections`.
- **Pipeline node markers.** `Section` renders
  `<span class="pipeline-node" data-section="<id>">`. A3's `PipelineGutter`
  queries `document.querySelectorAll('.pipeline-node')`, positions nothing (the
  marker is already positioned by `Section`), and toggles a `data-active`
  attribute / accent color as each section enters view. A3 also renders the
  vertical line itself inside `<main>` at `left: var(--line-x)`.
- **Hero node.** The hero has no `Section` wrapper. A1 must render a
  `.pipeline-node` marker with `data-section="hero"` at the top of the hero so
  the line has an origin. Copy the marker markup from `Section.tsx`.
- **Sticky bar.** A1's `StickyBar` is `fixed top-0` and becomes visible once the
  hero's primary CTA has scrolled out (use `useInView` on a sentinel inside
  Hero, share state via a tiny module-level store or `document` events — your
  choice, but keep it inside A1 files). It must not overlap content when hidden
  (`pointer-events-none` + translate off-screen).
- **Contact actions.** "Save my contact" links to `person.links.vcard` with the
  `download` attribute. Resume links to `person.links.resumePdf` with
  `target="_blank" rel="noopener"`.
- **External links** get `target="_blank" rel="noopener noreferrer"` and the
  arrow-up-right icon.

## Verifying your work (without colliding with other agents)

Other agents are editing the same repo concurrently. Do not run `npm run build`
(it writes `dist/` and a shared tsbuildinfo). Instead:

```bash
# type-check only your files' correctness in context
npx tsc -p tsconfig.app.json --noEmit

# build to a private folder to check bundle size and that Vite is happy
npx vite build --outDir /tmp/build-<your-task-id> --emptyOutDir
```

Type errors in files you do not own that come from other agents' in-progress
work: ignore them, but mention them in your report. Type errors in your own
files: fix them.

If you want to look at your section in a browser you may run
`npx vite --port <unique port 5180–5199> --strictPort` in the background, but
the page will contain other agents' half-finished sections. Judge only yours.
