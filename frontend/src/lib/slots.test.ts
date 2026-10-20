import { describe, it, expect } from 'vitest'
import { getAvailableSlots } from './slots'
import type { Slot, Booking } from '../types'

const future = (offsetMs: number) =>
  new Date(Date.now() + offsetMs).toISOString()

const past = (offsetMs: number) =>
  new Date(Date.now() - offsetMs).toISOString()

const slot = (id: string, startTime: string): Slot => ({
  id,
  startTime,
  duration: 30,
})

const booking = (slotId: string): Booking => ({
  id: `b-${slotId}`,
  slotId,
  name: 'Alice',
  email: 'alice@example.com',
})

describe('getAvailableSlots', () => {
  it('returns all slots when there are no bookings and all are in the future', () => {
    const slots = [slot('1', future(3600_000)), slot('2', future(7200_000))]
    expect(getAvailableSlots(slots, [])).toEqual(slots)
  })

  it('excludes a slot that has a matching booking', () => {
    const s1 = slot('1', future(3600_000))
    const s2 = slot('2', future(7200_000))
    expect(getAvailableSlots([s1, s2], [booking('1')])).toEqual([s2])
  })

  it('excludes a slot whose startTime is in the past', () => {
    const s1 = slot('1', past(3600_000))
    const s2 = slot('2', future(3600_000))
    expect(getAvailableSlots([s1, s2], [])).toEqual([s2])
  })

  it('excludes a slot that is both booked and past', () => {
    const s1 = slot('1', past(3600_000))
    expect(getAvailableSlots([s1], [booking('1')])).toEqual([])
  })

  it('returns empty array when all slots are booked or past', () => {
    const slots = [slot('1', past(1000)), slot('2', future(1000))]
    const bookings = [booking('2')]
    expect(getAvailableSlots(slots, bookings)).toEqual([])
  })
})
