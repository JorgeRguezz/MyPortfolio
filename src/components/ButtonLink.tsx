import type { AnchorHTMLAttributes, ReactNode } from 'react'

type ButtonLinkProps = {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'md' | 'lg'
  className?: string
} & AnchorHTMLAttributes<HTMLAnchorElement>

/**
 * The only button style on the site. Always an <a>; there are no real form actions.
 * primary   = filled accent (one per viewport, max)
 * secondary = hairline outline
 * ghost     = text + underline (ignores `size`: no padding, no fixed height)
 */
export function ButtonLink({ children, variant = 'secondary', size = 'md', className = '', ...rest }: ButtonLinkProps) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-[background-color,color,border-color,text-decoration-color,transform] duration-200 ease-[var(--ease-out)] active:scale-[0.98] select-none'
  const sizes = {
    md: 'h-11 px-5 text-[0.9375rem] no-underline',
    lg: 'h-13 px-6 text-base no-underline',
  }
  const variants = {
    primary: 'bg-fg text-bg hover:bg-accent hover:text-bg',
    secondary: 'border border-line-strong text-fg hover:border-fg',
    ghost: 'text-fg underline decoration-line-strong hover:decoration-fg text-[0.9375rem]',
  }
  const sizing = variant === 'ghost' ? '' : sizes[size]
  return (
    <a className={`${base} ${sizing} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </a>
  )
}
