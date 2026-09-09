'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, useScroll, useSpring, useInView } from 'framer-motion'
import { TransitionLink } from '../../components/PageTransition'
import ModalShader from '../../components/ui/modal-shader'
import { ALL_PROJECTS } from '../../lib/projects'
import Navbar from '../../components/Navbar'

const easeFluid = [0.22, 1, 0.36, 1]

const GITHUB_ICON = 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z'

function SectionLabel({ children, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
      <span style={{ width: '18px', height: '1px', background: color }} />
      <span className="mono-label" style={{ color }}>{children}</span>
    </div>
  )
}

/* ── One full-width case-study card on the rail ── */
function TimelineItem({ project, index, active, registerRef }) {
  const isPlaceholder = project.placeholder
  const passed = active >= index
  const isActive = active === index

  // Only run the WebGL shader while the card is near the viewport.
  const cardRef = useRef(null)
  const inView = useInView(cardRef, { margin: '300px 0px 300px 0px' })

  // Fall back to a branded tile if the screenshot is missing or fails to load.
  const [shotBroken, setShotBroken] = useState(false)
  const hasShot = project.image && !shotBroken

  return (
    <div
      className={`ptl-item${isActive ? ' ptl-item--active' : ''}`}
      ref={registerRef}
    >
      {/* node on the rail — fills in once the ball passes it */}
      <span
        className={`ptl-node${passed ? ' ptl-node--passed' : ''}`}
        style={{ '--node-accent': project.accent }}
        aria-hidden="true"
      />

      <article
        ref={cardRef}
        className={`ptl-card${isPlaceholder ? ' ptl-card--soon' : ''}`}
        style={{ '--card-accent': project.accent }}
      >
        {/* live silk backdrop tinted to the project accent */}
        {!isPlaceholder && inView && (
          <div className="ptl-card-shader" aria-hidden="true">
            <ModalShader accent={project.accent} />
          </div>
        )}
        {isPlaceholder ? (
          <div className="ptl-soon-body">
            <span className="mono-label" style={{ color: 'var(--text-tertiary)', display: 'block', marginBottom: '10px' }}>
              {project.label} · {project.year}
            </span>
            <h2 className="ptl-card-title" style={{ marginBottom: '10px' }}>{project.name}</h2>
            <p className="ptl-card-summary" style={{ marginBottom: '18px' }}>{project.summary}</p>
            <span className="proj-row-soon">
              <span className="proj-row-soon-dot" />
              Coming soon
            </span>
          </div>
        ) : (
          <>
            {/* Visual column — sticks in view while you read */}
            <div className="ptl-card-visual">
              {(project.year || project.status) && (
                <span className="ptl-card-badge">
                  {project.year}
                  {project.status && (
                    <>
                      <span
                        className="ptl-card-badge-dot"
                        style={{ background: project.status === 'Live' ? 'var(--status-live)' : 'currentColor' }}
                      />
                      {project.status}
                    </>
                  )}
                </span>
              )}
              <div className="ptl-card-shot">
                {hasShot ? (
                  <img src={project.image} alt={project.name} loading="lazy" draggable={false} onError={() => setShotBroken(true)} />
                ) : (
                  <div
                    className="ptl-card-placeholder"
                    style={{ background: `linear-gradient(135deg, ${project.accent}26, ${project.accent}0a)` }}
                  >
                    <span style={{ color: project.accent }}>{project.name}</span>
                  </div>
                )}
              </div>

              {project.stats?.length > 0 && (
                <div className="ptl-stats">
                  {project.stats.map(([k, v]) => (
                    <div key={k} className="ptl-stat">
                      <div className="ptl-stat-k">{k}</div>
                      <div className="ptl-stat-v">{v}</div>
                    </div>
                  ))}
                </div>
              )}

              {(project.link || project.github) && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="proj-row-btn">
                      Visit live
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                    </a>
                  )}
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="proj-row-link">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d={GITHUB_ICON} /></svg>
                      View code
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Story column — the whole case study, inline */}
            <div className="ptl-card-body">
              <span className="mono-label" style={{ color: project.accent, display: 'block', marginBottom: '10px' }}>
                {project.label}
              </span>

              <h2 className="ptl-card-title">{project.name}</h2>

              {project.summary && <p className="ptl-card-summary">{project.summary}</p>}

              {project.description && (
                <div className="ptl-section">
                  <SectionLabel color={project.accent}>Overview</SectionLabel>
                  <p className="ptl-card-desc">{project.description}</p>
                </div>
              )}

              {project.features?.length > 0 && (
                <div className="ptl-section">
                  <SectionLabel color={project.accent}>Key Features</SectionLabel>
                  <ul className="ptl-list ptl-list--grid">
                    {project.features.map((f) => (
                      <li key={f}>
                        <span className="ptl-list-dot" style={{ background: project.accent }} />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {project.highlights?.length > 0 && (
                <div className="ptl-section">
                  <SectionLabel color={project.accent}>Technical Highlights</SectionLabel>
                  <ul className="ptl-list">
                    {project.highlights.map((h) => (
                      <li key={h}>
                        <span className="ptl-list-caret" style={{ color: project.accent }}>›</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {project.tags?.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {project.tags.map((t) => (
                    <span key={t} className="tag-capsule">{t}</span>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </article>
    </div>
  )
}

export default function ProjectsIndex() {
  const trackRef = useRef(null)
  const itemRefs = useRef([])
  const [active, setActive] = useState(0)

  // Rail fill — synced to the viewport center, where the ball sits.
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start center', 'end center'],
  })
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 })

  // Which project is at the viewport center right now.
  const updateActive = useCallback(() => {
    const mid = window.innerHeight / 2
    let idx = 0
    itemRefs.current.forEach((el, i) => {
      if (el && el.getBoundingClientRect().top <= mid) idx = i
    })
    setActive(idx)
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
    updateActive()
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(updateActive)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [updateActive])

  const activeAccent = ALL_PROJECTS[active]?.accent || 'var(--accent)'

  return (
    <div className="site-content">
      {/* Shared site navbar — same experience as the home page */}
      <Navbar />

      <main className="container" style={{ paddingTop: 'clamp(96px, 12vw, 148px)', paddingBottom: 'clamp(48px, 6vw, 88px)' }}>
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: easeFluid }}
          style={{ marginBottom: 'clamp(48px, 7vw, 96px)', maxWidth: '760px' }}
        >
          <span className="mono-label" style={{ display: 'block', marginBottom: '18px' }}>ALL PROJECTS · {ALL_PROJECTS.length}</span>
          <h1 style={{
            fontSize: 'clamp(38px, 6vw, 68px)', fontWeight: 700,
            color: 'var(--text-primary)', letterSpacing: '-0.04em', lineHeight: 1.02,
            marginBottom: '20px',
          }}>
            Everything I&apos;ve been building.
          </h1>
          <p style={{ fontSize: 'clamp(15px, 1.6vw, 18px)', color: 'var(--text-secondary)', lineHeight: 1.65, maxWidth: '560px' }}>
            The full index — shipped products, work in progress, and what&apos;s next.
            Every case study lives right here on the page.
          </p>
        </motion.div>

        {/* ── Rail timeline: ball rides the track at viewport center ── */}
        <div className="ptl" ref={trackRef}>
          <div className="ptl-rail" aria-hidden="true">
            <span className="ptl-line" />
            <motion.span className="ptl-line-progress" style={{ scaleY: progress }} />
            <div className="ptl-ball-holder">
              <span className="ptl-ball" style={{ '--ball-accent': activeAccent }}>
                <span className="ptl-ball-num">{String(active + 1).padStart(2, '0')}</span>
                <span className="ptl-ball-ring" />
              </span>
            </div>
          </div>

          <div className="ptl-items">
            {ALL_PROJECTS.map((p, i) => (
              <TimelineItem
                key={p.id}
                project={p}
                index={i}
                active={active}
                registerRef={(el) => { itemRefs.current[i] = el }}
              />
            ))}
          </div>
        </div>

        {/* Foot CTA */}
        <div style={{ marginTop: 'clamp(56px, 7vw, 96px)', textAlign: 'center' }}>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
            Want to see how any of these were built, or talk about something new?
          </p>
          <TransitionLink href="/#contact" label="Contact." className="proj-row-btn" style={{ display: 'inline-flex' }}>
            Let&apos;s talk
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </TransitionLink>
        </div>
      </main>
    </div>
  )
}
