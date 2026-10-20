export type Slot = {
  id: string
  startTime: string
  duration: number
}

export type Booking = {
  id: string
  slotId: string
  name: string
  email: string
}
