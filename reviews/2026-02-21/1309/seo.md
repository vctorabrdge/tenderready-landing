# SEO review (2026-02-21 13:09)

- Production returns Vercel NOT_FOUND, so SEO is effectively **zero** (no indexable content).
- Repo has `<title>` + meta description in `app/layout.tsx` (good baseline).
- Root `robots.txt` and `sitemap.xml` currently reference **https://site-leanspace.vercel.app/** (wrong domain for Tenderpack) and appear to be static files at repo root (Next won’t necessarily serve these unless placed in `public/` or implemented via `app/robots.ts` / `app/sitemap.ts`).
- Internal nav in `app/page.tsx` links to `/pages/handoff-pack.html` (likely not a Next route unless moved to `public/`), which risks broken internal linking.
