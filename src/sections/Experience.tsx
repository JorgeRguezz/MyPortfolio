import { Reveal, Section, TagList } from '../components'
import { experience } from '../content'
import { glueSeparators } from './text'

/** Résumé-style list of roles. Facts come only from content.ts. */
export function Experience() {
  return (
    <Section id="experience" title="Experience">
      <ol className="divide-y divide-line">
        {experience.map((item, i) => (
          <Reveal as="li" key={`${item.org}-${item.role}`} delay={i * 0.06} className="py-6 first:pt-0">
            <div className="flex items-baseline justify-between gap-4">
              <p className="eyebrow">
                {item.start} – {item.end}
              </p>
              <p className="eyebrow text-right">{item.location}</p>
            </div>
            <h3 className="mt-2 text-base font-medium text-fg">{item.role}</h3>
            {/*
              Mobile: org and detail on their own lines (no separator), because at 360–390px
              "org · detail" always wraps and left a lone "·" at the start of line two.
              sm+: one line with a mono dot between them; the dot is glued to the org.
            */}
            <p className="flex flex-col text-fg-muted sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-2">
              <span>{item.org}</span>
              {item.orgDetail ? (
                <span className="text-sm text-fg-subtle">
                  <span aria-hidden className="hidden font-mono sm:inline">
                    ·&nbsp;
                  </span>
                  {glueSeparators(item.orgDetail)}
                </span>
              ) : null}
            </p>
            <ul className="mt-3 list-disc space-y-1.5 pl-4 text-sm text-fg-muted">
              {item.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            {item.tags && item.tags.length > 0 ? <TagList items={item.tags} className="mt-3" /> : null}
          </Reveal>
        ))}
      </ol>
    </Section>
  )
}
