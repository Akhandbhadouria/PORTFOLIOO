import 'katex/dist/katex.min.css'

import {
  getAllPosts,
  getPostBySlug,
  getAdjacentPosts,
  formatDate,
} from '../../../lib/blog'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'
import '../../../components/blog/blog.css'

export const dynamicParams = false

// Drafts are excluded here too — with dynamicParams=false that makes a
// draft's URL 404 instead of quietly shipping an unlisted page.
export function generateStaticParams() {
  return getAllPosts().map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const { meta } = getPostBySlug(slug)
  const url = `https://vibhavy.dev/blog/${slug}`
  return {
    title: `${meta.title} — Akhand`,
    description: meta.summary,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: meta.title,
      description: meta.summary,
      publishedTime: meta.date,
      authors: [meta.author],
      ...(meta.cover ? { images: [{ url: meta.cover }] } : {}),
    },
    twitter: {
      card: meta.cover ? 'summary_large_image' : 'summary',
      title: meta.title,
      description: meta.summary,
    },
  }
}

export default async function PostPage({ params }) {
  const { slug } = await params
  const { meta } = getPostBySlug(slug)
  const { prev, next } = getAdjacentPosts(slug)
  // Turbopack compiles every content/blog/*.mdx into a module at build time;
  // the dynamic specifier resolves to the one matching this slug.
  const { default: PostBody } = await import(`../../../content/blog/${slug}.mdx`)

  return (
    <div className="site-content">
      <Navbar />
      <main className="blog-post">
        <article>
          <header className="blog-post__head">
            <a href="/blog" className="blog-post__back">← All writing</a>
            <div className="blog-post__tags">
              {meta.tags.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
            <h1>{meta.title}</h1>
            {meta.summary && <p className="blog-post__summary">{meta.summary}</p>}
            <div className="blog-post__byline">
              <span>{meta.author}</span>
              <span aria-hidden="true">·</span>
              <span>{formatDate(meta.date)}</span>
              <span aria-hidden="true">·</span>
              <span>{meta.readingTime} min read</span>
            </div>
          </header>

          {meta.cover && (
            <div className="blog-post__cover">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={meta.cover} alt="" />
            </div>
          )}

          <div className="blog-prose">
            <PostBody />
          </div>
        </article>

        {(prev || next) && (
          <nav className="blog-post__nav" aria-label="More posts">
            {prev ? (
              <a href={`/blog/${prev.slug}`} className="blog-post__navcard">
                <span className="mono-label">← NEWER</span>
                <strong>{prev.meta.title}</strong>
              </a>
            ) : (
              <span />
            )}
            {next ? (
              <a href={`/blog/${next.slug}`} className="blog-post__navcard blog-post__navcard--right">
                <span className="mono-label">OLDER →</span>
                <strong>{next.meta.title}</strong>
              </a>
            ) : (
              <span />
            )}
          </nav>
        )}
      </main>
      <div className="grid-gutter" aria-hidden="true" />
      <Footer />
      <div aria-hidden="true" style={{ height: 'clamp(32px, 4vw, 56px)' }} />
    </div>
  )
}
