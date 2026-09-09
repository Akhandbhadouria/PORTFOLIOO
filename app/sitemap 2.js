// Generated at build time (static export emits out/sitemap.xml). Replaces the
// old hand-written public/sitemap.xml, which only listed the homepage.
import { getAllPosts } from '../lib/blog'

const SITE_URL = 'https://vibhavy.dev'

export const dynamic = 'force-static'

export default function sitemap() {
  const posts = getAllPosts()
  const newestPost = posts[0]?.meta.date ?? new Date().toISOString()

  return [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date('2026-06-03'),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/projects`,
      lastModified: new Date('2026-06-03'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(newestPost),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.meta.date),
      changeFrequency: 'yearly',
      priority: 0.6,
    })),
  ]
}
