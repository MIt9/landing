# Video sources — regeneration notes

Generated for ticket `03-video-generation`. One version each. Model: **`bytedance/seedance-2`** via `kie` CLI (kie.ai).

Credits spent: **459** (~$2.30). Balance after: 9567.
Portrait cinemagraph later regenerated from the real portrait (task `ecee379db85e23a81a1f5bdbde3f2a5d`, +205 credits, balance after: 9362).

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
- **kie task id:** `ecee379db85e23a81a1f5bdbde3f2a5d` (regen — replaces `32263a582295693a3d2709f76ac798c7`, which used a wrong fallback source)
- **Params:** `resolution=720p`, `aspect_ratio=3:4`, `duration=5`, `generate_audio=false`, plus `first_frame_url` **and** `last_frame_url` both set to the source image (to bias toward a loop-friendly clip)
- **Source image:** `/Users/d.bilukcha/work/landing/assets/img/portrait.jpg` (1167×1500 — the real
  dark editorial portrait from ticket 02: dark henley, charcoal background, warm amber rim light
  on the left of the face, calm direct gaze)
- **Subject:** Dmytro Bilukha, ~40, short dark hair, short beard.
- **Raw output:** 834x1112, 24fps, 5.04s, 1.4 MB (`.scratch/vidout/portrait/1788444163600-oh2dmxadmf.mp4`)
- **Credits:** 205 (balance after: 9362).
- **Prompt:**

```
Subtle photorealistic cinemagraph of a calm man about 40 with short dark hair
and a short beard, wearing a dark henley, against a static charcoal background
with a warm amber rim light on the left side of his face. Micro-motion only:
very gentle breathing in the shoulders and chest, and one single slow natural
eye blink. The amber rim light stays almost perfectly constant with only an
almost-imperceptible shift in intensity. No head turn, no expression change, no
smile, no camera movement, the background stays completely static and unchanged.
He holds a calm direct gaze into the lens the entire time. Preserve the exact
face, hair, beard, clothing and lighting of the source image. Quiet, understated,
seamless loop, first and last frame nearly identical. Do not let the backlight
swell or bloom, do not make any skin or body part glow translucent.
```

- **Post (seamless loop = crossfade tail over head. Raw first/last frames are near-identical
  — clean blink at ~3.4–4.0s, calm eyes-open at both ends — so a short 0.6s crossfade of the
  tail into the head hides the residual breathing-phase offset. 5.0s → 4.46s):**

```bash
ffmpeg -i RAW.mp4 -filter_complex \
"[0]scale=720:-2[s];[s]split[body][pre];[body]trim=0.6,setpts=PTS-STARTPTS[body];[pre]trim=0:0.6,setpts=PTS-STARTPTS[pre];[body][pre]xfade=transition=fade:duration=0.6:offset=3.8,format=yuv420p[v]" \
-map "[v]" -an -c:v libx264 -profile:v high -pix_fmt yuv420p -movflags +faststart -crf 20 -preset veryslow portrait-cinemagraph.mp4

ffmpeg -i portrait-cinemagraph.mp4 -an -c:v libvpx-vp9 -b:v 0 -crf 30 -row-mt 1 portrait-cinemagraph.webm
ffmpeg -i portrait-cinemagraph.mp4 -vframes 1 -q:v 2 portrait-poster.jpg
```

- **Final:** 720x960, 4.46s. mp4 357 KB (H.264 yuv420p faststart), webm 134 KB (VP9), poster 55 KB.
- **Motion:** gentle breathing in the shoulders/chest, one slow natural blink around the middle,
  a barely-perceptible flicker in the amber rim light. No head turn, no expression change, no
  camera move, background static. Calm direct gaze throughout.

---

## Regenerate from scratch

```bash
export PATH="$HOME/.npm-global/bin:$PATH"
kie run bytedance/seedance-2 --prompt "<hero prompt>" \
  --set resolution=720p --set aspect_ratio=16:9 --set duration=6 --set generate_audio=false \
  --wait --download ./hero --json

kie run bytedance/seedance-2 --prompt "<portrait prompt>" \
  --set first_frame_url=./assets/img/portrait.jpg --set last_frame_url=./assets/img/portrait.jpg \
  --set resolution=720p --set aspect_ratio=3:4 --set duration=5 --set generate_audio=false \
  --wait --download ./portrait --json
```

Then apply the ffmpeg post steps above.
