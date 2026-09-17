import { Reveal, Section } from '../components'
import { beyond } from '../content'

/**
 * The one human moment. Title comes verbatim from content.ts; its last word is
 * set in serif italic (the single italic allowed in this section).
 */
export function Beyond() {
  const words = beyond.title.split(' ')
  const last = words.pop()
  const title = (
    <>
      {words.join(' ')} <em>{last}</em>
    </>
  )

  return (
    <Section id="beyond" title={title}>
      <ul className="divide-y divide-line">
        {beyond.items.map((item, i) => (
          <Reveal as="li" key={item.label} delay={i * 0.06} className="py-5 first:pt-0">
            <p className="eyebrow">{item.when}</p>
            <p className="mt-2 font-medium text-fg">{item.label}</p>
            <p className="mt-1 text-sm text-fg-muted">{item.detail}</p>
          </Reveal>
        ))}
      </ul>
    </Section>
  )
}
