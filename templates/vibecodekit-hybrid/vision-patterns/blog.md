# Vision Pattern — Blog / Content Site

> Long-form reading experience optimised for discovery and SEO.

## Structural signature
- Hierarchical content: home → category → article.
- RSS / sitemap / schema.org markup.
- Reading time, table of contents, related posts, share.
- Usually static or ISR-rendered.

## Canonical layout
1. **Home**: featured post, recent posts list, category tiles.
2. **Category**: paginated post list.
3. **Article**:
   - Breadcrumb, title, meta (author, date, reading time).
   - Cover image.
   - Body (typography-first).
   - Floating TOC on desktop.
   - Related posts + share + newsletter CTA at bottom.
4. **Author page**, **Tag page**, **Search** (optional).
5. **Newsletter**: capture at multiple natural pause points.

## Default tech stack (suggestion)
- Framework: Astro / Next.js (static export or ISR)
- Content: MDX in repo, or Sanity / Contentlayer for non-dev authors
- Search: Fuse.js / Algolia / Typesense
- Analytics: Plausible / GA4
- Comments: Giscus / Disqus (only if explicitly needed)

## Non-goals
- User auth, personalised feeds. If required, lift to SaaS / Custom.
- Real-time anything.

## Persona focus (RRI)
- **First-Timer**: can I tell what this blog is about from the home page?
- **Data Scanner**: can I skim an article via headings + TOC?
- **SEO** (BA lens): meta tags, structured data, canonical URLs, alt text.

## Flow Physics (RRI-UX) priorities
- SCROLL: TOC highlights current section
- EYE TRAVEL: body measure ≤ 72ch
- RETURN PATH: category + breadcrumb always visible
- TIME TO ACTION: newsletter CTA appears at ≥ 60% scroll, not earlier

## Acceptance skeleton
```
Given an article with 10+ headings
When the user scrolls
Then the TOC highlights the active section within 100ms
And Lighthouse SEO score ≥ 95
```
