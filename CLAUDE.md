# Portfolio Project

## User
Eden is a non-technical solo developer, no coding background. Explain in plain language. No jargon without a one-line explanation. Never assume familiarity with terminal, config files, or developer tooling.

## How Eden Works
- Rapid-iteration, visually-driven. Tests live, observes, steers with small corrections until it feels right
- Gives direction, not specs. Translate short instructions into action without asking for detail that's already implied
- Will interrupt and redirect when off course. When corrected, pivot immediately, don't justify the old approach
- Judges results visually. "It looks wrong" is a valid bug report. Investigate what changed rather than asking what's wrong
- Prefers doing over explaining. Lead with the change, not the reasoning. If context is needed, keep it to 1-2 lines
- References past approaches often. Before asking clarifying questions, search solutions-log and memory files

## Supervision Style
- High-frequency, low-ceremony. Expect many short messages, not detailed briefs
- Will approve or reject quickly. Don't batch up questions, act on what you know, ask only what's blocking
- Trusts you to make judgment calls on implementation detail, but NOT on scope. Never add unrequested work
- Watches diffs closely. Unexplained changes or extra "improvements" erode trust fast

## Pushback Triggers
- Expanding scope: autonomous audits, scans, benchmarks, or explorations nobody asked for
- Trial-and-error spirals: cycling through 4+ approaches without diagnosing the root cause
- Over-explaining: restating what was asked, narrating what you're about to do, or summarizing what you just did
- Ignoring the simple ask: doing something complex when the request was straightforward
- Wrong approach persistence: continuing down a path after signals it's not working instead of stopping to think

## Delivery Preferences
- Terse. No trailing summaries. No preamble. No em dashes
- State trade-offs in 2-3 lines BEFORE implementing when multiple approaches exist
- If an approach fails, diagnose why before trying the next one. Max 3 attempts, then stop and explain what's blocking
- When something is unclear, ask before acting, never guess
- Do not hallucinate. If uncertain, say so

## Global Rules
- Do what is asked; nothing more, nothing less
- NEVER create files unless absolutely necessary; prefer editing existing files
- NEVER create documentation/README files unless explicitly requested
- ALWAYS read a file before editing it
- NEVER commit secrets, credentials, or .env files
- Batch parallel operations in a single message when possible
- Never poll or check status after spawning agents, wait for results
- Keep files under 500 lines
- Validate user input at system boundaries
- Code must be clean, correct, idiomatic, and modular
- Ask for any file content you need rather than assuming its structure

## Build & Deploy
- Deploy: `vercel --prod` from project root. Site is live at https://www.weferal.work
- No need to ask before deploying — Eden confirmed this as default behavior

## Architecture Conventions
- Source in `/src`, never save to root
- Use path aliases for cross-boundary imports rather than deep relative paths
- Service account JSONs and secrets gitignored
- No quotes in .env values

## CSS and Layout
- Before attempting any CSS fix, trace the full parent chain from the element to the root. Identify all flex/grid/overflow/min-height constraints. Then propose ONE targeted fix
- Max 3 CSS approaches. If none work, stop, report what you found in the layout hierarchy, and ask how to proceed
- Common root causes: missing `min-height: 0` in flex chains, `overflow` parents eating height, transforms shifting visual center. Check these first
- `margin-left: auto`, `order`, `align-self` only work between elements that share the SAME direct parent. If the target is nested one level deeper, these rules can never reach the row you're trying to control
- `min-width: 100%` on a table overrides ALL column sizing. Use `width: max-content` on the table and define column widths via `<col>` elements instead
- **Animating height to "auto":** Use `grid-template-rows` toggling between `0fr` and `1fr`. Inner wrapper needs `overflow: hidden; min-height: 0`. No JS measuring required
- **Animation flash on first load:** If an element opens by default, wrap the "set it open" call in `requestAnimationFrame` so the browser paints the closed state for one frame first, then transitions to open
- **Images from external URLs:** Always add an error handler. When the image fails to load, hide it and show fallback text (e.g. initials). Don't swap `src` — that flashes the broken-image icon

## External APIs
- Before integrating any external API: confirm it works client-side (CORS, referer restrictions, key requirements). Write a minimal fetch test first. Research first, code second
- Google APIs often block client-side calls via referer policy. Default to free alternatives (timezone: Intl API; geocoding: OpenStreetMap Nominatim)
- If CORS is likely an issue, suggest a server-side proxy upfront rather than building client-side and reverting later

## CSP / Hosting
- CSP changes require ALL resource types checked in one pass: scripts, styles, fonts, images, JSON, glyphs, sprites, connect-src. One domain often needs 3-4 directives
- After CSP edits, grep `src/` for every external domain and cross-check against the hosting config headers

## Assets
- Vite serves from `public/` relative to the Vite root. Verify `vite.config` root before placing assets
- Pick one font and stick to it. Do not introduce system font overrides without asking

## Documentation
- Maintain `docs/solutions-log.md`. Read before work, log results after
- After fixing a bug, immediately append: date, problem, root cause, fix
- Log approaches that DIDN'T work too — "don't retry these" saves hours
- For multi-iteration debugging, also keep `tests/fix-iterations.md`

## LocalStorage / Caching
- When the shape of locally-cached data changes (different fields, different structure), bump the cache key name (`cache_v1_` → `cache_v2_`). Otherwise returning users see old layout with new data poured into it

## UI Filtering & Sorting
- `display: none` keeps items in memory (images stay cached, state preserved). Removing items from the array re-fetches and re-mounts everything. Prefer CSS hiding for filter/sort toggles

