import { ButtonLink, Reveal, Section, TagList } from '../components'
import { featuredProjects, otherProjects, type Project } from '../content'
import { PipelineDiagram } from './pipeline/PipelineDiagram'
import { glueSeparators } from './text'

function ArrowUpRight({ className = '' }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      width="16"
      height="16"
      fill="none"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 stroke-current ${className}`}
    >
      <path d="M4.5 11.5 11.5 4.5M5.5 4.5h6v6" />
    </svg>
  )
}

function ProjectCard({ project }: { project: Project }) {
  const headingId = `${project.id}-name`
  // CONTENT REQUEST: `metric` is undefined for every project (llm-router has a TODO in content.ts).
  // The large-number path below renders as soon as { value, label } is filled in.
  return (
    <Reveal as="article" className="rounded-2xl border border-line bg-bg-elevated p-5 sm:p-6" aria-labelledby={headingId}>
      <p className="eyebrow">{glueSeparators(project.context)}</p>
      <h3 id={headingId} className="display-md mt-2">
        {project.name}
      </h3>
      <p className="mt-2 text-fg-muted">{project.hook}</p>

      <PipelineDiagram id={project.id} input={project.input} system={project.system} output={project.output} />

      <p className="mt-6 text-sm text-fg-muted">{project.outcome}</p>

      {project.metric ? (
        <p className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="display-md font-display">{project.metric.value}</span>
          <span className="eyebrow">{project.metric.label}</span>
        </p>
      ) : null}

      <TagList items={project.stack} className="mt-5" />

      <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
        {project.links.map((link) => (
          <li key={link.href}>
            {/* Ghost links are 24px tall; min-h-11 gives a 44px tap target and the negative
                margin cancels the extra height so the card rhythm is unchanged. */}
            <ButtonLink variant="ghost" href={link.href} target="_blank" rel="noopener noreferrer" className="-my-2.5 min-h-11">
              {link.label}
              {/* a11y: three cards each have a "Code" link; name the project and announce the new tab. */}
              <span className="sr-only">
                , {project.name} (opens in new tab)
              </span>
              <ArrowUpRight />
            </ButtonLink>
          </li>
        ))}
      </ul>
    </Reveal>
  )
}

function AlsoBuilt() {
  return (
    <Reveal className="mt-14">
      <h3 className="eyebrow">Also built</h3>
      <ul className="mt-3 divide-y divide-line">
        {otherProjects.map((project) => {
          const body = (
            <span className="min-w-0">
              <span className="block font-medium text-fg transition-colors duration-200 group-hover:text-accent">
                {project.name}
              </span>
              <span className="mt-0.5 block text-sm text-fg-muted">{project.detail}</span>
            </span>
          )
          return (
            <li key={project.name}>
              {project.href ? (
                <a
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex min-h-11 items-start justify-between gap-4 py-3 no-underline"
                >
                  {body}
                  <span className="sr-only"> (opens in new tab)</span>
                  <ArrowUpRight className="mt-1 text-fg-subtle transition-colors duration-200 group-hover:text-accent" />
                </a>
              ) : (
                <div className="flex min-h-11 items-start py-3">{body}</div>
              )}
            </li>
          )
        })}
      </ul>
    </Reveal>
  )
}

export function FeaturedWork() {
  return (
    <Section
      id="work"
      title={
        <>
          Featured <em>work</em>
        </>
      }
      lead="Four systems, each told the same way: what went in, what I built, what came out."
    >
      <div className="space-y-10">
        {featuredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
      <AlsoBuilt />
    </Section>
  )
}
