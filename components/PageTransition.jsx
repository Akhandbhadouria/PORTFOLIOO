'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'

const easeFluid = [0.22, 1, 0.36, 1]

const TransitionCtx = createContext({ navigate: null })

/* Drop-in Link replacement — plays the veil sweep before routing.
   `label` is the big word shown on the veil while it covers. */
export function TransitionLink({ href, label, children, ...props }) {
  const { navigate } = useContext(TransitionCtx)
  return (
    <Link
      href={href}
      {...props}
      onClick={(e) => {
        if (!navigate) return
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return // let new-tab clicks through
        e.preventDefault()
        navigate(href, label)
      }}
    >
      {children}
    </Link>
  )
}

export default function TransitionProvider({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [veil, setVeil] = useState(null) // { label } while covering
  const pendingRef = useRef(null)
  const failsafeRef = useRef(null)

  const navigate = useCallback((href, label) => {
    const targetPath = href.split('#')[0] || '/'
    // Same page (e.g. "/#contact" while on "/") or reduced motion → plain nav.
    const reduced = typeof window !== 'undefined'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (targetPath === pathname || reduced) {
      router.push(href)
      return
    }
    pendingRef.current = targetPath
    setVeil({ label })
    // route once the cover sweep has landed
    setTimeout(() => router.push(href), 620)
    // failsafe — never leave the veil stuck
    clearTimeout(failsafeRef.current)
    failsafeRef.current = setTimeout(() => {
      pendingRef.current = null
      setVeil(null)
    }, 3200)
  }, [pathname, router])

  // Route landed → hold a beat so the new page paints, then lift the veil.
  useEffect(() => {
    if (pendingRef.current && pathname === pendingRef.current) {
      const t = setTimeout(() => {
        pendingRef.current = null
        clearTimeout(failsafeRef.current)
        setVeil(null)
      }, 200)
      return () => clearTimeout(t)
    }
  }, [pathname])

  return (
    <TransitionCtx.Provider value={{ navigate }}>
      {children}

      <AnimatePresence>
        {veil && (
          <motion.div
            key="pt-veil"
            className="pt-veil"
            initial="hidden"
            animate="cover"
            exit="reveal"
          >
            {/* orange leading edge */}
            <motion.div
              className="pt-veil-accent"
              variants={{
                hidden: { y: '103%' },
                cover: { y: '0%', transition: { duration: 0.5, ease: easeFluid } },
                reveal: { y: '-103%', transition: { duration: 0.55, ease: easeFluid, delay: 0.07 } },
              }}
            />
            {/* deep navy panel that carries the label */}
            <motion.div
              className="pt-veil-main"
              variants={{
                hidden: { y: '103%' },
                cover: { y: '0%', transition: { duration: 0.55, ease: easeFluid, delay: 0.07 } },
                reveal: { y: '-103%', transition: { duration: 0.6, ease: easeFluid } },
              }}
            >
              <motion.div
                className="pt-veil-label"
                variants={{
                  hidden: { opacity: 0, y: 26 },
                  cover: { opacity: 1, y: 0, transition: { duration: 0.45, ease: easeFluid, delay: 0.32 } },
                  reveal: { opacity: 0, y: -20, transition: { duration: 0.22, ease: 'easeIn' } },
                }}
              >
                <span className="pt-veil-eyebrow">
                  <span className="pt-veil-eyebrow-line" />
                  Going to
                </span>
                <span className="pt-veil-word">{veil.label}</span>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </TransitionCtx.Provider>
  )
}
