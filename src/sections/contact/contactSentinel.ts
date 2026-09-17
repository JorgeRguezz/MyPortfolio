import { useSyncExternalStore } from 'react'

/**
 * Module-level store shared between Contact and StickyBar, mirroring
 * `hero/heroSentinel`.
 *
 * Contact observes its actions row and reports when the reader has *reached*
 * it (the row is on screen or already scrolled past). StickyBar hides itself
 * then: the section's own full-width "Save my contact" is the one primary
 * action in that viewport, and a second copy in the bar would compete with it.
 */
let contactReached = false
const listeners = new Set<() => void>()

export function setContactReached(next: boolean) {
  if (next === contactReached) return
  contactReached = next
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

const getSnapshot = () => contactReached
const getServerSnapshot = () => false

export function useContactReached(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
