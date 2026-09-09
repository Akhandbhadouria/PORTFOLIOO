'use client'

// Wraps the <pre> emitted by rehype-pretty-code and adds a copy button.
// Copy reads the rendered text so we don't have to walk the highlighted spans.
import { useRef, useState } from 'react'

export default function Pre(props) {
  const ref = useRef(null)
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    const code = ref.current?.innerText ?? ''
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* clipboard blocked — ignore */
    }
  }

  return (
    <div className="blog-code">
      <button
        type="button"
        className="blog-code__copy"
        onClick={copy}
        aria-label="Copy code"
      >
        {copied ? 'Copied ✓' : 'Copy'}
      </button>
      <pre ref={ref} {...props} />
    </div>
  )
}
