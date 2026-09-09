// Highlighted aside. Usage:  <Callout type="info" title="Note">…</Callout>
// types: info | tip | warn | note
const ICONS = {
  info: 'ℹ',
  tip: '✦',
  warn: '▲',
  note: '✎',
}

export default function Callout({ type = 'info', title, children }) {
  const safe = ICONS[type] ? type : 'info'
  return (
    <aside className={`blog-callout blog-callout--${safe}`} role="note">
      <div className="blog-callout__mark" aria-hidden="true">
        {ICONS[safe]}
      </div>
      <div className="blog-callout__body">
        {title && <p className="blog-callout__title">{title}</p>}
        <div className="blog-callout__content">{children}</div>
      </div>
    </aside>
  )
}
