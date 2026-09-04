# Media sources — reproducible generation record

**Art direction: "Hold the position"** — cinematic / Awwwards. Cold blue-graphite
palette: bg `#0E1217`, text bone `#F2EEE4`, accents cobalt `#2B4CF0` and
acid-yellow `#F5E003`. Heavy scroll motion, high-contrast cold monochrome
imagery, four looping video beds.

Supersedes "The Weekly Circular" (newsprint) and the earlier dark-charcoal/amber
directions — both dead.

Subject: Dmytro Bilukha — man mid-40s, short dark hair greying at the sides,
short dark beard, blue-grey eyes, athletic former Greco-Roman wrestler build.

Tooling: `kie` CLI (`kie-media-cli` 0.3.1). Video model `bytedance/seedance-2`
(text-to-video, 720p 16:9, `generate_audio=false`, `duration=5`). Image edit
model `google/nano-banana-edit`. Local post: `ffmpeg`, `avifenc`, `cwebp`,
`rsvg-convert`, `sips` (all Homebrew / macOS).

KIE credits: 9350 -> 8526 = **824 credits (~$4.12)**
(4x seedance-2 video + 1x nano-banana-edit).

---

## VIDEO — assets/video/  (1280x720, no audio, seamless loop ~4.54s)

All four raw clips came back as 1280x720 / 24fps / 5.04s. None looped cleanly,
so each was rebuilt as a seamless loop with a 0.5s tail-to-head crossfade
before encoding:

```
XF="[0:v]trim=0:4.54167,setpts=PTS-STARTPTS[a];\
[0:v]trim=4.54167,setpts=PTS-STARTPTS[b];\
[b][a]xfade=transition=fade:duration=0.5:offset=0"

# mp4  (H.264, yuv420p, +faststart)
ffmpeg -nostdin -y -i RAW.mp4 -filter_complex "${XF},format=yuv420p[v]" -map "[v]" -an \
  -c:v libx264 -preset veryslow -crf 25 -pix_fmt yuv420p -movflags +faststart NAME.mp4

# webm (VP9)
ffmpeg -nostdin -y -i RAW.mp4 -filter_complex "${XF}[v]" -map "[v]" -an \
  -c:v libvpx-vp9 -b:v 0 -crf 36 -row-mt 1 -pix_fmt yuv420p NAME.webm

# poster (first frame of the looped mp4 -> AVIF)
ffmpeg -nostdin -y -i NAME.mp4 -frames:v 1 poster.png
avifenc --min 24 --max 40 -s 6 -d 8 poster.png NAME-poster.avif
```

### 1. hero  — KIE task `089d96ed0adb6c0f07d75b009e32405c`
Prompt:
> Chalk dust drifting through a hard shaft of cold daylight in an empty
> wrestling gym. Black rubber mat floor, dark walls, dust particles catching
> the light. Locked-off camera, no people, very slow drift. High-contrast
> monochrome with a faint cold blue cast. Cinematic 35mm grain. Seamless loop,
> motion identical at first and last frame.

### 2. impact-a  — KIE task `2d8379c9d00456285208ad6eb0bc6b70`
Prompt:
> Overhead abstract macro of supermarket shelf-edge LED price rails as pure
> streaks of cold blue-white light on near-black. Slow lateral dolly, heavy
> motion blur, no legible text, no numbers. Cinematic, near-black cold graphite
> background. Seamless loop, first and last frame match.

### 3. impact-b  — KIE task `b5e8642421d5fb5600433b1a82caff7d`
Prompt:
> A dense grid of small warm-white lights on a black wall slowly powering on
> row by row, like a distant stadium light bank or a server rack seen from
> across a room. Cold graphite background, subtle blue tone, very slow, no
> people, no text. Cinematic. Seamless loop, ends where it begins.

Extra grade in the loop chain to cool the amber lights toward the palette:
`colorbalance=rm=-0.06:gm=-0.02:bm=0.05:rh=-0.08:bh=0.06,eq=saturation=0.8`

### 4. work-texture  — KIE task `a584dac2245218ca598446ddc6e49dbe`
Prompt:
> Very slow drifting field of fine technical wireframe lines and small
> particles continuously reconfiguring on a near-black cold ground. Generative,
> abstract, low contrast, blue-grey. No text, no people. Seamless loop, motion
> continuous across the loop point.

---

## turn-0.webp / turn-1.webp  (720x957, cold mono, ALPHA cut-out) — About portrait

Two head-and-shoulders **cut-outs** (transparent background): `turn-0` right
profile, `turn-1` front / eyes to camera. In the About section a canvas cross-
fades profile → front as it scrolls, over a `--sun` disc (cobalt `#2B4CF0` by
default) that rises behind him on the scrub timeline. `portrait.*` and the
earlier 5-frame circular turn both retired.

Design history worth knowing before regenerating:
- The AI **erases the cauliflower ear** on every frame regardless of prompt, so
  the wrestler's-ear detail can't live here — it needs a future real photo,
  used large. Never mirror-flip a frame (inverts his anatomy + ear side + hair
  part). That's why this is 2 real angles, not a mirrored sweep.
