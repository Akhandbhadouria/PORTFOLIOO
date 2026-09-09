'use client'

import { useEffect, useRef } from 'react'
import CornerPlus from './ui/corner-plus'

// "VIBHAV" rendered with box-drawing block characters (Doom/Big-style ASCII art).
const ASCII = String.raw`
██╗   ██╗ ██╗ ██████╗  ██╗  ██╗  █████╗  ██╗   ██╗
██║   ██║ ██║ ██╔══██╗ ██║  ██║ ██╔══██╗ ██║   ██║
██║   ██║ ██║ ██████╔╝ ███████║ ███████║ ██║   ██║
╚██╗ ██╔╝ ██║ ██╔══██╗ ██╔══██║ ██╔══██║ ╚██╗ ██╔╝
 ╚████╔╝  ██║ ██████╔╝ ██║  ██║ ██║  ██║  ╚████╔╝
  ╚═══╝   ╚═╝ ╚═════╝  ╚═╝  ╚═╝ ╚═╝  ╚═╝   ╚═══╝
`.replace(/^\n+/, '').replace(/\n+$/, '')

const INFLUENCE = 170          // cursor influence radius (px)
const ACCENT = '#ff7a18'       // matches --accent

export default function FooterAscii() {
  const preRef = useRef(null)
  const charsRef = useRef([])

  useEffect(() => {
    const pre = preRef.current
    if (!pre) return
    const chars = charsRef.current.filter(Boolean)

    let raf = 0
    let scrollRaf = 0
    // Mouse position is stored in viewport coords (clientX/Y).
    let mx = -1e5
    let my = -1e5
    // Char centers are also stored in viewport coords.
    let positions = []
    let active = new Set()

    const measure = () => {
      positions = chars.map((el) => {
        const r = el.getBoundingClientRect()
        return {
          cx: r.left + r.width / 2,
          cy: r.top + r.height / 2,
          el,
        }
      })
    }

    const draw = () => {
      const r2 = INFLUENCE * INFLUENCE
      const next = new Set()

      for (let i = 0; i < positions.length; i++) {
        const p = positions[i]
        const dx = p.cx - mx
        const dy = p.cy - my
        const d2 = dx * dx + dy * dy
        if (d2 < r2) {
          next.add(i)
          const t = 1 - Math.sqrt(d2) / INFLUENCE
          const e = t * t // ease so brightness concentrates near the cursor
          // Colour fades white (edge) → bright warm orange (centre).
          const g = Math.round(255 - 95 * e)   // 255 → 160
          const b = Math.round(255 - 185 * e)  // 255 → 70
          const glowAlpha = (0.1 + 0.5 * e).toFixed(2)
          const blur = Math.round(6 + 22 * e)
          p.el.style.color = `rgb(255, ${g}, ${b})`
          p.el.style.transform = `scale(${1 + 0.4 * e})`
          p.el.style.textShadow = `0 0 ${blur}px rgba(255, 160, 70, ${glowAlpha})`
        }
      }

      // Reset any char that just left the active set.
      for (const idx of active) {
        if (!next.has(idx)) {
          const p = positions[idx]
          p.el.style.color = ''
          p.el.style.transform = ''
          p.el.style.textShadow = ''
        }
      }
      active = next
    }

    const onMove = (e) => {
      mx = e.clientX
      my = e.clientY
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(draw)
    }
    const onLeave = () => {
      mx = -1e5
      my = -1e5
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(draw)
    }

    // Viewport coords for chars go stale on scroll — re-measure (rAF-throttled).
    const onScroll = () => {
      cancelAnimationFrame(scrollRaf)
      scrollRaf = requestAnimationFrame(() => {
        measure()
        draw()
      })
    }

    let resizeT
    const onResize = () => {
      clearTimeout(resizeT)
      resizeT = setTimeout(measure, 120)
    }

    measure()
    pre.addEventListener('pointermove', onMove)
    pre.addEventListener('pointerleave', onLeave)
    window.addEventListener('resize', onResize)
    window.addEventListener('scroll', onScroll, { passive: true })
    if (document.fonts?.ready) document.fonts.ready.then(measure)

    return () => {
      cancelAnimationFrame(raf)
      cancelAnimationFrame(scrollRaf)
      clearTimeout(resizeT)
      pre.removeEventListener('pointermove', onMove)
      pre.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const lines = ASCII.split('\n')
  let charIdx = 0

  return (
    <footer
      id="footer"
      className="section container grid-box"
      style={{
        position: 'relative',
        textAlign: 'center',
        paddingBottom: 'clamp(20px, 2vw, 32px)',
      }}
    >
      <CornerPlus />

      <pre
        ref={preRef}
        role="img"
        aria-label="Akhand"
        style={{
          margin: '0 auto',
          fontFamily: 'var(--font-mono)',
          fontSize: 'clamp(16px, 2.6vw, 38px)',
          color: '#fff',
          lineHeight: 1.05,
          whiteSpace: 'pre',
          display: 'inline-block',
          textAlign: 'left',
          letterSpacing: 0,
          cursor: 'crosshair',
          userSelect: 'none',
        }}
      >
        {lines.map((line, li) => (
          <span key={`row-${li}`} style={{ display: 'block' }}>
            {[...line].map((ch, ci) => {
              const idx = charIdx++
              return (
                <span
                  key={ci}
                  ref={(el) => { if (el) charsRef.current[idx] = el }}
                  style={{
                    display: 'inline-block',
                    willChange: 'transform, color',
                    transition: 'transform .15s ease-out, color .15s ease-out, text-shadow .15s ease-out',
                  }}
                >
                  {ch === ' ' ? ' ' : ch}
                </span>
              )
            })}
          </span>
        ))}
      </pre>

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
    </footer>
  )
}
