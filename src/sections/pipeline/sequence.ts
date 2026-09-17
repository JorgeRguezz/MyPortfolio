/**
 * Timing for the Input → System → Output sequence.
 *
 * The whole run is driven by ONE boolean flip (`active`) and per-element CSS
 * `transition-delay`s. Node k activates at `nodeDelay(k)`; the rail segment
 * that leaves node k starts at the same instant and takes exactly STEP_MS to
 * fill, so the fill front reaches node k+1 at the moment node k+1 lights up,
 * no matter how tall the rows are. Nothing is timed in JS.
 */

/** Gap between consecutive node activations, and the fill time of one rail segment. */
export const STEP_MS = 140

/** Colour transition of a node once it activates. */
export const NODE_MS = 250

/** Node order: input = 0, system steps = 1…n, output = n + 1. */
export function nodeDelay(index: number): number {
  return index * STEP_MS
}

/** Total run time; for n = 5 system steps this is 6 × 140 + 250 = 1090 ms (budget 1400). */
export function totalMs(systemSteps: number): number {
  return nodeDelay(systemSteps + 1) + NODE_MS
}
