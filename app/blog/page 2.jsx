import { getAllPosts, formatDate } from '../../lib/blog'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import '../../components/blog/blog.css'

export const metadata = {
  title: 'Writing — Akhand Pratapsingh',
  description:
    'Essays and build logs on full-stack engineering — real-time systems, performance, and the craft of shipping products.',
  alternates: { canonical: 'https://vibhavy.dev/blog' },
  openGraph: {
    type: 'website',
    url: 'https://vibhavy.dev/blog',
    title: 'Writing — Akhand Pratapsingh',
    description:
      'Essays and build logs on full-stack engineering — real-time systems, performance, and the craft of shipping products.',
  },
}

export default function BlogIndex() {
  const posts = getAllPosts()
  const [featured, ...rest] = posts

  return (
    <div className="site-content">
      <Navbar />
      <main className="blog-index">
        <header className="blog-index__head">
          <span className="mono-label">/ WRITING</span>
          <h1>Notes on building things.</h1>
          <p>
            Deep-dives, engineering explainers, and build logs — with the code,
            data, and diagrams that go with them.
          </p>
        </header>

        {featured && (
          <a href={`/blog/${featured.slug}`} className="blog-feature">
            {featured.meta.cover && (
              <div className="blog-feature__cover">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={featured.meta.cover} alt="" loading="lazy" />
              </div>
            )}
            <div className="blog-feature__body">
              <span className="mono-label">FEATURED</span>
              <h2>{featured.meta.title}</h2>
              <p>{featured.meta.summary}</p>
              <div className="blog-card__meta">
                <span>{formatDate(featured.meta.date)}</span>
                <span aria-hidden="true">·</span>
                <span>{featured.meta.readingTime} min read</span>
              </div>
            </div>
          </a>
        )}

        <ul className="blog-grid">
          {rest.map((post) => (
            <li key={post.slug}>
              <a href={`/blog/${post.slug}`} className="blog-card">
                {post.meta.cover && (
                  <div className="blog-card__cover">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={post.meta.cover} alt="" loading="lazy" />
                  </div>
                )}
                <div className="blog-card__body">
                  <div className="blog-card__tags">
                    {post.meta.tags.slice(0, 3).map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                  <h3>{post.meta.title}</h3>
                  <p>{post.meta.summary}</p>
                  <div className="blog-card__meta">
                    <span>{formatDate(post.meta.date)}</span>
                    <span aria-hidden="true">·</span>
                    <span>{post.meta.readingTime} min read</span>
                  </div>
                </div>
              </a>
            </li>
          ))}
        </ul>

        {posts.length === 0 && (
          <p className="blog-empty">No posts yet — check back soon.</p>
        )}
      </main>
      <div className="grid-gutter" aria-hidden="true" />
      <Footer />
      <div aria-hidden="true" style={{ height: 'clamp(32px, 4vw, 56px)' }} />
    </div>
  )
}
