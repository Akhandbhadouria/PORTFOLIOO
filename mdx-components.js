// Required by @next/mdx in the App Router. Every compiled .mdx file pulls its
// component overrides from here, so our custom blocks (Figure, Chart, Callout)
// and tag restyles are available in posts without per-file imports.
import { mdxComponents } from './components/blog/mdx'

export function useMDXComponents(components) {
  return {
    ...components,
    ...mdxComponents,
  }
}
