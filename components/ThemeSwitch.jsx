'use client'

import { useEffect, useState } from 'react'

/* The sun/moon orb slider from the theme onboarding card, extracted so it can
   live anywhere (navbar, drawer, onboarding). Flips data-theme — the page
   morphs via CSS transitions — and persists the choice to localStorage. */
export default function ThemeSwitch({ compact = false }) {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    const sync = () => setTheme(document.documentElement.getAttribute('data-theme') || 'light')
    sync()
    const observer = new MutationObserver(sync)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => observer.disconnect()
  }, [])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    const root = document.documentElement
    // Flip the attribute directly — the theme morphs via the CSS transitions on
    // the glass surfaces and the shaders easing their palette. No wipe.
    root.setAttribute('data-theme', next)
    root.setAttribute('data-theme-source', 'saved')

    try {
      localStorage.setItem('vy_theme', next)
    } catch {}
    setTheme(next)
  }

  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      className={`theme-notice-switch${compact ? ' theme-notice-switch--compact' : ''}`}
      role="switch"
      aria-checked={isDark}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      onClick={toggleTheme}
    >
      <span className="theme-notice-switch-icon theme-notice-switch-icon--sun" aria-hidden="true">☀</span>
      <span className="theme-notice-switch-icon theme-notice-switch-icon--moon" aria-hidden="true">☾</span>
      <span className="theme-notice-switch-orb" aria-hidden="true" />
    </button>
  )
}
