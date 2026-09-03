# Dmytro Bilukha — personal site

Single static `index.html`. All CSS/JS inline. Only three external deps, loaded
from CDN at pinned versions:

| Lib               | Version | Source                                                        |
|-------------------|---------|---------------------------------------------------------------|
| GSAP              | 3.13.0  | cdnjs                                                         |
| GSAP ScrollTrigger| 3.13.0  | cdnjs                                                         |
| Lenis             | 1.1.14  | jsDelivr                                                      |

Fonts (Space Grotesk display, Inter body) are self-hosted under
`assets/fonts/` as Latin-subset `woff2`. No build step, no bundler, no
`package.json`.

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
Subsequent deploys are the same command; each push to `main` via the Git
integration also redeploys automatically.

Exclude nothing extra — `.git`, `.scratch`, and `node_modules` are skipped by
Wrangler by default. Add a `.assetsignore` in the root only if that changes.

### Custom domain (later — `bilukha.dev` is not registered yet)

1. Register `bilukha.dev` (or chosen domain).
2. Cloudflare dashboard → **Workers & Pages** → `dmytro-bilukha` → **Custom domains** → *Set up a custom domain* → enter `bilukha.dev`.
3. If the domain's nameservers are already on Cloudflare, the DNS record is added automatically; otherwise move the domain to Cloudflare or add the shown `CNAME`.
4. Once live, update the placeholder `https://bilukha.dev/` URLs in `index.html` (`<link rel="canonical">`, `og:url`, `og:image`, `twitter:image`, and the JSON-LD `url`) — they are flagged with an HTML comment.

## Follow-ups

- **YouTube channel rename:** the portfolio playlist is currently under an old
  channel name ("Product Portfolio"). Rename the channel to "Dmytro Bilukha"
  for a consistent link label; no code change needed (the site links the
  playlist, not the channel).

## Structure

```
index.html
assets/video/   video assets
assets/img/     image assets
assets/fonts/   self-hosted woff2
cv/dmytro-bilukha-cv.pdf
```

`index.html` has empty placeholder `<section>`s (`hero, about, impact,
experience, cases, work, skills, contact`) filled by later tickets.

## Motion

Lenis smooth-scroll is driven by `gsap.ticker` and reports scroll to
`ScrollTrigger.update`. Elements with `data-reveal` fade/slide in on entry via
one shared helper. `prefers-reduced-motion: reduce` disables Lenis (native
scroll), skips all entrance animation, and any future `<video>` must not
autoplay.
