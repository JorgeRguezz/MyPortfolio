import { useSyncExternalStore } from 'react'

/**
 * Tiny module-level store shared between Hero and StickyBar (both owned by A1).
 *
 * Hero observes its `[data-hero-sentinel]` element (just under the actions row)
 * and reports whether it has scrolled *above* the viewport. StickyBar subscribes
 * and slides in when it has. No DOM queries across components, no context.
 *
 * Default is `false` (hero still on screen) so the bar is hidden on first paint
 * and never flashes before the observer reports.
 */
let heroScrolledOut = false
const listeners = new Set<() => void>()

export function setHeroScrolledOut(next: boolean) {
  if (next === heroScrolledOut) return
  heroScrolledOut = next
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

const getSnapshot = () => heroScrolledOut
const getServerSnapshot = () => false

export function useHeroScrolledOut(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
