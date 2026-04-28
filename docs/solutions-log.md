# Solutions Log

## 2026-04-13 — Scroll + cursor + video-view performance sweep

**Problem**
1. Scrolling not 100% smooth across site
2. Cursor "mouth" (ring) animation stutters during scroll and link hover
3. Cursor ring freezes / goes inactive when a video lightbox opens

**Root causes**
1. `html { scroll-behavior: smooth }` in `src/index.css` compounding with macOS momentum scroll and rAF listeners
2. `Navbar.jsx` scroll handler was not throttled and not `{ passive: true }` — every scroll tick ran `setScrolled()` synchronously
3. `CustomCursor.jsx` had a `MutationObserver` on `document.body` (childList + subtree) that re-attached hover listeners on every DOM mutation (carousel tick, IntersectionObserver class toggles, React re-renders). Primary cursor stutter source.
4. `.cursor-dot` had `transition: transform 0.05s ease` fighting the rAF-driven inline `style.transform`
5. Cross-origin video lightbox iframe (Vimeo / mediadelivery.net) captures mouse events — parent `document.mousemove` stops firing → ring appeared frozen
6. `BottomCTA` retro grid was animating `background-position` on a `perspective/rotateX/scaleY` element — paint-per-frame jank

**Fixes**
- Removed `html { scroll-behavior: smooth }` from `src/index.css`; replaced with JS `scrollIntoView({behavior:'smooth'})` handlers on the 3 anchor links (`Navbar.jsx` Work/Contact, `About.jsx` SEE WORKS). Logo `<a href="/">` is a full nav, unchanged.
- `Navbar.jsx`: scroll handler wrapped in `requestAnimationFrame` ticking throttle; `addEventListener('scroll', onScroll, { passive: true })`
- `CustomCursor.jsx`: removed `MutationObserver` entirely, replaced with delegated `document` `mouseover`/`mouseout` (guarded against child re-entry via `closest` ancestor comparison)
- `CustomCursor.jsx`: removed `.cursor-dot { transition: transform 0.05s ease }`
- `CustomCursor.jsx`: added cross-origin iframe dimming — `document.addEventListener('mouseleave', fn, true)` + `window.addEventListener('blur', fn)` set `insideIframe = true`; `document.mouseenter` capture + `window.focus` reset. Inside rAF loop, `ring.style.opacity` (and dot) set to `0.3` when `insideIframe`, `1` otherwise. Cached via `currentOpacity` to skip redundant writes.
- `BottomCTA.jsx`: split `.bottom-cta__grid-bg` into parent (static `perspective/rotateX/scaleY`) + child `.bottom-cta__grid-mover` (oversized by 60px top/bottom; animates `transform: translateY` via revised `@keyframes gridMove` — GPU composited).

**Files touched**
- `src/index.css`
- `src/components/Navbar.jsx`
- `src/components/CustomCursor.jsx`
- `src/components/About.jsx`
- `src/components/BottomCTA.jsx`

**Explicitly deferred (out of scope)**
- CLAUDE.md rule says Aileron is the only font. Project currently uses `'Inter', sans-serif` (loaded via Google Fonts in `index.css:1`). Not fixed in this pass — requires a font-swap decision + Aileron self-hosted file.
- Hero.jsx:10 has a `setTimeout` without cleanup in a `useEffect` — minor leak on unmount, not user-visible since Hero mounts once.

**Build check**
`npm run build` — 238.13 kB bundle, 515ms.
