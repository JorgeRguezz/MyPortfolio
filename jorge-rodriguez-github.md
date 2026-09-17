---
document_type: developer_profile
subject: Jorge Rodríguez
github_handle: JorgeRguezz
profile_url: https://github.com/JorgeRguezz
source_access: Public GitHub profile and repository documentation; accessed 2026-09-17
confidence: mixed
notes: >-
  This is a normalized context file for AI agents. It only summarizes public,
  visible information. Treat repository-specific README files as the source of
  truth when working in a repository.
---

# Jorge Rodríguez — GitHub context

## Identity and focus

- **GitHub:** [@JorgeRguezz](https://github.com/JorgeRguezz)
- **Public profile tagline:** AI Student Researcher at UPM-GATV
- **Visible public footprint:** 10 repositories, 6 starred repositories
- **Primary technical themes:** multimodal AI, video understanding, retrieval-
  augmented generation (RAG), computer vision, knowledge graphs, and applied
  machine learning.

## Agent working assumptions

- Jorge works on experimental and research-oriented AI systems, particularly
  systems that combine vision/video, language models, retrieval, and structured
  knowledge.
- Prefer grounded, modular pipelines with clear intermediate artifacts,
  validation/sanitization, and offline evaluation.
- For code changes, preserve research reproducibility: avoid treating generated
  caches, models, or virtual environments as source-of-truth code.
- Check the target repository’s README and deployment notes before assuming a
  runtime or dependency setup.

## Notable repositories

### [Multimodal-video-analysis-agent](https://github.com/JorgeRguezz/Multimodal-video-analysis-agent)

**Purpose:** Research and implementation workspace for multi-agent video
analysis. The active system is **Multimodal LoL-RAG**, which converts League of
Legends gameplay videos into sanitized multimodal knowledge artifacts and
answers questions with grounded evidence.

**Architecture:**

```text
video queue
  → multimodal extraction
  → pre-build sanitization
  → vector + graph knowledge build
  → post-build sanitization
  → retrieval / reranking / answer generation
  → FastAPI service + Next.js chat UI
```

**Key capabilities:**

- Video segmentation, frame sampling, champion/entity matching, ASR, VLM frame
  descriptions, and segment summaries.
- Sanitization that removes prompt/meta contamination, normalizes entities,
  validates structures, quarantines invalid artifacts, and creates reports.
- Hybrid retrieval over sanitized vector, graph, and visual artifacts;
  inference is deliberately limited to sanitized caches.
- FastAPI `/chat` service and a Next.js chat frontend.
- Offline evaluation using QA datasets and metrics including ROUGE, BERTScore,
  and RAGAS-based judgments.

**Important implementation signals:**

- GPU/CUDA is expected for practical throughput.
- Model stacks have dependency conflicts; the project uses multiple isolated
  environments.
- The pipeline is organized into `knowledge_extraction`,
  `knowledge_sanitization`, `knowledge_build`, `knowledge_inference`,
  `knowledge_api_server`, `knowledge_frontend`, and
  `knowledge_system_evaluation`.
- `knowledge_pipeline/README.md` is the most useful system-specific starting
  point; deployment notes live under `knowledge_pipeline/deploy/`.

### [Multimodal-LoL-RAG](https://github.com/JorgeRguezz/Multimodal-LoL-RAG)

- Public Python repository.
- Related to the multimodal League of Legends RAG work. Consult its repository
  documentation for its exact current scope before modifying it.

### [ComputerVisionTennisProject](https://github.com/JorgeRguezz/ComputerVisionTennisProject)

- Described as Jorge’s first substantial computer-vision project.
- Objective: derive tennis-match statistics from object detection in tennis
  video.
- Signals interest in video analytics and applying object detection to real
  footage.

### [TFG-limpio](https://github.com/JorgeRguezz/TFG-limpio)

- Organized code repository for Jorge’s undergraduate final-degree project
  (Spanish: *Trabajo Fin de Grado*).
- Main language visible publicly: Jupyter Notebook.
- Has at least one fork; consult the repository itself for technical scope.

### [IdC-Project-ISST](https://github.com/JorgeRguezz/IdC-Project-ISST)

- TypeScript course project for ISST in the fourth year of telecommunications
  engineering.

### [HSIL-Harvard-Hackathon-CareNest](https://github.com/kayser17/HSIL-Harvard-Hackathon-CareNest)

- Public Python project listed as a contribution/pin under `kayser17`.
- Hackathon collaboration; do not assume primary ownership without checking
  commit history and repository documentation.

## Technical profile inferred from public work

### Strongly evidenced

- Python and Jupyter Notebook development
- TypeScript exposure
- Computer vision and video understanding
- Multimodal AI systems (vision + ASR + language models)
- RAG, vector indexing, knowledge graphs, and entity/relation extraction
- FastAPI backends and Next.js frontends
- Evaluation-driven AI development
- GPU-aware local experimentation and model-inference tooling

### Preferred engineering patterns visible in the main video-analysis project

- Explicit pipeline phases and artifact contracts
- Data validation and sanitization before retrieval/inference
- Componentized services and queue-oriented orchestration
- Debug/confidence payloads for inference
- Evaluation datasets and metric comparisons

## Guardrails for agents

- Do not commit large generated caches, downloaded models, `node_modules`, or
  virtual environments unless explicitly requested.
- Preserve the separation between experimental playground code and the active
  pipeline.
- In the video-analysis system, do not bypass the sanitization stages or make
  inference consume unsanitized artifacts.
- Verify model, environment, and GPU requirements from the target repository’s
  current docs before running heavyweight jobs.

## Data gaps / do not assume

- The public profile does not expose a comprehensive skills list, employment
  history, location, or contact details.
- Repository count and social metrics may change.
- Readmes, branches, and the active project focus can change; use this file as
  orientation, not a replacement for repository documentation.
