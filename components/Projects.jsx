'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { TransitionLink } from './PageTransition'
import SectionHeader from './ui/section-header'
import ProjectModal from './ProjectModal'
import { FEATURED_PROJECTS as PROJECTS } from '../lib/projects'

const easeFluid = [0.22, 1, 0.36, 1]

export default function Projects() {
  const [selected, setSelected] = useState(null)
  const [active, setActive] = useState(0)
  const [mounted, setMounted] = useState(false)
  const stageRef = useRef(null)

  useEffect(() => { setMounted(true) }, [])

  // Overlay carousel: the arrows/dots pick a card and each card's transform is
  // derived from its distance to the active index. A CSS transition on
  // .proj-card animates the movement — no page-scroll hijacking.
  const goTo = (i) => setActive(Math.min(PROJECTS.length - 1, Math.max(0, i)))

  // Horizontal-scroll support: since the cards are stacked (not a scroll track),
  // a horizontal trackpad swipe or touch drag steps through them. Vertical
  // scroll is left untouched so the page scrolls normally over the section.
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    let cooling = false
    const step = (dir) => {
      if (cooling) return
      cooling = true
      setActive((a) => Math.min(PROJECTS.length - 1, Math.max(0, a + dir)))
      setTimeout(() => { cooling = false }, 420)
    }
    const onWheel = (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 10) {
        e.preventDefault()
        step(e.deltaX > 0 ? 1 : -1)
      }
    }
    let startX = 0
    const onTouchStart = (e) => { startX = e.touches[0].clientX }
    const onTouchEnd = (e) => {
      const dx = e.changedTouches[0].clientX - startX
      if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1)
    }
    stage.addEventListener('wheel', onWheel, { passive: false })
    stage.addEventListener('touchstart', onTouchStart, { passive: true })
    stage.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      stage.removeEventListener('wheel', onWheel)
      stage.removeEventListener('touchstart', onTouchStart)
      stage.removeEventListener('touchend', onTouchEnd)
    }
  }, [])

  const cardStyle = (i) => {
    const d = Math.max(-3, Math.min(3, i - active))
    const ad = Math.min(Math.abs(d), 1)
    return {
      transform: `translateX(${d * 106}%) scale(${1 - 0.14 * ad})`,
      opacity: 1 - 0.3 * ad,
      zIndex: 100 - Math.round(Math.abs(d) * 10),
    }
  }

  const project = PROJECTS[active]

  return (
    <>
      <section
        id="work"
        data-section="projects"
        className="section"
        style={{ position: 'relative', paddingBlock: 0 }}
      >
        <div>
          <div className="container grid-box" style={{ padding: 'clamp(24px, 3vw, 48px) 0', overflow: 'hidden', width: '100%' }}>
            <div style={{ paddingInline: 'clamp(20px, 3vw, 48px)', position: 'relative' }}>
              <SectionHeader
                eyebrow="SELECTED WORK"
                title="Real-world systems, not just code."
                align="left"
                marginBottom={24}
              />
              {/* pinned to the eyebrow row so the title keeps the full width */}
              <TransitionLink
                href="/projects"
                label="Projects."
                className="proj-viewall"
                style={{ position: 'absolute', top: -6, right: 'clamp(20px, 3vw, 48px)', marginBottom: 0 }}
              >
                View all projects
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </TransitionLink>
            </div>

            {/* Per-slide header: project name left, summary headline right */}
            <div style={{ paddingInline: 'clamp(20px, 3vw, 48px)', minHeight: '86px' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={project.id}
                  className="cert-show-head"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35, ease: easeFluid }}
                >
                  <div>
                    <span className="mono-label" style={{
                      display: 'inline-flex', alignItems: 'center', gap: '10px',
                      color: project.accent, marginBottom: '8px',
                    }}>
                      <span style={{ width: '20px', height: '1px', background: project.accent }} />
                      {project.label} · {project.year}
                    </span>
                    <h3 style={{
                      fontSize: 'clamp(20px, 2vw, 26px)', fontWeight: 700,
                      color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.15,
                    }}>
                      {project.name}
                    </h3>
                  </div>
                  <p className="cert-show-headline">{project.summary}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Card stage — one front card, the next peeking right */}
            <div style={{ position: 'relative', marginTop: '20px' }}>
              <div className="proj-stage" ref={stageRef}>
                {PROJECTS.map((p, i) => (
                  <div
                    key={p.id}
                    className="proj-card"
                    style={cardStyle(i)}
                    onClick={() => (i === active ? setSelected(p) : goTo(i))}
                  >
                    <CardImage project={p} />
                    <div className="cert-card-cta">
                      <span>Read Casestudy</span>
                    </div>
                  </div>
                ))}
              </div>

              <CarouselArrow dir="left"  disabled={active === 0}                   onClick={() => goTo(active - 1)} />
              <CarouselArrow dir="right" disabled={active === PROJECTS.length - 1} onClick={() => goTo(active + 1)} />
            </div>

            {/* Below: tag pills left, status quote right */}
            <div style={{ paddingInline: 'clamp(20px, 3vw, 48px)' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={project.id}
                  className="cert-show-foot"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: easeFluid, delay: 0.05 }}
                >
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {project.tags.map(t => (
                      <span key={t} className="tag-capsule">{t}</span>
                    ))}
                  </div>
                  <div className="cert-quote">
                    <span style={{
                      fontSize: '22px', lineHeight: 1, color: project.accent,
                      fontFamily: 'Georgia, serif', flexShrink: 0, marginTop: '2px',
                    }}>&ldquo;</span>
                    <p style={{
                      fontSize: '13.5px', lineHeight: 1.6, color: 'var(--text-secondary)',
                      fontStyle: 'italic', margin: 0,
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }}>
                      {project.description}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Dots */}
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '20px' }}>
                {PROJECTS.map((p, i) => (
                  <button
                    key={p.id}
                    aria-label={`Go to ${p.name}`}
                    onClick={() => goTo(i)}
                    style={{
                      width: i === active ? '26px' : '8px', height: '8px',
                      borderRadius: '999px', border: 'none', cursor: 'pointer',
                      background: i === active ? 'var(--accent)' : 'rgba(var(--ink), 0.18)',
                      transition: 'all 0.35s cubic-bezier(0.22,1,0.36,1)',
                      padding: 0,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal — rendered via portal to body */}
      {mounted && createPortal(
        <AnimatePresence>
          {selected && <ProjectModal key={selected.id} project={selected} onClose={() => setSelected(null)} />}
        </AnimatePresence>,
        document.body
      )}
    </>
  )
}

// Renders the card screenshot, falling back to a branded accent tile if the
// image is missing or fails to load (e.g. a project without a shot yet).
function CardImage({ project }) {
  const [broken, setBroken] = useState(false)
  if (!project.image || broken) {
    return (
      <div
        className="proj-card-fallback"
        style={{ background: `linear-gradient(135deg, ${project.accent}26, ${project.accent}0a)` }}
      >
        <span style={{ color: project.accent }}>{project.name}</span>
      </div>
    )
  }
  return (
    <img
      src={project.image}
      alt={project.name}
      loading="lazy"
      draggable={false}
      onError={() => setBroken(true)}
    />
  )
}

function CarouselArrow({ dir, onClick, disabled }) {
  return (
    <motion.button
      aria-label={dir === 'left' ? 'Previous project' : 'Next project'}
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
