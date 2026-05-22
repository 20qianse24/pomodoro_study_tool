## MODIFIED Requirements

### Requirement: Digital Timer Display
The system SHALL provide a digital countdown display in the format HH:MM:SS.

#### Scenario: Initial State
- **WHEN** the page loads
- **THEN** the timer SHALL display "00:30:00" as the default initial value.

### Requirement: Timer Control - Reset
The system SHALL provide a "Reset" button that returns the timer to the currently active preset or custom value.

#### Scenario: Resetting the timer
- **WHEN** the user clicks "Reset"
- **THEN** the timer SHALL return to the initial value of the currently selected preset or custom time (e.g., "00:30:00", "01:00:00", or "01:30:00").

## REMOVED Requirements

### Requirement: Study Session Presets
**Reason**: Replaced by the `time-selector-wheel` for more flexible custom time selection.
**Migration**: Use the new scroll-wheel visualizer to select study durations.
