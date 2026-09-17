# Task A3 — Pipeline gutter line, experience, awards, education, skills, beyond

Owner files: `src/sections/PipelineGutter.tsx`, `Experience.tsx`, `Awards.tsx`,
`Education.tsx`, `Skills.tsx`, `Beyond.tsx`.

Read first: `docs/00-brief.md`, `docs/01-design-system.md`,
`docs/02-architecture.md`, `src/content.ts`, `src/components/Section.tsx`
(the node marker contract), `src/App.tsx` (layout variables).

## Goal

Two things. First, the page-wide **pipeline gutter**: the thin line down the
left that ties the whole page together and fills as you scroll. Second, the
"résumé" sections: experience, awards, education, skills, and the one human
touch (WindAid, Peru). These must be scannable in seconds and consistent with
the featured-work cards A2 is building (same eyebrow / serif / mono grammar).

## PipelineGutter (`PipelineGutter.tsx`)

Rendered as the first child of `<main>` (already wired in `App.tsx`).
`<main>` is `relative`; `--line-x` (20px) is the x position of the line from
`<main>`'s left edge.

- Base line: `absolute top-0 bottom-0 w-px bg-line` at `left: var(--line-x)`.
  It starts at the hero's node marker (top ≈ first `.pipeline-node`'s offset)
  and ends at the contact section's node. Compute the start/end from the first
  and last `.pipeline-node` markers after mount (and on resize, debounced) so
  the line does not extend into the top padding or the footer.
- Fill line: same geometry, `bg-accent`, `origin-top`, `scaleY` bound to scroll
  progress with `useScroll({ target: mainRef? })`. Simplest correct version:
  progress = (window.scrollY + 0.5·viewportHeight − lineTop) / lineHeight,
  clamped 0–1, smoothed with `useSpring({ stiffness: 120, damping: 30 })`.
  Reduced motion: no spring, set directly.
- Node activation: observe all `.pipeline-node` markers with a single
  `IntersectionObserver` (`rootMargin: '-40% 0px -50% 0px'` so a node is
  "active" roughly when its section crosses the upper-middle of the screen).
  Active marker: set `data-active="true"`. Style via a small `<style>` block in
  this component or Tailwind arbitrary variants on the marker is not possible
  since `Section` owns the markup — so set inline styles from JS
  (`el.style.backgroundColor = 'var(--c-accent)'`, plus `transform: scale(1.4)`
  with a 250ms transition) and revert when inactive. Past nodes (above the
  active one) stay accent, future nodes stay `var(--c-line-strong)`.
- Also render a small **current-section label** that is *optional*: skip it if
  it adds clutter. Priority is the line and nodes.

Do not render anything wider than the gutter; content must never overlap it.

## Experience (`Experience.tsx`)

`<Section id="experience" title="Experience">`. A vertical list, `divide-y
divide-line`, one block per `experience` item, each in a `Reveal` with stagger.

Block layout (mobile):
- Row 1: `start – end` in `.eyebrow` (use an en dash), `location` right-aligned
  in the same eyebrow style.
- Row 2: `role` in `font-medium text-fg`.
- Row 3: `org` in `text-fg-muted`, and `orgDetail` after a mono middle dot if
  present, `text-fg-subtle text-sm`.
- Bullets: `ul` with `list-disc pl-4 text-sm text-fg-muted space-y-1.5 mt-3`.
- `tags` → `<TagList>` with `mt-3`, if present.

Blocks: `py-6`.

## Awards (`Awards.tsx`)

`<Section id="awards" title="Awards">`. Two cards in a `grid grid-cols-1
sm:grid-cols-2 gap-3`. Card: `rounded-2xl border border-line bg-bg-elevated
p-5`. `date` eyebrow; `title` in `display-md` serif; `event` in `text-sm
font-medium`; `detail` in `text-sm text-fg-muted`.

## Education (`Education.tsx`)

`<Section id="education" title="Education">`. List `divide-y divide-line`,
`py-5` per row: `start – end` eyebrow with `location` right-aligned; `degree`
in `font-medium`; `school` in `text-fg-muted`; `focus` prefixed with "Focus:"
in `text-sm text-fg-subtle` when present; `notes` as a small mono list
(`text-xs font-mono text-fg-subtle`) when non-empty. Hide empty parts.

## Skills (`Skills.tsx`)

`<Section id="skills" title="Skills">`. One block per `skills` group: `group`
in `.eyebrow` then `<TagList>`. `space-y-6`. No proficiency bars, no icons.

## Beyond (`Beyond.tsx`)

`<Section id="beyond" title={beyond.title}>`. For each item: `when` eyebrow,
`label` font-medium, `detail` `text-sm text-fg-muted`. Quiet, short. This is the
only warm/human moment; a single serif italic line is allowed here if it stays
within the content given.

## Acceptance

- [ ] Line starts at the hero node and ends at the contact node; no overshoot.
- [ ] Fill tracks scroll smoothly; nodes activate in order; past nodes stay lit.
- [ ] Works when sections change height (fonts load, images none) — recompute
      on `resize` and after fonts ready (`document.fonts.ready`).
- [ ] Reduced motion: no spring, no scale transitions, but line/nodes still
      reflect position.
- [ ] All five content sections read cleanly at 390px in both themes.
- [ ] `npx tsc -p tsconfig.app.json --noEmit` clean for your files.

Report back: what you built, how you computed line bounds, any
`// CONTENT REQUEST` items, any primitive changes you wish you had.
