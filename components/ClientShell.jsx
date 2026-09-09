'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

const greetings = [
  "Hello", "Hola", "Bonjour", "Ciao", "こんにちは",
  "안녕하세요", "مرحبا", "Olá", "Hallo", "नमस्कार",
  "ਸਤ ਸ੍ਰੀ ਅਕਾਲ", "నమస్కారం", "ನಮಸ್ಕಾರ", "नमस्ते"
]

const CRITICAL_IMAGES = ['/hero-bg.webp', '/1774288544676-1-tjs99i.webp']

const BOT_PATTERN = /bot|crawl|spider|slurp|facebookexternalhit|linkedinbot|twitterbot|whatsapp|telegram|googlebot|bingbot|yandex|baidu|duckduck|semrush|ahref|lighthouse|pagespeed|headless/i

function isBot() {
  if (typeof navigator === 'undefined') return true
  return BOT_PATTERN.test(navigator.userAgent)
}

export default function ClientShell({ children }) {
  const skip = isBot()
  const [loading, setLoading] = useState(!skip)
  const [greetingIndex, setGreetingIndex] = useState(0)
  const [animDone, setAnimDone] = useState(skip)
  const [imgsDone, setImgsDone] = useState(skip)

  useEffect(() => {
    Promise.all(
      CRITICAL_IMAGES.map(
        src => new Promise(resolve => {
          const img = new Image()
          img.onload = img.onerror = resolve
          img.src = src
        })
      )
    ).then(() => setImgsDone(true))
  }, [])

  useEffect(() => {
    if (greetingIndex < greetings.length - 1) {
      const t = setTimeout(() => setGreetingIndex(prev => prev + 1), 400)
      return () => clearTimeout(t)
    } else {
      const t = setTimeout(() => setAnimDone(true), 800)
      return () => clearTimeout(t)
    }
  }, [greetingIndex])

  useEffect(() => {
    if (animDone && imgsDone) setLoading(false)
  }, [animDone, imgsDone])

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <motion.div
          key="loader"
          exit={{ opacity: 0, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } }}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'var(--bg-base)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <AnimatePresence mode="popLayout">
            <motion.span
              key={greetingIndex}
              initial={{ opacity: 0, scale: 0.95, filter: 'blur(8px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.95, filter: 'blur(8px)' }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              style={{
                fontSize: 'clamp(32px, 5vw, 64px)',
                fontWeight: 600, color: 'var(--text-primary)',
                fontFamily: 'var(--font-main)',
                position: 'absolute',
              }}
            >
              {greetings[greetingIndex]}
            </motion.span>
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
