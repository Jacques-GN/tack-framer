# SnapSite — Website to HTML Exporter

Export any published site as a portable, multi-file bundle: HTML pages, images, fonts, CSS and JavaScript — packaged as a ZIP ready for self-hosting, editing or developer handoff.

![Stack](https://img.shields.io/badge/Next.js%2016-React%2019-violet) ![Styling](https://img.shields.io/badge/Tailwind%20CSS%204-Zustand-violet)

A deliberately minimal codebase: **no auth, no database, 8 runtime dependencies**. Everything you need for the export flow, nothing else.

## ✨ Features

- **Site scan** — discovers every published page via `sitemap.xml`, internal-link crawl and `/404` probe, with page titles.
- **Multi-page export** — select all or individual pages (up to 100 per export). Each page is written as `path/index.html`, preserving clean URLs.
- **Full asset pipeline** — downloads images, fonts, CSS and JS; resolves nested CSS references (`url(...)`, `@font-face`); rewrites every reference to relative local paths.
- **Link rewriting** — internal links between exported pages are converted to relative file paths so the site works offline.
- **SEO extras** — auto-generated `sitemap.xml`, `robots.txt` and an optional per-page SEO audit report (`audit-report.html`).
- **Export options** — choose which asset types to include, minify HTML, forms handling (manual / custom endpoint / Formspree / Netlify), live preview of the original site in the wizard.
- **Zero state** — the export runs fully in memory and streams the ZIP straight back. No database, no cron, no storage bucket required.

## 🎨 Design

Violet primary (`#7c3aed`) with fuchsia and amber section accents, Inter + Outfit typography. The whole design system fits in ~75 lines of CSS (`.btn-primary` gradient, hero grid, two keyframe animations).

## 🏗️ Architecture

```
src/
├── app/
│   ├── page.tsx                  # Marketing landing (clone-grade UI)
│   └── api/
│       ├── scan/route.ts         # POST — site discovery (sitemap + crawl)
│       ├── export/route.ts       # POST — synchronous export, streams ZIP
│       └── preview/route.ts      # GET  — CORS-free iframe preview proxy
├── lib/export/
│   ├── crawler.ts                # Sitemap + link crawler, title extraction
│   ├── exporter.ts               # In-memory export pipeline → ZIP buffer
│   ├── html.ts                   # HTML/CSS rewriting, asset extraction, SEO audit
│   ├── store.ts                  # Zustand wizard state (scan → options → export)
│   └── types.ts                  # Shared types + URL/path helpers
└── components/
    ├── site/                     # Landing page sections
    └── export/                   # 3-step export wizard + progress modal
```

**Why synchronous?** The export endpoint runs the whole pipeline inside one serverless invocation (`maxDuration = 300`) and returns the ZIP as the response body. This makes the app 100 % stateless — it deploys anywhere Next.js runs with zero infrastructure.

Limits: 100 pages/export · 100 MB of assets/export · 10 MB per file.

## 🚀 Deploy to Vercel

1. Push this repository to GitHub.
2. On [vercel.com](https://vercel.com) → **Add New… → Project** → import the repo.
3. Framework preset: **Next.js** (auto-detected). No environment variables required.
4. Deploy.

Or with the CLI:

```bash
npm i -g vercel
vercel --prod
```

> Note: full-site exports (100 pages, ~300 assets) take 20–60 s. This fits comfortably inside Vercel's function timeout on both Hobby (Fluid compute) and Pro plans.

## 💻 Local development

```bash
bun install        # or npm install
bun run dev        # http://localhost:3000
bun run build      # production build
bun run lint       # eslint
```

## 📦 What an export looks like

```
clavion-wbs.framer.website-2026-09-19.zip
├── index.html                  # home page
├── about/index.html
├── blog/
│   ├── index.html
│   └── my-post/index.html
├── assets/
│   ├── images/                 # 168 files
│   ├── fonts/                  # 98 files
│   ├── js/                     # 46 files
│   └── other/
├── sitemap.xml
├── robots.txt
├── audit-report.html           # optional (SEO report option)
└── export-summary.json
```

Serve the folder with any static host (Vercel, Netlify, Cloudflare Pages, GitHub Pages, nginx…) — internal navigation, images and fonts work offline.

## ⚖️ Fair use

SnapSite exports the **publicly rendered** output of published sites. It does not extract Framer project sources, private CMS data or paywalled content. Only export sites you own or have permission to export. "Framer" is a trademark of Framer B.V. — this tool is independent and not affiliated with Framer.
