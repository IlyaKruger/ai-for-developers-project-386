import { useEffect, useState } from 'react'
import './client'
import { bookingsList, bookingsCancel } from './generated/sdk.gen'
import { formatSlotDate, formatSlotTime } from './lib/format'
import type { Booking } from './generated/types.gen'

type State =
  | { phase: 'loading' }
  | { phase: 'idle'; bookings: Booking[] }
  | { phase: 'error'; message: string }

export default function HostPage() {
  const [state, setState] = useState<State>({ phase: 'loading' })

  function load() {
    bookingsList()
      .then((r) => {
        if (r.error) throw new Error('Не удалось загрузить встречи')
        setState({ phase: 'idle', bookings: r.data ?? [] })
      })
      .catch((err: unknown) => setState({ phase: 'error', message: String(err) }))
  }

  useEffect(load, [])

  async function cancel(id: string) {
    await bookingsCancel({ path: { id } })
    load()
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Предстоящие встречи</h1>
        <a href="/" className="text-sm text-muted-foreground hover:text-foreground">
          ← К публичной странице
        </a>
      </div>

      {state.phase === 'loading' && <p className="text-muted-foreground">Загрузка…</p>}
      {state.phase === 'error' && <p className="text-destructive">{state.message}</p>}

      {state.phase === 'idle' && (
        <>
          {state.bookings.length === 0 ? (
            <p className="text-muted-foreground">Предстоящих встреч нет.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {state.bookings.map((b) => (
                <li
                  key={b.id}
                  className="flex items-center justify-between rounded-lg border bg-card p-4 shadow-sm"
                >
                  <div>
                    <p className="font-medium capitalize">{formatSlotDate(b.startTime)}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatSlotTime(b.startTime, b.durationMinutes)}
                    </p>
                    <p className="mt-1 text-sm">
                      {b.bookerName}{' '}
                      <span className="text-muted-foreground">·</span>{' '}
                      <a
                        href={`mailto:${b.bookerEmail}`}
                        className="text-primary hover:underline"
                      >
                        {b.bookerEmail}
                      </a>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => cancel(b.id)}
                    className="ml-4 rounded-md border px-3 py-1 text-sm text-destructive hover:bg-destructive/10"
                  >
                    Отменить
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </main>
  )
}
