# Task A1 — Hero, at-a-glance, sticky bar, contact, footer

Owner files: `src/sections/StickyBar.tsx`, `Hero.tsx`, `Glance.tsx`,
`Contact.tsx`, `Footer.tsx` (plus anything you create under `src/sections/hero/`
or `src/sections/contact/`).

Read first: `docs/00-brief.md`, `docs/01-design-system.md`,
`docs/02-architecture.md`, `src/content.ts`, `src/components/*`.

## Goal

The first and last screens the recruiter sees. The hero must land the whole
pitch in one 390×844 viewport without scrolling: name, headline, role, where he
is now, what he is seeking, and two actions. The close must make saving the
contact the obvious next step.

## Hero (`Hero.tsx`)

Layout, top to bottom, all from `content.ts → person`:

1. Pipeline node marker with `data-section="hero"` (copy markup from
   `Section.tsx`, same positioning), so the gutter line has an origin.
2. Eyebrow line: `roleLine` in `.eyebrow`.
3. `name` as `<h1 class="display-xl">`. Allow the surname to wrap naturally.
4. `headline` as a `<p>` in `display-md` serif, muted color. This is the hook.
5. `nowLine` in mono, `text-fg-subtle`, small.
6. Availability chip: `availability` rendered with `<Tag tone="accent">`.
   If the string is empty, render nothing.
7. Actions row: `ButtonLink variant="primary"` → Save my contact (vcard,
   `download`), `ButtonLink variant="secondary"` → Resume (PDF).
8. `intro` paragraph, `text-fg-muted`, max-w-prose, below the actions.
9. A scroll cue at the very bottom of the hero: a single thin vertical line
   (1px × 40px) with a short "scroll" mono label, muted. It fades out once the
   user has scrolled 40px (use `useScroll` from motion). Reduced motion: static.

Hero height: `min-h-[calc(100dvh-4rem)]` with content vertically distributed
(`flex flex-col justify-between`), so the actions sit comfortably in the thumb
zone on a phone and the scroll cue sits at the bottom edge.

Stagger the hero items with `<Reveal delay={i*0.06}>`.

Include an invisible sentinel element `<div data-hero-sentinel />` just below
the actions row; the sticky bar appears when it leaves the viewport.

## Sticky bar (`StickyBar.tsx`)

`fixed inset-x-0 top-0 z-40 h-14`. Background `bg-bg/85 backdrop-blur` with a
`border-b border-line`. Content centered to the same column as `<main>`
(max-w 680, px 20). Left: `shortName` in serif `text-lg`. Right: a small
`ButtonLink variant="primary" size="md"` → Save contact (vcard) with a
16px contact/download icon.

Visibility: hidden (`-translate-y-full opacity-0 pointer-events-none`) until
the hero sentinel scrolls out, then slides in (200ms). Implement with
`IntersectionObserver` on `[data-hero-sentinel]` or with motion's `useInView`
via a shared tiny store — keep everything inside your files.

## At a glance (`Glance.tsx`)

`<Section id="glance">` with **no** title (eyebrow only), then a 2×2 grid
(`grid grid-cols-2 gap-3`) of tiles from `content.ts → glance`:

- Tile: `rounded-2xl border border-line bg-bg-elevated p-4`.
- Number: `display-md` serif. Count up from 0 to `value` over 900ms when the
  tile enters view (`useInView` once, `animate` from motion or a simple rAF),
  then swap to `display` (e.g. "10/10", "100+"). Reduced motion: show
  `display` immediately.
- `label` in `text-sm text-fg` and `detail` in `text-xs text-fg-subtle`.
- Stagger tiles with `Reveal delay={i*0.06}`.

## Contact (`Contact.tsx`)

`<Section id="contact" title={contact.title} lead={contact.lead}>`.

- Primary action: `ButtonLink variant="primary" size="lg"` full width on mobile
  → Save my contact (vcard). Secondary: Resume (PDF).
- Under them, a `divide-y divide-line` list of three rows: Email (mailto,
  shows the address), LinkedIn, GitHub. Each row: 18px icon, label, value in
  mono, arrow-up-right at the right edge. Whole row is the link. 48px min
  tap height.
- Location line `person.location` in `.eyebrow` at the bottom.

## Footer (`Footer.tsx`)

`<footer>` with `border-t border-line`, `py-10`. `footer.line` in
`text-xs text-fg-subtle`, and a "Source" ghost link to `footer.sourceHref`.
Add `© {currentYear} {person.name}`.

## Acceptance

- [ ] Hero fits in 390×844 with no scrolling required to see both actions.
- [ ] Both themes look right; accent used only on the chip and primary hover.
- [ ] Sticky bar appears/disappears correctly and never blocks taps when hidden.
- [ ] Count-up works once, respects reduced motion.
- [ ] Tapping Save contact on iOS Safari and Android Chrome triggers the vCard
      (verify at least that the `<a download href=".vcf">` is correct).
- [ ] `npx tsc -p tsconfig.app.json --noEmit` clean for your files.
- [ ] No text outside `content.ts` except UI labels like "scroll" or "Source".

Report back: what you built, any `// CONTENT REQUEST` items, any primitive
changes you wish you had, screenshots if you took any.
