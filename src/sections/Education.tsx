import { Reveal, Section } from '../components'
import { education } from '../content'

/** Degrees, newest first (order as given in content.ts). Empty parts are hidden. */
export function Education() {
  return (
    <Section id="education" title="Education">
      <ol className="divide-y divide-line">
        {education.map((e, i) => {
          const notes: readonly string[] = e.notes
          return (
            <Reveal as="li" key={`${e.school}-${e.degree}`} delay={i * 0.06} className="py-5 first:pt-0">
              <div className="flex items-baseline justify-between gap-4">
                <p className="eyebrow">
                  {e.start} – {e.end}
                </p>
                <p className="eyebrow text-right">{e.location}</p>
              </div>
              <h3 className="mt-2 text-base font-medium text-fg">{e.degree}</h3>
              <p className="text-fg-muted">{e.school}</p>
              {e.focus ? <p className="mt-1 text-sm text-fg-subtle">Focus: {e.focus}</p> : null}
              {notes.length > 0 ? (
                <ul className="mt-2 space-y-1 font-mono text-xs text-fg-subtle">
                  {notes.map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
              ) : null}
            </Reveal>
          )
        })}
      </ol>
    </Section>
  )
}
