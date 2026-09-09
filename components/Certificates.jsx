'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import SectionHeader from './ui/section-header'

const cert1 = '/Certificates/image.webp'
const cert2 = '/Certificates/image copy.webp'
const cert3 = '/Certificates/image copy 2.webp'
const cert4 = '/Certificates/image copy 3.webp'

const certs = [
  {
    id: 'cert4',
    image: cert4,
    title: 'Oracle Data Platform Foundations',
    headline: 'Core data infrastructure, certified at the source.',
    subtitle: 'Oracle Certified',
    desc: 'Oracle Certified Foundations Associate for the Oracle Data Platform 2025 program. Validates core understanding of Oracle data infrastructure, services, and platform fundamentals.',
    tags: ['Data Platform', 'Cloud Infrastructure', 'Oracle'],
    accent: '#C74634',
  },
  {
    id: 'cert1',
    image: cert1,
    title: 'Cloud Computing',
    headline: 'Distributed systems, straight from IIT Kharagpur.',
    subtitle: 'NPTEL Certified (IIT Kharagpur)',
    desc: 'An NPTEL-certified course covering cloud computing fundamentals, distributed systems, and scalable infrastructure — with perfect performance in online assessments.',
    tags: ['Cloud Computing', 'Distributed Systems', 'NPTEL'],
    accent: '#f7790f',
  },
  {
    id: 'cert2',
    image: cert2,
    title: 'Python (Basic)',
    headline: 'Problem solving, proven under assessment.',
    subtitle: 'HackerRank Certified',
    desc: 'Validated core Python programming skills through HackerRank assessment, focusing on problem solving, data structures, and writing efficient, clean code.',
    tags: ['Python', 'Data Structures', 'HackerRank'],
    accent: '#4ECDC4',
  },
  {
    id: 'cert3',
    image: cert3,
    title: 'Frontend Developer (React)',
    headline: 'Component architecture that ships.',
    subtitle: 'HackerRank Certified',
    desc: 'Proficiency in building modern web applications using React — component-based architecture, state management, and responsive, interactive user interfaces.',
    tags: ['React', 'State Management', 'HackerRank'],
    accent: '#6C8EFF',
  },
];

const easeFluid = [0.22, 1, 0.36, 1]

