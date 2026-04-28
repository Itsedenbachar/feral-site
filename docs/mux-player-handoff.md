# Mux Video Player — Implementation Handoff

## What was built

A custom HLS video player component for Mux-hosted videos, integrated into a React (Vite) portfolio site. It replaces iframes for Mux streams and adds:
- Play/pause controls with timecode
- Scrub preview thumbnails on the progress bar (Mux image API)
- Animated hover preview on video grid cards (Mux animated.webp)
- Quality selector (gear icon) with Auto + manual resolution options

---

## Dependencies

```
npm install hls.js
```

---

## Files involved

- `src/components/VideoPlayer.jsx` — the custom player
- `src/components/VideoPlayer.css` — player styles
- `src/components/VideoCard.jsx` — grid card with animated hover preview, opens lightbox
- Any component that opens a lightbox (check for `Lightbox` components — they must conditionally render `VideoPlayer` for HLS URLs instead of an iframe)

---

## Key patterns

### Detecting a Mux HLS URL
```js
function isHlsUrl(url) {
  return !!url && /\.m3u8(\?|$)/i.test(url);
}
```

### Mux URL formats
```
Stream:    https://stream.mux.com/{PLAYBACK_ID}.m3u8
Thumbnail: https://image.mux.com/{PLAYBACK_ID}/thumbnail.jpg
           https://image.mux.com/{PLAYBACK_ID}/thumbnail.jpg?time=0.5  (custom frame)
Animated:  https://image.mux.com/{PLAYBACK_ID}/animated.webp
Scrub:     https://image.mux.com/{PLAYBACK_ID}/thumbnail.jpg?time={seconds}&width=160
```

### hls.js initialisation — critical ordering

**Always prioritise hls.js over native Safari HLS.** Safari handles `.m3u8` natively but won't expose quality levels. hls.js works on modern Safari too (MSE is supported since Safari 13).

```js
if (Hls.isSupported()) {
  const hls = new Hls();
  hls.loadSource(src);
  hls.attachMedia(videoElement);
  hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
    // Use data.levels from the event — NOT hls.levels — more reliable
    setLevels(data.levels.map((l, i) => ({ index: i, height: l.height })));
  });
} else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
  // Fallback for very old Safari without MSE only
  videoElement.src = src;
}
```

### Quality switching
```js
hls.currentLevel = -1;    // Auto (ABR)
hls.currentLevel = 0;     // Force lowest
hls.currentLevel = 2;     // Force specific index (0 = lowest, highest index = best)
```

### Lightbox: iframe vs custom player
Every lightbox in the project must check `isHlsUrl` and branch:
```jsx
{isHlsUrl(project.video) ? (
  <Suspense fallback={<div style={{ background: '#000', width: '100%', height: '100%' }} />}>
    <VideoPlayer src={project.video} poster={project.thumb} />
  </Suspense>
) : (
  <iframe src={getLightboxUrl(project.video)} allow="autoplay; fullscreen" allowFullScreen />
)}
```
Import VideoPlayer lazily: `const VideoPlayer = lazy(() => import('./VideoPlayer'))`.

### Animated hover preview (grid cards)
```js
function getMuxAnimatedUrl(videoUrl) {
  const match = videoUrl?.match(/stream\.mux\.com\/([^.]+)\.m3u8/);
  return match ? `https://image.mux.com/${match[1]}/animated.webp` : null;
}
```
Load `src` only on hover to avoid downloading on page load:
```jsx
<img src={hovered ? animatedUrl : undefined} className="animated-preview" />
```

---

## Gotchas

1. **Safari quality levels:** If you use `canPlayType` first, Safari takes the native path and quality levels are never exposed. Always use hls.js first.
2. **Use `data.levels` not `hls.levels`:** In the `MANIFEST_PARSED` callback, read from the event's `data` parameter — `hls.levels` can be unreliably timed.
3. **Duplicate PROJECTS arrays:** This project has two separate component files each with their own list of videos. Both must be updated when changing a video URL or thumbnail.
4. **Mux quality tiers:** Basic uploads produce only 1 rendition — the gear will show "Auto" only. Plus/Premium uploads produce multiple renditions and show 720p/1080p etc. Quality tier is set at upload time and cannot be changed after.
5. **Custom thumbnail frame:** Append `?time=0.5` (or any second value) to the thumbnail URL to set which frame shows as the poster/grid thumbnail.
