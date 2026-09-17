# Task A2 — Featured work and the Input → System → Output diagram

Owner files: `src/sections/FeaturedWork.tsx` and everything under
`src/sections/pipeline/` (create it).

Read first: `docs/00-brief.md`, `docs/01-design-system.md`,
`docs/02-architecture.md`, `src/content.ts` (especially `featuredProjects`,
`otherProjects`, the `Project` type), `src/components/*`.

## Goal

This is the centerpiece of the page and the reason a recruiter remembers it.
Three project cards, each telling its story as a small animated pipeline:
one input node, 4–5 system steps, one output node. When a card enters view,
the steps light up in sequence, top to bottom, like a pipeline running. It must
be legible at 390px, feel engineered rather than decorative, and never look
like a generic "timeline" component.

## Section

`<Section id="work" title={<>Featured <em>work</em></>} lead="Three systems, each told the same way: what went in, what I built, what came out.">`

(The lead is UI copy, allowed. Italic `em` inherits the serif italic.)

## Project card (one per `featuredProjects` item)

Vertical stack, `space-y-10` between cards. Card container:
`rounded-2xl border border-line bg-bg-elevated p-5 sm:p-6`.

Inside, top to bottom:

1. `context` in `.eyebrow`.
2. `name` as `<h3 class="display-md">`.
3. `hook` as `<p class="text-fg-muted">`.
4. **PipelineDiagram** (below).
5. `outcome` paragraph, `text-sm text-fg-muted`.
6. If `metric` exists: large serif number (`display-md`) + mono label. Hidden
   otherwise. (Currently only undefined; keep the code path.)
7. `<TagList items={stack} />`.
8. Links row: `ButtonLink variant="ghost"` per link, with arrow-up-right icon,
   external attributes.

Cards use `<Reveal>`; do not stagger across cards (they are far apart).

## PipelineDiagram (`src/sections/pipeline/PipelineDiagram.tsx`)

Props: `{ input: PipelineStep; system: PipelineStep[]; output: PipelineStep; id: string }`.

Visual: a vertical rail on the left (2px wide, `bg-line`), with nodes on it:

- **Input node**: 10px hollow circle (border 2px `border-fg`), label
  "INPUT" as eyebrow to its right, then `label` in `font-medium text-sm` and
  `detail` in `text-sm text-fg-muted`.
- **System steps**: 6px filled dots, `bg-line-strong` when inactive → `bg-accent`
  when active. Each step row: mono `label` (`font-mono text-xs uppercase
  tracking-wide`) and `detail` in `text-sm text-fg-muted`. Group them under a
  single "SYSTEM" eyebrow with a subtle bracket or indented rail so it reads as
  one stage.
- **Output node**: 10px filled circle `bg-fg` (turns `bg-accent` when the
  sequence completes), "OUTPUT" eyebrow, then `label` and `detail`.
- The rail between nodes fills top-to-bottom with accent as the sequence runs
  (a `motion.div` scaleY with `origin-top`, or a stroked SVG path with
  `pathLength`; your call).

Sequence: when the diagram enters view (`useInView`, once, margin
`-15%`), run: input node → each step (staggered ~140ms) → output node. Each
activation is a 250ms color/opacity transition; the rail fill tracks it.
Total ≤ 1.4s. `useReducedMotion()` → render everything in its final state
immediately, no animation.

Every row has a `min-h` so the diagram never jitters while animating. Text
does not animate; only dots, rail and the OUTPUT node do. This keeps it
readable while it runs.

Dark mode: verify the rail and inactive dots are visible but quiet.

## "Also built" (`otherProjects`)

After the three cards, an eyebrow "Also built" and a compact list
(`divide-y divide-line`): each row `name` (font-medium) + `detail`
(`text-sm text-fg-muted`). If `href` exists, the row is a link with the
arrow-up-right icon; otherwise plain text. 44px min height.

## Acceptance

- [ ] At 390px the diagram is fully legible, no horizontal overflow, labels
      never truncate.
- [ ] The step sequence runs once per card as it enters view; reduced motion
      shows final state.
- [ ] Only the accent color changes state; nothing else is colored.
- [ ] `metric` path compiles and hides cleanly when undefined.
- [ ] `npx tsc -p tsconfig.app.json --noEmit` clean for your files.
- [ ] `npx vite build --outDir /tmp/build-a2 --emptyOutDir` succeeds; note the
      main JS gzip size in your report.

Report back: what you built, the sequencing approach you chose and why, any
`// CONTENT REQUEST` items, any primitive changes you wish you had.
