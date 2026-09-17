import { useEffect, useRef } from 'react'
import { m, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { contact, person } from '../content'
import { ButtonLink, Reveal, Tag } from '../components'
import { setHeroScrolledOut } from './hero/heroSentinel'

const STAGGER = 0.06

/**
 * First screen. Everything a recruiter needs without scrolling on a 390×844
 * phone: role, name, hook, where/now, availability, two actions, intro.
 *
 * Layout: a flex column with `justify-between` so the top block sits under the
 * sticky-bar offset, the actions land in the thumb zone and the scroll cue
 * hugs the bottom edge of the first viewport.
 */
export function Hero() {
  const sentinelRef = useRef<HTMLDivElement>(null)

  // Report to the sticky bar when the actions row has scrolled *above* the
  // viewport. IntersectionObserver reports real geometry on its first callback,
  // so there is no false "scrolled out" frame on load, and the extra
  // `top < 0` check ignores the sentinel being below the fold on short screens.
  useEffect(() => {
    const el = sentinelRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        setHeroScrolledOut(!entry.isIntersecting && entry.boundingClientRect.top < 0)
      }
    })
    io.observe(el)
    return () => {
      io.disconnect()
      setHeroScrolledOut(false)
    }
  }, [])

  // One availability string, but at 375px a 55-character mono pill would wrap
  // inside its rounded ends. Split on the content's own " · " separator so each
  // clause is its own chip; the copy is unchanged.
  const availabilityChips = person.availability
    .split(' · ')
    .map((s) => s.trim())
    .filter(Boolean)

  return (
    <header
      id="hero"
      aria-labelledby="hero-title"
      className="relative flex min-h-[calc(100dvh-4rem)] flex-col pt-16 pb-5 sm:pt-20"
    >
      {/* Pipeline origin. Same markup and position as Section's node marker. */}
      <span
        aria-hidden
        data-section="hero"
        className="pipeline-node absolute top-[calc(4rem+0.35rem)] sm:top-[calc(5rem+0.35rem)] block size-2 rounded-full bg-line-strong"
        style={{ left: 'calc(var(--line-x) - var(--gutter) - var(--page-pad) - 0.25rem)' }}
      />

      <div>
        <Reveal>
          <p className="eyebrow">{person.roleLine}</p>
        </Reveal>

        <Reveal delay={STAGGER * 1}>
          <h1 id="hero-title" className="display-xl mt-4">
            {person.name}
          </h1>
        </Reveal>

        <Reveal delay={STAGGER * 2}>
          <p className="display-md mt-5 font-display text-fg-muted">{person.headline}</p>
        </Reveal>

        <Reveal delay={STAGGER * 3}>
          <p className="mt-5 font-mono text-xs leading-relaxed text-fg-subtle">{person.nowLine}</p>
        </Reveal>

        {availabilityChips.length > 0 ? (
          <Reveal delay={STAGGER * 4} className="mt-3 flex flex-wrap gap-1.5">
            {availabilityChips.map((chip) => (
              <Tag key={chip} tone="accent">
                {chip}
              </Tag>
            ))}
          </Reveal>
        ) : null}
      </div>

      <div className="mt-10">
        <Reveal delay={STAGGER * 5}>
          <div className="flex flex-wrap items-center gap-3">
            <ButtonLink variant="primary" size="md" href={person.links.vcard}>
              {contact.saveLabel}
            </ButtonLink>
            <ButtonLink variant="secondary" size="md" href={person.links.resumePdf} target="_blank" rel="noopener">
              {contact.resumeLabel}
              <span className="sr-only"> (opens in new tab)</span>
            </ButtonLink>
          </div>
        </Reveal>

        {/* Sticky-bar trigger. Invisible; sits right under the actions. */}
        <div ref={sentinelRef} data-hero-sentinel aria-hidden className="h-px w-px" />

        <Reveal delay={STAGGER * 6}>
          <p className="mt-8 max-w-prose text-[0.9375rem] text-fg-muted">{person.intro}</p>
        </Reveal>
      </div>

      <ScrollCue />
    </header>
  )
}

/**
 * 1px × 40px line with a mono "scroll" label. Fades out over the first 40px of
 * scroll; static (always visible) under reduced motion.
 */
function ScrollCue() {
  const reduce = useReducedMotion()
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 40], [1, 0])

  return (
    <m.div
      aria-hidden
      className="pointer-events-none mt-auto flex flex-col items-start gap-2 pt-10"
      style={reduce ? undefined : { opacity }}
    >
      <span className="block h-10 w-px bg-line-strong" />
      <span className="eyebrow">scroll</span>
    </m.div>
  )
}
