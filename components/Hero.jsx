'use client'

import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import Magnetic from './Magnetic'


const capabilities = [
  { n: '01', title: 'Machine Learning', desc: 'Building end-to-end ML pipelines — from data preprocessing to model deployment.' },
  { n: '02', title: 'Data Science', desc: 'Turning raw datasets into actionable insights with Python, Pandas, and Matplotlib.' },
  { n: '03', title: 'AI Engineering', desc: 'Integrating LLMs, computer vision, and generative AI into real-world applications.' },
  { n: '04', title: 'Backend & Web', desc: 'Django-powered APIs and full-stack apps that serve data-driven products.' },
]

const easeFluid = [0.22, 1, 0.36, 1]

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uDark;

// light silk palette — rich enough to read as a shader, still airy
const vec3 CREAM  = vec3(0.990, 0.972, 0.950);
const vec3 PEACH  = vec3(1.000, 0.760, 0.520);
const vec3 PERI   = vec3(0.580, 0.660, 1.000);
const vec3 MINT   = vec3(0.560, 0.860, 0.820);
const vec3 ORANGE = vec3(0.969, 0.440, 0.050);
const vec3 INKISH = vec3(0.300, 0.360, 0.560);

// dark silk palette — charcoal base, muted ember/indigo folds (desaturated on
// purpose: saturated hues vibrate against dark surfaces)
const vec3 D_BASE   = vec3(0.086, 0.084, 0.090);
const vec3 D_INDIGO = vec3(0.165, 0.180, 0.260);
const vec3 D_EMBER  = vec3(0.360, 0.220, 0.120);
const vec3 D_TEAL   = vec3(0.110, 0.200, 0.200);
const vec3 D_GLOW   = vec3(0.760, 0.450, 0.210);
const vec3 D_MIST   = vec3(0.300, 0.320, 0.400);

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / min(uRes.x, uRes.y);
  uv += (uMouse - 0.5) * vec2(0.28, -0.28);
  float t = uTime * 0.10;

  // iterative sine warp — silky flowing ribbons
  vec2 p = uv * 1.9;
  for (float i = 1.0; i < 6.0; i++) {
    p.x += 0.42 / i * sin(i * 2.1 * p.y + t * 1.6 + i * 1.7);
    p.y += 0.42 / i * cos(i * 1.8 * p.x - t * 1.2 + i * 0.9);
  }

  float v1 = 0.5 + 0.5 * sin(p.x * 1.5 + t * 0.5);
  float v2 = 0.5 + 0.5 * cos(p.y * 1.8 - t * 0.4);
  float v3 = 0.5 + 0.5 * sin((p.x + p.y) * 1.1 + t);

  vec3 lightCol = mix(CREAM, PERI, smoothstep(0.15, 0.95, v1));
  lightCol = mix(lightCol, PEACH, smoothstep(0.30, 0.95, v1 * v2));
  lightCol = mix(lightCol, MINT,  smoothstep(0.45, 1.0, v2 * (1.0 - v1)));
  // deep shading in the folds gives the silk its depth
  lightCol = mix(lightCol, INKISH, 0.35 * smoothstep(0.62, 0.98, v3 * (1.0 - v2)));
  // orange silk highlight
  lightCol = mix(lightCol, ORANGE, 0.55 * smoothstep(0.68, 0.98, v1 * v2));
  // gentle edge lift so the card corners stay light
  lightCol = mix(lightCol, CREAM, 0.6 * smoothstep(1.0, 1.6, length(uv)));

  // dark variant — same ribbon field, but folds glow instead of shade
  vec3 darkCol = mix(D_BASE, D_INDIGO, smoothstep(0.15, 0.95, v1));
  darkCol = mix(darkCol, D_EMBER, smoothstep(0.35, 0.95, v1 * v2));
  darkCol = mix(darkCol, D_TEAL,  0.7 * smoothstep(0.45, 1.0, v2 * (1.0 - v1)));
  darkCol = mix(darkCol, D_MIST,  0.4 * smoothstep(0.62, 0.98, v3 * (1.0 - v2)));
  darkCol = mix(darkCol, D_GLOW,  0.45 * smoothstep(0.74, 0.99, v1 * v2));
  // edges fall back to charcoal so the card melts into the dark page
  darkCol = mix(darkCol, D_BASE, 0.7 * smoothstep(0.9, 1.6, length(uv)));

  vec3 col = mix(lightCol, darkCol, uDark);

  // film grain
  float g = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
  col += (g - 0.5) * 0.035;

  gl_FragColor = vec4(col, 1.0);
}`

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`

