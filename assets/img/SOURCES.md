# Image sources — reproducible generation record

**Art direction: "The Weekly Circular"** — the site is a broadsheet newspaper /
supermarket promo leaflet. Newsprint palette: paper `#FAF7F0`, ink `#1B1A17`,
promo-red `#E4002B`, highlight-yellow `#FFD200`. All imagery is black-and-white /
neutral greyscale; the site applies any tint in CSS.

(Supersedes the previous dark-charcoal / amber `#F5A524` direction. The video
assets from that direction were deleted — the newspaper direction has no video.)

Subject: Dmytro Bilukha — man mid-40s, short dark hair greying at the sides,
short dark beard, blue-grey eyes, athletic former Greco-Roman wrestler build.

Face reference images (passed as `--image`, auto-uploaded by the CLI):
- `/Users/d.bilukcha/work/resume/photo/photo_2026-09-03_15-20-42.jpg` (front, neutral)
- `/Users/d.bilukcha/work/resume/photo/photo_2026-09-03_15-20-47.jpg` (3/4 view)

Tooling: `kie` CLI (`kie-media-cli` 0.3.1), model `google/nano-banana-edit`
(reference-image edit) and `google/nano-banana` (text-to-image). Local
post-processing with `ffmpeg`, `cwebp`, `avifenc`, `rsvg-convert`, `sips`.

---

## 1. portrait.jpg / portrait.webp / portrait.avif  (1280 x 1600, greyscale)

- **Model:** `google/nano-banana-edit`
- **KIE task id:** `adddbc29fec9784a6f0a8a9a31444a18`
- **Params:** `aspect_ratio=4:5`, `output_format=jpeg`
- **Reference images:** the two face-reference photos above (both `--image`)
- **Raw output:** 896 x 1152 JPEG (`image_2cc78225d992a9f2f0380f8ff623c31e.jpg`)

**Prompt:**

> documentary black-and-white environmental portrait of the same man from the
> reference photos, keep him exactly recognizable: man mid-40s, short dark hair
> greying at the sides, short dark beard, blue-grey eyes, athletic ex-wrestler
> build, broad shoulders. Wearing a plain dark crew-neck shirt. Newspaper
> front-page press photography. Direct calm gaze straight to camera, mouth
> closed, neutral serious expression. Plain mid-grey seamless studio background.
> Hard even frontal light, sharp focus edge to edge, high micro-contrast,
> visible skin texture and pores, 50mm lens, editorial press photo. Head and
> shoulders, subject centered, generous headroom. NO rim light, NO coloured
> light, NO shallow depth of field, NO bokeh, NO vignette. Genuinely
> black-and-white neutral greyscale.

```bash
kie run google/nano-banana-edit \
  --image /Users/d.bilukcha/work/resume/photo/photo_2026-09-03_15-20-42.jpg \
  --image /Users/d.bilukcha/work/resume/photo/photo_2026-09-03_15-20-47.jpg \
  --prompt "<above>" \
  --set aspect_ratio=4:5 --set output_format=jpeg \
  --wait --download ./out --json
```

**Post-processing** (upscale to 1280x1600, force true greyscale, encode):

```bash
ffmpeg -y -i image_2cc78225d992a9f2f0380f8ff623c31e.jpg \
  -vf "scale=1280:1600:flags=lanczos,format=gray" portrait_grey.png
ffmpeg -y -i portrait_grey.png -q:v 2 portrait.jpg          # ~112 KB
cwebp -q 82 portrait_grey.png -o portrait.webp              # ~38 KB
avifenc --min 20 --max 34 -s 4 -d 8 portrait_grey.png portrait.avif   # ~19 KB
```

Verified neutral: `ffmpeg -i portrait.jpg -vf signalstats ...` → SATAVG 0.

---

## 2. shelf.jpg / shelf.webp  (1600 x 914, greyscale) — mid-page section break

- **Model:** `google/nano-banana` (text-to-image)
- **KIE task id:** `8e00e7501a0973b9d8ba63b18d438169`
  (first attempt `df5bad61ff1e92825ef09d56c2cd0d97` was too sparse — rejected)
- **Params:** `aspect_ratio=16:9`, `output_format=jpeg`
- **Raw output:** 1344 x 768 JPEG (`image_b3d9a758b345e1cc03bef9e7392c5ed2.jpg`)

**Prompt:**

> tight graphic black-and-white close-up photograph of supermarket shelf rails
> stacked in three or four horizontal rows that FILL THE ENTIRE FRAME edge to
> edge, each metal rail crammed with blank white price-tag holders and empty
> promo sticker clips, retail shelf-edge vernacular. Shot dead flat and frontal
> like documentary photography, extreme high contrast monochrome, deep black
> shadows between shelves, bright blown highlights on the labels, hard raking
> light, sharp gritty focus, heavy newsprint grain. NO readable text, NO
> numbers, NO prices, NO barcodes, NO brand logos, blank label faces only.
> Dense, busy, graphic composition with no empty background.

```bash
kie run google/nano-banana --prompt "<above>" \
  --set aspect_ratio=16:9 --set output_format=jpeg \
  --wait --download ./out-shelf2 --json
```

**Post-processing:**

```bash
ffmpeg -y -i image_b3d9a758b345e1cc03bef9e7392c5ed2.jpg \
  -vf "scale=1600:-2:flags=lanczos,format=gray" shelf_grey.png
ffmpeg -y -i shelf_grey.png -q:v 6 shelf.jpg    # ~282 KB (grain-heavy)
cwebp -q 70 shelf_grey.png -o shelf.webp        # ~287 KB
```

---

## 3. og-image.jpg  (1200 x 630, < 200 KB) — Open Graph / social card

Built locally as an SVG broadsheet masthead, no API. The greyscale portrait from
step 1 is embedded as a base64 data URI in the right-hand column.

- Builder script: `assets/img/mk_og.py` (committed next to the images) — writes `og.svg`
- Layout: paper `#FAF7F0` ground; ink `#1B1A17` nameplate rules + type;
  Arial Black wordmark "DMYTRO BILUKHA" fitted with `textLength`;
  promo-red `#E4002B` 6px rule under the masthead + a red "SPECIAL ISSUE" tag;
  dateline row "FRONTEND TECH LEAD · VINNYTSIA, UKRAINE · THE WEEKLY CIRCULAR";
  Georgia headline "Ten years building the storefront for Ukraine's largest
  grocer"; portrait in a bordered right column (`xMidYMid slice`).
- Fonts: system Arial Black + Georgia (macOS `/System/Library/Fonts/Supplemental`).

```bash
python3 mk_og.py assets/img/portrait.jpg og.svg
rsvg-convert -w 1200 -h 630 og.svg -o og.png
sips -s format jpeg -s formatOptions 82 og.png --out og-image.jpg   # ~109 KB
```

---

## Cost

KIE credits: 9362 → 9350 = **12 credits (~$0.06)** for 3 generations
(1 nano-banana-edit + 2 nano-banana).