- `nano-banana-edit` will not output real transparency, and its "flat #0E1217"
  and "green screen" backgrounds both come back vignetted → unkeyable. The one
  reliable path: ask for **pure flat white** + a deliberately **low-key grade**
  ("no highlight above ~65% grey, hair matte near-black, the white bg is the
  only bright thing"), then key with a corner flood-fill.

- **Model:** `google/nano-banana-edit`, `aspect_ratio=3:4`, `output_format=png`
- **Sources** (`/Users/d.bilukcha/work/resume/photo/`): `photo_2026-09-03_15-20-34.jpg`
  (right profile) for turn-0; `_15-20-42.jpg` (front) for turn-1.
- turn-1 front — task `dca170ad92cbfa9a720b59eb95e8881e` region / regen chain
  (final low-key white version). turn-0 profile — task `dca170ad92cbfa9a720b59eb95e8881e`
  sibling. (Both regenerated several times; see `kie generate list`.)

Prompt shape (each frame): "Editorial portrait, man in <ANGLE>. LOW-KEY cold
black-and-white: hair/beard matte near-black, skin dark-to-mid grey, no
highlight above 65% grey, faint cool blue in shadows, fine 35mm grain, dark
charcoal crew-neck. Background 100% PURE FLAT WHITE #FFFFFF, uniform edge to
edge, no gradient/grey/vignette/shadow — the only bright thing in the image.
Head-and-shoulders, cropped mid-chest, head upper third of a 3:4 frame."

Key + finish (per frame):
```
# corner flood-fill key (short hair = clean edge; low-key grade = face survives)
magick RAW.png -colorspace Gray -alpha set -bordercolor white -border 1 \
  -fuzz 12% -fill none -draw "alpha 0,0 floodfill" -draw "alpha <W+1>,0 floodfill" \
  -shave 1x1 -channel A -morphology Erode Diamond:1 -blur 0x0.6 +channel  key.png
# normalise framing onto a common 760x1010 canvas, head-top aligned
magick key.png -trim +repage -resize x860 -background none -gravity north -extent 760x1010 N.png
# profile only: nudge right ~85px so the face lines up with the front frame for the crossfade
magick -size 760x1010 xc:none N.png -geometry +85+8 -composite turn-0-src.png
magick turn-0-src.png -resize 720x -quality 90 -define webp:method=6 turn-0.webp   # ~38 KB, alpha
```

KIE: ~14 × nano-banana-edit @ 4cr ≈ **56 credits (~$0.28)** across all the
regen attempts.

---

## portrait.jpg / .webp / .avif  (1000x1500, cold high-contrast monochrome) — RETIRED

Replaced by the `turn-*` sequence above. Record kept for provenance.


- **Model:** `google/nano-banana-edit`
- **KIE task id:** `db2287f18def4e293b5f6de20af38339`
- **Input:** the existing b/w editorial portrait `assets/img/portrait.jpg`
  (1280x1600) — uploaded as `--image`
- **Params:** `aspect_ratio=2:3`, `output_format=jpeg`
- **Raw output:** 832x1248 JPEG (`image_6f113e008ae8acae34addfbd2074c8b1.jpg`)

Prompt:
> Re-grade this exact portrait to high-contrast cold monochrome. Keep the man
> perfectly recognizable, identical face, identical features and expression.
> Deep crushed blacks, retain sharp facial and skin texture detail, subtle cool
> blue tone held in the shadows, hard studio side-light, fine film grain. No
> warm tones, no color shift on skin beyond a cool cast. Black-and-white cold
> grade.

The model held likeness. Post-processing sharpened the grade and cooled it
further (desaturate -> black crush -> blue only in shadows -> grain):

```
ffmpeg -y -i RAW.jpg -vf "scale=1000:1500:flags=lanczos,hue=s=0,eq=contrast=1.06,\
curves=all='0/0 0.12/0.09 0.45/0.5 0.8/0.88 1/1',\
colorbalance=bs=0.20:bm=0.04,unsharp=5:5:0.4,noise=alls=6:allf=t" -frames:v 1 cold3.png

sips -s format jpeg -s formatOptions 58 cold3.png --out portrait.jpg   # ~212 KB
cwebp -q 80 cold3.png -o portrait.webp                                 # ~141 KB
avifenc --min 22 --max 36 -s 4 -d 8 cold3.png portrait.avif            # ~56 KB
```

---

## og-image.jpg  (1200x630, < 200 KB) — Open Graph / social card

Built locally, no API. Builder script: `assets/img/mk_og.py` -> writes `og.svg`.

- Ground `#0E1217`, radial corner vignette to `#080A0D`.
- 3px electric-cobalt `#2B4CF0` vertical rail on the left edge.
- Kicker "DMYTRO BILUKHA" (Arial, letter-spaced, bone at 55%).
- Headline "FRONTEND / TECH LEAD" lower-left, two lines, Arial Black 120px,
  bone `#F2EEE4`, `letter-spacing=-3`.
- 150x2px acid-yellow `#F5E003` underline under the headline.
- Matte, no glow. Fonts: system Arial Black.

```
python3 mk_og.py og.svg
rsvg-convert -w 1200 -h 630 og.svg -o og.png
sips -s format jpeg -s formatOptions 86 og.png --out og-image.jpg   # ~55 KB
```

---

## Retired

- `shelf.jpg` / `shelf.webp` — `git rm`d with this direction.
- `yt-0P4A7sZnVRE.jpg`, `yt-rJ2_WVpQato.jpg` — kept, reused as case-study video posters.
