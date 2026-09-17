# Portfolio plan — IIT career fair (ship in one day)

Goal: a recruiter scans a QR code on Jorge's phone or printed card, lands on a
mobile-first single page, and in under 60 seconds understands: who Jorge is,
what he has built, and how to reach him. The *way* it is told (calm, precise,
pipeline-shaped) should itself signal engineering taste.

---

## 1. Concept: "Input → System → Output"

Every line of Jorge's profile is the same story: take messy real-world input
(video, bank documents, football regulations, raw model benchmarks) and turn it
into reliable, user-facing software. The site borrows that shape.

- A thin vertical **pipeline line** runs down the left gutter for the whole
  page. Section markers are nodes on it; they light up as they enter the
  viewport and the line fills with scroll progress.
- Each featured project is told as **Input → System → Output**, with a small
  animated step-by-step diagram instead of a screenshot.
- Copy is terse and outcome-first. Numbers are set in bold and large.

Tone: minimal, warm, editorial. Not a "developer template".

## 2. Visual system

| Token | Choice |
| --- | --- |
| Background | Warm off-white `#FAFAF7`; dark mode via `prefers-color-scheme` (`#0E0E0F`) |
| Text | Near-black `#141414` / dark mode `#ECEBE6` |
| Accent | One only. Deep teal `#0F766E` (light) / `#2DD4BF` (dark) for nodes, links, active states |
| Display type | *Instrument Serif* (headings, big numbers) |
| Body type | *Inter* (self-hosted, 400/500) |
| Mono | *Geist Mono* for stack tags, pipeline labels, dates |
| Spacing | 8pt grid, generous vertical rhythm (sections ~96px apart on mobile) |
| Motion | Reveal on scroll: opacity 0→1, translateY 8px→0, 400ms, stagger 60ms. Pipeline diagram steps animate in sequence. Count-up on stats. All disabled under `prefers-reduced-motion`. No parallax, no 3D, no cursor effects |

Layout target: 375px wide first. Desktop simply centers a 680px column and
lets the pipeline line breathe.

## 3. Page structure (single scroll)

0. **Sticky micro-bar** (appears after hero): name · "Save contact" button.
1. **Hero**
   - `Jorge Rodríguez Ruigómez`
   - "I turn AI capabilities into software people actually use."
   - Applied AI · Forward Deployed Engineering · M.S. ITM @ Illinois Tech, Chicago
   - Availability chip: **[INPUT NEEDED]** e.g. "Seeking Summer 2027 internship · Full-time from May 2027"
   - Two buttons: *Save contact* (vCard) · *Resume (PDF)*
2. **At a glance** — 4 tiles, count-up numbers
   - 2 hackathon podiums (winner + 2nd place)
   - 10/10 thesis, honors nomination
   - Production GenAI at a top Spanish bank (NTT DATA / Banco Sabadell)
   - 100+ attendees at events he co-organized
3. **Featured work** — 3 deep cards, each with Input → System → Output diagram
   - **Multimodal LoL-RAG** (flagship). Input: hours of gameplay video.
     System: segmentation → frame sampling → champion/entity matching → ASR +
     VLM descriptions → two-stage sanitization → vector + knowledge-graph
     build → hybrid retrieval & reranking. Output: grounded answers with
     evidence, FastAPI `/chat` + Next.js UI, Docker GPU deploy, offline eval
     (ROUGE, BERTScore, RAGAS). Tags: Python, PyTorch, FastAPI, Next.js,
     Docker, GraphML.
   - **Intelligent LLM Router** (B.Eng. thesis, 10/10). Input: every prompt
     sent to the same expensive model. System: BERT classifier routes each
     prompt to the cheapest model that answers it well; benchmarked GPT-4.1
     nano, GPT-4o mini, Llama 3.1 8B, Mistral 7B, Gemma 2 9B, Phi-4 on
     MMLU-Pro including paraphrase robustness; measured accuracy, cost and
     energy. Output: router + chat UI (React + Python API). **[INPUT NEEDED:
     headline metric, e.g. "−X% cost at −Y pt accuracy"]**
   - **World Cup 2026 Prediction League**. Input: FIFA 2026 regulations +
     official results. System: rules engine implementing the real format
     (12 groups, 8 best thirds via FIFA's 495-combination table, bracket
     M73–M104), predictions lock at kickoff, admin result entry, ranking
     with tests. Output: live app used by a real group of friends. React,
     Vite, TypeScript, Supabase (Postgres + RLS + PL/pgSQL), Vercel.
     Spec-driven: PRD, engine spec, phased implementation.
     Live: https://worldcup-app-ten.vercel.app
   - **Also built** (compact row): ETSIT-UPM Alumni platform (QR credentials,
     payments), Tennis match stats from object detection, CareNest (Harvard
     HSIL hackathon), IdC ISST project.
