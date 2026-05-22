## ADDED Requirements

### Requirement: Digital Timer Display
The system SHALL provide a digital countdown display in the format HH:MM:SS.

#### Scenario: Initial State
- **WHEN** the page loads
- **THEN** the timer SHALL display "00:30:00" as the default initial value.

### Requirement: Timer Control - Start
The system SHALL provide a "Start" button that begins the countdown.

#### Scenario: Starting the timer
- **WHEN** the user clicks "Start"
- **THEN** the timer SHALL begin counting down one second at a time.

### Requirement: Timer Control - Pause
The system SHALL provide a "Pause" button that halts the countdown.

#### Scenario: Pausing the timer
- **WHEN** the timer is running and the user clicks "Pause"
- **THEN** the timer SHALL stop at the current time and the countdown SHALL cease.

### Requirement: Timer Control - Reset
The system SHALL provide a "Reset" button that returns the timer to the currently active preset or custom value.

#### Scenario: Resetting the timer
- **WHEN** the user clicks "Reset"
- **THEN** the timer SHALL return to the initial value of the currently selected preset or custom time (e.g., "00:30:00", "01:00:00", or "01:30:00").

### Requirement: Completion Notification
The system SHALL play a subtle audio notification sound when the timer reaches "00:00".

#### Scenario: Timer completion
- **WHEN** the timer reaches "00:00"
- **THEN** the system SHALL play the notification audio file once.
