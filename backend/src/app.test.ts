import { describe, it, expect, beforeEach } from 'vitest'
import { createApp } from './app.js'
import { createDb } from './db.js'
import type { Db } from './db.js'

let db: Db
let app: ReturnType<typeof createApp>

beforeEach(() => {
  db = createDb()
  app = createApp(db)
})

async function json(res: Response) {
  return res.json()
}

describe('GET /event-types', () => {
  it('returns seeded event types', async () => {
    const res = await app.request('/event-types')
    expect(res.status).toBe(200)
    const body = await json(res)
    expect(body).toHaveLength(2)
    expect(body[0]).toMatchObject({ title: expect.any(String), durationMinutes: expect.any(Number) })
  })
})

describe('GET /slots', () => {
  it('returns 400 when eventTypeId is missing', async () => {
    const res = await app.request('/slots')
    expect(res.status).toBe(400)
  })

  it('returns slots for a valid event type', async () => {
    const etId = db.eventTypes[0].id
    const res = await app.request(`/slots?eventTypeId=${etId}`)
    expect(res.status).toBe(200)
    const body = await json(res)
    expect(body.length).toBeGreaterThan(0)
    expect(body[0]).toMatchObject({ eventTypeId: etId, startTime: expect.any(String) })
  })

  it('excludes slots that are booked', async () => {
    const et = db.eventTypes[0]
    const slot = db.slots.find((s) => s.eventTypeId === et.id)!
    db.bookings.push({
      id: 'b-1',
      slotId: slot.id,
      eventTypeId: et.id,
      startTime: slot.startTime,
      durationMinutes: et.durationMinutes,
      bookerName: 'Alice',
      bookerEmail: 'alice@example.com',
    })
    const res = await app.request(`/slots?eventTypeId=${et.id}`)
    const body: Array<{ id: string }> = await json(res)
    expect(body.find((s) => s.id === slot.id)).toBeUndefined()
  })
})

describe('POST /bookings', () => {
  it('creates a booking and returns 201', async () => {
    const et = db.eventTypes[0]
    const slot = db.slots.find((s) => s.eventTypeId === et.id)!
    const res = await app.request('/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slotId: slot.id, bookerName: 'Alice', bookerEmail: 'alice@example.com' }),
    })
    expect(res.status).toBe(201)
    const body = await json(res)
    expect(body).toMatchObject({
      slotId: slot.id,
      bookerName: 'Alice',
      bookerEmail: 'alice@example.com',
      durationMinutes: et.durationMinutes,
    })
  })

  it('returns 409 when the same slot is booked twice', async () => {
    const et = db.eventTypes[0]
    const slot = db.slots.find((s) => s.eventTypeId === et.id)!
    const payload = JSON.stringify({ slotId: slot.id, bookerName: 'Alice', bookerEmail: 'alice@example.com' })
    await app.request('/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
    })
    const res2 = await app.request('/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
    })
    expect(res2.status).toBe(409)
    const body = await json(res2)
    expect(body.code).toBe('SLOT_UNAVAILABLE')
  })

  it('returns 409 for a different event type that overlaps in time', async () => {
    const et1 = db.eventTypes[0] // 30 min
    const et2 = db.eventTypes[1] // 60 min

    // Find a slot in et2 that starts at the same time as a slot in et1
    const slot1 = db.slots.find((s) => s.eventTypeId === et1.id)!
    const slot2 = db.slots.find(
      (s) => s.eventTypeId === et2.id && s.startTime === slot1.startTime,
    )

    if (!slot2) {
      // If no exact match, ensure the overlap detection works with existing times
      // by manually creating a slot2 that overlaps
      const overlapSlot = {
        id: 'test-overlap',
        eventTypeId: et2.id,
        startTime: slot1.startTime,
      }
      db.slots.push(overlapSlot)

      await app.request('/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slotId: slot1.id, bookerName: 'Alice', bookerEmail: 'alice@example.com' }),
      })
      const res = await app.request('/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slotId: overlapSlot.id, bookerName: 'Bob', bookerEmail: 'bob@example.com' }),
      })
      expect(res.status).toBe(409)
    } else {
      await app.request('/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slotId: slot1.id, bookerName: 'Alice', bookerEmail: 'alice@example.com' }),
      })
      const res = await app.request('/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slotId: slot2.id, bookerName: 'Bob', bookerEmail: 'bob@example.com' }),
      })
      expect(res.status).toBe(409)
    }
  })
})

describe('GET /bookings', () => {
  it('returns only upcoming bookings sorted by startTime', async () => {
    const et = db.eventTypes[0]
    const slots = db.slots.filter((s) => s.eventTypeId === et.id).slice(0, 2)
    for (const slot of slots) {
      await app.request('/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slotId: slot.id, bookerName: 'Alice', bookerEmail: 'alice@example.com' }),
      })
    }
    const res = await app.request('/bookings')
    expect(res.status).toBe(200)
    const body: Array<{ startTime: string }> = await json(res)
    expect(body.length).toBe(2)
    expect(new Date(body[0].startTime) <= new Date(body[1].startTime)).toBe(true)
  })
})

describe('DELETE /bookings/:id', () => {
  it('cancels a booking and returns 204', async () => {
    const et = db.eventTypes[0]
    const slot = db.slots.find((s) => s.eventTypeId === et.id)!
    const createRes = await app.request('/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slotId: slot.id, bookerName: 'Alice', bookerEmail: 'alice@example.com' }),
    })
    const { id } = await createRes.json()
    const deleteRes = await app.request(`/bookings/${id}`, { method: 'DELETE' })
    expect(deleteRes.status).toBe(204)
    expect(db.bookings).toHaveLength(0)
  })

  it('returns 404 for unknown booking', async () => {
    const res = await app.request('/bookings/nonexistent', { method: 'DELETE' })
    expect(res.status).toBe(404)
  })
})
