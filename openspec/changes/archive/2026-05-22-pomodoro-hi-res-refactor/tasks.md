## 1. UI Structure Updates

- [ ] 1.1 Update `index.html` to remove old MM:SS presets
- [ ] 1.2 Add the scroll-wheel selector container (H, M, S columns) to `index.html`
- [ ] 1.3 Add the "History" button to the main UI
- [ ] 1.4 Add the history modal structure (using `<dialog>` or `div`) to `index.html`

## 2. Styling (CSS)

- [ ] 2.1 Implement the scroll-wheel CSS (scroll-snap, hidden scrollbars, highlighting centered item)
- [ ] 2.2 Add styles for the HH:MM:SS timer display
- [ ] 2.3 Style the history button and modal overlay
- [ ] 2.4 Ensure the layout remains centered and minimalist with new components

## 3. Core Logic Refactor (JavaScript)

- [ ] 3.1 Update `formatTime` to support HH:MM:SS formatting
- [ ] 3.2 Implement the scroll-wheel listener logic to update the timer duration
- [ ] 3.3 Refactor timer state to use a single `totalSeconds` variable
- [ ] 3.4 Update the timer countdown to handle hours-to-minutes transitions

## 4. History Feature (JavaScript)

- [ ] 4.1 Implement `saveSession` function to store completed sessions in `localStorage`
- [ ] 4.2 Implement `loadHistory` function to retrieve sessions from `localStorage`
- [ ] 4.3 Implement `renderHistory` function to populate the history modal
- [ ] 4.4 Add event listeners for the history modal (Open/Close)

## 5. Verification and Cleanup

- [ ] 5.1 Test HH:MM:SS countdown across hour boundaries
- [ ] 5.2 Verify scroll-wheel selection updates the timer correctly
- [ ] 5.3 Confirm sessions are correctly logged and retrieved from `localStorage`
- [ ] 5.4 Ensure the "study vibe" aesthetic is preserved
