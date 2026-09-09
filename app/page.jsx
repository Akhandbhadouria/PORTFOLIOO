'use client'

import { useState, useEffect, useLayoutEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import About from '../components/About'
import Projects from '../components/Projects'
import Certificates from '../components/CertificatesQuotes'
// import Certificates from '../components/Certificates'  // showcase-carousel version (kept for fallback)
import Skills from '../components/Skills'
import Experience from '../components/Experience'
import Now from '../components/Now'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
// import Footer from '../components/FooterAscii'   // interactive ASCII version (kept for fallback)
// import Footer from '../components/FooterGrid'    // grid + crosshair version (kept for fallback)
import CornerPlus from '../components/ui/corner-plus'

export default function Home() {
  // The curtain is in the prerendered HTML but hidden by CSS by default. An
  // inline script in app/layout.jsx decides show/skip BEFORE first paint and
  // exposes the verdict on window.__vyIntro:
  //   • show  → first visit in this tab session, or a hard refresh
  //   • skip  → in-session navigation back to "/", crawlers, or no-JS
  // We start `loading` true so the first client render matches the server HTML
  // (no hydration mismatch), then immediately drop it on a "skip" verdict. The
  // curtain was never painted in that case (CSS hid it pre-paint), so there is
  // no flash.
  const [loading, setLoading] = useState(true)
  const [greetingIndex, setGreetingIndex] = useState(0)

  const greetings = [
    "Hello", "Hola", "Bonjour", "Ciao", "こんにちは",
    "안녕하세요", "مرحبا", "Olá", "Hallo", "नमस्कार",
    "ਸਤ ਸ੍ਰੀ ਅਕਾਲ", "నమస్కారం", "ನಮಸ್ಕಾರ", "नमस्ते"
  ]

  const CRITICAL_IMAGES = ['/hero-bg.webp', '/1774288544676-1-tjs99i.webp']

  const [minLoaderTimeDone, setMinLoaderTimeDone] = useState(false)
  const [imgsDone, setImgsDone] = useState(false)

  // A direct load or reload should always introduce the page from its hero.
  // Preserve fragment navigation and browser history restoration for all other
  // routes so anchors and back/forward continue to work naturally.
  useLayoutEffect(() => {
    const previousRestoration = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'

    const shouldStartAtTop = !window.location.hash && window.__vyIntro === true
    if (shouldStartAtTop) window.scrollTo({ top: 0, left: 0, behavior: 'instant' })

    return () => {
      window.history.scrollRestoration = previousRestoration
    }
  }, [])

  // Honor the pre-paint verdict from the layout.jsx inline script.
  useEffect(() => {
    if (window.__vyIntro === false) setLoading(false)
  }, [])

  useEffect(() => {
    if (!loading) return
    Promise.all(
      CRITICAL_IMAGES.map(
        src => new Promise(resolve => {
          const img = new Image()
          img.onload = img.onerror = resolve
          img.src = src
        })
      )
    ).then(() => setImgsDone(true))
  }, [loading])

  useEffect(() => {
    if (!loading) return
    if (greetingIndex < greetings.length - 1) {
      const t = setTimeout(() => setGreetingIndex(prev => prev + 1), 110)
      return () => clearTimeout(t)
    } else {
      const t = setTimeout(() => setMinLoaderTimeDone(true), 120)
      return () => clearTimeout(t)
    }
  }, [greetingIndex, greetings.length])

  useEffect(() => {
    if (minLoaderTimeDone && imgsDone) setLoading(false)
  }, [minLoaderTimeDone, imgsDone])

  const loaderProgress = ((greetingIndex + 1) / greetings.length) * 100
  const easeFluid = [0.22, 1, 0.36, 1]
  const easeCurtain = [0.76, 0, 0.24, 1]

  return (
    <>
      {/* Loader curtain — lifts away to reveal the page underneath */}
      <AnimatePresence>
        {loading && (
          <motion.div
            key="loader"
            id="intro-curtain"
            exit={{
              y: '-100%',
              borderBottomLeftRadius: '48px',
              borderBottomRightRadius: '48px',
            }}
            transition={{ duration: 0.9, ease: easeCurtain }}
            style={{
              position: 'fixed', inset: 0, zIndex: 9999,
              background: 'var(--bg-base)', overflow: 'hidden',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 30px 60px rgba(var(--shadow-ink), 0.18)',
            }}
          >
            {/* Ambient blobs — same color field the site floats on */}
            <motion.div
              aria-hidden="true"
              animate={{ scale: [1, 1.18, 1], x: [0, 36, 0], y: [0, -24, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute', width: '48vw', height: '48vw',
                top: '-14vw', left: '-10vw', borderRadius: '50%',
                filter: 'blur(60px)', pointerEvents: 'none',
                background: 'radial-gradient(circle, rgba(247,121,15,0.16), transparent 65%)',
              }}
            />
            <motion.div
              aria-hidden="true"
              animate={{ scale: [1, 1.22, 1], x: [0, -30, 0], y: [0, 18, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
              style={{
                position: 'absolute', width: '52vw', height: '52vw',
                bottom: '-18vw', right: '-12vw', borderRadius: '50%',
                filter: 'blur(60px)', pointerEvents: 'none',
                background: 'radial-gradient(circle, rgba(108,142,255,0.18), transparent 65%)',
              }}
            />

            {/* Center stack — cycling greeting + progress line */}
            <div style={{ position: 'relative', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '22px' }}>
              <span className="mono-label">Akhand — Portfolio</span>

              <div
                style={{
                  height: 'clamp(48px, 8vw, 84px)', minWidth: 'min(520px, 86vw)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  position: 'relative',
                }}
              >
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={greetingIndex}
                    initial={{ opacity: 0, y: 16, scale: 0.96, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -16, scale: 0.96, filter: 'blur(10px)' }}
                    transition={{ duration: 0.24, ease: easeFluid }}
                    style={{
                      fontSize: 'clamp(36px, 5.5vw, 68px)',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-main)',
                      lineHeight: 1,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {greetings[greetingIndex]}
                  </motion.span>
                </AnimatePresence>
              </div>

              <div
                style={{
                  width: 'min(360px, 72vw)', height: '2px',
                  background: 'rgba(var(--ink), 0.1)',
                  borderRadius: '999px', overflow: 'hidden',
                }}
              >
                <motion.div
                  animate={{ width: `${loaderProgress}%` }}
                  transition={{ duration: 0.15, ease: easeFluid }}
                  style={{
                    height: '100%', width: 0,
                    background: 'linear-gradient(to right, #f7790f, #ffb347)',
                  }}
                />
              </div>
            </div>

            {/* Bottom rail — monogram + percent, mirrors the navbar/footer chrome */}
            <div
              style={{
                position: 'absolute', left: 'clamp(20px, 4vw, 48px)', right: 'clamp(20px, 4vw, 48px)', bottom: 'clamp(18px, 3vw, 36px)',
                display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    width: '20px',
                    height: '20px',
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
                  }}
                />
                <span style={{ fontFamily: 'var(--font-main)', fontWeight: 700, fontSize: '16px', color: 'var(--text-primary)', letterSpacing: '0.04em' }}>AKHAND</span>
              </div>
              <span className="mono-label" style={{ fontVariantNumeric: 'tabular-nums' }}>{String(Math.round(loaderProgress)).padStart(3, '0')}%</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Always rendered so it's present in the static HTML (crawlers and no-JS
          clients get the real content); the curtain above just covers it while
          the intro plays, then lifts to reveal it. */}
      <div className="site-content">
          <Navbar />
          <main>
            <Hero />
            <div className="grid-gutter" aria-hidden="true"><CornerPlus /></div>
            <About />
            <div className="grid-gutter" aria-hidden="true"><CornerPlus /></div>
            <Experience />
            <div className="grid-gutter" aria-hidden="true"><CornerPlus /></div>
            <Projects />
            <div className="grid-gutter" aria-hidden="true"><CornerPlus /></div>
            <Certificates />
            <div className="grid-gutter" aria-hidden="true"><CornerPlus /></div>
            <Skills />
            <div className="grid-gutter" aria-hidden="true"><CornerPlus /></div>
            <Now />
            <div className="grid-gutter" aria-hidden="true"><CornerPlus /></div>
            <Contact />
            <div className="grid-gutter" aria-hidden="true"><CornerPlus /></div>
            <Footer />
            <div aria-hidden="true" style={{ height: 'clamp(32px, 4vw, 56px)' }} />
          </main>
      </div>
    </>
  )
}