export default function Certificates() {
  const [selected, setSelected] = useState(null)
  const [active, setActive] = useState(0)
  const [mounted, setMounted] = useState(false)
  const trackRef = useRef(null)
  const cardRefs = useRef([])

  useEffect(() => { setMounted(true) }, [])

  // Track which card is centered while the user scrolls / swipes.
  const onScroll = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const center = track.scrollLeft + track.clientWidth / 2
    let best = 0
    let bestDist = Infinity
    cardRefs.current.forEach((el, i) => {
      if (!el) return
      const mid = el.offsetLeft + el.offsetWidth / 2
      const d = Math.abs(mid - center)
      if (d < bestDist) { bestDist = d; best = i }
    })
    setActive(best)
  }, [])

  const goTo = (i) => {
    const el = cardRefs.current[i]
    const track = trackRef.current
    if (!el || !track) return
    track.scrollTo({
      left: el.offsetLeft + el.offsetWidth / 2 - track.clientWidth / 2,
      behavior: 'smooth',
    })
  }

  // Escape closes the lightbox; lock page scroll while it's open.
  useEffect(() => {
    if (!selected) return
    const onKey = e => { if (e?.key === 'Escape') setSelected(null) }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [selected])

  const cert = certs[active]

  return (
    <>
      <section id="certificates" className="section">
        <div className="container grid-box" style={{ padding: 'clamp(24px, 3vw, 48px) 0', overflow: 'hidden' }}>
          <div style={{ paddingInline: 'clamp(20px, 3vw, 48px)' }}>
            <SectionHeader
              eyebrow="CREDENTIALS"
              title="Certified & always learning."
              align="left"
              marginBottom={28}
              eyebrowClassName="cert-eyebrow"
            />
          </div>

          {/* Per-slide header: issuer block left, headline right */}
          <div style={{ paddingInline: 'clamp(20px, 3vw, 48px)', minHeight: '92px' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={cert.id}
                className="cert-show-head"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: easeFluid }}
              >
                <div>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '10px',
                    color: cert.accent, fontSize: '11px', fontFamily: 'var(--font-mono)',
                    letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '8px',
                  }}>
                    <span style={{ width: '20px', height: '1px', background: cert.accent }} />
                    {cert.subtitle}
                  </span>
                  <h3 style={{
                    fontSize: 'clamp(20px, 2vw, 26px)', fontWeight: 700,
                    color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.15,
                  }}>
                    {cert.title}
                  </h3>
                </div>
                <p className="cert-show-headline">
                  {cert.headline}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Carousel: centered card, neighbors peeking at the edges */}
          <div style={{ position: 'relative', marginTop: '22px' }}>
            <div ref={trackRef} className="cert-track" onScroll={onScroll}>
              {certs.map((c, i) => {
                const isActive = i === active
                return (
                  <motion.div
                    key={c.id}
                    ref={el => { cardRefs.current[i] = el }}
                    className="cert-show-card"
                    animate={{ scale: isActive ? 1 : 0.94, opacity: isActive ? 1 : 0.55 }}
                    transition={{ duration: 0.45, ease: easeFluid }}
                    onClick={() => (isActive ? setSelected(c) : goTo(i))}
                  >
                    <img src={c.image} alt={c.title} loading="lazy" draggable={false} />
                    {/* hover CTA — become.team style */}
                    <div className="cert-card-cta" aria-hidden={!isActive}>
                      <span>Read Certificate</span>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Arrows */}
            <CarouselArrow dir="left"  disabled={active === 0}               onClick={() => goTo(active - 1)} />
            <CarouselArrow dir="right" disabled={active === certs.length - 1} onClick={() => goTo(active + 1)} />
          </div>

          {/* Below: tag pills left, quote right */}
          <div style={{ paddingInline: 'clamp(20px, 3vw, 48px)' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={cert.id}
                className="cert-show-foot"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: easeFluid, delay: 0.05 }}
              >
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {cert.tags.map(t => (
                    <span key={t} className="tag-capsule">{t}</span>
                  ))}
                </div>
                <div className="cert-quote">
                  <span style={{
                    fontSize: '22px', lineHeight: 1, color: cert.accent,
                    fontFamily: 'Georgia, serif', flexShrink: 0, marginTop: '2px',
                  }}>“</span>
                  <p style={{
                    fontSize: '13.5px', lineHeight: 1.6, color: 'var(--text-secondary)',
                    fontStyle: 'italic', margin: 0,
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>
                    {cert.desc}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Dots */}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '22px' }}>
              {certs.map((c, i) => (
                <button
                  key={c.id}
                  aria-label={`Go to ${c.title}`}
                  onClick={() => goTo(i)}
                  style={{
                    width: i === active ? '26px' : '8px', height: '8px',
                    borderRadius: '999px', border: 'none', cursor: 'pointer',
                    background: i === active ? cert.accent : 'rgba(var(--ink), 0.18)',
                    transition: 'all 0.35s cubic-bezier(0.22,1,0.36,1)',
                    padding: 0,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox — portal to body */}
      {mounted && createPortal(
        <AnimatePresence>
          {selected && (
            <motion.div
              key="modal-bg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              style={{
                position: 'fixed', inset: 0, zIndex: 99999,
                background: 'rgba(var(--base), 0.72)',
                backdropFilter: 'blur(22px) saturate(140%)',
                WebkitBackdropFilter: 'blur(22px) saturate(140%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '32px',
              }}
            >
              <motion.div
                key="modal-content"
                initial={{ scale: 0.9, opacity: 0, y: 24 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.94, opacity: 0, y: 24 }}
                transition={{ duration: 0.4, ease: easeFluid }}
                onClick={e => e.stopPropagation()}
                style={{
                  maxWidth: '900px', width: '100%',
                  background: 'rgba(var(--paper), 0.92)',
                  border: '1px solid var(--hairline)',
                  borderRadius: 'var(--r-sheet)', overflow: 'hidden',
                  boxShadow: '0 48px 100px rgba(var(--shadow-ink), 0.22)',
                  position: 'relative'
                }}
              >
                <img src={selected.image} alt={selected.title}
                  style={{ width: '100%', display: 'block', maxHeight: '78vh', objectFit: 'contain' }}
                />
                <div style={{
                  padding: '20px 28px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  borderTop: '1px solid var(--hairline)',
                }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--text-primary)', fontWeight: 600 }}>{selected.title}</h3>
                    <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>{selected.subtitle}</p>
                  </div>
                  <motion.button
                    onClick={() => setSelected(null)}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    style={{
                      background: 'rgba(var(--ink), 0.05)', border: '1px solid var(--hairline)',
                      borderRadius: '999px', padding: '8px 18px', color: 'var(--text-primary)',
                      fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-mono)',
                      textTransform: 'uppercase', letterSpacing: '0.1em',
                    }}
                  >Close</motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  )
}

function CarouselArrow({ dir, onClick, disabled }) {
  return (
    <motion.button
      aria-label={dir === 'left' ? 'Previous certificate' : 'Next certificate'}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.08 }}
      whileTap={disabled ? {} : { scale: 0.92 }}
      className="cert-arrow"
      style={{
        [dir]: 'clamp(10px, 2vw, 26px)',
        opacity: disabled ? 0.25 : 1,
        cursor: disabled ? 'default' : 'pointer',
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        {dir === 'left' ? <path d="M19 12H5M12 19l-7-7 7-7" /> : <path d="M5 12h14M12 5l7 7-7 7" />}
      </svg>
    </motion.button>
  )
}
