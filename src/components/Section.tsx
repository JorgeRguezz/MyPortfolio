import type { ReactNode } from 'react'
import { sections, type SectionId } from '../content'
import { Reveal } from './Reveal'

type SectionProps = {
  id: SectionId
  /** Optional big serif title. Omit for sections that render their own heading. */
  title?: ReactNode
  /** Optional one-line lead under the title. */
  lead?: ReactNode
  children: ReactNode
  className?: string
}

/**
 * Standard section wrapper. Renders:
 *  - a pipeline node marker (`.pipeline-node`) centered on the gutter line
 *  - the mono eyebrow "01 · At a glance"
 *  - optional serif title + lead
 *
 * The node marker is a plain element with `data-section={id}`; the PipelineGutter
 * component (task A3) observes these and lights them up. Do not restyle it here.
 */
export function Section({ id, title, lead, children, className = '' }: SectionProps) {
  const meta = sections.find((s) => s.id === id)

  return (
    <section id={id} className={`relative py-12 sm:py-20 ${className}`} aria-labelledby={`${id}-title`}>
      <span
        aria-hidden
        data-section={id}
        className="pipeline-node absolute top-[calc(3rem+0.35rem)] sm:top-[calc(5rem+0.35rem)] block size-2 rounded-full bg-line-strong"
        style={{ left: 'calc(var(--line-x) - var(--gutter) - var(--page-pad) - 0.25rem)' }}
      />
      <Reveal>
        <p className="eyebrow" id={`${id}-eyebrow`}>
          {meta ? `${meta.index} · ${meta.label}` : ''}
        </p>
        {title ? (
          <h2 id={`${id}-title`} className="display-lg mt-3">
            {title}
          </h2>
        ) : (
          <h2 id={`${id}-title`} className="sr-only">
            {meta?.label}
          </h2>
        )}
        {lead ? <p className="mt-3 max-w-prose text-fg-muted">{lead}</p> : null}
      </Reveal>
      <div className="mt-8">{children}</div>
    </section>
  )
}