## Proven Patterns (generic, battle-tested)

### React
- **Prop-sync useEffect anti-pattern:** Avoid `useEffect(() => setState(prop), [prop])` when parent data comes from a live subscription that rebuilds arrays each tick (new refs trigger effect with stale data). Use a `key` prop to remount on true identity change, or update local state directly in the same lifecycle
- **State staleness with live listeners:** When a listener updates a parent array and a child component holds a captured reference to one item, the child won't auto-sync. Add `useEffect(() => { const live = items.find(i => i.id === captured.id); if (live !== captured) setItem(live) }, [items, captured])`
- **URL updates without re-render:** Use `window.history.replaceState()` instead of router `setSearchParams()` when you only want to update the URL bar

### Portals & Overlays
- Any fixed/modal overlay inside a CSS `transform` ancestor MUST use `createPortal(document.body)`, otherwise `position: fixed` breaks
- After portalling, CSS descendant selectors (`.parent .child`) break. Add a compound selector (`.parent.child`) alongside
- **Sidebar-aware centering:** For portalled overlays next to a sidebar, read the sidebar's `getBoundingClientRect().right` and apply as `paddingLeft` on the overlay so flex centering targets the visible content area
- **Visual center vs CSS center:** When a container uses `transform: translateX()`, CSS centering targets the geometric center, not the visible center. Counter-offset by half the transform value

### Events & Interaction
- **Wheel/scroll blocking:** `{ passive: false }` required for `preventDefault()` on wheel events. Guard close-animation windows with a `closingRef`
- **Dropdown menus:** `document.addEventListener('mousedown', close)` fires before button `click`. Always `stopPropagation` or check `e.target.closest('.menu-wrap')` in the close handler
- **Internal vs external drag:** Gate upload-drop handlers with `if (draggedAssetId) return` where `draggedAssetId` is set on `onDragStart` of internal cards. Do NOT rely on `e.dataTransfer.types`
- **dragLeave false-fire:** `onDragLeave` fires when pointer enters a child. Guard with `if (!e.currentTarget.contains(e.relatedTarget)) { ... }`

### Animations
- Never animate `padding`/`margin`/`width` on grid containers, cards reflow. Use `transform: translateX()` instead (GPU-composited, layout-invisible)
- A CSS transition with the same value in both states is a no-op. Verify the property actually changes
- The `scale` CSS property is independent of `transform`. Use it to animate size without overwriting an inline `transform: rotate()`
- **SVG-relative positioning:** To anchor HTML to an SVG shape, wrap the SVG in a fixed-size `position: relative` div matching its width/height. Siblings then anchor to the SVG bounds

### Layout
- **Flex centering in scroll containers:** `flex: 1` + `justify-content: center` inside `overflow-y: auto` fails silently. Every ancestor in the flex chain needs `min-height: 0` to override the default `min-height: auto`
- **backdrop-filter consistency:** `backdrop-filter: blur()` with very low-opacity backgrounds renders differently based on element size. Use at least `rgba(30,30,30,0.65)` for consistent rendering

### Firebase / Firestore (if used)
- **Silent failures:** Never catch errors in save/submit handlers without showing feedback. "Nothing happens" bugs are always silent catches. Add visible error display + saving state to every modal save button
- **httpsCallable wrapper:** ALL `httpsCallable` / `callFunction()` responses are wrapped in `{ data: ... }`. Always access `result.data.fieldName`, never `result.fieldName`
- **Field name alignment:** When a Cloud Function writes and the client reads, grep both sides for field names. Mismatches cause silent failures
- **collectionGroup + documentId():** Never use `FieldPath.documentId()` with `collectionGroup` queries, it expects a full doc path. Use direct doc lookups instead
- **Single-field collectionGroup indexes** go in `fieldOverrides`, not the `indexes` array
- **Cold start stampede:** Stagger non-critical `onSnapshot` listeners 1-3s on auth load. 5+ simultaneous listeners stampede the connection
- **Nested arrays:** Firestore rejects `rows: string[][]`. Serialize with `JSON.stringify(rows)` as `rowsJson`, parse client-side with try/catch
- **Deploy order:** Functions first, then hosting when both are needed
- **Hosting rewrites:** `/path/**` rewrites pass the FULL path to the function, not just the wildcard. Strip the prefix in the handler

### Mux / HLS Video
- **Instant hover previews:** HLS streams (`.m3u8`) need 1-2s to fetch manifest + first segment. If you need instant playback on hover, preload ALL Mux videos on page mount — create hidden video elements + HLS instances immediately, let them buffer silently. Hover then just flips opacity.
- **Fade in only after buffered:** Don't show the video on hover — show it only after the `canplay` event fires. Add a CSS class (e.g. `--ready`) in the `onCanPlay` handler. This keeps the thumbnail visible as a fallback until the video is actually ready.
- **HLS init settings:** Use `{ startLevel: 0, maxBufferLength: 30 }` for fastest start (lowest quality rendition first, generous buffer).
- **Cleanup:** Always destroy HLS instances (`hls.destroy()`) on component unmount or when leaving hover, to avoid memory leaks.

### Debugging Discipline
- **Silent try/catch:** When debugging silent data failures, temporarily remove try/catch to see the real error
- **Screenshot first:** Before fixing a layout bug, look at a screenshot. Don't fix what you haven't seen
- **Check function logs:** Before guessing, read the logs from whatever ran last

## Memory / Handoff
Bring over any `memory/` or `MEMORY.md` entries from previous projects that describe Eden's preferences or generic feedback. Leave project-specific facts (IDs, partners, feature specs) behind.
