import type { Slot, Booking } from '../types'

export function getAvailableSlots(slots: Slot[], bookings: Booking[]): Slot[] {
  const bookedIds = new Set(bookings.map((b) => b.slotId))
  const now = new Date()
  return slots.filter(
    (s) => !bookedIds.has(s.id) && new Date(s.startTime) > now,
  )
}
