# SEO review — 2026-02-21 13:07

## Current findings (best-effort)

- **Production root returns 404**: this is the #1 SEO issue (indexing + conversions).
- `app/layout.tsx` includes `metadata` with title/description, which is good **if `/` is served**.
- `public/robots.txt` + `public/sitemap.xml` exist, but both hardcode `https://site-leanspace.vercel.app/...`.
  - For production domain `https://tenderpack.org/`, sitemap + robots should reference the **canonical domain**.
- No visible confirmation yet of:
  - OpenGraph/Twitter tags (important for share previews)
  - Canonical URL
- Internal links: app homepage links to `/resources`, `#how`, `#pack`, `/mvp`, and `/pages/handoff-pack.html`.
  - If Vercel cleanUrls are on, consider a nicer route for the handoff pack (not a raw `.html` under `/pages/`).

## TODO next

- Fix routing/deployment so `/` serves the landing content (not 404).
- Update sitemap + robots sitemap URL to `https://tenderpack.org/sitemap.xml` and list `tenderpack.org` URLs.
