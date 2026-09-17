import { contact, person } from '../content'
import { ButtonLink } from '../components'
import { useHeroScrolledOut } from './hero/heroSentinel'
import { useContactReached } from './contact/contactSentinel'
import { DownloadIcon } from './contact/icons'

/**
 * Fixed top bar that appears once the hero's actions row has scrolled out of
 * view (state comes from `hero/heroSentinel`) and hides again once the reader
 * reaches the Contact section's own actions (`contact/contactSentinel`), so
 * there is never more than one primary "Save my contact" on screen. While
 * hidden it is translated off-screen, transparent, non-interactive
 * (`pointer-events-none`) and `inert`, so it can neither block taps nor catch
 * keyboard focus.
 *
 * The 200ms slide uses a CSS transition; index.css collapses transitions under
 * prefers-reduced-motion, so no extra handling is needed here.
 */
export function StickyBar() {
  // Both hooks must run on every render (no short-circuit) to keep the hook order stable.
  const heroScrolledOut = useHeroScrolledOut()
  const contactReached = useContactReached()
  const visible = heroScrolledOut && !contactReached

  return (
    <div
      inert={!visible}
      aria-hidden={!visible}
      className={`fixed inset-x-0 top-0 z-40 h-14 border-b border-line bg-bg/85 backdrop-blur transition-[transform,opacity] duration-200 ease-[var(--ease-out)] ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-full opacity-0'
      }`}
    >
      <div
        className="mx-auto flex h-full items-center justify-between gap-4"
        style={{ maxWidth: 'var(--page-max)', paddingLeft: 'var(--page-pad)', paddingRight: 'var(--page-pad)' }}
      >
        {/* h-11 = 44px tap target (the text alone was 28px tall). Truncation lives on the inner span. */}
        <a href="#hero" className="flex h-11 min-w-0 items-center font-display text-lg text-fg no-underline">
          <span className="truncate">{person.shortName}</span>
        </a>
        <ButtonLink variant="primary" size="md" href={person.links.vcard} className="shrink-0">
          <DownloadIcon className="size-4" />
          {contact.saveLabel}
        </ButtonLink>
      </div>
    </div>
  )
}
