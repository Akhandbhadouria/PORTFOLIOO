import createMDX from '@next/mdx'
import { createRequire } from 'node:module'

// MDX is compiled by Next/Turbopack itself (not a runtime lib), so the JSX
// runtime always matches the app's React. Plugins must be passed as strings
// because Turbopack serializes loader options across a worker boundary — but
// bare package names ("remark-gfm") are resolved by @next/mdx relative to the
// .mdx file's directory (content/blog/), and Turbopack's dev loader worker
// doesn't reliably set that base, so the node_modules walk-up intermittently
// fails with "Cannot find module 'remark-frontmatter'". Resolving to absolute
// paths here removes the ambiguity while staying serializable.
const require = createRequire(import.meta.url)
const resolvePlugin = (plugin) =>
  Array.isArray(plugin)
    ? [require.resolve(plugin[0]), ...plugin.slice(1)]
    : require.resolve(plugin)

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [
      'remark-frontmatter',
      'remark-gfm',
      'remark-math',
    ].map(resolvePlugin),
    rehypePlugins: [
      'rehype-slug',
      ['rehype-autolink-headings', { behavior: 'wrap' }],
      'rehype-katex',
      ['rehype-pretty-code', { theme: 'github-light', keepBackground: false, defaultLang: 'plaintext' }],
    ].map(resolvePlugin),
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // .mdx files are imported as modules, not treated as routes.
  pageExtensions: ['js', 'jsx'],
}

export default withMDX(nextConfig)
