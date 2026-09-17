import { Reveal, Section, TagList } from '../components'
import { skills } from '../content'

/** Grouped skill tags. No bars, no icons. */
export function Skills() {
  return (
    <Section id="skills" title="Skills">
      <div className="space-y-6">
        {skills.map((g, i) => (
          <Reveal key={g.group} delay={i * 0.06}>
            <h3 className="eyebrow">{g.group}</h3>
            <TagList items={g.items} className="mt-2" />
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
