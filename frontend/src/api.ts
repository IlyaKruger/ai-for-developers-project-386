import type { Slot, Booking } from './types'

const BASE_URL = 'http://localhost:3001'

export async function fetchSlots(): Promise<Slot[]> {
  const res = await fetch(`${BASE_URL}/slots`)
  if (!res.ok) throw new Error('Failed to fetch slots')
  return res.json()
}

export async function fetchBookings(): Promise<Booking[]> {
  const res = await fetch(`${BASE_URL}/bookings`)
  if (!res.ok) throw new Error('Failed to fetch bookings')
  return res.json()
}

export async function createBooking(
  slotId: string,
  name: string,
  email: string,
): Promise<Booking> {
  const res = await fetch(`${BASE_URL}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slotId, name, email }),
  })
  if (!res.ok) throw new Error('Failed to create booking')
  return res.json()
}
