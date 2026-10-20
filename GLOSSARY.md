# Calendar Booking

A service that lets a host publish available time windows on their calendar and lets anyone book one of those windows by leaving their contact details.

## Language

**Slot**:
A specific, one-time date-and-time window on the host's calendar that can be booked. Availability is derived — a slot is available when no active booking exists for it.
_Avoid_: time slot, appointment, event, opening

**Booking**:
A reservation of one slot made by a booker. Holds the booker's name and email alongside a reference to the slot. One booking per slot maximum.
_Avoid_: reservation, appointment, registration

**Booker**:
A person who books a slot on the public page. Identified only by name and email; no account required.
_Avoid_: user, customer, client, visitor

**Host**:
The single owner of the calendar. Creates and manages slots, views bookings, and cancels bookings. The host is the only party who can cancel a booking.
_Avoid_: admin, owner, organiser

**Slot Generation**:
The process by which the host creates multiple slots at once by supplying a date range, days of week, time window, and duration. Slots that already exist within the requested range are skipped.
_Avoid_: slot creation, bulk create, scheduling

**Duration**:
The fixed length of every slot, set once for the entire calendar. All slots share the same duration.
_Avoid_: length, time block, interval

**Available Slot**:
A slot that has no active booking and whose start time has not yet passed. Only available slots are shown on the public booking page.
_Avoid_: open slot, free slot, unbooked slot

**Cancellation**:
The act of removing a booking, performed by the host only. Cancelling a booking returns the slot to available.
_Avoid_: deletion (of a booking), removal