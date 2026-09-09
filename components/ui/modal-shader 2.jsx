'use client'

import { useEffect, useRef } from 'react'

/* Accent-tinted silk shader — the animated backdrop shared by the
   project and certificate detail modals. */
const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec3 uAccent;
uniform float uDark;

const vec3 CREAM = vec3(0.992, 0.976, 0.958);
const vec3 CHAR  = vec3(0.090, 0.088, 0.094);

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / min(uRes.x, uRes.y);
  float t = uTime * 0.12;

  vec2 p = uv * 2.0;
  for (float i = 1.0; i < 5.0; i++) {
    p.x += 0.40 / i * sin(i * 2.0 * p.y + t * 1.5 + i * 1.3);
    p.y += 0.40 / i * cos(i * 1.7 * p.x - t * 1.1 + i * 0.7);
  }

  float v1 = 0.5 + 0.5 * sin(p.x * 1.4 + t * 0.4);
  float v2 = 0.5 + 0.5 * cos(p.y * 1.7 - t * 0.3);

  // theme base: cream silk in light, charcoal silk in dark (accent desaturated
  // and dimmed so it reads as embers in the folds, not neon)
  vec3 base = mix(CREAM, CHAR, uDark);
  vec3 acc  = mix(uAccent, mix(uAccent, vec3(dot(uAccent, vec3(0.333))), 0.35) * 0.55, uDark);

  // accent-family palette: soft tint -> stronger ribbon -> deep fold
  vec3 soft = mix(base, acc, mix(0.28, 0.5, uDark));
  vec3 mid  = mix(base, acc, mix(0.55, 0.8, uDark));
  vec3 deep = mix(mix(vec3(0.15, 0.17, 0.25), vec3(0.16, 0.16, 0.19), uDark), acc, 0.45);

  vec3 col = mix(base, soft, smoothstep(0.15, 0.9, v1));
  col = mix(col, mid,  smoothstep(0.35, 0.95, v1 * v2));
  col = mix(col, deep, 0.4 * smoothstep(0.65, 0.98, v2 * (1.0 - v1)));

  float g = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
  col += (g - 0.5) * 0.03;

  gl_FragColor = vec4(col, 1.0);
}`

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`

function hexToRgb01(hex) {
  const n = parseInt(hex.slice(1), 16)
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
}

export default function ModalShader({ accent }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false })
    if (!gl) return

    const compile = (type, src) => {
      const sh = gl.createShader(type)
      gl.shaderSource(sh, src)
      gl.compileShader(sh)
      return sh
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
    const uAccent = gl.getUniformLocation(prog, 'uAccent')
    const uDark = gl.getUniformLocation(prog, 'uDark')
    const [ar, ag, ab] = hexToRgb01(accent)

    const isDark = () => (document.documentElement.getAttribute('data-theme') === 'dark' ? 1 : 0)
    let darkTarget = isDark()
    let dark = darkTarget
    const themeObserver = new MutationObserver(() => { darkTarget = isDark() })
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    let raf = 0
    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = Math.max(2, Math.round(rect.width * 0.5))
      canvas.height = Math.max(2, Math.round(rect.height * 0.5))
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    const start = performance.now()
    const draw = () => {
      gl.uniform2f(uRes, canvas.width, canvas.height)
      gl.uniform1f(uTime, (performance.now() - start) / 1000)
      gl.uniform3f(uAccent, ar, ag, ab)
      dark += (darkTarget - dark) * 0.06
      gl.uniform1f(uDark, dark)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
      raf = requestAnimationFrame(draw)
    }
    resize()
    draw()
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      themeObserver.disconnect()
      window.removeEventListener('resize', resize)
    }
  }, [accent])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
    />
  )
}
