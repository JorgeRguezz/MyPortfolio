import { footer, person } from '../content'
import { ButtonLink, Reveal } from '../components'
import { ArrowUpRightIcon } from './contact/icons'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <Reveal as="footer" className="border-t border-line py-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-fg-subtle">{footer.line}</p>
        {/* min-h-11 = 44px tap target; -my-2.5 keeps the visual rhythm of a 24px text link. */}
        <ButtonLink
          variant="ghost"
          href={footer.sourceHref}
          target="_blank"
          rel="noopener noreferrer"
          className="-my-2.5 min-h-11 self-start sm:self-auto"
        >
          Source
          <span className="sr-only"> (opens in new tab)</span>
          <ArrowUpRightIcon className="size-4" />
        </ButtonLink>
      </div>
      <p className="mt-6 text-xs text-fg-subtle">
        © {year} {person.name}
      </p>
    </Reveal>
  )
}
