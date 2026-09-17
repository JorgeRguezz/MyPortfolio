# Task Q2 — Content accuracy audit and copy tightening

You are auditing what the site *says*. Do not edit code. Produce a report and
a proposed patch for `src/content.ts` (as a unified diff in your report, not
applied).

## Sources of truth (read all)

- `jorge-rodriguez-ruigomez-linkedin.md` — wins on any conflict
- `jorge-rodriguez-ruigomez-cv.md`
- `jorge-rodriguez-github.md`
- `work_taste.md` — target roles and positioning
- `PLAN.md` §8 for the verification notes on the three repos

Then read `src/content.ts` and every file under `src/sections/**` (to catch
any hardcoded text that bypasses content.ts).

## Checks

1. **Every fact** in `content.ts` (dates, numbers, names, titles, roles,
   metrics, links) traces to a source. List anything that does not, with the
   exact string. Pay attention to: "80 active members", "100+ attendees",
   "five-person team", "July 2026", grades, scholarship names, the six model
   names in the router project, the "495-combination table" and "M73–M104"
   claims, the GATV group name, all URLs.
2. **Nothing invented**: flag any adjective or claim that reads as
   embellishment ("production", "real people use every week", "live since June
   2026", "reply fast") and say whether a source supports it. Where it does
   not, propose a defensible rewording.
3. **Hardcoded text** in `src/sections/**` that should live in content.ts
   (UI labels like "scroll", "Source", "Also built", "INPUT/SYSTEM/OUTPUT"
   are acceptable; anything factual is not).
4. **Positioning**: does the hero + intro + featured work match the target in
   `work_taste.md` (Applied AI / Forward Deployed / product-facing)? Suggest
   wording changes if the emphasis drifts toward "researcher".
5. **Copy tightening**: for every string longer than ~18 words in content.ts,
   propose a tighter version that keeps the facts. Keep Jorge's voice:
   concrete verbs, no filler adjectives.
6. **Consistency**: date formats (Mon YYYY), en dashes in ranges, middle dots,
   capitalization of product names (LoL-RAG, MOTIVATE-XR, TelecoBuilders,
   ETSIT-UPM, Gaia-X), Oxford comma policy (pick one and apply).
7. **Privacy**: confirm the phone number appears nowhere on the page or in
   built HTML/JS (grep `dist/` after `npm run build` if a build exists; otherwise
   grep `src/`). It is allowed only in `public/*.vcf` and the PDF.

## Report

Sections: (a) unsupported or embellished claims with proposed fixes, (b)
hardcoded text found in sections, (c) positioning notes, (d) tightening
proposals as a table old → new, (e) consistency fixes, (f) privacy check
result, (g) a single unified diff against `src/content.ts` implementing
everything you recommend. Be precise; the orchestrator will apply your diff.
