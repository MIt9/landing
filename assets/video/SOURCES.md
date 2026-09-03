# Video sources — regeneration notes

Generated for ticket `03-video-generation`. One version each. Model: **`bytedance/seedance-2`** via `kie` CLI (kie.ai).

Credits spent: **459** (~$2.30). Balance after: 9567.

---

## 1. hero.mp4 / hero.webm — Hero ambient loop

- **Model:** `bytedance/seedance-2`
- **kie task id:** `b30bcaa256c12f4b8f9c7390d80a310f`
- **Params:** `resolution=720p`, `aspect_ratio=16:9`, `duration=6`, `generate_audio=false`
- **Source image:** none (text-to-video)
- **Raw output:** 1280x720, 24fps, 6.04s, 1.5 MB (`.scratch/vidout/hero/1788442760926-x9p7j80pawl.mp4`)
- **Prompt:**

```
Abstract cinematic ambient loop, absolutely no people and no text. Slow drifting
volumetric warm amber light (color hex F5A524) with soft glowing dust particles
and gentle haze suspended in a deep near-black void (color hex 0A0A0B). Extremely
gentle slow camera drift, shallow depth of field, delicate amber bokeh, smooth
continuous motion, no hard cuts, no flashes, no strobing. Dark moody low-contrast
image, most of the frame stays near-black with a subtle amber glow pooling softly
and shifting slowly. Meditative, elegant, high-end, cinematic film grain. Motion
loops seamlessly.
```

- **Post (seamless loop = crossfade tail over head, 6s -> 5s):**

```bash
ffmpeg -i RAW.mp4 -filter_complex \
"[0]split[body][pre];[body]trim=1,setpts=PTS-STARTPTS[body];[pre]trim=0:1,setpts=PTS-STARTPTS[pre];[body][pre]xfade=transition=fade:duration=1:offset=4,format=yuv420p[v]" \
-map "[v]" -an -c:v libx264 -profile:v high -pix_fmt yuv420p -movflags +faststart -crf 21 -preset veryslow hero.mp4

ffmpeg -i hero.mp4 -an -c:v libvpx-vp9 -b:v 0 -crf 30 -row-mt 1 hero.webm
ffmpeg -i hero.mp4 -vframes 1 -q:v 2 hero-poster.jpg
```

- **Final:** 1280x720, 5.0s. mp4 448 KB (H.264 yuv420p faststart), webm 129 KB (VP9), poster 25 KB.

---

## 2. portrait-cinemagraph.mp4 / .webm — Portrait cinemagraph

- **Model:** `bytedance/seedance-2` (image-to-video)
- **kie task id:** `32263a582295693a3d2709f76ac798c7`
- **Params:** `resolution=720p`, `aspect_ratio=3:4`, `duration=5`, `generate_audio=false`
- **Source image:** `/Users/d.bilukcha/work/resume/photo/photo_2026-09-03_15-20-47.jpg`
  (fallback per ticket — `assets/img/portrait.jpg` from ticket 02 did not exist at generation time)
- **Subject:** Dmytro Bilukha, ~40, short dark hair, short beard, blue eyes.
- **Raw output:** 834x1112, 24fps, 5.04s, 1.7 MB (`.scratch/vidout/portrait/1788442933055-35hhiwlr2qe.mp4`)
- **Prompt:**

```
Subtle photorealistic cinemagraph, micro-motion only. A man about 40 with short
dark hair, short beard and blue eyes stays calm and still, looking slightly off
camera. Very gentle breathing motion in the chest and shoulders, a faint warm
rim-light flicker along the edge of his face and hair, and one single slow
natural eye blink. No head turn, no expression change, no camera movement, the
background stays completely static. Quiet, understated, seamless loop. Preserve
the exact face, hair, beard and lighting of the source image.
```

- **Post (seamless loop = boomerang forward+reverse; the model ramped the rim
  light over the whole clip, so a direct head/tail loop would pop — boomerang
  avoids it. Result is ~10s, not ~5s):**

```bash
ffmpeg -i RAW.mp4 -filter_complex \
"[0]scale=630:840[s];[s]split[a][b];[b]reverse,select='gt(n\,0)',setpts=N/FRAME_RATE/TB[br];[a][br]concat=n=2:v=1:a=0,format=yuv420p[v]" \
-map "[v]" -an -c:v libx264 -profile:v high -pix_fmt yuv420p -movflags +faststart -crf 24 -preset veryslow portrait-cinemagraph.mp4

ffmpeg -i portrait-cinemagraph.mp4 -an -c:v libvpx-vp9 -b:v 0 -crf 33 -row-mt 1 portrait-cinemagraph.webm
ffmpeg -i portrait-cinemagraph.mp4 -vframes 1 -q:v 2 portrait-poster.jpg
```

- **Final:** 630x840, 10.04s. mp4 450 KB (H.264 yuv420p faststart), webm 250 KB (VP9), poster 40 KB.

---

## Regenerate from scratch

```bash
export PATH="$HOME/.npm-global/bin:$PATH"
kie run bytedance/seedance-2 --prompt "<hero prompt>" \
  --set resolution=720p --set aspect_ratio=16:9 --set duration=6 --set generate_audio=false \
  --wait --download ./hero --json

kie run bytedance/seedance-2 --prompt "<portrait prompt>" \
  --image <source.jpg> \
  --set resolution=720p --set aspect_ratio=3:4 --set duration=5 --set generate_audio=false \
  --wait --download ./portrait --json
```

Then apply the ffmpeg post steps above.
