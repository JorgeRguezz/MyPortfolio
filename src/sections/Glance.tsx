import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'motion/react'
import { glance } from '../content'
import { Reveal, Section } from '../components'
import { glueSeparators } from './text'

const COUNT_UP_MS = 900
/** Ease-out cubic: fast start, settles gently on the final digit. */
const easeOut = (t: number) => 1 - (1 - t) ** 3

/** 2×2 grid of numbers. Eyebrow only, no title. */
export function Glance() {
  return (
    <Section id="glance">
      <ul className="grid grid-cols-2 gap-3">
        {glance.map((tile, i) => (
          <Reveal as="li" key={tile.label} delay={i * 0.06} className="rounded-2xl border border-line bg-bg-elevated p-4">
            <GlanceTile {...tile} />
          </Reveal>
        ))}
      </ul>
    </Section>
  )
}

type GlanceTileProps = (typeof glance)[number]

/**
 * One tile. The number counts 0 → `value` over 900ms the first time the tile
 * enters view, then swaps to `display` (e.g. "10/10", "100+"). Reduced motion
 * renders `display` straight away. Screen readers only ever get `display`.
 *
 * The count-up is a plain requestAnimationFrame loop rather than motion's
 * `animate()`: it is ~4 KB gzipped lighter and this is the only place that
 * would have used it.
 */
function GlanceTile({ value, display, label, detail }: GlanceTileProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' })
  const reduce = useReducedMotion() === true
  const [count, setCount] = useState(0)
  const [settled, setSettled] = useState(false)

  useEffect(() => {
    if (!inView || reduce) return
    let frame = 0
    let start: number | undefined
    const tick = (now: number) => {
      start ??= now
      const t = Math.min((now - start) / COUNT_UP_MS, 1)
      setCount(Math.round(easeOut(t) * value))
      if (t < 1) {
        frame = requestAnimationFrame(tick)
      } else {
        setSettled(true)
      }
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, reduce, value])

  const shown = settled || reduce ? display : String(count)

  return (
    <div ref={ref}>
      <p className="display-md font-display tabular-nums text-fg">
        <span aria-hidden>{shown}</span>
        <span className="sr-only">{display}</span>
      </p>
      <p className="mt-1 text-sm text-fg">{label}</p>
      <p className="mt-0.5 text-xs leading-relaxed text-fg-subtle">{glueSeparators(detail)}</p>
    </div>
  )
}
