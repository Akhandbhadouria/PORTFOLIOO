'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import ThemeSwitch from './ThemeSwitch'

const resumes = [
  { label: 'General CV',    url: 'https://drive.google.com/file/d/1Qmg2B83VRTR0sgsx5XcWDxT3LiT0kLrg/view?usp=sharing', sub: 'Full overview' },
  { label: 'Specialized CV', url: 'https://drive.google.com/file/d/1JweM7qBCADSj7XxRncEqMow7wmQ5fZK5/view?usp=sharing', sub: 'AI/ML & Data Science' },
]

const navLinks = [
  { label: 'Home', id: 'home' },
  { label: 'Projects', id: 'work' },
  { label: 'Stack', id: 'stack' },
  { label: 'About', id: 'about' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [resumeOpen, setResumeOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  // Shared across every page: section links anchor in place on the home page
  // and jump back to /#section from /blog and /projects.
  const pathname = usePathname() || '/'
  const onHome = pathname === '/'
  const linkHref = (link) => link.href || (onHome ? `#${link.id}` : `/#${link.id}`)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const sync = () => setIsMobile(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const ease = 'cubic-bezier(.22,1,.36,1)'

  return (
    <>
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      style={{
        position: 'fixed',
        zIndex: 1000,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none',
        top: 0,
        // full-bleed hairline bar once scrolled
        background: scrolled ? 'rgba(var(--paper), 0.65)' : 'rgba(var(--paper), 0)',
        backdropFilter: scrolled ? 'blur(12px)' : 'blur(0px)',
        WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'blur(0px)',
        borderBottom: scrolled ? '1px solid rgba(var(--ink), 0.08)' : '1px solid rgba(var(--ink), 0)',
        transition: `background .4s ${ease}, backdrop-filter .4s ${ease}, border-color .4s ${ease}`,
      }}
    >
      {/* Bar */}
      <div
        style={{
          pointerEvents: 'auto',
          display: 'flex',
          alignItems: 'center',
          transition: `padding .5s ${ease}`,
          width: '100%',
          maxWidth: '1300px',
          justifyContent: 'space-between',
          gap: '0px',
          // Slimmer at the very top; expands a little once the sticky bar
          // gains its blurred background on scroll. Tighter on mobile.
          padding: isMobile ? (scrolled ? '6px 5vw' : '5px 5vw') : (scrolled ? '10px 5vw' : '8px 5vw'),
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <a
            href={onHome ? "#home" : "/"}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              textDecoration: 'none',
            }}
          >
            <span
              style={{
                width: '28px',
                height: '28px',
                display: 'inline-block',
                backgroundColor: 'var(--text-primary)',
                maskImage: 'url(/logo-mask.png)',
                WebkitMaskImage: 'url(/logo-mask.png)',
                maskSize: 'contain',
                WebkitMaskSize: 'contain',
                maskRepeat: 'no-repeat',
                WebkitMaskRepeat: 'no-repeat',
                maskPosition: 'center',
                WebkitMaskPosition: 'center',
                flexShrink: 0,
              }}
            />
            <span
              style={{
                color: 'var(--text-primary)',
                fontWeight: 800,
                fontSize: '18px',
                letterSpacing: '0.04em',
                fontFamily: 'var(--font-main)',
                textTransform: 'uppercase',
              }}
            >
              AKHAND
            </span>
          </a>
        </div>

        {/* Center Links */}
        <div className="nav-links" style={{ gap: '32px', alignItems: 'center' }}>
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={linkHref(link)}
              style={{
                color: 'rgba(var(--ink), 0.7)',
                textDecoration: 'none',
                fontWeight: 500,
                fontSize: '13.5px',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.target.style.color = 'var(--text-primary)')}
              onMouseLeave={(e) => (e.target.style.color = 'rgba(var(--ink), 0.7)')}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Mobile hamburger — visible <=768px */}
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
          className="nav-mobile-toggle"
          style={{
            display: 'none',
            background: 'transparent',
            border: '1px solid rgba(var(--ink), 0.18)',
            color: 'var(--text-primary)',
            width: 36,
            height: 36,
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {mobileOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="7" x2="21" y2="7" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="17" x2="21" y2="17" />
              </>
            )}
          </svg>
        </button>

        {/* Right Action */}
        <div
          className="nav-right-actions"
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: '22px',
            flexShrink: 0,
          }}
        >
          <ThemeSwitch compact />
          <div
            onMouseEnter={() => setResumeOpen(true)}
            onMouseLeave={() => setResumeOpen(false)}
            style={{ position: 'relative' }}
          >
            <button
              type="button"
              onClick={() => setResumeOpen((v) => !v)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'transparent',
                border: 'none',
                padding: 0,
                color: resumeOpen ? 'var(--accent)' : 'rgba(var(--ink), 0.85)',
                fontSize: '13.5px',
                fontWeight: 600,
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'color 0.2s',
              }}
            >
              Resume
              <svg
                width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                style={{ transform: resumeOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s ease' }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            <div
              // Wrapper with transparent padding acts as a hover bridge between
              // the button and the visible dropdown so the mouse never leaves
              // the hoverable region while traveling across the gap.
              style={{
                position: 'absolute',
                right: 0,
                top: '100%',
                paddingTop: '10px',
                opacity: resumeOpen ? 1 : 0,
                visibility: resumeOpen ? 'visible' : 'hidden',
                transform: resumeOpen ? 'translateY(0)' : 'translateY(-8px)',
                transition: 'opacity .2s ease, transform .25s cubic-bezier(.22,1,.36,1), visibility .2s',
                pointerEvents: resumeOpen ? 'auto' : 'none',
              }}
            >
              <div
                style={{
                  minWidth: '230px',
                  background: 'rgba(var(--paper), 0.85)',
                  backdropFilter: 'blur(20px) saturate(160%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(160%)',
                  border: '1px solid rgba(var(--ink), 0.1)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 16px 40px rgba(var(--shadow-ink), 0.14)',
                }}
              >
              {resumes.map((r, i) => (
                <a
                  key={r.url}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block',
                    padding: '14px 16px',
                    color: 'rgba(var(--ink), 0.85)',
                    textDecoration: 'none',
                    borderTop: i > 0 ? '1px solid rgba(var(--ink), 0.06)' : 'none',
                    transition: 'background 0.18s ease, color 0.18s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(var(--ink), 0.04)'
                    e.currentTarget.style.color = 'var(--accent)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = 'rgba(var(--ink), 0.85)'
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '12px',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {r.label}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      color: 'rgba(var(--ink), 0.4)',
                      letterSpacing: '0.08em',
                      marginTop: '4px',
                    }}
                  >
                    {r.sub}
                  </div>
                </a>
              ))}
              </div>
            </div>
          </div>
          <a
            href={onHome ? "#contact" : "/#contact"}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 18px',
              border: '1px solid var(--accent)',
              borderRadius: 'var(--r-pill)',
              color: 'var(--accent)',
              background: 'transparent',
              fontSize: '13px',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              transition: 'background 0.25s ease, color 0.25s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--accent)'
              e.currentTarget.style.color = '#fff'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = 'var(--accent)'
            }}
          >
            Let&apos;s talk
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </motion.nav>

      {/* Mobile drawer — sibling of nav so it isn't trapped in nav's stacking/pointer-events */}
      <div
        className="nav-mobile-drawer"
        {...(!mobileOpen ? { inert: true } : {})}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(var(--base), 0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          zIndex: 1500,
          display: 'none',
          flexDirection: 'column',
          padding: '96px 24px 32px',
          pointerEvents: mobileOpen ? 'auto' : 'none',
          opacity: mobileOpen ? 1 : 0,
          transform: mobileOpen ? 'translateY(0)' : 'translateY(-8px)',
          transition: `opacity .3s ${ease}, transform .3s ${ease}`,
          overflowY: 'auto',
        }}
      >
        {/* Close button — top right of drawer */}
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'absolute',
            top: 22,
            right: 24,
            width: 42,
            height: 42,
            background: 'transparent',
            border: '1px solid rgba(var(--ink), 0.18)',
            color: 'var(--text-primary)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={linkHref(link)}
              onClick={() => setMobileOpen(false)}
              style={{
                color: 'var(--text-primary)',
                textDecoration: 'none',
                fontFamily: 'var(--font-main)',
                fontSize: '28px',
                fontWeight: 600,
                letterSpacing: '-0.02em',
                padding: '14px 0',
                borderBottom: '1px solid rgba(var(--ink), 0.08)',
              }}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Theme — the full-size slider, in the drawer on mobile */}
        <div style={{
          marginTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.18em',
            textTransform: 'uppercase', color: 'rgba(var(--ink), 0.4)',
          }}>
            Theme
          </span>
          <ThemeSwitch />
        </div>

        <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.18em',
            textTransform: 'uppercase', color: 'rgba(var(--ink), 0.4)', marginBottom: '4px',
          }}>
            Resume
          </span>
          {resumes.map((r) => (
            <a
              key={r.url}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              style={{
                display: 'block',
                padding: '12px 14px',
                border: '1px solid rgba(var(--ink), 0.12)',
                color: 'var(--text-primary)',
                textDecoration: 'none',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              {r.label}
              <div style={{
                fontSize: '10px', color: 'rgba(var(--ink), 0.4)',
                fontWeight: 500, marginTop: '4px', letterSpacing: '0.06em',
              }}>
                {r.sub}
              </div>
            </a>
          ))}
        </div>

        <a
          href={onHome ? "#contact" : "/#contact"}
          onClick={() => setMobileOpen(false)}
          style={{
            marginTop: '20px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '14px 18px',
            border: '1px solid var(--accent)',
            borderRadius: 'var(--r-pill)',
            color: 'var(--accent)',
            background: 'transparent',
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            textDecoration: 'none',
          }}
        >
          Let&apos;s talk
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </>
  )
}
