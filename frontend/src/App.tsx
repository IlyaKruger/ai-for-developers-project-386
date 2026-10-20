import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { fetchSlots, fetchBookings, createBooking } from './api'
import { getAvailableSlots } from './lib/slots'
import { formatSlotDate, formatSlotTime } from './lib/format'
import type { Slot } from './types'

type State =
  | { phase: 'loading' }
  | { phase: 'idle'; slots: Slot[] }
  | { phase: 'selecting'; slots: Slot[]; slot: Slot }
  | { phase: 'submitting'; slots: Slot[]; slot: Slot }
  | { phase: 'success' }
  | { phase: 'error'; message: string }

export default function App() {
  const [state, setState] = useState<State>({ phase: 'loading' })

  useEffect(() => {
    Promise.all([fetchSlots(), fetchBookings()])
      .then(([slots, bookings]) =>
        setState({ phase: 'idle', slots: getAvailableSlots(slots, bookings) }),
      )
      .catch((err: unknown) =>
        setState({ phase: 'error', message: String(err) }),
      )
  }, [])

  if (state.phase === 'loading') {
    return <Page><p className="text-muted-foreground">Загрузка…</p></Page>
  }

  if (state.phase === 'error') {
    return <Page><p className="text-destructive">{state.message}</p></Page>
  }

  if (state.phase === 'success') {
    return (
      <Page>
        <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center">
          <p className="text-lg font-medium text-green-800">Запись подтверждена!</p>
          <p className="mt-1 text-sm text-green-700">Мы свяжемся с вами в ближайшее время.</p>
        </div>
      </Page>
    )
  }

  const { slots } = state

  if (state.phase === 'idle') {
    return (
      <Page>
        {slots.length === 0 ? (
          <p className="text-muted-foreground">Свободных слотов нет.</p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {slots.map((slot) => (
              <li key={slot.id}>
                <button
                  type="button"
                  onClick={() => setState({ phase: 'selecting', slots, slot })}
                  className="w-full rounded-lg border bg-card p-4 text-left shadow-sm transition hover:border-primary hover:shadow-md"
                >
                  <p className="font-medium capitalize">{formatSlotDate(slot.startTime)}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{formatSlotTime(slot.startTime, slot.duration)}</p>
                </button>
              </li>
            ))}
          </ul>
        )}
      </Page>
    )
  }

  // phase === 'selecting' | 'submitting'
  const { slot } = state
  const submitting = state.phase === 'submitting'

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (state.phase !== 'selecting') return
    const fd = new FormData(e.currentTarget)
    setState({ phase: 'submitting', slots, slot })
    try {
      await createBooking(slot.id, fd.get('name') as string, fd.get('email') as string)
      setState({ phase: 'success' })
    } catch (err) {
      setState({ phase: 'error', message: String(err) })
    }
  }

  return (
    <Page>
      <div className="mx-auto max-w-md rounded-lg border bg-card p-6 shadow-sm">
        <button
          type="button"
          onClick={() => setState({ phase: 'idle', slots })}
          className="mb-4 text-sm text-muted-foreground hover:text-foreground"
        >
          ← Назад
        </button>
        <h2 className="text-lg font-semibold capitalize">{formatSlotDate(slot.startTime)}</h2>
        <p className="mb-5 text-sm text-muted-foreground">{formatSlotTime(slot.startTime, slot.duration)}</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm font-medium">
            Имя
            <input
              name="name"
              type="text"
              required
              autoFocus
              className="rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium">
            Email
            <input
              name="email"
              type="email"
              required
              className="rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </label>
          <Button type="submit" disabled={submitting} className="mt-1">
            {submitting ? 'Отправка…' : 'Забронировать'}
          </Button>
        </form>
      </div>
    </Page>
  )
}

function Page({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-8 text-2xl font-bold tracking-tight">Запись на звонок</h1>
      {children}
    </main>
  )
}
