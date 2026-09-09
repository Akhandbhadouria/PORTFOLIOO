'use client'

import CornerPlus from './ui/corner-plus'

// A "+" crosshair tiled across the footer, on a 48px grid — matches the
// page's grid/crosshair motif. Encoded as an inline SVG background.
const PLUS = encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48'>
     <path d='M24 21 V27 M21 24 H27' stroke='rgba(var(--ink), 0.22)' stroke-width='1'/>
   </svg>`
)

export default function FooterGrid() {
  return (
    <footer
      id="footer"
      className="section container grid-box"
      style={{
        position: 'relative',
        textAlign: 'center',
        overflow: 'hidden',
        paddingBlock: 'clamp(48px, 6vw, 88px)',
        paddingBottom: 'clamp(24px, 3vw, 40px)',
      }}
    >
      <CornerPlus />

      {/* Crosshair grid field */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          backgroundImage: `url("data:image/svg+xml,${PLUS}")`,
          backgroundSize: '48px 48px',
          backgroundPosition: 'center',
          // fade the field toward the box edges so it never fights the border
          WebkitMaskImage:
            'radial-gradient(ellipse 80% 75% at 50% 45%, #000 40%, transparent 100%)',
          maskImage:
            'radial-gradient(ellipse 80% 75% at 50% 45%, #000 40%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--accent)',
            display: 'block',
            marginBottom: '20px',
          }}
        >
          [ EOF ]
        </span>

        <h2
          style={{
            fontSize: 'clamp(56px, 12vw, 180px)',
            fontWeight: 700,
            letterSpacing: '-0.05em',
            textTransform: 'uppercase',
            color: '#fff',
            lineHeight: 0.9,
            margin: 0,
          }}
        >
          Akhand
        </h2>

        <p
          style={{
            marginTop: '28px',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(var(--ink), 0.4)',
          }}
        >
          © {new Date().getFullYear()} · Akhand Pratapsingh · Built with Next.js
        </p>
      </div>
    </footer>
  )
}
