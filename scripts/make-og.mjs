#!/usr/bin/env node
/**
 * Generate the social preview image public/og.png (1200×630).
 *
 *   npm run og
 *
 * Pure SVG template → PNG via sharp. All copy comes from src/content.ts.
 * The "JR" mark mirrors public/favicon.svg.
 */
import { stat } from 'node:fs/promises'
import { resolve } from 'node:path'
import sharp from 'sharp'
import { person } from '../src/content.ts'
import { PUBLIC, ROOT, palette, fonts, esc, kb } from './lib.mjs'

const W = 1200
const H = 630
const X = 96 // left margin
const LINE_X = 56 // pipeline line x

// Wrap the headline on two lines if needed (Georgia at 44px ≈ 0.48em average glyph width).
function wrap(text, maxChars) {
  const words = text.split(' ')
  const lines = []
  let cur = ''
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > maxChars && cur) {
      lines.push(cur)
      cur = w
    } else cur = (cur + ' ' + w).trim()
  }
  if (cur) lines.push(cur)
  return lines
}
const headline = wrap(person.headline, 46)

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${palette.bg}"/>

  <!-- pipeline line down the left gutter, with the active node at the name -->
  <line x1="${LINE_X}" y1="0" x2="${LINE_X}" y2="${H}" stroke="${palette.line}" stroke-width="2"/>
  <circle cx="${LINE_X}" cy="284" r="8" fill="${palette.accent}"/>

  <!-- JR mark, same as favicon.svg -->
  <g transform="translate(${X} 88)">
    <rect width="64" height="64" rx="14" fill="${palette.accent}"/>
    <text x="32" y="43" text-anchor="middle" font-family="${esc(fonts.serif)}" font-size="34" fill="${palette.bg}">JR</text>
  </g>

  <!-- role line, mono eyebrow -->
  <text x="${X}" y="216" font-family="${esc(fonts.mono)}" font-size="22" letter-spacing="3.5" fill="${palette.fgSubtle}">${esc(person.roleLine.toUpperCase())}</text>

  <!-- name -->
  <text x="${X}" y="312" font-family="${esc(fonts.serif)}" font-size="88" letter-spacing="-2.2" fill="${palette.fg}">${esc(person.name)}</text>

  <!-- headline -->
  ${headline
    .map(
      (line, i) =>
        `<text x="${X}" y="${392 + i * 56}" font-family="${esc(fonts.serif)}" font-size="44" letter-spacing="-0.6" fill="${palette.fgMuted}">${esc(line)}</text>`,
    )
    .join('\n  ')}

  <!-- footer: where / what now -->
  <text x="${X}" y="${H - 64}" font-family="${esc(fonts.sans)}" font-size="22" fill="${palette.fgSubtle}">${esc(person.nowLine)}</text>
</svg>`

const out = resolve(PUBLIC, 'og.png')
await sharp(Buffer.from(svg), { density: 72 }).png({ compressionLevel: 9, palette: true }).toFile(out)
const { size } = await stat(out)
console.log(`  ${out.replace(`${ROOT}/`, '').padEnd(22)} ${kb(size)}  (${W}×${H})`)
