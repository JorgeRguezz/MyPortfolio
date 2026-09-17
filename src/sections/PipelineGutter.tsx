import { useEffect, useRef, useState } from 'react'
import { m, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from 'motion/react'

/**
 * The page-wide pipeline line in the left gutter.
 *
 * Rendered as the first child of <main> (which is `relative`). It draws:
 *  - a hairline from the first `.pipeline-node` marker (hero) to the last one
 *    (contact), never into the top padding or the footer;
 *  - an accent fill on top of it whose scaleY tracks scroll progress;
 * and it lights up the `.pipeline-node` markers that `Section` (and the hero)
 * render, by setting `data-active` / inline colors from JS. It owns no marker
 * markup; it only observes whatever markers exist in the DOM.
 *
 * Geometry is measured after mount and re-measured on resize, when <main>
 * changes size (fonts loading, sections mounting), when markers are added or
 * removed (MutationObserver) and after `document.fonts.ready`.
 */

type Geometry = {
  /** Line top, relative to <main>'s padding box. */
  top: number
  /** Line height in px. */
  height: number
  /** Line top in document coordinates (for scroll math). */
  docTop: number
  /** Marker centers in document coordinates, in DOM order. */
  centers: number[]
}

const NODE_SELECTOR = '.pipeline-node'
/** A node counts as "active" while it crosses the upper-middle band of the viewport. */
const ACTIVE_ROOT_MARGIN = '-40% 0px -50% 0px'
/** The scroll probe: the fill reaches, and a node lights up at, the middle of the viewport. */
const PROBE = 0.5
const NODE_TRANSITION = 'background-color 250ms var(--ease-out), transform 250ms var(--ease-out)'

function clamp01(n: number) {
  return n < 0 ? 0 : n > 1 ? 1 : n
}

/** Document y of the probe line for a given scroll position. */
function probeY(scrollY: number) {
  return scrollY + window.innerHeight * PROBE
}

function computeProgress(scrollY: number, geom: Geometry | null) {
  if (!geom || geom.height <= 0) return 0
  let probe = probeY(scrollY)
  // If the page cannot scroll far enough for the probe to reach the last node,
  // stretch the last stretch so the line still completes at the very bottom.
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight
  const lineBottom = geom.docTop + geom.height
  const probeAtEnd = probeY(maxScroll)
  if (maxScroll > 0 && probeAtEnd < lineBottom) {
    probe += (lineBottom - probeAtEnd) * clamp01(scrollY / maxScroll)
  }
  return clamp01((probe - geom.docTop) / geom.height)
}

/** Index of the last marker whose center is at or above the probe line; -1 if none. */
function activeFromScroll(scrollY: number, geom: Geometry | null) {
  if (!geom) return -1
  const probe = probeY(scrollY)
  let active = -1
  for (let i = 0; i < geom.centers.length; i++) {
    if (geom.centers[i] <= probe) active = i
  }
  return active
}

export function PipelineGutter() {
  const rootRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  const [geom, setGeom] = useState<Geometry | null>(null)
  const geomRef = useRef<Geometry | null>(null)
  const activeRef = useRef(-1)
  const nodesRef = useRef<HTMLElement[]>([])

  const { scrollY } = useScroll()
  const progress = useMotionValue(0)
  const spring = useSpring(progress, { stiffness: 120, damping: 30 })
  const scaleY = reduce ? progress : spring

  /** Paint node states: past + active are accent, active is scaled, future is line-strong. */
  const paint = (active: number) => {
    if (active === activeRef.current) return
    activeRef.current = active
    nodesRef.current.forEach((el, i) => {
      const lit = i <= active
      const isActive = i === active
      el.style.backgroundColor = lit ? 'var(--c-accent)' : 'var(--c-line-strong)'
      el.style.transform = isActive ? 'scale(1.4)' : 'scale(1)'
      if (isActive) el.setAttribute('data-active', 'true')
      else el.removeAttribute('data-active')
      if (lit && !isActive) el.setAttribute('data-past', 'true')
      else el.removeAttribute('data-past')
    })
  }

  useMotionValueEvent(scrollY, 'change', (y) => {
    progress.set(computeProgress(y, geomRef.current))
    paint(activeFromScroll(y, geomRef.current))
  })

  useEffect(() => {
    const root = rootRef.current
    const main = root?.parentElement
    if (!root || !main) return

    let io: IntersectionObserver | null = null
    let frame = 0
    let firstMeasure = true
    const timers: number[] = []
    /** Per-node position relative to the IO band, kept between IO callbacks. */
    let bands: ('above' | 'in' | 'below')[] = []

    const measure = () => {
      frame = 0
      const nodes = nodesRef.current
      if (nodes.length === 0) {
        geomRef.current = null
        setGeom(null)
        return
      }
      const mainRect = main.getBoundingClientRect()
      const pageY = window.scrollY
      const relCenters = nodes.map((n) => {
        const r = n.getBoundingClientRect()
        return r.top + r.height / 2 - mainRect.top
      })
      const top = relCenters[0]
      const bottom = relCenters[relCenters.length - 1]
      const next: Geometry = {
        top,
        height: Math.max(bottom - top, 0),
        docTop: mainRect.top + pageY + top,
        centers: relCenters.map((c) => mainRect.top + pageY + c),
      }
      const prev = geomRef.current
      geomRef.current = next
      if (!prev || Math.abs(prev.top - next.top) > 0.5 || Math.abs(prev.height - next.height) > 0.5) {
        setGeom(next)
      }
      const p = computeProgress(pageY, next)
      progress.set(p)
      if (firstMeasure) {
        // Do not animate the fill from 0 on a reload that restores scroll position.
        spring.jump(p)
        firstMeasure = false
      }
      paint(activeFromScroll(pageY, next))
    }

    const schedule = () => {
      if (frame) return
      frame = requestAnimationFrame(measure)
    }

    const onIntersect: IntersectionObserverCallback = (entries) => {
      const nodes = nodesRef.current
      for (const entry of entries) {
        const i = nodes.indexOf(entry.target as HTMLElement)
        if (i < 0) continue
        const bandTop = entry.rootBounds?.top ?? window.innerHeight * 0.4
        bands[i] = entry.isIntersecting ? 'in' : entry.boundingClientRect.top < bandTop ? 'above' : 'below'
      }
      let active = -1
      for (let i = 0; i < bands.length; i++) {
        if (bands[i] && bands[i] !== 'below') active = i
      }
      paint(active)
      // A node crossing the band is also a good moment to refresh cached geometry.
      schedule()
    }

    /** Re-query markers; rebuild the observer if the set changed. */
    const collect = () => {
      const found = Array.from(document.querySelectorAll<HTMLElement>(NODE_SELECTOR))
      const current = nodesRef.current
      const same = found.length === current.length && found.every((el, i) => el === current[i])
      if (!same) {
        nodesRef.current = found
        bands = found.map(() => 'below')
        activeRef.current = -2 // force a repaint
        found.forEach((el) => {
          el.style.transition = reduce ? 'none' : NODE_TRANSITION
        })
        io?.disconnect()
        io = new IntersectionObserver(onIntersect, { rootMargin: ACTIVE_ROOT_MARGIN, threshold: 0 })
        found.forEach((el) => io?.observe(el))
      } else {
        // Transition preference may have changed between effect runs.
        found.forEach((el) => {
          el.style.transition = reduce ? 'none' : NODE_TRANSITION
        })
      }
      schedule()
    }

    collect()

    // Late-mounting markers (other sections mount, hero adds its node).
    const mo = new MutationObserver(collect)
    mo.observe(main, { childList: true, subtree: true })

    // Height changes inside <main> (fonts swapping, content mounting).
    const ro = new ResizeObserver(schedule)
    ro.observe(main)

    window.addEventListener('resize', schedule)
    window.addEventListener('orientationchange', schedule)

    if ('fonts' in document) {
      document.fonts.ready.then(schedule).catch(() => {})
    }
    // Short retry ladder as a belt-and-braces for anything the observers miss.
    for (const ms of [120, 600, 1800]) {
      timers.push(window.setTimeout(collect, ms))
    }

    return () => {
      if (frame) cancelAnimationFrame(frame)
      timers.forEach((t) => window.clearTimeout(t))
      io?.disconnect()
      mo.disconnect()
      ro.disconnect()
      window.removeEventListener('resize', schedule)
      window.removeEventListener('orientationchange', schedule)
    }
    // `progress`/`spring` are stable motion values (same identity every render), so in
    // practice this effect only re-runs when the reduced-motion preference changes.
  }, [reduce, progress, spring])

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="pointer-events-none absolute w-px"
      style={{
        left: 'calc(var(--line-x) - 0.5px)',
        top: geom?.top ?? 0,
        height: geom?.height ?? 0,
        visibility: geom ? 'visible' : 'hidden',
      }}
    >
      <div className="absolute inset-0 bg-line" />
      <m.div className="absolute inset-0 origin-top bg-accent" style={{ scaleY }} />
    </div>
  )
}
