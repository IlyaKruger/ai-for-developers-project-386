import type { Slot, Booking } from '../types'

export function getAvailableSlots(slots: Slot[], bookings: Booking[]): Slot[] {
  const bookedIds = new Set(bookings.map((booking) => booking.slotId))
  const now = new Date()
  return slots.filter(
    (slot) => !bookedIds.has(slot.id) && new Date(slot.startTime) >= now,
  )
}
