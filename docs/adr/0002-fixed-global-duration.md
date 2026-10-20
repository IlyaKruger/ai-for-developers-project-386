# Fixed global duration for all slots

Every slot has the same duration, configured once for the calendar. Slots do not carry an individual duration field. We chose this because the service is designed for a single host with a uniform call format; per-slot durations would add configuration complexity with no current use case.

## Consequences

Adding per-slot variable durations later requires a schema change (adding a `duration` field to Slot) and UI changes to the slot generation form. The current model deliberately does not accommodate this.
