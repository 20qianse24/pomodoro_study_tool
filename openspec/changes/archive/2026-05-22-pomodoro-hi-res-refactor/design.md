## Context

The current Pomodoro application uses a simple MM:SS timer with fixed button presets. This refactor introduces a high-resolution HH:MM:SS timer, an interactive scroll-wheel for time selection, and a persistent session history.

## Goals / Non-Goals

**Goals:**
- Upgrade timer logic to support HH:MM:SS formatting.
- Implement a smooth, tactile scroll-wheel UI for custom time selection.
- Implement a persistent session history using `localStorage`.
- Create a modal UI for viewing history.
- Ensure the interface remains clean and minimalist.

**Non-Goals:**
- Syncing history across multiple devices (offline storage only).
- Advanced analytics on session data.
- Complex audio-visual feedback beyond the completion alert.

## Decisions

### 1. HH:MM:SS Logic Update
- **Decision:** Use a total seconds counter internally and format it as `HH:MM:SS` for the display.
- **Rationale:** Storing a single integer for total seconds simplifies arithmetic (increments/decrements) and comparisons.
- **Alternatives:** Storing separate H, M, S variables (rejected as it complicates overflow/underflow logic).

### 2. Scroll-Wheel Visualizer Implementation
- **Decision:** Use CSS `overflow-y: scroll` with `scroll-snap-type: y mandatory` for the wheels. JavaScript will listen to `scroll` events and use `getBoundingClientRect()` or `scrollTop` to determine the selected value based on which element is centered.
- **Rationale:** Leverages native browser scrolling for a smooth, "tactile" feel without heavy third-party libraries.
- **Alternatives:** A canvas-based wheel (rejected as CSS is more accessible and easier to style).

### 3. Session History Storage
- **Decision:** Store an array of objects in `localStorage` under the key `pomodoro_history`. Each object contains `{ duration: seconds, timestamp: Date.toISOString() }`.
- **Rationale:** `localStorage` is perfect for simple, persistent, key-value data that doesn't need to be shared with a server.
- **Alternatives:** IndexedDB (rejected as the data structure is simple enough for `localStorage`).

### 4. History UI Modal
- **Decision:** Use a simple `<dialog>` element or a hidden `<div>` with a high `z-index` for the modal.
- **Rationale:** Keeps the HTML clean and utilizes modern browser features.

## Risks / Trade-offs

- **[Risk] Scroll performance on older browsers** → **Mitigation:** Fallback to standard `overflow` if `scroll-snap` is unsupported.
- **[Risk] localStorage size limits** → **Mitigation:** Limit history to the last 100 sessions to prevent storage bloat.
- **[Risk] Clock drift in long sessions** → **Mitigation:** While `setInterval` can drift, for a 24-hour max timer, the drift is negligible for a study tool.
