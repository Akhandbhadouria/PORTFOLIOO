// Image + caption. Static-export safe (plain <img>, images are unoptimized).
// Usage in MDX:  <Figure src="/blog/foo.png" alt="…" caption="…" wide />
export default function Figure({ src, alt = '', caption, wide = false, credit }) {
  return (
    <figure className={`blog-figure${wide ? ' blog-figure--wide' : ''}`}>
      <div className="blog-figure__frame">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt || caption || ''} loading="lazy" />
      </div>
      {(caption || credit) && (
        <figcaption>
          {caption}
          {credit && <span className="blog-figure__credit"> · {credit}</span>}
        </figcaption>
      )}
    </figure>
  )
}
