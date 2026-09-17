import type { PipelineStep } from '../../content'
import { NODE_MS, STEP_MS } from './sequence'

/*
 * Geometry (all px). Every row is a positioned box with the node column on the
 * left and text at pl-6. The first line of text in every row is `leading-5`
 * (20px), and the node is centred on that line, so the node centre is always
 * 10px below the row's top edge (NODE_Y). That constant is what lets a rail
 * segment reach the *next* node with pure CSS: it starts at NODE_Y and extends
 * past the row's bottom edge by exactly the distance to the next node centre.
 *
 *   to-step    next step row starts right after this one          → 10
 *   to-system  the System box has pt-5 (20) before its first row   → 20 + 10
 *   to-output  last step: System box pb-4 (16) + mb-4 (16)         → 16 + 16 + 10
 *
 * If you change the box paddings in PipelineDiagram, update these.
 */
const SEGMENT_REACH = {
  'to-step': '-bottom-2.5',
  'to-system': '-bottom-[30px]',
  'to-output': '-bottom-[42px]',
} as const

export type SegmentKind = keyof typeof SEGMENT_REACH | 'none'

type PipelineRowProps = {
  kind: 'input' | 'step' | 'output'
  step: PipelineStep
  /** "Input" / "Output" stage eyebrow. Steps sit under the shared "System" legend instead. */
  eyebrow?: string
  /** Whether the sequence has run (or is running). */
  active: boolean
  /** ms after the sequence starts; `null` = render final state with no delays (reduced motion). */
  delay: number | null
  /** Which rail segment leaves this node, if any. */
  segment: SegmentKind
}

const NODE_TRANSITION = 'transition-colors ease-[var(--ease-out)]'
const NODE_HALO = 'ring-2 ring-bg-elevated'

/**
 * One node on the rail plus its text. Only the node and the rail segment change
 * state; text is static so the diagram stays readable while it runs.
 */
export function PipelineRow({ kind, step, eyebrow, active, delay, segment }: PipelineRowProps) {
  // Durations come from sequence.ts; the global reduced-motion rule in index.css overrides them to ~0.
  const nodeStyle = delay === null ? undefined : { transitionDuration: `${NODE_MS}ms`, transitionDelay: `${delay}ms` }
  const railStyle = delay === null ? undefined : { transitionDuration: `${STEP_MS}ms`, transitionDelay: `${delay}ms` }

  const rowPad = kind === 'input' ? 'pb-4' : kind === 'step' ? 'pb-3 pr-3 last:pb-0' : ''

  return (
    <li className={`relative min-h-10 pl-6 ${rowPad}`}>
      {/* Node. Input is a hollow fg circle and stays put; steps and output take the accent. */}
      {kind === 'input' ? (
        <span aria-hidden className="absolute top-[5px] left-0 size-2.5 rounded-full border-2 border-fg bg-bg-elevated" />
      ) : kind === 'step' ? (
        <span
          aria-hidden
          className={`absolute top-[7px] left-[2px] size-1.5 rounded-full ${NODE_HALO} ${NODE_TRANSITION} ${
            active ? 'bg-accent' : 'bg-line-strong'
          }`}
          style={nodeStyle}
        />
      ) : (
        <span
          aria-hidden
          className={`absolute top-[5px] left-0 size-2.5 rounded-full ${NODE_HALO} ${NODE_TRANSITION} ${
            active ? 'bg-accent' : 'bg-fg'
          }`}
          style={nodeStyle}
        />
      )}

      {/* Rail segment from this node to the next: quiet hairline track, accent fill scaling from the top. */}
      {segment !== 'none' ? (
        <span aria-hidden className={`absolute top-2.5 left-[4px] w-0.5 bg-line ${SEGMENT_REACH[segment]}`}>
          <span
            className={`absolute inset-0 origin-top bg-accent transition-transform ease-linear ${
              active ? 'scale-y-100' : 'scale-y-0'
            }`}
            style={railStyle}
          />
        </span>
      ) : null}

      <div className="min-w-0">
        {eyebrow ? <p className="eyebrow leading-5">{eyebrow}</p> : null}
        {kind === 'step' ? (
          <p className="font-mono text-xs leading-5 tracking-wide text-fg uppercase">{step.label}</p>
        ) : (
          <p className="text-sm leading-5 font-medium text-fg">{step.label}</p>
        )}
        <p className="mt-0.5 text-sm text-fg-muted">{step.detail}</p>
      </div>
    </li>
  )
}
