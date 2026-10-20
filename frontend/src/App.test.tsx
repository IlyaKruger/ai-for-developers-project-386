import { render, screen } from '@testing-library/react'
import { vi, it, expect } from 'vitest'
import App from './App'
import * as api from './api'

vi.mock('./api', () => ({
  fetchSlots: vi.fn().mockResolvedValue([]),
  fetchBookings: vi.fn().mockResolvedValue([]),
  createBooking: vi.fn(),
}))

it('renders the booking page heading', () => {
  vi.mocked(api.fetchSlots).mockResolvedValue([])
  vi.mocked(api.fetchBookings).mockResolvedValue([])
  render(<App />)
  expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Запись на звонок')
})
