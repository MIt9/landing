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

Static site, no build.

- **Framework preset:** None
- **Build command:** *(leave empty)*
- **Build output directory:** `/` (repo root)

CLI:

```sh
npx wrangler pages deploy .
```

Or drag-and-drop the repo folder in the Cloudflare Pages dashboard.

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
