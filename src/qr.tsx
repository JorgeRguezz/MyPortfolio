/**
 * /qr — the screen Jorge shows to recruiters.
 *
 * Standalone entry (qr.html → this file). Builds the QR at runtime from
 * `window.location.origin`, so whatever domain serves this page is what the
 * code encodes. Zero configuration.
 */
import { StrictMode, useEffect, useMemo } from 'react'
import { createRoot } from 'react-dom/client'
import QRCode from 'qrcode'
import './index.css'
import { person } from './content'
import { ButtonLink } from './components'

/** Copy specific to this screen. Not in content.ts; nothing here is a fact about Jorge. */
const copy = {
  scanLine: 'Scan to open my portfolio',
  openLabel: 'Open portfolio',
  qrAlt: 'QR code that opens this portfolio',
} as const

/**
 * QR modules as an SVG path. The `qrcode` package's own SVG renderer emits a
 * full document with hardcoded fills; we want a bare <path> using currentColor
 * so the card can control colors. Same module → path conversion qrcode uses
 * internally, condensed. Error correction M, 1-module quiet zone.
 */
function useQrPath(text: string) {
  return useMemo(() => {
    if (!text) return null
    const qr = QRCode.create(text, { errorCorrectionLevel: 'M' })
    const size = qr.modules.size
    const data = qr.modules.data
    const margin = 1
    let d = ''
    for (let r = 0; r < size; r++) {
      let run = 0
      for (let c = 0; c <= size; c++) {
        const dark = c < size && data[r * size + c] !== 0
        if (dark) {
          run++
          continue
        }
        if (run > 0) {
          d += `M${c - run + margin} ${r + margin}h${run}v1h-${run}z`
          run = 0
        }
      }
    }
    return { d, viewBox: size + margin * 2 }
  }, [text])
}

/**
 * Keep the phone screen awake while this page is open. Wake Lock requires a
 * user gesture on most browsers, so we request it on the first tap and
 * re-request when the tab becomes visible again. Entirely optional.
 */
function useWakeLock() {
  useEffect(() => {
    let sentinel: WakeLockSentinel | null = null
    let wanted = false

    const request = async () => {
      if (!wanted || sentinel || !('wakeLock' in navigator)) return
      try {
        sentinel = await navigator.wakeLock.request('screen')
        sentinel.addEventListener('release', () => {
          sentinel = null
        })
      } catch {
        // Not granted (low battery, unsupported, background tab). Fine.
      }
    }
    const onTap = () => {
      wanted = true
      void request()
    }
    const onVisible = () => {
      if (document.visibilityState === 'visible') void request()
    }

    document.addEventListener('pointerdown', onTap)
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      document.removeEventListener('pointerdown', onTap)
      document.removeEventListener('visibilitychange', onVisible)
      void sentinel?.release()
    }
  }, [])
}

function QrPage() {
  // Whatever origin serves this page is what the code encodes. No config.
  const origin = window.location.origin
  const qr = useQrPath(origin)
  useWakeLock()

  const host = origin.replace(/^https?:\/\//, '')

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-8 bg-bg px-6 py-10 text-center">
      <header>
        <h1 className="display-lg">{person.shortName}</h1>
        <p className="eyebrow mt-3">{person.roleLine}</p>
      </header>

      {/*
        The card is deliberately white with black modules in BOTH themes: dark
        modules on a light background is what phone cameras decode most
        reliably, and a bright card is what a loud, dim hall needs. This is the
        one place on the site that ignores the theme tokens, on purpose.
      */}
      <figure className="m-0">
        <div className="rounded-3xl border border-line bg-white p-5 text-black">
          {qr ? (
            <svg
              viewBox={`0 0 ${qr.viewBox} ${qr.viewBox}`}
              shapeRendering="crispEdges"
              role="img"
              aria-label={copy.qrAlt}
              className="block w-[min(78vw,340px)] aspect-square fill-current"
            >
              <path d={qr.d} />
            </svg>
          ) : (
            <div aria-hidden className="w-[min(78vw,340px)] aspect-square" />
          )}
        </div>
        <figcaption className="mt-5">
          <p className="font-mono text-sm text-fg-subtle">{host}</p>
          <p className="mt-1 text-fg-muted">{copy.scanLine}</p>
        </figcaption>
      </figure>

      <ButtonLink href="/" variant="ghost">
        {copy.openLabel}
      </ButtonLink>
    </main>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QrPage />
  </StrictMode>,
)
