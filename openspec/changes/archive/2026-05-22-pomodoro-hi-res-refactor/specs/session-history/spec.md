## ADDED Requirements

### Requirement: Session Logging
The system SHALL log each completed study session.

#### Scenario: Successful logging
- **WHEN** the timer reaches "00:00:00"
- **THEN** the system SHALL save the session duration and the current timestamp to local storage.

### Requirement: Persistent History Retrieval
The system SHALL retrieve and display the list of past sessions from local storage.

#### Scenario: Displaying history
- **WHEN** the history modal is opened
- **THEN** the system SHALL list all stored sessions, showing their duration and completion time.
