# Dmytro Bilukha — personal site

**Art direction: "The Weekly Circular".** The page is built as a broadsheet
newspaper / supermarket promo leaflet: a masthead nameplate, a dateline, one
lead story, heavy horizontal ink rules, multi-column running text, price-tag
metric tiles, a classifieds grid, an aisle directory. Newsprint palette.

Single static `index.html`. All CSS + JS inline. **No build step, no bundler,
no `package.json`, and no CDN scripts** — the whole runtime is ~40 lines of
vanilla JS (email assembly, YouTube facade, one IntersectionObserver).

## Palette

| Role | Hex | Use |
|---|---|---|
| Paper (background) | `#FAF7F0` | the only ground |
| Ink (text, rules, borders) | `#1B1A17` | |
| Promo red | `#E4002B` | CTAs, the masthead rule, price-tag stickers (large text only) |
| Highlight yellow | `#FFD200` | fill behind price numerals, highlighter marks (never a text colour) |

Light theme only, committed (`color-scheme: light`). A newspaper is a paper
artifact; there is no dark mode.

## Fonts

Self-hosted `woff2` under `assets/fonts/`, Latin subset, `font-display: swap`.
The two above-the-fold weights (Archivo Black, Archivo 800) are preloaded.

| Family | Weights | Role |
|---|---|---|
| Archivo | 400, 600, 800 | section nameplates, lead headline, price numerals, UI |
| Archivo Black | 400 | masthead nameplate, drop cap |
| Newsreader | 400, 400 italic, 600 | all running text, drop-cap article, captions in prose |
| Spline Sans Mono | 400, 500 | dateline, classifieds, the colophon |

Source: [Fontsource](https://fontsource.org/) CDN, pinned to `@latest` at
download time. These families ship no Cyrillic subset on Fontsource and the
page has no Cyrillic text, so only Latin is bundled.

## Motion

The page "sets like it is being printed": the masthead nameplate ink-settles
once on load, and each section's hairline rule draws once when it scrolls into
view (one `IntersectionObserver`). **Nothing moves on scroll.** No Lenis, no
GSAP, no scroll hijacking. Under `prefers-reduced-motion: reduce` the page just
renders — no load animation, no rule draw.

## Media

No video anywhere. Imagery is black-and-white, generated with
[`kie-media-cli`](https://github.com/MIt9/kie-media-cli) — see
`assets/img/SOURCES.md` for the reproducible generation record. The two
case-study clips use a lite-embed facade: a local thumbnail plus a real play
button; the `youtube-nocookie.com` iframe is created only on click, so no
YouTube request fires on page load.

## Local preview

```sh
python3 -m http.server 8000
# or
npx serve .
```

Then open <http://localhost:8000>.

## Deploy — Cloudflare Pages

Static site, **no build step**. Everything in the repo root is served as-is.

### Dashboard (Git integration)

- **Framework preset:** None
- **Build command:** *(leave empty)*
- **Build output directory:** `/` (repo root)
- **Root directory:** `/`

### CLI (Wrangler)

First deploy creates the project (`dmytro-bilukha` → `dmytro-bilukha.pages.dev`):

```sh
npx wrangler pages deploy . --project-name=dmytro-bilukha
```

Wrangler needs a one-time login (`npx wrangler login`, opens a browser) or a
`CLOUDFLARE_API_TOKEN` env var with the **Cloudflare Pages: Edit** permission.
Each push to `main` via the Git integration also redeploys automatically.

`.git`, `.scratch`, and `.claude` are skipped by Wrangler by default.

### Custom domain (later — `bilukha.dev` is not registered yet)

1. Register `bilukha.dev` (or a chosen domain).
2. Cloudflare dashboard → **Workers & Pages** → `dmytro-bilukha` → **Custom domains**.
3. Once live, update the placeholder `https://bilukha.dev/` URLs in `index.html`
   (`<link rel="canonical">`, `og:url`, `og:image`, `twitter:image`, and the
   JSON-LD `url`) — they are flagged with an HTML comment.

## Follow-ups

- **YouTube channel rename:** the portfolio playlist is under an old channel
  name. The site links the playlist, not the channel, so no code change is
  needed when it is renamed.

## Structure

```
index.html
assets/img/      black-and-white imagery + yt-*.jpg thumbnails + SOURCES.md
assets/fonts/    self-hosted woff2 (Archivo, Archivo Black, Newsreader, Spline Sans Mono)
cv/dmytro-bilukha-cv.pdf
```

## Sections (in order)

Front page (masthead) · The Long Read (about) · This Week's Prices (impact) ·
The Career Ledger (experience) · Case Files (cases) · The Classifieds (selected
work) · Aisle Directory (skills) · The Back Page (contact) · colophon (footer).
