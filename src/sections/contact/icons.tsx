import type { SVGProps } from 'react'

/**
 * The only icons the shell needs, inline and stroke-based (1.5px, currentColor).
 * Shared by Contact, StickyBar and Footer (all A1 files). Sizes are set by the
 * caller through `className` (e.g. `size-4` = 16px, `size-[18px]`).
 */

type IconProps = SVGProps<SVGSVGElement>

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
} as const

/** Used on every external link, at the right edge or after the label. */
export function ArrowUpRightIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  )
}

/** "Save contact": arrow into a tray. */
export function DownloadIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 4v11" />
      <path d="m7.5 10.5 4.5 4.5 4.5-4.5" />
      <path d="M4.5 17.5v1a1.5 1.5 0 0 0 1.5 1.5h12a1.5 1.5 0 0 0 1.5-1.5v-1" />
    </svg>
  )
}

export function MailIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  )
}

/** LinkedIn mark, drawn with strokes so it matches the other icons. */
export function LinkedInIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="2.5" />
      <path d="M8 10.5V17" />
      <path d="M8 7.75v.01" />
      <path d="M12 17v-4a2.25 2.25 0 0 1 4.5 0v4" />
      <path d="M12 10.5V17" />
    </svg>
  )
}

/** GitHub mark, simplified to a single outline path. */
export function GitHubIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M15.5 21v-3.1c0-.9-.3-1.5-.7-1.9 2.2-.3 4.6-1.1 4.6-5a3.9 3.9 0 0 0-1.1-2.7 3.6 3.6 0 0 0-.1-2.7s-.9-.3-2.8 1a9.7 9.7 0 0 0-5 0c-1.9-1.3-2.8-1-2.8-1a3.6 3.6 0 0 0-.1 2.7A3.9 3.9 0 0 0 6.4 11c0 3.9 2.4 4.7 4.6 5-.3.3-.6.8-.7 1.5V21" />
      <path d="M10.3 17.7c-2 .6-3.6.2-4.8-1.7" />
    </svg>
  )
}
