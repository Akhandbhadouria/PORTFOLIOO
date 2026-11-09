'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

const W = 560
const H_LID = 350
const H_BASE = 350

export default function MacbookReveal() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  // ── CINEMATIC TRUE 3D DOLLY ZOOM ── //
  // Z moves from deep space (-1500) to right up against the lens (+1150)
  const worldZ    = useTransform(scrollYProgress, [0, 0.90], [-1500, 1150]) 
  // Y centers the scene vertically on the screen exactly as we close in
  const worldY    = useTransform(scrollYProgress, [0, 0.90], [250, 175])
  // Pan from looking down at the table to looking straight-on at the screen
  const worldRotX = useTransform(scrollYProgress, [0, 0.90], [-20, 0])

  // Laptop opening motion
  const lidAngle  = useTransform(scrollYProgress, [0, 0.45], [-55, 0])

  // UI & Lighting Fades
  const screenOpacity = useTransform(scrollYProgress, [0.0, 0.25], [0.3, 1])
  const hintOpacity   = useTransform(scrollYProgress, [0, 0.05, 0.10], [1, 1, 0])
  const exitOpacity   = useTransform(scrollYProgress, [0.85, 0.98], [0, 1])

  return (
    <div ref={ref} style={{ height: '400vh', position: 'relative' }}>
      <div style={{
        position: 'sticky', top: 0, height: '100vh', width: '100vw',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#040306', overflow: 'hidden',
      }}>

        {/* CSS TRUE 3D VIEWPORT */}
        <div style={{
          perspective: '1200px',
          width: '100vw', height: '100vh',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transformStyle: 'preserve-3d',
        }}>
          
          {/* THE DOLLY CAMERA FRAME */}
          <motion.div style={{
            transformStyle: 'preserve-3d',
            x: 0, y: worldY, z: worldZ, rotateX: worldRotX,
            willChange: 'transform',
          }}>
            
            {/* ══ 1. INFINITE DESK ENVIROMENT ══ */}
            <div style={{ position: 'absolute', top: 0, left: 0, transformStyle: 'preserve-3d' }}>
              
              {/* Floor Plane - highly optimized radial falloff instead of massive geometry */}
              <div style={{
                position: 'absolute', width: '2800px', height: '2200px',
                transform: 'translate(-50%, -50%) rotateX(90deg)',
                background: '#060508',
                backgroundImage: 'linear-gradient(rgba(var(--paper), 0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--paper), 0.015) 1px, transparent 1px)',
                backgroundSize: '100px 100px',
                maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
                WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
                top: '5px', // Sit just beneath the laptop hinge
              }} />
              
              {/* Hot Neon Radiant Glow (Zero GPU blur, huge performance boost) */}
              <motion.div style={{
                position: 'absolute', width: '1600px', height: '1400px',
                transform: 'translate(-50%, -50%) rotateX(90deg)',
                background: 'radial-gradient(ellipse at center, rgba(160, 50, 255, 0.25) 0%, rgba(255, 50, 100, 0.12) 25%, rgba(255, 120, 50, 0.05) 45%, transparent 70%)',
                opacity: screenOpacity,
              }} />
              
              {/* Drop Shadow Base */}
              <div style={{
                position: 'absolute', width: `${W+100}px`, height: `${H_BASE+100}px`,
                transform: 'translate(-50%, -50px) rotateX(90deg)',
                background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.9) 10%, rgba(0,0,0,0.5) 40%, transparent 70%)',
              }} />

              {/* Table Front Edge with Legs */}
              <div style={{
                position: 'absolute', width: '2800px', height: '60px',
                transform: 'translate(-50%, 0) translateZ(800px)',
                top: '5px', background: 'linear-gradient(180deg, #09070a 0%, #000 100%)',
                borderTop: '2px solid rgba(var(--paper), 0.04)',
                transformStyle: 'preserve-3d',
                maskImage: 'linear-gradient(90deg, transparent 0%, black 20%, black 80%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, black 20%, black 80%, transparent 100%)',
              }}>
                 {/* Legs pushed inward so they perfectly frame the zoom */}
                 <div style={{ position: 'absolute', left: '600px', top: 0, width: '40px', height: '1000px', background: 'linear-gradient(90deg, #020202, #080808)' }} />
                 <div style={{ position: 'absolute', right: '600px', top: 0, width: '40px', height: '1000px', background: 'linear-gradient(90deg, #080808, #020202)' }} />
              </div>
            </div>


            {/* ══ 2. MACBOOK BASE ══ */}
            <div style={{
              position: 'absolute', top: 0, left: 0,
              width: W, height: H_BASE,
              transformOrigin: 'top center',
              transform: 'translate(-50%, 0) rotateX(90deg)',
              background: 'linear-gradient(180deg, #2a2a2c 0%, #171719 100%)',
              borderRadius: '0 0 16px 16px',
              transformStyle: 'preserve-3d',
            }}>
              <div style={{ padding: '24px 30px', position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', transform: 'translateZ(1px)' }}>
                {/* Speakers */}
                <div style={{ position: 'absolute', top: '30px', left: '12px', width: '22px', height: '180px', background: 'repeating-linear-gradient(90deg, #111 0px, #111 1px, transparent 1px, transparent 3px)' }} />
                <div style={{ position: 'absolute', top: '30px', right: '12px', width: '22px', height: '180px', background: 'repeating-linear-gradient(90deg, #111 0px, #111 1px, transparent 1px, transparent 3px)' }} />

                {/* Keyboard Layout */}
                <div style={{
                  background: '#151517', width: '440px', height: '180px', margin: '0 auto',
                  borderRadius: '8px', padding: '8px', boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.8), 0 1px 0 rgba(var(--specular), 0.06)'
                }}>
                  {[
                    { h: '12px', flex: [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2] },
                    { h: '22px', flex: [1.5, ...Array(12).fill(1), 1.5] },
                    { h: '22px', flex: [1.8, ...Array(12).fill(1), 1.2] },
                    { h: '22px', flex: [2.2, ...Array(11).fill(1), 2.2] },
                    { h: '22px', flex: [2.8, ...Array(10).fill(1), 2.8] },
                    { h: '24px', flex: [1.2, 1.2, 1.2, 6, 1.2, 1.2, 1.2] },
                  ].map((row, rIdx) => (
                    <div key={rIdx} style={{ display: 'flex', gap: '3px', marginBottom: '3px', height: row.h }}>
                      {row.flex.map((flex, kIdx) => (
                        <div key={kIdx} style={{ flex, background: '#1c1c1e', border: '1px solid #111', borderRadius: '3px' }} />
                      ))}
                    </div>
                  ))}
                </div>

                {/* Trackpad Line */}
                <div style={{ display: 'flex', flex: 1, marginTop: '20px', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1, paddingLeft: '14px', paddingTop: '24px' }}>
                    <span style={{ fontFamily: 'var(--font-main)', fontWeight: 800, fontSize: '24px', letterSpacing: '-0.06em', color: 'transparent', WebkitTextStroke: '1.5px rgba(var(--paper), 0.2)', userSelect: 'none', lineHeight: 1 }}>APS.</span>
                  </div>
                  <div style={{ width: '180px', height: '110px', background: 'rgba(var(--paper), 0.02)', border: '1px solid rgba(var(--paper), 0.05)', borderRadius: '8px' }} />
                  <div style={{ flex: 1 }} />
                </div>
              </div>

              {/* Radiant Screen Reflection on Keyboard */}
              <motion.div style={{
                position: 'absolute', inset: 0,
                background: 'radial-gradient(ellipse at top center, rgba(255,50,150,0.18) 0%, rgba(100,60,255,0.12) 30%, transparent 80%)',
                opacity: screenOpacity, pointerEvents: 'none', borderRadius: '0 0 16px 16px', transform: 'translateZ(2px)',
              }} />

              {/* Edge Lip Downward */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, width: '100%', height: '16px',
                background: 'linear-gradient(180deg, #3c3c3e 0%, #1a1a1c 100%)',
                transformOrigin: 'bottom center', transform: 'rotateX(-90deg)', borderRadius: '0 0 16px 16px', display: 'flex', justifyContent: 'center'
              }}>
                <div style={{ width: '80px', height: '6px', background: '#111', borderRadius: '0 0 6px 6px' }} />
              </div>
            </div>


            {/* ══ 3. MACBOOK LID ══ */}
            <motion.div style={{
              position: 'absolute', top: 0, left: 0, width: W, height: H_LID,
              transformOrigin: 'bottom center', transformStyle: 'preserve-3d',
              x: '-50%', y: '-100%', rotateX: lidAngle,
            }}>

              {/* A. Screen Front Face */}
              <div style={{
                position: 'absolute', inset: 0, transform: 'translateZ(1px)', 
              }}>
                <div style={{ position: 'absolute', inset: 0, background: '#111113', borderRadius: '16px 16px 0 0', boxShadow: 'inset 0 1px 0 rgba(var(--specular), 0.15)' }} />
                <div style={{ position: 'absolute', top: '8px', left: '50%', transform: 'translateX(-50%)', width: '6px', height: '6px', borderRadius: '50%', background: '#040404' }} />

                {/* The Monitor Inner Area */}
                <div style={{
                  position: 'absolute', top: '14px', left: '14px', right: '14px', bottom: '20px',
                  backgroundColor: '#000', borderRadius: '4px', overflow: 'hidden',
                }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, #1a1e26 0%, #000 80%)' }} />
                  
                  <motion.div style={{ position: 'absolute', inset: 0, opacity: screenOpacity }}>
                    <div style={{ width: '100%', height: '100%', backgroundImage: 'url(/hero-bg.webp)', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(165deg, rgba(4,7,14,0.85), rgba(5,8,13,0.95))' }} />
                      
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '12px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: '#fff', fontWeight: 800, fontSize: '12px' }}>APS.</span>
                        <div style={{ display: 'flex', gap: '16px' }}>{['Home', 'Projects', 'Stack', 'Experience'].map(l => <span key={l} style={{ color: 'rgba(var(--paper), 0.6)', fontSize: '8px' }}>{l}</span>)}</div>
                      </div>
                      
                      <div style={{ position: 'absolute', bottom: '28px', left: '30px', right: '30px' }}>
                        <p style={{ color: '#ff7a18', fontWeight: 700, fontSize: '22px', lineHeight: 1.05, letterSpacing: '-0.03em' }}>Data Science & AI</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* B. Screen Back (Luminous Apple Logo) */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(150deg, #3c3c3e 0%, #2a2a2c 60%, #222224 100%)',
                borderRadius: '16px 16px 0 0',
                transform: 'translateZ(-1px) rotateY(180deg)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: 'inset 0 1px 0 rgba(var(--specular), 0.1)',
              }}>
                <svg width="34" height="42" viewBox="0 0 814 1000" fill="rgba(var(--specular), 0.95)" style={{ filter: 'drop-shadow(0 0 8px rgba(var(--specular), 0.6))' }}>
                  <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-43.4-150.3-113.4C27.1 756 0 665.8 0 561Q0 409.3 79 289.9C138.6 197.2 236.7 131 349.4 131c64.8 0 122.6 43.4 164.1 43.4 40.3 0 103.8-46.5 178-46.5c28.2.5 112.7 8.5 168.9 81.4zm-107.4-110.3c24.1-29.8 41.5-71.4 41.5-113s-2.6-43.8-3.8-61c-39.4 2.6-88.9 26.3-121.8 61.7-26.3 29.1-48.2 70.7-48.2 112.9 0 4.5.6 9 1 10.3 2.6.6 6.7 1.3 11 1.3 35.6 0 82.3-24.4 120.3-72.2z"/>
                </svg>
              </div>

            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Hint */}
        <motion.div style={{
          position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)',
          opacity: hintOpacity, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', zIndex: 10,
        }}>
          <div style={{
            border: '1px solid rgba(var(--paper), 0.15)', background: 'rgba(var(--paper), 0.05)', backdropFilter: 'blur(10px)',
            borderRadius: '999px', padding: '6px 16px', fontSize: '9px',
            color: 'rgba(var(--paper), 0.6)', fontFamily: 'var(--font-mono)', letterSpacing: '0.15em',
          }}>SCROLL TO EXPLORE</div>
        </motion.div>

        {/* Flawless Handoff Hider */}
        <motion.div style={{ position: 'absolute', inset: 0, background: '#0a0a0a', opacity: exitOpacity, pointerEvents: 'none', zIndex: 20 }} />

      </div>
    </div>
  )
}