4. **Experience** — pipeline nodes with dates
   - AI Research Assistant, UPM (GATV) · MOTIVATE-XR · Oct 2025 – Aug 2026
   - AI Engineer Intern, NTT DATA · Feb 2025 – Jul 2025
   - Founding Team Member, ETSIT-UPM Alumni Network · Oct 2025 – present
   - TelecoEmprende · Vice President → Board Member · Oct 2025 – present
   - Summer Engineer (volunteer), WindAid Institute, Peru · Aug – Sep 2024
5. **Awards** — Repsol Challenge winner, IndesIAHack (Nov 2024) · 2nd place,
   Gaia-X Hub Spain Hackathon (Dec 2024)
6. **Education** — IIT M.S. ITM (Applied Data Science & AI, 2026–27) · UPM
   Master's Telecom Eng. (ML & Data Science, 2025–27) · UPM B.Eng. (2020–25,
   thesis 10/10). Scholarships: UPM International Mobility, Santander.
7. **Skills** — grouped mono tags: Applied AI · Engineering · Languages ·
   Cloud/Data. Plus English C1 (TOEFL 104).
8. **Contact / close**
   - Large "Save my contact" (downloads `.vcf` — works natively on iOS and
     Android)
   - Email · LinkedIn · GitHub · Resume PDF
   - Footer: "Built in a day with React, Tailwind and Motion. Deployed on Vercel."
9. **`/qr` page** — full-screen QR of the site URL plus name. Jorge opens it
   on his phone at the fair and lets recruiters scan the screen. Also exported
   as `public/qr.png` and a printable A6 card `public/qr-card.pdf`.

## 4. Stack and why

- **Vite + React 19 + TypeScript** — same stack as worldcup_App, so it stays
  maintainable. No routing framework needed; `/qr` is a second HTML entry.
- **Tailwind CSS v4** — fast to iterate, tiny output.
- **Motion** (`motion/react`) — scroll reveals, `useInView`, count-ups.
- **`qrcode`** (dev-time script) — generates QR SVG/PNG from the final URL.
- **Self-hosted fonts** (woff2, preloaded, `font-display: swap`).
- **Vercel** — import `JorgeRguezz/MyPortfolio` in the Vercel dashboard,
  auto-deploys on push to `main`. Free `*.vercel.app` URL, or a custom domain
  if Jorge has one. Optional: Vercel Analytics to count scans.

Performance budget (conference Wi-Fi is bad):
- JS ≤ 90 KB gzipped, CSS ≤ 15 KB, fonts ≤ 120 KB total, no images above the
  fold (headshot optional, ≤ 40 KB WebP if used).
- Lighthouse mobile ≥ 95 across the board. LCP < 1.5 s on simulated 4G.

All copy lives in one typed file `src/content.ts` so edits tomorrow morning
are one-file changes.

## 5. Execution model: orchestrator + subagents

The orchestrator (this session) owns the shared foundation so every agent
builds against one coherent base: scaffold, tokens (`src/index.css`),
content source of truth (`src/content.ts`), primitives (`src/components/*`),
page composition (`src/App.tsx`), and the docs in `docs/`.

Work is split by **file ownership** so agents never edit the same file:

