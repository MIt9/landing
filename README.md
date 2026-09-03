# Dmytro Bilukha — personal site

**Art direction: "Hold the position".** Coach to developer to tech lead, told
as one job: set the stance, hold the standard, move the group forward. The page
is a sequence of *holds* — the viewport pins, one idea is worked through kinetic
type and generated motion as you scroll, then releases to the next. `pin: true`
is both the wrestling term and the ScrollTrigger mechanic.

Single static `index.html`. All CSS + JS inline. **No build step, no bundler,
no `package.json`.** The only external files are four pinned CDN scripts
(GSAP core, ScrollTrigger, SplitText, Lenis, ~70 KB gzipped, all `defer`).

## Palette

Cold graphite ground, bone text, one cobalt accent, one signal-yellow spotlight.
Committed dark theme (`color-scheme: dark`) — the design is a single look.

| Token | Hex | Role |
|---|---|---|
| `--bg` | `#0E1217` | page ground |
| `--bg-deep` | `#080A0D` | vignette edges, gutters, CTA label |
| `--bg-raise` | `#161C23` | pinned panel surface, video frames |
| `--bone` | `#F2EEE4` | primary text |
| `--bone-dim` | `#9CA0A6` | secondary text, mono labels |
| `--bone-faint` | `#4A5158` | hairlines only, never text |
| `--cobalt` | `#2B4CF0` | scroll rail, focus rings, link underlines, active index |
| `--cobalt-lift` | `#4E6BFF` | body-link text colour (AA on bg) |
| `--signal` | `#F5E003` | the one key number per data moment, primary CTA, pinned-title underline |

Every image and clip is matte, print-sharp, cold-graded. No glow anywhere. A
fixed grain layer sits over the page (skipped under reduced motion).

## Fonts

Self-hosted `woff2` under `assets/fonts/`, Latin subset, `font-display: swap`.
Bricolage variable + General Sans 400 are preloaded; the hero poster is
preloaded `fetchpriority="high"`.

| Family | Axes / weights | Role |
|---|---|---|
| Bricolage Grotesque | variable `wght` 200–800 | display, all headings, kinetic type. The signature scrub loads `wght` 320→780 while a section holds. |
| General Sans | 400 / 500 / 600 | body + UI |
| Spline Sans Mono | 400 / 500 | evidence only — metric numbers, section index, timeline years, repo paths, credit |

Sources: Bricolage from [Fontsource](https://fontsource.org/) (`:vf` latin);
General Sans from [Fontshare](https://www.fontshare.com/fonts/general-sans).

## Motion

GSAP + ScrollTrigger + SplitText, driven through Lenis smooth-scroll
(`lerp: 0.09`). All ScrollTriggers are built after `window.load` and after
`document.fonts.load`, wrapped in `gsap.matchMedia`:

- **Desktop (`min-width: 901px`)** — full rig. Six `100dvh` sections pin for a
  scroll and are worked through during the hold: hero headline weight loads and
  a cobalt hairline sweeps; the About manifesto unmasks line by line; **Impact
  is a horizontal scroll hijack** through six full-screen number plates
  (`x` transform on an inner track, never body overflow); the Experience
  timeline draws and milestones snap in with a cross-fading background year;
  Cases is a sticky-stack of two video cards; Selected Work is a scrubbed
  row-stagger. Skills does **not** pin (pattern break) and carries the page's
  one marquee, its `timeScale` driven by scroll velocity. Contact does not pin;
  the word "code" punches to signal-yellow on enter.
- **Mobile (`pointer: coarse`, `max-width: 900px`)** — no pins, no hijack, no
  Lenis. Light `IntersectionObserver` reveals, numbers count once, one video at
  a time.
- **`prefers-reduced-motion: reduce`** — no Lenis, no GSAP, native scroll,
  videos show their posters, grain off. Each section is a designed static
  layout, not a degraded one.

The section index overlay (top-bar **Index** button) is the keyboard skip
mechanism: focus-trapped, `Esc` closes, links call `lenis.scrollTo`. A
visually-hidden skip link to `#main` is also present.

**Not built:** the blueprint's global directional 1/8 snap. With six pins plus
the 6400 px horizontal Impact hijack the scroll distance per section is wildly
uneven, so a uniform or section-boundary snap either lands nowhere meaningful or
flings the viewer through the whole horizontal pan on a short pause. Lenis plus
the pins already give the sectioned cadence. See the comment in `index.html`.

## Media

Four short clips under `assets/video/` (`hero`, `impact-a`, `impact-b`,
`work-texture`), each `mp4` + `webm` + an `avif` poster. All are
`preload="none"` with `<source data-src>` so nothing loads until an
`IntersectionObserver` (`rootMargin: "100% 0px"`) brings the section within one
viewport; never more than one plays at once; all pause on exit. Imagery
generated with [`kie-media-cli`](https://github.com/MIt9/kie-media-cli) — see
`assets/img/SOURCES.md`.

The two case-study clips use a lite-embed facade: a local thumbnail plus a real
play button; the `youtube-nocookie.com` iframe is created only on click, so no
YouTube request fires on page load.

Contact e-mail is assembled in JS (`["siniidrozd","gmail.com"].join("@")`) and
never appears in the HTML source; `<noscript>` points to LinkedIn. No phone
number anywhere.

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
assets/img/      cold-graded imagery + og-image + yt-*.jpg thumbnails + SOURCES.md
assets/video/    hero / impact-a / impact-b / work-texture, each mp4+webm+avif poster
assets/fonts/    self-hosted woff2 (Bricolage Grotesque variable, General Sans 400/500/600, Spline Sans Mono 400/500)
cv/dmytro-bilukha-cv.pdf
```

## Sections (in order)

01 Hero (`FRONTEND TECH LEAD`) · 02 About (the manifesto) · 03 Impact (six
number plates, horizontal) · 04 Experience (ten years, one company) · 05 Cases
(two walkthroughs) · 06 Selected work (five repos) · 07 Skills (four groups +
marquee) · 08 Contact (`Still coaching. Now in code.`) · colophon.
