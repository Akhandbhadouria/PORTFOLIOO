'use client'

import { useState, useEffect, useMemo } from 'react'

import SectionHeader from './ui/section-header'
import CornerPlus from './ui/corner-plus'

const profileLightImg = '/profile.webp'
const profileDarkImg = '/profile.webp'
const resumePdf = 'https://drive.google.com/file/d/1Qmg2B83VRTR0sgsx5XcWDxT3LiT0kLrg/view?usp=sharing'

const links = [
  { name: 'GitHub',     url: 'https://github.com/Akhandbhadouria',    icon: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' },
  { name: 'LinkedIn',   url: 'https://www.linkedin.com/in/akhand320/', icon: 'M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z' },
  { name: 'LeetCode',   url: 'https://leetcode.com/u/akhand_07/',   icon: 'M16.102 17.93l-2.697 2.607c-.466.467-1.111.662-1.823.662s-1.357-.195-1.824-.662l-4.332-4.363c-.467-.467-.702-1.15-.702-1.863s.235-1.357.702-1.824l4.319-4.38c.467-.467 1.125-.645 1.837-.645s1.357.195 1.823.662l2.697 2.606c.514.515 1.365.497 1.9-.038.535-.536.553-1.387.039-1.901l-2.609-2.636a5.055 5.055 0 0 0-2.445-1.337l2.467-2.503c.516-.514.498-1.366-.037-1.901-.535-.535-1.387-.552-1.902-.038l-10.1 10.101c-.981.982-1.494 2.337-1.494 3.835 0 1.498.513 2.895 1.494 3.875l4.347 4.361c.981.979 2.337 1.452 3.834 1.452s2.853-.473 3.833-1.452l2.697-2.606c.514-.515.497-1.366-.037-1.902-.536-.535-1.388-.552-1.903-.038zm-6.495-6.505l-2.112-2.1c-.244-.244-.244-.64 0-.884l2.112-2.113c.244-.244.64-.244.884 0l2.112 2.113c.244.244.244.64 0 .884l-2.112 2.1c-.244.244-.64.244-.884 0z' },
  { name: 'Email',      url: 'mailto:thakurakhand.singh21111@gmail.com',      icon: 'M12 12.713l11.985-8.713h-23.97l11.985 8.713zm0 2.47l-12-8.725v12.542h24v-12.542l-12 8.725z' },
  { name: 'Resume',     url: 'https://drive.google.com/file/d/1JweM7qBCADSj7XxRncEqMow7wmQ5fZK5/view?usp=sharing', icon: 'M14 0h-14v24h24v-14l-10-10zm-12 22v-20h9v7h7v13h-16zm6-8h8v2h-8v-2zm0-4h8v2h-8v-2zm0 8h8v2h-8v-2zm6-11l5 5h-5v-5z' },
]

const education = [
  { year: 'Currently', degree: 'B.Tech CSE', school: 'Lovely Professional University', current: true },
  { year: '2022', degree: 'Intermediate (XII)', school: 'Kendriya Vidyalaya Lalganj' },
  { year: '2020', degree: 'Matriculation (X)', school: 'Kendriya Vidyalaya Lalganj' },
]

const LEETCODE_USER = 'akhand_07'
const GITHUB_USER = 'Akhandbhadouria'

const labelStyle = {
  fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, color: 'var(--text-tertiary)',
  textTransform: 'uppercase', letterSpacing: '0.14em', display: 'block',
}

function LeetCodeCard() {
  const [mounted, setMounted] = useState(false)
  const [stats, setStats]     = useState(null)
  const [ranking, setRanking] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
    // Primary API (alfa-leetcode-api)
    fetch(`https://alfa-leetcode-api.onrender.com/${LEETCODE_USER}/solved`, { signal: AbortSignal.timeout?.(8000) })
      .then(r => { if (!r.ok) throw new Error(); return r.json() })
      .then(d => {
        if (d.solvedProblem != null || d.totalSolved != null) {
          setStats({
            totalSolved: d.solvedProblem ?? d.totalSolved ?? 0,
            easySolved: d.easySolved ?? 0,
            mediumSolved: d.mediumSolved ?? 0,
            hardSolved: d.hardSolved ?? 0,
          })
          setLoading(false)
        }
      })
      .catch(() => {
        // Fallback API (leetcode-stats-api)
        fetch(`https://leetcode-stats-api.herokuapp.com/${LEETCODE_USER}`, { signal: AbortSignal.timeout?.(8000) })
          .then(r => { if (!r.ok) throw new Error(); return r.json() })
          .then(d => {
            if (d.status === 'success' || d.totalSolved != null) {
              setStats({
                totalSolved: d.totalSolved ?? 0,
                easySolved: d.easySolved ?? 0,
                mediumSolved: d.mediumSolved ?? 0,
                hardSolved: d.hardSolved ?? 0,
              })
              if (d.ranking) setRanking(d.ranking)
            }
            setLoading(false)
          })
          .catch(() => setLoading(false))
      })

    // Fetch ranking separately from alfa API
    fetch(`https://alfa-leetcode-api.onrender.com/${LEETCODE_USER}`, { signal: AbortSignal.timeout?.(8000) })
      .then(r => r.json())
      .then(d => { if (d.ranking) setRanking(d.ranking) })
      .catch(() => {})
  }, [])

  const solved = stats?.totalSolved ?? 0
  const easy   = stats?.easySolved  ?? 0
  const medium = stats?.mediumSolved ?? 0
  const hard   = stats?.hardSolved  ?? 0
  const pct    = Math.round((solved / 3800) * 100)

  return (
    <div style={{
      background: 'rgba(var(--ink), 0.02)',
      border: '1px solid rgba(var(--ink), 0.08)',
      borderRadius: '12px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      height: '100%',
      justifyContent: 'space-between'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src="https://assets.leetcode.com/static_assets/public/icons/favicon-96x96.png" alt="LC" style={{ width: '20px', height: '20px', borderRadius: '4px' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
            LeetCode Stats
          </span>
        </div>
        <a
          href={`https://leetcode.com/u/${LEETCODE_USER}/`}
          target="_blank"
          rel="noreferrer"
          style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#f7790f', textDecoration: 'none', fontWeight: 600 }}
        >
          {LEETCODE_USER} ↗
        </a>
      </div>

      {/* Stats Row: Circular Ring + Difficulty Progress Bars */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* Ring */}
        <div style={{ position: 'relative', width: '72px', height: '72px', flexShrink: 0 }}>
          <svg width="72" height="72" viewBox="0 0 72 72" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="36" cy="36" r="30" fill="none" stroke="rgba(var(--ink),0.08)" strokeWidth="6" />
            {mounted && !loading && (
              <circle
                cx="36" cy="36" r="30"
                fill="none" stroke="#f7790f" strokeWidth="6" strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 30}`}
                strokeDashoffset={`${2 * Math.PI * 30 * (1 - Math.min(pct, 100) / 100)}`}
                style={{ transition: 'stroke-dashoffset 0.8s ease' }}
              />
            )}
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>
              {mounted && !loading ? solved : '…'}
            </span>
            <span style={{ fontSize: '9px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '2px' }}>
              Solved
            </span>
          </div>
        </div>

        {/* Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          {/* Easy */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontFamily: 'var(--font-mono)', marginBottom: '3px' }}>
              <span style={{ color: '#00b8a3', fontWeight: 600 }}>Easy</span>
              <span style={{ color: 'var(--text-secondary)' }}>{mounted && !loading ? `${easy} / 930` : '—'}</span>
            </div>
            <div style={{ height: '5px', borderRadius: '3px', background: 'rgba(var(--ink), 0.08)', overflow: 'hidden' }}>
              <div style={{ height: '100%', background: '#00b8a3', width: mounted && !loading ? `${Math.min((easy / 930) * 100, 100)}%` : '0%', transition: 'width 0.6s ease' }} />
            </div>
          </div>
          {/* Medium */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontFamily: 'var(--font-mono)', marginBottom: '3px' }}>
              <span style={{ color: '#ffc01e', fontWeight: 600 }}>Medium</span>
              <span style={{ color: 'var(--text-secondary)' }}>{mounted && !loading ? `${medium} / 2022` : '—'}</span>
            </div>
            <div style={{ height: '5px', borderRadius: '3px', background: 'rgba(var(--ink), 0.08)', overflow: 'hidden' }}>
              <div style={{ height: '100%', background: '#ffc01e', width: mounted && !loading ? `${Math.min((medium / 2022) * 100, 100)}%` : '0%', transition: 'width 0.6s ease' }} />
            </div>
          </div>
          {/* Hard */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontFamily: 'var(--font-mono)', marginBottom: '3px' }}>
              <span style={{ color: '#ef4743', fontWeight: 600 }}>Hard</span>
              <span style={{ color: 'var(--text-secondary)' }}>{mounted && !loading ? `${hard} / 913` : '—'}</span>
            </div>
            <div style={{ height: '5px', borderRadius: '3px', background: 'rgba(var(--ink), 0.08)', overflow: 'hidden' }}>
              <div style={{ height: '100%', background: '#ef4743', width: mounted && !loading ? `${Math.min((hard / 913) * 100, 100)}%` : '0%', transition: 'width 0.6s ease' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Footer / Rank */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px dashed rgba(var(--ink), 0.08)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Global Rank
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
          {mounted && ranking ? `#${Number(ranking).toLocaleString()}` : (mounted ? 'Top 10%' : '…')}
        </span>
      </div>
    </div>
  )
}


function GitHubCard() {
  const [mounted, setMounted] = useState(false)
  const [stats, setStats]     = useState({ repos: null, stars: null, followers: null })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
    Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USER}`).then(r => r.ok ? r.json() : null),
      fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100`).then(r => r.ok ? r.json() : [])
    ]).then(([user, repos]) => {
      const totalStars = Array.isArray(repos) ? repos.reduce((acc, r) => acc + (r.stargazers_count || 0), 0) : 0
      setStats({
        repos: user?.public_repos ?? 24,
        followers: user?.followers ?? 12,
        stars: totalStars || 15,
      })
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  return (
    <div style={{
      background: 'rgba(var(--ink), 0.02)',
      border: '1px solid rgba(var(--ink), 0.08)',
      borderRadius: '12px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      height: '100%',
      justifyContent: 'space-between'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--text-primary)">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
            GitHub Insights
          </span>
        </div>
        <a
          href={`https://github.com/${GITHUB_USER}`}
          target="_blank"
          rel="noreferrer"
          style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#f7790f', textDecoration: 'none', fontWeight: 600 }}
        >
          {GITHUB_USER} ↗
        </a>
      </div>

      {/* 3 Key Insights */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
        {/* Repos */}
        <div style={{
          background: 'rgba(var(--ink), 0.03)',
          border: '1px solid rgba(var(--ink), 0.06)',
          borderRadius: '8px',
          padding: '12px 8px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
            {mounted && !loading ? (stats.repos ?? '—') : '…'}
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '4px' }}>
            Repos
          </span>
        </div>

        {/* Stars */}
        <div style={{
          background: 'rgba(var(--ink), 0.03)',
          border: '1px solid rgba(var(--ink), 0.06)',
          borderRadius: '8px',
          padding: '12px 8px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          <span style={{ fontSize: '18px', fontWeight: 700, color: '#f7790f', lineHeight: 1.2 }}>
            {mounted && !loading ? (stats.stars ?? '—') : '…'}
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '4px' }}>
            Stars
          </span>
        </div>

        {/* Followers */}
        <div style={{
          background: 'rgba(var(--ink), 0.03)',
          border: '1px solid rgba(var(--ink), 0.06)',
          borderRadius: '8px',
          padding: '12px 8px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
            {mounted && !loading ? (stats.followers ?? '—') : '…'}
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '4px' }}>
            Followers
          </span>
        </div>
      </div>

      {/* Footer / Profile Link */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px dashed rgba(var(--ink), 0.08)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Open Source Activity
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>
          github.com/{GITHUB_USER}
        </span>
      </div>
    </div>
  )
}

export default function About() {
  return (
    <section id="about" className="section container grid-box">
      <CornerPlus />
      <SectionHeader
        eyebrow="About"
        title="Who I am."
        marginBottom={24}
        eyebrowClassName="about-eyebrow"
      />

      <div className="edi-sheet">

        {/* Row 1: Intro + Photo.
            Desktop → photo is a tall side column (original layout).
            Mobile  → photo floats right and the text wraps around it.
            Photo is first in the DOM so the float-wrap works on mobile;
            on desktop it's re-ordered to the right via grid `order`. */}
        <div className="edi-row about-row">
          {/* alignSelf start (not stretch) so the 3:4 aspect-ratio governs the
              height — a stretched cell would be taller than 3:4 and object-fit
              would crop the subject's shoulders off the sides. */}
          <div className="edi-cell edi-cell--flush about-photo-cell" style={{ position: 'relative', overflow: 'hidden', aspectRatio: '3 / 4', alignSelf: 'start' }}>
            {/* Two portraits shot on matching backdrops — both ship, and CSS
                cross-fades to the one matching the active theme. */}
            <img
              className="about-photo about-photo--light"
              src={profileLightImg} alt="Akhand" loading="lazy"
            />
            <img
              className="about-photo about-photo--dark"
              src={profileDarkImg} alt="" aria-hidden="true" loading="lazy"
            />
            <div style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 0 60px rgba(var(--shadow-ink), 0.25)', pointerEvents: 'none' }} />
          </div>
          <div className="edi-cell about-text-cell" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '20px' }}>
            <div>
              <span style={{ ...labelStyle, marginBottom: '14px' }}>Profile</span>
              <h3 style={{ fontSize: 'clamp(24px, 2.3vw, 32px)', lineHeight: 1.12, color: 'var(--text-primary)', fontWeight: 700, letterSpacing: '-0.02em', textTransform: 'uppercase', marginBottom: '12px' }}>
                Data Science & AI,<br />not just code.
              </h3>
              <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '560px' }}>
                B.Tech CSE student at Lovely Professional University, aspiring Data Scientist and AI/ML Engineer. I build end-to-end ML pipelines, Django-powered web apps, and data-driven systems that transform raw data into decisions.
              </p>
            </div>
            <div className="about-lower">
              {/* separator between Profile and the lower blocks */}
              <div style={{ height: '1px', background: 'rgba(var(--ink), 0.12)', marginBottom: '20px' }} />
              <div className="about-inner-grid">
                {/* LeetCode Stats */}
                <LeetCodeCard />
                {/* GitHub Insights */}
                <GitHubCard />
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Education | Connect */}
        <div className="edi-row edi-row-split about-records">
          <div className="edi-cell about-education">
            <span style={{ ...labelStyle, marginBottom: '18px' }}>Education</span>
            <div className="about-education-list">
              {education.map((e) => (
                <div key={e.degree} className="about-education-entry">
                  <span className={`about-education-year${e.current ? ' about-education-year--current' : ''}`}>
                    {e.year}
                  </span>
                  <div>
                    <h4 className="about-education-degree">{e.degree}</h4>
                    <span className="about-education-school">{e.school}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Connect */}
          <div className="edi-cell about-connect">
            <span style={{ ...labelStyle, marginBottom: '18px' }}>Connect</span>
            <p className="about-connect-intro">Find the work, the proof, or a direct way to get in touch.</p>
            <div className="about-connect-links">
              {links.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="edi-link about-connect-link"
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(var(--ink), 0.85)' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
                    <path d={link.icon} />
                  </svg>
                  {link.name}
                  <span className="edi-arrow">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 17L17 7M17 7V16" />
                    </svg>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
