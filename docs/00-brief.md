# Brief — read this first

## What we are building

A single-page, mobile-first web portfolio for Jorge Rodríguez Ruigómez. Tomorrow
recruiters at the Illinois Tech career fair scan a QR code on Jorge's phone and
land on this page. They have about 60 seconds and are standing in a loud hall on
bad Wi-Fi. The page must:

1. Tell them in one screen who Jorge is and what he is looking for.
2. Show, not claim, that he ships real AI systems (three featured projects).
3. Let them save his contact in one tap.
4. Feel calm, precise and considered. The *craft* of the page is part of the pitch.

Target roles: Applied AI Engineer, Forward Deployed Engineer, ML Engineer (RAG,
agents, multimodal), Solutions Engineer at AI-first companies.

## The concept: Input → System → Output

Every project and job in Jorge's profile has the same shape: messy real-world
input becomes reliable software. The page borrows that shape.

- A thin vertical **pipeline line** runs down the left gutter for the whole page.
  Each section is a node on it. Nodes light up as they scroll into view; the
  line fills with scroll progress.
- Each featured project is told as **Input → System → Output**: one input, a few
  system steps, one output. Steps animate in sequence when the card enters view.
- Copy is terse and outcome-first. Numbers are large and set in the serif.

## Non-negotiables

- **Mobile first.** Design at 375–390px wide. Desktop is the same column, centered.
- **Facts come only from `src/content.ts`.** Never type a name, date, number or
  link into a component. Never invent a fact or metric. If content is missing,
  leave a `// CONTENT REQUEST:` comment and say so in your final report.
- **Performance budget** (conference Wi-Fi): total JS ≤ 115 KB gzipped (React DOM
  alone is ~66 KB; measured 113 KB with the lazy Motion bundle), no images
  above the fold, no additional runtime dependencies without asking.
  `motion` is already installed; use it. No other animation libraries.
- **Accessibility.** Semantic HTML, real headings, focus states, 4.5:1 contrast
  in both themes, `prefers-reduced-motion` respected (the `Reveal` primitive
  already does; anything you animate yourself must too).
- **One accent color.** Everything else is neutral. Restraint is the style.
- **Do not edit files you do not own.** See `docs/02-architecture.md`.
- **Do not commit or push.** The orchestrator integrates.

## Tone of the copy

Confident, specific, no adjectives that could describe anyone ("passionate",
"innovative"). Prefer verbs and nouns: built, shipped, evaluated, routed.
Short sentences. Where content.ts already has copy, use it verbatim.
