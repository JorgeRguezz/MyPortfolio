import { Reveal, Section } from '../components'
import { awards } from '../content'

/** Two hackathon podiums as quiet cards. */
export function Awards() {
  return (
    <Section id="awards" title="Awards">
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {awards.map((a, i) => (
          <Reveal as="li" key={`${a.event}-${a.title}`} delay={i * 0.06} className="rounded-2xl border border-line bg-bg-elevated p-5">
            <p className="eyebrow">{a.date}</p>
            <h3 className="display-md mt-2 text-fg">{a.title}</h3>
            <p className="mt-1 text-sm font-medium text-fg">{a.event}</p>
            <p className="mt-2 text-sm text-fg-muted">{a.detail}</p>
          </Reveal>
        ))}
      </ul>
    </Section>
  )
}
