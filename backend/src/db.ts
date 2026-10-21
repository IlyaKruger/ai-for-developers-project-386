import { randomUUID } from "node:crypto";

export type EventType = {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
};

export type Slot = {
  id: string;
  eventTypeId: string;
  startTime: string; // ISO 8601
};

export type Booking = {
  id: string;
  slotId: string;
  eventTypeId: string;
  startTime: string;
  durationMinutes: number;
  bookerName: string;
  bookerEmail: string;
};

export type Db = {
  eventTypes: EventType[];
  slots: Slot[];
  bookings: Booking[];
};

export function createDb(): Db {
  const consultationId = randomUUID();
  const demoId = randomUUID();

  const now = new Date();
  const slots: Slot[] = [];

  for (let day = 1; day <= 14; day++) {
    for (const hour of [10, 11, 14, 15, 16]) {
      const d = new Date(now);
      d.setDate(now.getDate() + day);
      d.setHours(hour, 0, 0, 0);
      slots.push({ id: randomUUID(), eventTypeId: consultationId, startTime: d.toISOString() });
    }
    for (const hour of [9, 13, 17]) {
      const d = new Date(now);
      d.setDate(now.getDate() + day);
      d.setHours(hour, 0, 0, 0);
      slots.push({ id: randomUUID(), eventTypeId: demoId, startTime: d.toISOString() });
    }
  }

  return {
    eventTypes: [
      {
        id: consultationId,
        title: "Консультация",
        description: "Разбираем ваш вопрос и намечаем следующие шаги.",
        durationMinutes: 30,
      },
      {
        id: demoId,
        title: "Демонстрация продукта",
        description: "Показываю возможности продукта под ваш сценарий.",
        durationMinutes: 60,
      },
    ],
    slots,
    bookings: [],
  };
}
