## ADDED Requirements

### Requirement: Scroll-Wheel Selector
The system SHALL provide a scroll-wheel style visualizer for selecting custom hours, minutes, and seconds.

#### Scenario: Smooth selection
- **WHEN** the user interacts with the scroll-wheel (via touch or mouse scroll)
- **THEN** the selection SHALL move smoothly and update the target time duration.

### Requirement: HH:MM:SS Custom Selection
The scroll-wheel SHALL allow independent selection of hours (0-23), minutes (0-59), and seconds (0-59).

#### Scenario: Setting custom time
- **WHEN** the user scrolls the wheels to 01:15:30
- **THEN** the timer display SHALL update to "01:15:30" and the system SHALL set this as the current session duration.
