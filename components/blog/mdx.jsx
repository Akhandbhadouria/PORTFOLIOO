// Component map handed to <MDXRemote>. Custom components are available by name
// inside every .mdx post; the tag overrides restyle plain markdown output.
import Figure from './Figure'
import Callout from './Callout'
import Chart from './Chart'
import Pre from './Pre'

function Anchor({ href = '', children, ...rest }) {
  const external = /^https?:\/\//.test(href)
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...rest}
    >
      {children}
    </a>
  )
}

// Markdown images (![alt](src)) render as captioned figures using alt text.
function MdImg({ src, alt }) {
  return <Figure src={src} alt={alt} caption={alt} />
}

export const mdxComponents = {
  // custom components usable directly in MDX
  Figure,
  Callout,
  Chart,
  // tag overrides
  a: Anchor,
  img: MdImg,
  pre: Pre,
}
