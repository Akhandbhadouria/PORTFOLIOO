// ── Blog content layer ─────────────────────────────────────────────────────
// Posts live as MDX files in /content/blog/<slug>.mdx. Each file has YAML
// frontmatter (title, date, summary, tags, cover, author, draft) followed by
// MDX body. These helpers run at BUILD TIME only (static export), so plain
// Node fs access is safe — nothing here ships to the browser.

import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog')

// Rough reading-time estimate at ~200 wpm from the raw MDX body.
function readingTime(body) {
  const words = body.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

function parseFile(slug) {
  const full = path.join(BLOG_DIR, `${slug}.mdx`)
  const raw = fs.readFileSync(full, 'utf8')
  const { data, content } = matter(raw)
  return {
    slug,
    content,
    meta: {
      title: data.title ?? slug,
      date: data.date ? new Date(data.date).toISOString() : null,
      summary: data.summary ?? '',
      tags: data.tags ?? [],
      cover: data.cover ?? null,
      author: data.author ?? 'Akhand Pratapsingh',
      draft: Boolean(data.draft),
      readingTime: readingTime(content),
    },
  }
}

/** Every slug that has a matching .mdx file (drafts included). */
export function getAllSlugs() {
  if (!fs.existsSync(BLOG_DIR)) return []
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''))
}

/** One post by slug — throws if the file is missing. */
export function getPostBySlug(slug) {
  return parseFile(slug)
}

/** All published posts, newest first. Drafts are excluded in production. */
export function getAllPosts({ includeDrafts = false } = {}) {
  return getAllSlugs()
    .map(parseFile)
    .filter((p) => includeDrafts || !p.meta.draft)
    .sort((a, b) => new Date(b.meta.date) - new Date(a.meta.date))
}

/** Previous / next post relative to a slug, for footer navigation. */
export function getAdjacentPosts(slug) {
  const posts = getAllPosts()
  const i = posts.findIndex((p) => p.slug === slug)
  return {
    prev: i > 0 ? posts[i - 1] : null,
    next: i >= 0 && i < posts.length - 1 ? posts[i + 1] : null,
  }
}

/** Human-friendly date, e.g. "Jul 10, 2026". */
export function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
