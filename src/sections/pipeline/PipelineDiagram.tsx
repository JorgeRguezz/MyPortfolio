import { useInView, useReducedMotion } from 'motion/react'
import { useRef } from 'react'
import type { PipelineStep } from '../../content'
import { PipelineRow } from './PipelineRow'
import { nodeDelay } from './sequence'

type PipelineDiagramProps = {
  input: PipelineStep
  system: PipelineStep[]
  output: PipelineStep
  /** Project id; namespaces the DOM id. */
  id: string
}

/**
 * Input → System → Output, drawn as a vertical rail with nodes on it. The
 * system steps live inside a hairline box whose left wall *is* the rail, so the
 * three stages read as "pipe in → component → pipe out".
 *
 * Sequencing: when the diagram enters view (once), a single `active` flag flips
 * and every node / rail segment transitions with its own CSS delay (see
 * sequence.ts). Under prefers-reduced-motion the flag is true from the first
 * render and delays are dropped, so the finished diagram is painted immediately.
 */
export function PipelineDiagram({ input, system, output, id }: PipelineDiagramProps) {
  const ref = useRef<HTMLOListElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' })
  const reduce = useReducedMotion() === true
  const active = reduce || inView
  const delayFor = (index: number) => (reduce ? null : nodeDelay(index))
  const last = system.length - 1

  return (
    <ol ref={ref} id={`${id}-pipeline`} aria-label="Input, system, output" className="relative mt-6">
      <PipelineRow kind="input" eyebrow="Input" step={input} active={active} delay={delayFor(0)} segment="to-system" />

      {/* System stage. Paddings here are mirrored by SEGMENT_REACH in PipelineRow. */}
      <li className="relative mb-4 pt-5 pb-4">
        <span aria-hidden className="pointer-events-none absolute inset-y-0 left-[5px] right-0 rounded-r-xl border border-l-0 border-line" />
        <span className="eyebrow absolute -top-2.5 left-5 bg-bg-elevated px-1 leading-5">System</span>
        <ol>
          {system.map((step, i) => (
            <PipelineRow
              key={step.label}
              kind="step"
              step={step}
              active={active}
              delay={delayFor(i + 1)}
              segment={i === last ? 'to-output' : 'to-step'}
            />
          ))}
        </ol>
      </li>

      <PipelineRow
        kind="output"
        eyebrow="Output"
        step={output}
        active={active}
        delay={delayFor(system.length + 1)}
        segment="none"
      />
    </ol>
  )
}
