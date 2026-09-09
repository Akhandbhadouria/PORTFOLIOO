'use client'

import { cn } from '../../lib/utils'

export default function GlassCard({
  as: Component = 'div',
  className,
  style,
  children,
  liquid = true,
  ...props
}) {
  return (
    <Component
      className={cn(liquid ? 'liquid-glass' : '', className)}
      style={style}
      {...props}
    >
      {children}
    </Component>
  )
}