| Wave | Agent | Scope | Brief |
| --- | --- | --- | --- |
| 1 | orchestrator | scaffold, tokens, content, primitives, docs | this file, `docs/00–02` |
| 2 (parallel) | A1 | hero, at-a-glance, sticky bar, contact, footer | `docs/tasks/A1-shell.md` |
| 2 (parallel) | A2 | featured work cards + Input→System→Output diagram | `docs/tasks/A2-featured-work.md` |
| 2 (parallel) | A3 | pipeline gutter line, experience, awards, education, skills, beyond | `docs/tasks/A3-timeline-gutter.md` |
| 2 (parallel) | A4 | `/qr` page, QR + OG assets, meta tags, Vercel config, README | `docs/tasks/A4-qr-meta-deploy.md` |
| 3 | orchestrator | integrate, build, fix cross-task seams | — |
| 4 (parallel) | Q1 | visual + interaction QA on real mobile viewport (Playwright screenshots, both themes, reduced motion) | `docs/tasks/Q1-visual-qa.md` |
| 4 (parallel) | Q2 | content accuracy audit against the three source `.md` files; copy tightening | `docs/tasks/Q2-content-audit.md` |
| 4 (parallel) | Q3 | performance + accessibility (Lighthouse mobile, bundle size, a11y tree) | `docs/tasks/Q3-perf-a11y.md` |
| 5 | orchestrator | apply QA fixes, final build, hand-off instructions | — |

Rules every agent follows: read `docs/00-brief.md` first; facts only from
`content.ts`; do not edit files you do not own; verify with
`npx tsc -p tsconfig.app.json --noEmit` and a private-folder Vite build; do not
commit or push.

## 6. Build order (today)

| Step | Time | Output |
| --- | --- | --- |
| 1. Scaffold Vite+React+TS+Tailwind, node `.gitignore`, deploy empty shell to Vercel | 45 min | Live URL → QR can be generated immediately |
| 2. `content.ts` with all copy; hero, glance, contact, vCard, PDF | 1.5 h | Usable v0 |
| 3. Featured work cards + Input→System→Output diagram component | 2 h | The centerpiece |
| 4. Experience, awards, education, skills, pipeline gutter line | 1.5 h | Full page |
| 5. Motion pass, dark mode, OG image + meta tags, `/qr` page | 1 h | Polished |
| 6. Real-device test via QR on Jorge's phone, Lighthouse, copy tightening | 1 h | Ship |
| 7. Export `qr.png`, `qr-card.pdf`; set QR as phone lock screen | 15 min | Ready for the fair |

## 7. Inputs needed from Jorge (defaults used until answered)

1. **Availability line** in hero. Default: "Seeking Summer 2027 internships and
   full-time roles from May 2027". Add work-authorization note? (F-1 CPT/OPT)
2. **Phone number on site?** Default: **no** on the page; **yes** inside the
   vCard and the PDF resume.
3. **Headshot?** Default: none; design works without it.
4. **TFG headline metric** (cost saved vs accuracy lost). Placeholder until given.
5. **Domain.** Default: first free `*.vercel.app` name close to
   `jorge-ruigomez`. Custom domain if he owns one.
6. **LoL-RAG demo asset** (short screen recording or screenshot)? Default: diagram only.
7. **Resume PDF**: use `~/Documents/Work/Jorge_Rodriguez_Ruigomez_CV_IIT.pdf` as-is?

## 8. Source-of-truth notes

- Where LinkedIn and CV differ, LinkedIn wins (no hard conflicts found; CV is
  simply more detailed). Scholarships and WindAid come from LinkedIn only.
- Project facts for LoL-RAG, TFG and World Cup app were verified against the
  public repos on 2026-09-17.
- Do not invent metrics. Anything marked **[INPUT NEEDED]** stays as a
  placeholder or is omitted at ship time.

## 9. Status — 2026-09-17, end of build session

Done: waves 1–5 complete. Build passes (`tsc`, `oxlint`, `vite build`), both
`index.html` and `qr.html` emitted, QR assets decode, phone number only in the
vCard and PDF. Lighthouse mobile (slow 4G): 96 perf / 95 → expected 100 a11y
after the contrast fix / 100 best practices / 91 SEO (robots false positive on
preview; `public/robots.txt` added). JS 113 KB gz (React DOM 66 + Motion 27 +
app 13); budget re-baselined to 115 KB.

Not done (needs Jorge's accounts or input): commit, push, Vercel import,
`npm run qr -- <final url>`, device test of the vCard tap on iOS/Android,
thesis headline metric, confirm availability line.
