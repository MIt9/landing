# Image sources — reproducible generation record

All imagery generated via the KIE API (kie.ai) using the `kie` CLI (`kie-media-cli`),
per ticket `02-imagery-generation.md`.

Subject: Dmytro Bilukha — man ~40, short dark hair (greying at the temples),
short dark beard, blue eyes, athletic former Greco-Roman wrestler build.

Face reference images (passed as `--image`):
- `/Users/d.bilukcha/work/resume/photo/photo_2026-09-03_15-20-42.jpg` (front, neutral)
- `/Users/d.bilukcha/work/resume/photo/photo_2026-09-03_15-20-47.jpg` (3/4 view)

Brand palette: dark charcoal / near-black background `#0a0a0c`, amber accent `#F5A524`.

---

## 1. portrait.jpg / portrait.webp / portrait.avif

- **Model:** `google/nano-banana-edit` (the `nano-banana` family; `-edit` is the
  variant that accepts reference images — plain `google/nano-banana` is text-only)
- **KIE task id:** `c62c8cfe9f9dba66ea3cfa07361341c7`
- **Params:** `aspect_ratio=4:5`, `output_format=jpeg`
- **Reference images:** the two face-reference photos above (both passed with `--image`)
- **Raw output:** 896 x 1152 JPEG → `image_67b8d303a915f64e882ee813801957d3.jpg`
- **Post-processing:** upscaled to 1167 x 1500 with ImageMagick (Lanczos + light unsharp),
  then encoded to JPEG (q88), WebP (`cwebp -q 82`), AVIF (`avifenc --min 20 --max 32 -s 4`)

**Prompt:**

> Editorial cinematic headshot of the same man from the reference photos — keep his
> face exactly recognizable: man about 40, short dark hair slightly greying at the
> temples, short dark beard, blue eyes, athletic former-wrestler build, broad
> shoulders. Wardrobe: a dark charcoal henley shirt. Lighting: dark charcoal
> near-black studio background, warm amber (#F5A524) rim light along the edge of his
> face and shoulder, soft key light on the face. Shallow depth of field, background
> softly blurred. Calm, confident, relaxed expression, mouth closed, looking toward
> camera. Natural realistic skin texture with visible pores, not plastic, not
> over-retouched. Cinematic color grade, warm highlights, cool shadows. Framing:
> head and shoulders with generous headroom, subject positioned slightly to the
> right so there is empty negative space on the left for text. Vertical portrait
> orientation, high resolution.

```
kie run google/nano-banana-edit \
  --image /Users/d.bilukcha/work/resume/photo/photo_2026-09-03_15-20-42.jpg \
  --image /Users/d.bilukcha/work/resume/photo/photo_2026-09-03_15-20-47.jpg \
  --prompt "<above>" \
  --set aspect_ratio=4:5 --set output_format=jpeg \
  --wait --download ./out --json
```

---

## 2. og-image.jpg  (1200 x 630, Open Graph / social card)

Two-step: (a) generate a wide dark portrait with negative space, (b) composite text locally.

### (a) Background plate

- **Model:** `google/nano-banana-edit`
- **KIE task id:** `58dcd4b0295edacd6e21b9a3a3fc978f`
- **Params:** `aspect_ratio=16:9`, `output_format=jpeg`
- **Reference images:** the two face-reference photos + the portrait from step 1
  (`image_67b8d303a915f64e882ee813801957d3.jpg`), all passed with `--image`
- **Raw output:** 1344 x 768 JPEG → `image_539f63c02f3c4d848b9f4ffec28633fc.jpg`

**Prompt:**

> Wide cinematic banner portrait of the same man from the reference photos — keep
> his face exactly recognizable: man about 40, short dark hair greying slightly at
> the temples, short dark beard, blue eyes, athletic former-wrestler build.
> Wardrobe: dark charcoal henley shirt. He is positioned on the RIGHT third of a
> wide horizontal frame, body angled slightly toward center, calm confident
> expression looking at camera. The LEFT two-thirds of the frame is empty dark
> charcoal near-black negative space (for text overlay). Lighting: warm amber
> (#F5A524) rim light on the edge of his face and shoulder, soft key light, deep
> shadows. Shallow depth of field, cinematic color grade. Wide 1.9:1 horizontal
> composition, high resolution.

### (b) Text composite (local, no API)

- Plate resized to cover 1200 x 630 (`magick -resize 1200x630^ -extent 1200x630`)
- Left-to-right dark gradient scrim (`#0a0a0c` 0.85 → 0 alpha) for text contrast
- Amber accent rule (`#F5A524`, 64 x 6 px)
- Text (Arial via `rsvg-convert`): "Dmytro Bilukha" 80px bold white,
  "Frontend Tech Lead" 37px `#F5A524`
- SVG built by `mk_og_svg.py` (in scratchpad), rasterized with `rsvg-convert`,
  encoded JPEG q82 4:2:0 → 40 KB

---

## Cost

KIE credits: 10026 → 9567 = **459 credits (~$2.30)** for 2 generations
(nano-banana-edit "4K" tier + reference-image uploads).
