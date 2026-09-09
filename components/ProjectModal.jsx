'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import ModalShader from './ui/modal-shader'

const GITHUB_ICON = 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z'

// Section label inside the modal body — mono uppercase with a short accent rule.
function ModalSectionLabel({ children, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
      <span style={{ width: '18px', height: '1px', background: color }} />
      <span className="mono-label" style={{ color }}>
        {children}
      </span>
    </div>
  )
}

/* ── Project detail modal — image left, story right, shader behind ── */
export default function ProjectModal({ project, onClose }) {
  // Esc to close + lock body scroll while open.
  useEffect(() => {
    const onKey = (e) => { if (e?.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [onClose])

  const [shotBroken, setShotBroken] = useState(false)
  const hasVisual = Boolean(project.image) && !shotBroken

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        background: 'rgba(var(--base), 0.7)',
        backdropFilter: 'blur(20px) saturate(140%)',
        WebkitBackdropFilter: 'blur(20px) saturate(140%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 'clamp(14px, 2.5vw, 40px)',
      }}
    >
      <motion.div
        initial={{ y: 28, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 24, opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="pmodal"
      >
        {/* live silk backdrop, tinted to the project accent */}
        <ModalShader accent={project.accent} />

        {/* Close */}
        <motion.button
          aria-label="Close"
          onClick={onClose}
          whileHover={{ scale: 1.08, rotate: 90 }}
          whileTap={{ scale: 0.92 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'absolute', top: 16, right: 16, zIndex: 3,
            width: 40, height: 40, borderRadius: '999px',
            background: 'rgba(var(--paper), 0.85)',
            backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid var(--hairline)',
            color: 'var(--text-primary)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 10px 24px rgba(var(--shadow-ink), 0.14)',
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </motion.button>

        {/* LEFT — screenshot floating on the shader */}
        <div className="pmodal-visual">
          {hasVisual ? (
            <motion.img
              src={project.image}
              alt={project.name}
              onError={() => setShotBroken(true)}
              initial={{ y: 18, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            />
          ) : (
            <motion.div
              initial={{ y: 18, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              style={{
                width: '78%', aspectRatio: '16 / 9', borderRadius: 'var(--r-cell)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(var(--paper), 0.14)',
                border: '1px solid rgba(var(--paper), 0.35)',
                backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
                boxShadow: '0 30px 60px rgba(var(--shadow-ink), 0.28)',
              }}
            >
              <span style={{
                fontFamily: 'var(--font-main)', fontWeight: 700,
                fontSize: 'clamp(28px, 4vw, 48px)', letterSpacing: '-0.02em',
                color: '#fff', textShadow: '0 4px 18px rgba(var(--shadow-ink), 0.35)',
              }}>
                {project.name}
              </span>
            </motion.div>
          )}
          <div className="pmodal-meta">
            {(project.year || project.status) && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(var(--paper), 0.9)' }}>
                {project.year}
                {project.status && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: project.status === 'Live' ? 'var(--status-live)' : '#fff' }} />
                    {project.status}
                  </span>
                )}
              </span>
            )}
          </div>
        </div>

        {/* RIGHT — the story, on a glass panel */}
        <div className="pmodal-panel">
          <div className="pmodal-scroll">
            <span className="mono-label" style={{ color: project.accent, display: 'block', marginBottom: '10px' }}>
              {project.label}
            </span>
            <h3 style={{
              fontSize: 'clamp(24px, 2.4vw, 32px)', fontWeight: 700,
              color: 'var(--text-primary)', letterSpacing: '-0.025em', lineHeight: 1.1,
              marginBottom: '12px',
            }}>
              {project.name}
            </h3>

            {project.summary && (
              <p style={{ fontSize: '15px', color: 'var(--text-primary)', fontWeight: 500, lineHeight: 1.55, margin: '0 0 22px' }}>
                {project.summary}
              </p>
            )}

            {project.description && (
              <div style={{ marginBottom: '24px' }}>
                <ModalSectionLabel color={project.accent}>Overview</ModalSectionLabel>
                <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
                  {project.description}
                </p>
              </div>
            )}

            {project.features?.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <ModalSectionLabel color={project.accent}>Key Features</ModalSectionLabel>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '9px' }}>
                  {project.features.map((f) => (
                    <li key={f} style={{ display: 'flex', gap: '11px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      <span style={{ flexShrink: 0, marginTop: '7px', width: '5px', height: '5px', borderRadius: '50%', background: project.accent }} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {project.highlights?.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <ModalSectionLabel color={project.accent}>Technical Highlights</ModalSectionLabel>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {project.highlights.map((h) => (
                    <li key={h} style={{ display: 'flex', gap: '11px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      <span style={{ flexShrink: 0, marginTop: '3px', fontFamily: 'var(--font-mono)', fontSize: '10px', color: project.accent }}>›</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {project.stats?.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <ModalSectionLabel color={project.accent}>Stack</ModalSectionLabel>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '14px 20px' }}>
                  {project.stats.map(([k, v]) => (
                    <div key={k}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-tertiary)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '4px' }}>{k}</div>
                      <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)' }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {project.tags?.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {project.tags.map((t) => (
                  <span
                    key={t}
                    style={{
                      background: project.accent + '14',
                      border: `1px solid ${project.accent}30`,
                      borderRadius: '999px',
                      padding: '5px 13px',
                      fontSize: '11px',
                      fontFamily: 'var(--font-mono)',
                      color: project.accent,
                      letterSpacing: '0.04em',
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* CTAs pinned at the panel foot */}
          {(project.link || project.github) && (
            <div className="pmodal-ctas">
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '10px',
                    padding: '11px 22px', borderRadius: '999px',
                    background: project.accent, border: `1px solid ${project.accent}`,
                    color: '#fff', fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700,
                    letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none',
                    transition: 'transform 0.25s cubic-bezier(0.22,1,0.36,1), box-shadow 0.25s cubic-bezier(0.22,1,0.36,1)',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 10px 26px ${project.accent}66` }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
                >
                  Visit live
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                </a>
              )}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '10px',
                    padding: '11px 22px', borderRadius: '999px',
                    background: 'rgba(var(--paper), 0.7)', border: '1px solid var(--hairline)',
                    color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700,
                    letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none',
                    transition: 'transform 0.25s cubic-bezier(0.22,1,0.36,1)',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d={GITHUB_ICON} /></svg>
                  View code
                </a>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
