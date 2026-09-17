import { useEffect, useRef, type ComponentType, type SVGProps } from 'react'
import { contact, person } from '../content'
import { ButtonLink, Reveal, Section } from '../components'
import { ArrowUpRightIcon, DownloadIcon, GitHubIcon, LinkedInIcon, MailIcon } from './contact/icons'
import { setContactReached } from './contact/contactSentinel'

type ContactRow = {
  label: string
  value: string
  href: string
  Icon: ComponentType<SVGProps<SVGSVGElement>>
  external: boolean
}

/** "https://www.linkedin.com/in/x/" → "linkedin.com/in/x" for the mono value column. */
function humanizeUrl(href: string) {
  return href.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '')
}

const rows: ContactRow[] = [
  { label: 'Email', value: person.email, href: `mailto:${person.email}`, Icon: MailIcon, external: false },
  { label: 'LinkedIn', value: humanizeUrl(person.links.linkedin), href: person.links.linkedin, Icon: LinkedInIcon, external: true },
  { label: 'GitHub', value: humanizeUrl(person.links.github), href: person.links.github, Icon: GitHubIcon, external: true },
]

/** The close. Saving the contact is the one obvious action; everything else is quieter. */
export function Contact() {
  const actionsRef = useRef<HTMLDivElement>(null)

  // Tell the sticky bar when the reader has reached this section's own
  // "Save my contact" (row on screen, or already above the viewport), so the
  // bar's duplicate primary button slides away. Same pattern as Hero's sentinel.
  useEffect(() => {
    const el = actionsRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        setContactReached(entry.isIntersecting || entry.boundingClientRect.top < 0)
      }
    })
    io.observe(el)
    return () => {
      io.disconnect()
      setContactReached(false)
    }
  }, [])

  return (
    <Section id="contact" title={contact.title} lead={contact.lead}>
      <Reveal>
        <div ref={actionsRef} className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink variant="primary" size="lg" href={person.links.vcard} className="w-full sm:w-auto">
            <DownloadIcon className="size-[18px]" />
            {contact.saveLabel}
          </ButtonLink>
          <ButtonLink
            variant="secondary"
            size="lg"
            href={person.links.resumePdf}
            target="_blank"
            rel="noopener"
            className="w-full sm:w-auto"
          >
            {contact.resumeLabel}
            <span className="sr-only"> (opens in new tab)</span>
          </ButtonLink>
        </div>
      </Reveal>

      <Reveal delay={0.06}>
        <ul className="mt-10 divide-y divide-line border-y border-line">
          {rows.map(({ label, value, href, Icon, external }) => (
            <li key={label}>
              <a
                href={href}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : null)}
                className="group flex min-h-12 items-center gap-3 py-3 text-fg no-underline"
              >
                <Icon className="size-[18px] shrink-0 text-fg-subtle transition-colors duration-200 group-hover:text-fg" />
                <span className="flex min-w-0 flex-1 flex-col sm:flex-row sm:items-baseline sm:gap-3">
                  <span className="text-sm text-fg-muted">{label}</span>
                  <span className="truncate font-mono text-[0.8125rem] text-fg">{value}</span>
                </span>
                {external ? <span className="sr-only"> (opens in new tab)</span> : null}
                <ArrowUpRightIcon className="size-4 shrink-0 text-fg-subtle transition-colors duration-200 group-hover:text-accent" />
              </a>
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal delay={0.12}>
        <p className="eyebrow mt-8">{person.location}</p>
      </Reveal>
    </Section>
  )
}
