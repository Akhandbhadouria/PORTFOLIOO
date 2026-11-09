'use client'

import { useEffect, useRef } from 'react'
import CornerPlus from './ui/corner-plus'

const WORD = 'AKHAND'

// Konami easter egg morphs the name through these phrases, then back home.
const EGG_PHRASES = ['LET’S', 'MAKE SOMETHING', 'TOGETHER', 'LET’S CONNECT', 'THANKS :)', 'नमस्ते']

// Tuning knobs for the particle field.
const PARTICLE_R = 1.4       // visual radius (CSS px)
const PARTICLE_STEP = 5      // sample grid in CSS px (smaller = denser)
const REPEL_RADIUS = 90      // cursor influence radius
const REPEL_STRENGTH = 55    // max displacement
const LERP = 0.18            // how fast dots return to home
const MORPH_LERP = 0.12      // how fast dots flow to a morph target
const SCENE_HOLD = 1500      // ms each egg phrase is held
const ACCENT = '#f7790f'

export default function Footer() {
  const canvasRef = useRef(null)
  const overlayRef = useRef(null)
  const mouseRef = useRef({ x: -1e4, y: -1e4 })
  // The dot colour follows the theme's --ink channel. Reading it per frame is
  // a forced style recalc, so it is cached here and refreshed only when the
  // theme attribute actually changes.
  const inkRef = useRef([15, 23, 42])

  useEffect(() => {
    const readInk = () => {
      const v = getComputedStyle(document.documentElement)
        .getPropertyValue('--ink').split(',').map((n) => parseFloat(n))
      if (v.length === 3 && v.every(Number.isFinite)) inkRef.current = v
    }
    readInk()
    const obs = new MutationObserver(readInk)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => obs.disconnect()
  }, [])

  // Easter egg #1 — an interactive console for anyone who opens DevTools.
  useEffect(() => {
    if (typeof window === 'undefined' || window.__vyHello) return
    window.__vyHello = true

    const EMAIL = 'thakurakhand.singh21111@gmail.com'
    const GITHUB = 'https://github.com/Akhandbhadouria'
    const LINKEDIN = 'https://www.linkedin.com/in/akhand320/'
    const LEETCODE = 'https://leetcode.com/u/akhand_07/'
    const RESUME = 'https://drive.google.com/file/d/123ivkXyXzQ-sWK2fufpRtZfNEXsP6koI/view?usp=sharing'

    // shared styles — tuned to the site's liquid-glass theme and readable on
    // both light and dark DevTools
    const banner = 'background:linear-gradient(120deg,#f7790f,#f55f16);color:#fff;font:800 22px/1.6 "Space Grotesk",sans-serif;padding:8px 18px;border-radius:999px'
    const sub = 'color:#94a3b8;font:500 13px/1.8 monospace'
    const cmd = 'color:#f7790f;font:700 13px/1.8 monospace'
    const arrow = 'color:#94a3b8;font:13px/1.8 monospace'
    const ok = 'color:#10b981;font:600 13px monospace'
    const dim = 'color:#94a3b8;font:12px monospace'

    const COMMANDS = [
      ['akhand.help()       ', 'show this menu'],
      ['akhand.about()      ', 'who I am, in 3 lines'],
      ['akhand.projects()   ', 'what I’ve built'],
      ['akhand.skills()     ', 'my stack, by layer'],
      ['akhand.now()        ', 'what I’m working on'],
      ['akhand.contact()    ', 'every way to reach me'],
      ['akhand.hire()       ', 'start a conversation'],
      ['akhand.resume()     ', 'open my CV'],
      ['akhand.source()     ', 'this portfolio on GitHub'],
      ['akhand.say("hi")    ', 'make the footer spell anything'],
      ['akhand.party()      ', 'launch the particle show'],
    ]
    const row = (c, d) => console.log(`%c${c}%c  → ${d}`, cmd, arrow)

    console.log('%c  नमस्ते — AKHAND PRATAPSINGH  ', banner)
    console.log(
      '%cBackend & Data Science enthusiast · building Django apps and ML projects.\n' +
      '%cThis console is live — try a command:\n',
      sub, sub
    )
    COMMANDS.forEach(([c, d]) => row(c, d))
    console.log('\n%cp.s. there’s a Konami code on the page → ↑ ↑ ↓ ↓ ← → ← → B A', dim)

    const morphAvailable = () => typeof window.__vyMorph === 'function'

    const api = {
      help() {
        console.log('%c  AKHAND — console commands  ', banner)
        COMMANDS.forEach(([c, d]) => row(c, d))
        return '↑ pick one'
      },
      about() {
        console.log(
          '%cAkhand Pratapsingh%c — B.Tech CSE @ Lovely Professional University.\n' +
          '%cBackend and data science enthusiast — building Django apps, ML pipelines,\n' +
          'and full-stack web applications. Open for internships.',
          'color:#f7790f;font:700 14px monospace', sub, sub
        )
        return 'akhand.projects() to see the work →'
      },
      projects() {
        console.table([
          { project: 'ClassAudit AI', stack: 'Django · OpenCV · Python', link: 'github.com/Akhandbhadouria' },
          { project: 'Customer Churn ML', stack: 'Python · Scikit-learn · Pandas', link: 'github.com/Akhandbhadouria' },
          { project: 'E-Commerce Platform', stack: 'Django · React · PostgreSQL', link: 'github.com/Akhandbhadouria' },
          { project: 'Social Media App', stack: 'Django · Bootstrap · PostgreSQL', link: 'github.com/Akhandbhadouria' },
        ])
        return 'Click any project on the page for the full story.'
      },
      skills() {
        console.table({
          Frontend: 'React · HTML5 · CSS3 · Bootstrap · Tailwind',
          Backend: 'Python · Django · FastAPI · C++ · REST APIs',
          'Data Science': 'Scikit-learn · Pandas · Matplotlib · OpenCV',
          'Tools & DevOps': 'Git · Docker · AWS · PostgreSQL · MySQL',
        })
        return 'akhand.now() for what I’m exploring →'
      },
      now() {
        console.log(
          '%c◎ NOW%c\n' +
          '%c· Building   %cDjango & ML projects — ClassAudit AI, Churn Predictor\n' +
          '%c· Learning   %cMachine Learning end-to-end — Scikit-learn, deployment\n' +
          '%c· Focused on %cOpen for internships in backend / data science roles',
          'color:#10b981;font:700 13px monospace', '',
          arrow, 'font:13px monospace',
          arrow, 'font:13px monospace',
          arrow, 'font:13px monospace'
        )
        return 'Inspired by Derek Sivers’ /now page.'
      },
      contact() {
        console.table({
          Email: EMAIL,
          GitHub: GITHUB,
          LinkedIn: LINKEDIN,
          LeetCode: LEETCODE,
        })
        return 'akhand.hire() opens a pre-filled email →'
      },
      hire() {
        console.log('%c✉  Opening your mail client… talk soon!', ok)
        window.open(`mailto:${EMAIL}?subject=${encodeURIComponent('Let’s build something')}`, '_blank')
        return `Or just email ${EMAIL}`
      },
      resume() {
        console.log('%c📄  Opening CV…', ok)
        window.open(RESUME, '_blank')
        return 'Opened in a new tab.'
      },
      source() {
        console.log('%c⌥  Opening GitHub…', ok)
        window.open(GITHUB, '_blank')
        return GITHUB
      },
      say(text) {
        const t = String(text == null ? '' : text).slice(0, 20).toUpperCase()
        if (!t.trim()) return 'Usage: akhand.say("your text")'
        if (!morphAvailable()) return 'Scroll to the footer first, then try again.'
        window.__vyMorph([t], 2200)
        console.log(`%c✦  Spelling “${t}” in the footer…`, ok)
        return 'Look down ↓'
      },
      party(seconds) {
        if (typeof window.__vyParty !== 'function') return 'Scroll to the footer first, then try again.'
        window.__vyParty(seconds)
        console.log('%c🎉  PARTY MODE — confetti incoming!', 'color:#f7790f;font:700 14px monospace')
        return 'Look down ↓ (try akhand.party(10) for a longer one)'
      },
      sudo(...args) {
        console.log('%cNice try. %cPermission denied (you’re not root here 😉).', 'color:#ff5f57;font:700 13px monospace', sub)
        return 'But akhand.hire() always works.'
      },
      coffee() {
        console.log('%c☕  Brewing… 418 I’m a teapot.', 'color:#E5C07B;font:700 13px monospace')
        return 'Fueled by caffeine & curiosity.'
      },
      toString() { return 'Type akhand.help() for commands' },
    }

    window.akhand = api
    window.ak = api // short alias
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const overlay = overlayRef.current
    if (!canvas || !overlay) return

    const ctx = canvas.getContext('2d', { alpha: true })
    let dots = []
    let raf = 0
    let width = 0
    let height = 0
    let dpr = 1

    // ── Egg / morph state ──
    let egg = false          // is the morph sequence running
    let scenes = []          // array of point-arrays to morph through
    let sceneIdx = 0
    let nextSceneAt = 0
    let sceneHold = SCENE_HOLD
    let targets = null       // current target point-array, or null = home
    let colorMix = 0         // 0 = ink, 1 = accent (eased for a smooth tint)

    // Sample any string into an array of {x,y} points, auto-fit to the canvas.
    const sampleText = (text) => {
      const off = document.createElement('canvas')
      off.width = Math.round(width * dpr)
      off.height = Math.round(height * dpr)
      if (!off.width || !off.height) return []
      const c = off.getContext('2d')
      c.setTransform(dpr, 0, 0, dpr, 0, 0)
      c.fillStyle = '#fff'
      c.textAlign = 'center'
      c.textBaseline = 'alphabetic'
      const fontAt = (s) => `700 ${s}px "Space Grotesk", Inter, "Arial Black", sans-serif`
      const maxW = width * 0.88
      const maxH = height * 0.66

      let fs = Math.round(height * 0.78)
      c.font = fontAt(fs)
      // Fit to width.
      const w0 = c.measureText(text).width
      if (w0 > maxW) {
        fs = Math.max(18, Math.floor((fs * maxW) / w0))
        c.font = fontAt(fs)
      }
      // Fit to the *actual* glyph height (caps + descenders), then centre on it.
      let m = c.measureText(text)
      let gh = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent
      if (gh > maxH) {
        fs = Math.max(18, Math.floor((fs * maxH) / gh))
        c.font = fontAt(fs)
        m = c.measureText(text)
      }
      const asc = m.actualBoundingBoxAscent
      const desc = m.actualBoundingBoxDescent
      // Baseline placed so the visible ink is vertically centred in the canvas.
      const y = height / 2 + (asc - desc) / 2
      c.fillText(text, width / 2, y)
      const img = c.getImageData(0, 0, off.width, off.height).data
      const step = Math.max(2, Math.round(PARTICLE_STEP * dpr))
      const pts = []
      for (let py = 0; py < off.height; py += step) {
        for (let px = 0; px < off.width; px += step) {
          if (img[(py * off.width + px) * 4 + 3] > 140) {
            pts.push({ x: px / dpr, y: py / dpr })
          }
        }
      }
      return pts
    }

    const sampleDots = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const home = sampleText(WORD)
      dots = home.map((p) => ({ hx: p.x, hy: p.y, x: p.x, y: p.y }))
    }

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current.x = e.clientX - rect.left
      mouseRef.current.y = e.clientY - rect.top
    }
    const onLeave = () => {
      mouseRef.current.x = -1e4
      mouseRef.current.y = -1e4
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      const now = performance.now()

      // Advance the egg scene timeline.
      if (egg && now >= nextSceneAt) {
        sceneIdx++
        if (sceneIdx < scenes.length) {
          targets = scenes[sceneIdx]
          nextSceneAt = now + sceneHold
        } else {
          // sequence done — flow home, drop the tint
          egg = false
          targets = null
        }
      }

      // Ease the global colour tint toward its goal (ink → brand accent #f7790f).
      // Ink follows the theme's --ink channel so the dots stay visible in dark mode.
      colorMix += ((egg ? 1 : 0) - colorMix) * 0.08
      const [ir = 15, ig = 23, ib = 42] = inkRef.current
      const r = Math.round(ir + (247 - ir) * colorMix)
      const g = Math.round(ig + (121 - ig) * colorMix)
      const b = Math.round(ib + (15 - ib) * colorMix)
      ctx.fillStyle = `rgb(${r},${g},${b})`
      const radius = PARTICLE_R * (1 + 0.5 * colorMix)

      const { x: mx, y: my } = mouseRef.current
      const r2 = REPEL_RADIUS * REPEL_RADIUS
      const tgt = targets

      for (let i = 0; i < dots.length; i++) {
        const d = dots[i]
        let gx, gy, lerp
        if (tgt) {
          // Morphing — flow toward the target glyph (wrap if fewer points).
          const t = tgt[i % tgt.length]
          gx = t.x
          gy = t.y
          lerp = MORPH_LERP
        } else {
          // Home — with cursor repel.
          gx = d.hx
          gy = d.hy
          lerp = LERP
          const dx = d.hx - mx
          const dy = d.hy - my
          const dist2 = dx * dx + dy * dy
          if (dist2 < r2) {
            const dist = Math.sqrt(dist2) || 1
            const force = (1 - dist / REPEL_RADIUS) * REPEL_STRENGTH
            gx = d.hx + (dx / dist) * force
            gy = d.hy + (dy / dist) * force
          }
        }
        d.x += (gx - d.x) * lerp
        d.y += (gy - d.y) * lerp

        ctx.beginPath()
        ctx.arc(d.x, d.y, radius, 0, Math.PI * 2)
        ctx.fill()
      }
      raf = requestAnimationFrame(draw)
    }

    // Morph the particle field through a list of phrases, then reassemble.
    const morph = (phrases, hold = SCENE_HOLD) => {
      const list = (Array.isArray(phrases) ? phrases : [phrases]).filter(Boolean).map(String)
      if (!list.length) return
      scenes = list.map(sampleText)
      // Grow the particle pool so even the longest phrase is fully formed
      // (otherwise the modulo mapping leaves the tail of wide words empty).
      const need = scenes.reduce((m, s) => Math.max(m, s.length), dots.length)
      const homeCount = dots.length
      while (dots.length < need) {
        const src = dots[(Math.random() * homeCount) | 0]
        // Extra dots melt back into a real VIBHAV point when the morph ends.
        dots.push({ hx: src.hx, hy: src.hy, x: src.x, y: src.y })
      }
      sceneIdx = 0
      targets = scenes[0]
      egg = true
      sceneHold = hold
      nextSceneAt = performance.now() + hold
    }
    const triggerEgg = () => { if (!egg) morph(EGG_PHRASES) }

    // ── PARTY: a full-screen choreographed particle dance ──
    // A drifting particle field across the whole screen + a rotating 3D
    // particle sphere in the centre.
    const octx = overlay.getContext('2d', { alpha: true })
    let partyRaf = 0
    let partyStart = 0
    let partyDur = 0
    let ocw = 0, och = 0, odpr = 1
    let field = []           // background drifters: { x, y, vx, vy, hue }
    let sphere = []          // unit-sphere points: { x, y, z, hue }
    let sphereR = 0
    let lasers = []          // full radiating beams: { ang, t0, hue, life, width }
    let confetti = []        // beat-synced confetti sticks: { x, y, vx, vy, rot, vr, len, thick, hue, t0, life }
    let rings = []           // expanding beat rings: { t0, hue }
    let flashT0 = -1e9       // centre-flash timestamp (on kicks)
    let step = 0             // current sequencer step
    let nextStepAt = 0       // perf.now() time of the next step

    const FIELD_COUNT = 2800
    const SPHERE_COUNT = 1400
    const BPM = 124
    const STEP_MS = 60000 / BPM / 4   // 16th-note grid
    // Brand hues only — orange, periwinkle, mint, amber (same family as the
    // site's ambient blobs and hero silk), instead of full rainbow cycling.
    const PARTY_HUES = [27, 226, 174, 38]

    // ── Web Audio: a synthesized looping track + beat-synced laser hits ──
    let audioCtx = null
    let master = null
    let noiseBuf = null
    const ensureAudio = () => {
      try {
        if (!audioCtx) {
          const AC = window.AudioContext || window.webkitAudioContext
          if (!AC) return null
          audioCtx = new AC()
          master = audioCtx.createGain()
          master.gain.value = 0.5
          master.connect(audioCtx.destination)
          // one second of white noise for drums
          noiseBuf = audioCtx.createBuffer(1, audioCtx.sampleRate, audioCtx.sampleRate)
          const ch = noiseBuf.getChannelData(0)
          for (let i = 0; i < ch.length; i++) ch[i] = Math.random() * 2 - 1
        }
        if (audioCtx.state === 'suspended') audioCtx.resume()
        return audioCtx
      } catch { return null }
    }
    // ── Instruments ──
    const kick = (t) => {
      const o = audioCtx.createOscillator(), g = audioCtx.createGain()
      o.type = 'sine'
      o.frequency.setValueAtTime(165, t)
      o.frequency.exponentialRampToValueAtTime(48, t + 0.12)
      g.gain.setValueAtTime(0.9, t)
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.26)
      o.connect(g); g.connect(master); o.start(t); o.stop(t + 0.28)
    }
    const noiseHit = (t, hp, dur, peak) => {
      const s = audioCtx.createBufferSource(); s.buffer = noiseBuf
      const f = audioCtx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = hp
      const g = audioCtx.createGain()
      g.gain.setValueAtTime(peak, t)
      g.gain.exponentialRampToValueAtTime(0.001, t + dur)
      s.connect(f); f.connect(g); g.connect(master); s.start(t); s.stop(t + dur + 0.02)
    }
    const clap = (t) => noiseHit(t, 1400, 0.14, 0.5)
    const hat = (t) => noiseHit(t, 8000, 0.045, 0.25)
    const synth = (t, freq, type, peak, dur, cutoff) => {
      const o = audioCtx.createOscillator(), g = audioCtx.createGain()
      o.type = type
      o.frequency.value = freq
      let node = o
      if (cutoff) {
        const lp = audioCtx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = cutoff
        o.connect(lp); node = lp
      }
      g.gain.setValueAtTime(0.0001, t)
      g.gain.exponentialRampToValueAtTime(peak, t + 0.012)
      g.gain.exponentialRampToValueAtTime(0.001, t + dur)
      node.connect(g); g.connect(master); o.start(t); o.stop(t + dur + 0.02)
    }
    const bass = (t, f) => synth(t, f, 'sawtooth', 0.32, 0.24, 500)
    const lead = (t, f) => synth(t, f, 'square', 0.16, 0.2, 4000)

    // ── Song: 16-step loop over Am – F – C – G ──
    const N = { _: 0, A1: 55, C2: 65.41, F1: 43.65, G1: 49, A4: 440, C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99 }
    const SONG = {
      kick: [1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 0],
      clap: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      hat:  [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
      bass: ['A1', 0, 0, 0, 'F1', 0, 0, 0, 'C2', 0, 0, 0, 'G1', 0, 0, 0],
      lead: ['A4', 0, 0, 'C5', 'E5', 0, 'D5', 0, 'C5', 0, 'A4', 0, 0, 'D5', 'E5', 0],
    }
    // Which steps fire lasers, and how: returns {count,hue,wide} or null.
    // Lead-note hues mapped into the brand palette (peri / mint / amber / orange).
    const LEAD_HUE = { A4: 226, C5: 174, D5: 38, E5: 27, G5: 226 }

    // Deep rising power-up when the party launches.
    const playWhoosh = () => {
      const ac = ensureAudio()
      if (!ac) return
      const t = ac.currentTime
      const o = ac.createOscillator()
      const g = ac.createGain()
      o.type = 'sawtooth'
      o.frequency.setValueAtTime(70, t)
      o.frequency.exponentialRampToValueAtTime(700, t + 0.7)
      g.gain.setValueAtTime(0.0001, t)
      g.gain.exponentialRampToValueAtTime(0.12, t + 0.25)
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.8)
      o.connect(g); g.connect(master); o.start(t); o.stop(t + 0.85)
    }

    const buildParty = () => {
      ocw = window.innerWidth
      och = window.innerHeight
      odpr = Math.min(window.devicePixelRatio || 1, 2)
      overlay.width = Math.round(ocw * odpr)
      overlay.height = Math.round(och * odpr)
      octx.setTransform(odpr, 0, 0, odpr, 0, 0)

      lasers = []
      confetti = []
      rings = []
      flashT0 = -1e9
      step = 0
      nextStepAt = 0

      // Background field — particles everywhere, slow random drift.
      field = []
      for (let i = 0; i < FIELD_COUNT; i++) {
        field.push({
          x: Math.random() * ocw,
          y: Math.random() * och,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          hue: PARTY_HUES[i % PARTY_HUES.length],
        })
      }

      // Sphere — evenly spread points via the Fibonacci sphere.
      sphereR = Math.min(ocw, och) * 0.22
      sphere = []
      const golden = Math.PI * (3 - Math.sqrt(5))
      for (let i = 0; i < SPHERE_COUNT; i++) {
        const y = 1 - (i / (SPHERE_COUNT - 1)) * 2
        const rr = Math.sqrt(Math.max(0, 1 - y * y))
        const theta = golden * i
        sphere.push({
          x: Math.cos(theta) * rr,
          y,
          z: Math.sin(theta) * rr,
          hue: PARTY_HUES[i % PARTY_HUES.length] + (Math.random() * 14 - 7),
        })
      }
    }

    const partyLoop = () => {
      const now = performance.now()
      const elapsed = now - partyStart
      const remain = partyDur - elapsed
      const t = elapsed / 1000
      octx.clearRect(0, 0, ocw, och)

      const cx = ocw / 2
      const cy = och / 2
      const baseAlpha = Math.max(0, Math.min(1, Math.min(elapsed / 400, remain / 700)))

      // ── Light glass veil — same base tone as the site, so the party feels
      // like it happens *on* the page rather than cutting to a black rave ──
      octx.globalAlpha = baseAlpha * 0.94
      octx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg-base').trim() || '#eef0f4'
      octx.fillRect(0, 0, ocw, och)
      octx.globalAlpha = baseAlpha

      // ── Background field — drift + wrap in the four brand hues ──
      // A clear circular void around the centre keeps the sphere clean (no
      // particles behind / around it).
      const fdot = Math.max(1.4, Math.min(ocw, och) * 0.0026)
      const clearR = sphereR * 1.45
      const clearR2 = clearR * clearR
      for (let i = 0; i < field.length; i++) {
        const p = field[i]
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x += ocw; else if (p.x > ocw) p.x -= ocw
        if (p.y < 0) p.y += och; else if (p.y > och) p.y -= och
      }
      octx.globalAlpha = baseAlpha * 0.55
      for (let h = 0; h < PARTY_HUES.length; h++) {
        octx.fillStyle = `hsl(${PARTY_HUES[h]}, 85%, 52%)`
        octx.beginPath()
        for (let i = h; i < field.length; i += PARTY_HUES.length) {
          const p = field[i]
          const dx = p.x - cx, dy = p.y - cy
          if (dx * dx + dy * dy < clearR2) continue // skip the sphere's zone
          octx.moveTo(p.x + fdot, p.y)
          octx.arc(p.x, p.y, fdot, 0, Math.PI * 2)
        }
        octx.fill()
      }
      octx.globalAlpha = baseAlpha

      // ── Centre sphere — rotate Y + fixed tilt, perspective projection ──
      const ay = t * 0.6              // spin around Y
      const cosY = Math.cos(ay), sinY = Math.sin(ay)
      const tilt = 0.5
      const cosT = Math.cos(tilt), sinT = Math.sin(tilt)
      const focal = 2.2               // perspective strength
      for (let i = 0; i < sphere.length; i++) {
        const s = sphere[i]
        // rotate around Y
        let x = s.x * cosY - s.z * sinY
        let z = s.x * sinY + s.z * cosY
        const y0 = s.y
        // tilt around X
        const y = y0 * cosT - z * sinT
        z = y0 * sinT + z * cosT
        // perspective: depth in [-1,1] → scale
        const persp = focal / (focal + z)
        const sx = cx + x * sphereR * persp
        const sy = cy + y * sphereR * persp
        const depth = (z + 1) / 2     // 0 = back, 1 = front
        const r = Math.max(0.6, (0.9 + 2.2 * persp) * (0.5 + depth))
        octx.fillStyle = `hsl(${(s.hue + 360) % 360}, 85%, ${Math.round(36 + depth * 22)}%)`
        octx.globalAlpha = (remain / 700 < 1 ? Math.max(0, remain / 700) : 1) * (0.35 + depth * 0.65)
        octx.beginPath()
        octx.arc(sx, sy, r, 0, Math.PI * 2)
        octx.fill()
      }
      octx.globalAlpha = 1

      // ── Sequencer: play the song + fire lasers on the beat ──
      const ac = ensureAudio()
      const fireBeams = (count, hue, width, life) => {
        for (let k = 0; k < count; k++) {
          lasers.push({
            ang: Math.random() * Math.PI * 2,
            t0: now,
            hue: (hue + Math.random() * 24 - 12 + 360) % 360,
            life,
            width,
          })
        }
      }
      // Confetti burst from the sphere — rounded sticks that arc out and fall.
      const burstConfetti = (count) => {
        for (let k = 0; k < count; k++) {
          const ang = Math.random() * Math.PI * 2
          const sp = 2.5 + Math.random() * 6
          confetti.push({
            x: cx, y: cy,
            vx: Math.cos(ang) * sp,
            vy: Math.sin(ang) * sp - 3.2,
            rot: Math.random() * Math.PI,
            vr: (Math.random() - 0.5) * 0.3,
            len: 6 + Math.random() * 9,
            thick: 2.5 + Math.random() * 2,
            hue: PARTY_HUES[(Math.random() * PARTY_HUES.length) | 0],
            t0: now,
            life: 1100 + Math.random() * 800,
          })
        }
      }
      if (remain > 700) {
        if (nextStepAt === 0) nextStepAt = now
        while (now >= nextStepAt) {
          const s16 = step % 16
          const at = ac ? ac.currentTime : 0
          if (ac) {
            if (SONG.kick[s16]) kick(at)
            if (SONG.clap[s16]) clap(at)
            if (SONG.hat[s16]) hat(at)
            if (SONG.bass[s16]) bass(at, N[SONG.bass[s16]])
            if (SONG.lead[s16]) lead(at, N[SONG.lead[s16]])
          }
          // Lasers, confetti and rings locked to the music
          if (SONG.kick[s16]) {
            fireBeams(3, PARTY_HUES[step % PARTY_HUES.length], 3.2, 320)
            burstConfetti(16)
            flashT0 = now
          }
          if (SONG.clap[s16]) { fireBeams(2, 226, 2.4, 280); rings.push({ t0: now, hue: 226 }) }
          if (SONG.lead[s16]) fireBeams(1, LEAD_HUE[SONG.lead[s16]] ?? 226, 2.2, 260)
          step++
          nextStepAt += STEP_MS
        }
      }

      // ── Render beams — saturated brand strokes that read on the light veil ──
      const diag = Math.hypot(ocw, och)
      octx.save()
      octx.lineCap = 'round'
      for (let li = lasers.length - 1; li >= 0; li--) {
        const L = lasers[li]
        const age = (now - L.t0) / L.life
        if (age >= 1) { lasers.splice(li, 1); continue }
        const env = age < 0.12 ? age / 0.12 : 1 - (age - 0.12) / 0.88 // snap on, fall off
        const a = Math.max(0, env) * baseAlpha
        const c = Math.cos(L.ang), s = Math.sin(L.ang)
        const x1 = cx + c * sphereR * 1.05, y1 = cy + s * sphereR * 1.05
        const x2 = cx + c * diag, y2 = cy + s * diag
        // soft outer glow
        octx.globalAlpha = a * 0.22
        octx.strokeStyle = `hsl(${L.hue}, 90%, 60%)`
        octx.lineWidth = L.width * 4
        octx.beginPath(); octx.moveTo(x1, y1); octx.lineTo(x2, y2); octx.stroke()
        // deep saturated core
        octx.globalAlpha = a * 0.85
        octx.strokeStyle = `hsl(${L.hue}, 95%, 46%)`
        octx.lineWidth = L.width
        octx.beginPath(); octx.moveTo(x1, y1); octx.lineTo(x2, y2); octx.stroke()
      }

      // Expanding beat rings around the sphere.
      for (let ri = rings.length - 1; ri >= 0; ri--) {
        const R = rings[ri]
        const rAge = (now - R.t0) / 650
        if (rAge >= 1) { rings.splice(ri, 1); continue }
        octx.globalAlpha = (1 - rAge) * 0.45 * baseAlpha
        octx.strokeStyle = `hsl(${R.hue}, 90%, 52%)`
        octx.lineWidth = 2
        octx.beginPath()
        octx.arc(cx, cy, sphereR * (1.08 + rAge * 1.9), 0, Math.PI * 2)
        octx.stroke()
      }

      // Confetti — rounded sticks with gravity and spin.
      for (let ci = confetti.length - 1; ci >= 0; ci--) {
        const C = confetti[ci]
        const cAge = (now - C.t0) / C.life
        if (cAge >= 1) { confetti.splice(ci, 1); continue }
        C.vy += 0.12
        C.x += C.vx
        C.y += C.vy
        C.rot += C.vr
        octx.globalAlpha = Math.min(1, (1 - cAge) * 1.6) * baseAlpha
        octx.strokeStyle = `hsl(${C.hue}, 90%, 52%)`
        octx.lineWidth = C.thick
        const cdx = Math.cos(C.rot) * C.len / 2
        const cdy = Math.sin(C.rot) * C.len / 2
        octx.beginPath()
        octx.moveTo(C.x - cdx, C.y - cdy)
        octx.lineTo(C.x + cdx, C.y + cdy)
        octx.stroke()
      }

      // centre flash on kicks — warm brand-orange glow
      const fAge = (now - flashT0) / 260
      if (fAge >= 0 && fAge < 1) {
        const fr = sphereR * (1.1 + fAge * 0.6)
        const fg = octx.createRadialGradient(cx, cy, 0, cx, cy, fr)
        fg.addColorStop(0, `hsla(27, 95%, 72%, ${(1 - fAge) * 0.6 * baseAlpha})`)
        fg.addColorStop(1, 'hsla(27, 95%, 55%, 0)')
        octx.globalAlpha = 1
        octx.fillStyle = fg
        octx.beginPath(); octx.arc(cx, cy, fr, 0, Math.PI * 2); octx.fill()
      }
      octx.restore()
      octx.globalAlpha = 1

      if (remain <= 0) {
        overlay.style.display = 'none'
        octx.clearRect(0, 0, ocw, och)
        return
      }
      partyRaf = requestAnimationFrame(partyLoop)
    }

    const startParty = (seconds) => {
      partyDur = Math.min(10000, Math.max(5000, (Number(seconds) || 7) * 1000))
      buildParty()
      overlay.style.display = 'block'
      partyStart = performance.now()
      playWhoosh()
      cancelAnimationFrame(partyRaf)
      partyLoop()
    }

    // Expose hooks so the DevTools console egg can drive the particles.
    window.__vyMorph = (phrases, hold) => {
      canvas.scrollIntoView({ behavior: 'smooth', block: 'center' })
      morph(phrases, hold)
    }
    window.__vyParty = (seconds) => { startParty(seconds) }

    sampleDots()

    // The particle field is only worth animating while the footer is on
    // screen. Left running, it costs a canvas repaint every frame for the
    // entire length of the page.
    let running = false
    const startLoop = () => {
      if (running) return
      running = true
      draw()
    }
    const stopLoop = () => {
      running = false
      cancelAnimationFrame(raf)
    }

    let onScreen = false
    const syncLoop = () => {
      if (onScreen && !document.hidden) startLoop()
      else stopLoop()
    }
    const io = new IntersectionObserver(
      ([entry]) => { onScreen = entry.isIntersecting; syncLoop() },
      { rootMargin: '200px' }
    )
    io.observe(canvas)
    document.addEventListener('visibilitychange', syncLoop)

    let resizeT
    const onResize = () => {
      clearTimeout(resizeT)
      resizeT = setTimeout(() => {
        stopLoop()
        sampleDots()
        syncLoop()
      }, 120)
    }

    // Easter egg #2 — Konami code anywhere on the page triggers the blast.
    const KONAMI = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a']
    let konamiPos = 0
    const onKey = (e) => {
      if (!e || typeof e.key !== 'string') return
      const k = e.key.toLowerCase()
      if (k === KONAMI[konamiPos]) {
        konamiPos++
        if (konamiPos === KONAMI.length) {
          konamiPos = 0
          // bring the footer into view so the effect is actually seen
          canvas.scrollIntoView({ behavior: 'smooth', block: 'center' })
          triggerEgg()
        }
      } else {
        konamiPos = k === KONAMI[0] ? 1 : 0
      }
    }

    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerleave', onLeave)
    window.addEventListener('resize', onResize)
    window.addEventListener('keydown', onKey)
    return () => {
      stopLoop()
      io.disconnect()
      document.removeEventListener('visibilitychange', syncLoop)
      cancelAnimationFrame(partyRaf)
      clearTimeout(resizeT)
      overlay.style.display = 'none'
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('keydown', onKey)
      if (window.__vyMorph) window.__vyMorph = null
      if (window.__vyParty) window.__vyParty = null
      if (audioCtx) { try { audioCtx.close() } catch {} audioCtx = null }
    }
  }, [])

  return (
    <footer
      id="footer"
      className="section container grid-box"
      style={{
        position: 'relative',
        textAlign: 'center',
        paddingBottom: 'clamp(20px, 2vw, 32px)',
      }}
    >
      <CornerPlus />

      <canvas
        ref={canvasRef}
        role="img"
        aria-label={WORD}
        style={{
          width: '100%',
          maxWidth: '1100px',
          height: 'clamp(140px, 18vw, 240px)',
          display: 'block',
          margin: '0 auto',
          cursor: 'crosshair',
        }}
      />

      <p className="mono-label" style={{ marginTop: '20px' }}>
        © {new Date().getFullYear()} · Akhand Pratapsingh · Built with Next.js
      </p>

      {/* Full-screen overlay for the party dance (hidden until launched). */}
      <canvas
        ref={overlayRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100vh',
          display: 'none',
          zIndex: 9998,
          pointerEvents: 'none',
        }}
      />
    </footer>
  )
}
