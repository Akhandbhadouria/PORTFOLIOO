'use client'

import { cn } from '../../lib/utils'

export default function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'left',
  marginBottom = 64,
  eyebrowClassName,
  titleClassName,
  descriptionClassName,
  descriptionWidth = 600,
  titleTag: TitleTag = 'h2',
}) {
  const isCentered = align === 'center'

  return (
    <div style={{ marginBottom, textAlign: isCentered ? 'center' : 'left' }}>
      {eyebrow ? (
        <span
          className={cn('mono-label', 'section-header-eyebrow', eyebrowClassName)}
          style={{ display: 'block', marginBottom: '16px' }}
        >
          {eyebrow}
        </span>
      ) : null}

      <TitleTag
        className={cn('section-header-title', titleClassName)}
        style={{
          fontSize: 'clamp(32px, 4vw, 42px)',
          color: 'var(--text-primary)',
          lineHeight: 1.1,
          letterSpacing: '-0.03em',
          marginBottom: description ? '24px' : 0,
        }}
      >
        {title}
      </TitleTag>

      {description ? (
        <p
          className={cn('section-header-description', descriptionClassName)}
          style={{
            color: 'var(--text-secondary)',
            fontSize: '16px',
            lineHeight: 1.7,
            maxWidth: typeof descriptionWidth === 'number' ? `${descriptionWidth}px` : descriptionWidth,
            margin: isCentered ? '0 auto' : 0,
          }}
        >
          {description}
        </p>
      ) : null}
    </div>
  )
}