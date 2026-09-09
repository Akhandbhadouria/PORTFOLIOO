'use client'

import { motion } from 'framer-motion'

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-base)',
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-main)',
        padding: '0 24px',
        textAlign: 'center',
      }}
    >
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '13px',
          fontWeight: 600,
          color: 'var(--accent)',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          marginBottom: '24px',
        }}
      >
        Error 404
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        style={{
          fontSize: 'clamp(64px, 15vw, 180px)',
          fontWeight: 700,
          lineHeight: 1,
          letterSpacing: '-0.05em',
          background: 'linear-gradient(to bottom, #0f172a, rgba(var(--ink), 0.35))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '24px',
        }}
      >
        404
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        style={{
          fontSize: '18px',
          color: 'var(--text-secondary)',
          maxWidth: '420px',
          lineHeight: 1.6,
          marginBottom: '40px',
        }}
      >
        This page doesn't exist — or maybe it wandered off.
      </motion.p>

      <motion.a
        href="/"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'linear-gradient(to right, #ff7a18, #ffb347)',
          color: '#000',
          fontWeight: 600,
          fontSize: '15px',
          padding: '14px 28px',
          borderRadius: '100px',
          textDecoration: 'none',
          boxShadow: '0 10px 30px rgba(255,122,24,0.25)',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        whileHover={{ scale: 1.05 }}
      >
        ← Back home
      </motion.a>
    </div>
  )
}
