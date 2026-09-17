import { m, useReducedMotion, type HTMLMotionProps } from 'motion/react'
import type { ReactNode } from 'react'

type RevealProps = {
  children: ReactNode
  /** Seconds. Use multiples of 0.06 for staggering siblings. */
  delay?: number
  className?: string
  /** Render as a different element. Defaults to div. */
  as?: 'div' | 'section' | 'li' | 'article' | 'header' | 'footer' | 'span'
} & Omit<HTMLMotionProps<'div'>, 'children' | 'transition' | 'initial' | 'whileInView' | 'viewport'>

const EASE = [0.2, 0.8, 0.2, 1] as const

/**
 * The ONE scroll-reveal used across the site: opacity 0→1, translateY 8px→0,
 * 400ms, once. Respects prefers-reduced-motion (renders static).
 * Use `delay` for staggering; never invent other entrance animations.
 */
export function Reveal({ children, delay = 0, className, as = 'div', ...rest }: RevealProps) {
  const reduce = useReducedMotion()
  const Tag = m[as] as typeof m.div

  if (reduce) {
    return (
      <Tag className={className} {...rest}>
        {children}
      </Tag>
    )
  }

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.4, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
