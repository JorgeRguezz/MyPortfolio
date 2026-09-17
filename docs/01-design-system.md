# Design system

All tokens are defined in `src/index.css`. Use the Tailwind utilities that map to
them. Never hardcode a hex value in a component.

## Color

| Utility | Light | Dark | Use |
| --- | --- | --- | --- |
| `bg-bg` | #FAFAF7 | #0E0E0F | page |
| `bg-bg-elevated` | #FFFFFF | #161618 | cards, sticky bar |
| `text-fg` | #141414 | #ECEBE6 | primary text |
| `text-fg-muted` | #5B5B57 | #A3A29C | secondary text, leads |
| `text-fg-subtle` | #8A8A84 | #6E6D68 | eyebrows, dates, footnotes |
| `border-line` | #E6E4DD | #26262A | hairlines, dividers, tag borders |
| `border-line-strong` / `bg-line-strong` | #CFCDC4 | #3A3A40 | inactive pipeline nodes, secondary buttons |
| `text-accent` / `bg-accent` / `border-accent` | #0F766E | #2DD4BF | active node, links on hover, filled line, primary hover |
| `bg-accent-soft` | #E0F2EF | #113B37 | accent tag background, selection |

Dark mode is automatic through `prefers-color-scheme`. Test both.

Rule: the accent appears only where something is *active* or *the one action*.
If a screen has more than a few accent touches, remove some.

## Type

| Class | Font | Use |
| --- | --- | --- |
| `font-display` + `.display-xl` | Instrument Serif | the name in the hero |
| `font-display` + `.display-lg` | Instrument Serif | section titles (`Section` renders this) |
| `font-display` + `.display-md` | Instrument Serif | project names, big numbers in tiles |
| `font-sans` (default) | Inter | body, 16px, line-height 1.6 |
| `font-mono` / `.eyebrow` | Geist Mono | eyebrows, dates, tags, pipeline step labels |

`h1–h3` already get `font-display` from base styles. Body text never smaller
than 15px (`text-[0.9375rem]`). Eyebrow is 11px uppercase with 0.14em tracking.
Serif italics are allowed for a single emphasized word in a title, e.g.
"Featured *work*". Use them at most twice on the page.

## Spacing and layout

- 8pt grid. Tailwind spacing only.
- Sections: `Section` gives `py-16` mobile / `py-20` sm+. Do not add more.
- Content column: `<main>` is max 680px, padded `--page-pad` (20px) right and
  `--page-pad + --gutter` (20 + 32px) left. The pipeline line sits at
  `--line-x` (20px) from `<main>`'s left edge; `.pipeline-node` markers are
  centered on it (see `Section.tsx`).
- Cards: `rounded-2xl border border-line bg-bg-elevated p-5`. No shadows in
  light mode. In dark mode the elevated background alone is enough.
- Hairline dividers between list items: `divide-y divide-line`.

## Motion

- Entrance: only via `<Reveal>` (opacity + 8px rise, 400ms, ease
  `[0.2,0.8,0.2,1]`, once). Stagger siblings with `delay={i * 0.06}`.
- In-view sequences (pipeline steps, count-ups): use `useInView` from
  `motion/react` with `{ once: true, margin: '0px 0px -15% 0px' }` and
  `useReducedMotion()`; render the final state immediately when reduced.
- Scroll-linked (gutter line fill): `useScroll` + `useSpring` from `motion/react`.
- Hover/press: 200ms color transitions and `active:scale-[0.98]` only.
- Nothing loops. Nothing moves on its own without scrolling.
- Total motion budget: subtle. If someone notices the animation more than the
  content, it is too much.

## Components you already have (`src/components`)

- `Section` — wrapper with node marker, eyebrow, optional serif title and lead.
- `Reveal` — the entrance animation.
- `Tag` / `TagList` — mono pills.
- `ButtonLink` — `primary | secondary | ghost`, `md | lg`. Always an `<a>`.

Use them. Extend by composition, not by editing them. If you truly need a
primitive change, describe it in your final report instead.

## Iconography

Inline SVG only, 16–20px, `stroke-current` with 1.5px stroke, no icon library.
Needed icons at most: arrow-up-right (external link), download, mail, plus the
LinkedIn and GitHub marks. Keep them in the component that uses them.
