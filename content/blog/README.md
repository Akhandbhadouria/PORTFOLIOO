# Writing a blog post

Posts are MDX files in this directory. Filename = URL slug:
`content/blog/my-post.mdx` → `vibhavy.dev/blog/my-post`. No registration
needed — the index, sitemap, and prev/next nav pick new posts up automatically,
sorted newest-first by `date`.

Images live in `public/blog/` and are referenced as `/blog/<file>`.

## Frontmatter

```yaml
---
title: Post Title                 # required (quote it if it contains a colon)
date: 2026-07-08                  # required — drives ordering + prev/next
summary: Shown on the index card and used as the meta description.
tags: [CRDT, Realtime, Yjs]       # index shows the first 3
cover: /blog/cover.png            # optional — card, post header, OG image
author: Akhand Pratapsingh              # optional, this is the default
draft: true                       # optional — post is NOT built at all
---
```

Reading time is computed automatically. Publish a draft by removing
`draft: true` and pushing — Cloudflare rebuilds.

## Markdown features

- **Code blocks** — highlighted, copy button included. Optional title and
  line highlights:

  ````md
  ```js title="collab.js" {6-9}
  const doc = new Y.Doc()
  ```
  ````

- **GFM** — tables, task lists, strikethrough.
- **Footnotes** — `text[^1]` … `[^1]: Source.`
- **Math (KaTeX)** — `$O(n \log n)$` inline, `$$ … $$` for display math.
- **Images** — `![Caption text](/blog/img.png)` renders as a captioned figure.
- **Headings** — start at `##` (title is the h1); anchors are automatic.

## Custom components (no imports needed)

```mdx
<Callout type="tip" title="Optional title">   {/* info | tip | warn | note */}
Body text.
</Callout>

<Figure
  src="/blog/diagram.svg"
  alt="Accessible description"
  caption="Shown under the image."
  credit="optional credit"
  wide                              {/* optional: break out of text column */}
/>

<Chart
  type="line"                       {/* line | area | bar | pie */}
  xKey="week"
  series={[{ key: 'p95', name: 'p95 (ms)', color: '#f7790f' }]}
  data={[{ week: 'W1', p95: 240 }, { week: 'W2', p95: 180 }]}
  caption="Optional caption"
/>
{/* Chart extras: height={300}, stacked, showLegend={false}.
    Pie: data={[{ name: 'CSR', value: 40 }]} — no series needed. */}
```

## Notes

- Social scrapers don't render SVG covers — use 1200×630 PNG/JPG for posts
  whose links should unfurl on Twitter/LinkedIn.
- Preview locally: `npm run dev` → localhost:4000/blog/<slug>.
