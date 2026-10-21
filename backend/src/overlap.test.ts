import { describe, it, expect } from 'vitest'
import { overlaps } from './overlap.js'

const iso = (offsetMin: number) =>
  new Date(Date.now() + offsetMin * 60_000).toISOString()

describe('overlaps', () => {
  it('returns false when intervals do not overlap', () => {
    // A: 0–30, B: 30–60
    expect(overlaps(iso(0), 30, iso(30), 30)).toBe(false)
  })

  it('returns true when one interval starts inside another', () => {
    // A: 0–60, B: 30–60
    expect(overlaps(iso(0), 60, iso(30), 30)).toBe(true)
  })

  it('returns true for exact same interval', () => {
    const t = iso(10)
    expect(overlaps(t, 30, t, 30)).toBe(true)
  })

  it('returns true when B contains A', () => {
    // A: 10–40, B: 0–60
    expect(overlaps(iso(10), 30, iso(0), 60)).toBe(true)
  })

  it('returns false when B ends exactly when A starts', () => {
    // A: 30–60, B: 0–30
    expect(overlaps(iso(30), 30, iso(0), 30)).toBe(false)
  })
})
