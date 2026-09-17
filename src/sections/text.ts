/**
 * Typographic helpers shared by section components. No facts live here.
 */

/**
 * Glue every " · " separator to the word before it (U+00A0 before the dot) so a
 * line can only break *after* the dot. Without this, a wrapped "A · B" leaves a
 * lone "· B" dangling at the start of the next line (seen in the hero-card
 * eyebrows, Glance tile details and Experience org lines on 360–390px screens).
 * A trailing separator at a ragged right edge is the conventional typographic
 * form; a leading one is not.
 */
export function glueSeparators(text: string): string {
  return text.replace(/ · /g, ' · ')
}
