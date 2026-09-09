'use client'

import { motion } from 'framer-motion'

// Re-mounts on every route change, so it doubles as a lightweight page
// transition — content fades/slides up as you move between / and /projects.
export default function Template({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.995 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
