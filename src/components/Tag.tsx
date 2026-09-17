import type { ReactNode } from 'react'

type TagProps = {
  children: ReactNode
  /** `accent` is reserved for the currently-active or most important tag. Use sparingly. */
  tone?: 'default' | 'accent'
  className?: string
}

/** Mono pill for stack items, skills and small labels. */
export function Tag({ children, tone = 'default', className = '' }: TagProps) {
  const tones = {
    default: 'border-line text-fg-muted',
    accent: 'border-accent/40 bg-accent-soft text-accent',
  }
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[0.6875rem] leading-5 tracking-wide ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  )
}

export function TagList({ items, className = '' }: { items: readonly string[]; className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-1.5 ${className}`}>
      {items.map((item) => (
        <li key={item}>
          <Tag>{item}</Tag>
        </li>
      ))}
    </ul>
  )
}