/* ── WebGL silk shader — domain-warped ribbons, light palette, cursor-reactive ── */
function HeroShader() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false })
    if (!gl) return

    const compile = (type, src) => {
      const s = gl.createShader(type)
      gl.shaderSource(s, src)
      gl.compileShader(s)
      return s
    }
    const prog = gl.createProgram()
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT))
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(prog)
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'aPos')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    const uRes = gl.getUniformLocation(prog, 'uRes')
    const uTime = gl.getUniformLocation(prog, 'uTime')
    const uMouse = gl.getUniformLocation(prog, 'uMouse')
    const uDark = gl.getUniformLocation(prog, 'uDark')

    let raf = 0
    const mouse = { x: 0.5, y: 0.5 }
    const eased = { x: 0.5, y: 0.5 }

    // theme crossfade — eases toward 1 when <html data-theme="dark">
    const isDark = () => (document.documentElement.getAttribute('data-theme') === 'dark' ? 1 : 0)
    let darkTarget = isDark()
    let dark = darkTarget
    const themeObserver = new MutationObserver(() => { darkTarget = isDark() })
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      const rect = canvas.getBoundingClientRect()
      canvas.width = Math.round(rect.width * dpr * 0.7)   // undersample — silk hides it
      canvas.height = Math.round(rect.height * dpr * 0.7)
      gl.viewport(0, 0, canvas.width, canvas.height)
    }

    const onMove = (e) => {
      mouse.x = e.clientX / window.innerWidth
      mouse.y = 1 - e.clientY / window.innerHeight
    }

    const start = performance.now()
    const draw = () => {
      eased.x += (mouse.x - eased.x) * 0.04
      eased.y += (mouse.y - eased.y) * 0.04
      dark += (darkTarget - dark) * 0.06
      gl.uniform1f(uDark, dark)
      gl.uniform2f(uRes, canvas.width, canvas.height)
      gl.uniform1f(uTime, (performance.now() - start) / 1000)
      gl.uniform2f(uMouse, eased.x, eased.y)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
      raf = requestAnimationFrame(draw)
    }

    // The shader only earns its cost while the hero is actually on screen.
    // Scrolled past it, or on a backgrounded tab, the loop stops entirely —
    // otherwise it burns a full GPU frame budget for the whole page.
    let running = false
    const startLoop = () => {
      if (running) return
      running = true
      raf = requestAnimationFrame(draw)
    }
    const stopLoop = () => {
      running = false
      cancelAnimationFrame(raf)
    }

    let onScreen = true
    const sync = () => {
      if (onScreen && !document.hidden) startLoop()
      else stopLoop()
    }

    const io = new IntersectionObserver(
      ([entry]) => { onScreen = entry.isIntersecting; sync() },
      { rootMargin: '120px' }
    )
    io.observe(canvas)
    document.addEventListener('visibilitychange', sync)

    resize()
    startLoop()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      stopLoop()
      io.disconnect()
      document.removeEventListener('visibilitychange', sync)
      themeObserver.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
    />
  )
}

/* Rotating circular text badge — bottom-right of the stage */
function Rotor() {
  const text = 'AKHAND · DATA SCIENCE & AI · '
  return (
    <div className="hero-rotor" aria-hidden="true">
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <defs>
          <path id="rotor-circle" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
        </defs>
        <text style={{
          fontFamily: 'var(--font-mono)', fontSize: '10.5px', letterSpacing: '0.18em',
          fill: 'rgba(var(--ink), 0.55)',
        }}>
          <textPath href="#rotor-circle">{text}</textPath>
        </text>
      </svg>
      <span style={{
        position: 'absolute', inset: 0, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        fontSize: '16px',
      }}>✦</span>
    </div>
  )
}

export default function Hero() {
  return (
    <section
      id="home"
      className="hero-shell"
      style={{
        paddingTop: 'clamp(76px, 9vw, 108px)',
        paddingBottom: 0,
      }}
    >
      <div className="container" style={{ position: 'relative', zIndex: 10, width: '100%' }}>
        {/* Shader stage */}
        <motion.div
          className="hero-stage"
          initial={{ opacity: 0, y: 24, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, ease: easeFluid }}
        >
          <HeroShader />

          {/* Content — lower-left editorial stack */}
          <div className="hero-stack">
            <motion.h1
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.35, ease: easeFluid }}
              className="hero-lines"
            >
              <span className="hero-line hero-line--bold">Data Science</span>
              <span className="hero-line hero-line--italic">&amp; AI Engineer</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: easeFluid }}
              style={{
                color: 'rgba(var(--ink), 0.62)', fontSize: 'clamp(15px, 1.5vw, 17px)',
                maxWidth: '460px', lineHeight: 1.65, margin: 0,
              }}
            >
              Aspiring Data Scientist and AI/ML Engineer — building ML pipelines, training
              predictive models, and deploying Django-powered apps that turn data into decisions.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.62, ease: easeFluid }}
              className="hero-cta-row"
              style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}
            >
              <Magnetic strength={0.2}>
                <a href="#work" className="btn-liquid">
                  View Projects
                  <svg style={{ marginLeft: 10 }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </a>
              </Magnetic>
              <Magnetic strength={0.2}>
                <a
                  href="#contact"
                  style={{
                    display: 'inline-flex', alignItems: 'center',
                    padding: '12px 26px', borderRadius: '999px',
                    background: 'var(--surface-cell)',
                    backdropFilter: 'var(--blur-cell)', WebkitBackdropFilter: 'var(--blur-cell)',
                    border: '1px solid var(--hairline)',
                    color: 'var(--text-primary)', fontSize: '14px', fontWeight: 600,
                    textDecoration: 'none',
                    transition: 'transform 0.25s cubic-bezier(0.22,1,0.36,1), box-shadow 0.25s cubic-bezier(0.22,1,0.36,1)',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 26px rgba(var(--shadow-ink), 0.12)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
                >
                  Let&apos;s talk
                </a>
              </Magnetic>
            </motion.div>
          </div>

          <Rotor />
        </motion.div>

        {/* Capability cards — wrapped in the same sheet shell as every section */}
        <motion.div
          className="grid-box"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.75, ease: easeFluid }}
          style={{ marginTop: 'clamp(18px, 2vw, 28px)', padding: 'clamp(12px, 1.4vw, 20px)' }}
        >
          <div className="edi-cap-grid">
            {capabilities.map((c) => (
              <div key={c.n} className="edi-cap-cell">
                <span className="mono-label" style={{ color: 'var(--accent)' }}>{c.n}</span>
                <h3 style={{ fontSize: 'clamp(16px, 1.3vw, 19px)', fontWeight: 600, color: 'var(--text-primary)', margin: '14px 0 8px', letterSpacing: '-0.01em' }}>
                  {c.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.55 }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
