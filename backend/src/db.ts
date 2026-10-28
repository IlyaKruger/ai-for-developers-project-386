import { randomUUID } from "node:crypto";

export type EventType = {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  availableHours: number[];
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
  bookings: Booking[];
};

export function createDb(): Db {
  const consultationId = randomUUID();
  const demoId = randomUUID();

  return {
    eventTypes: [
      {
        id: consultationId,
        title: "Консультация",
        description: "Разбираем ваш вопрос и намечаем следующие шаги.",
        durationMinutes: 30,
        availableHours: [10, 11, 14, 15, 16],
      },
      {
        id: demoId,
        title: "Демонстрация продукта",
        description: "Показываю возможности продукта под ваш сценарий.",
        durationMinutes: 60,
        availableHours: [9, 13, 17],
      },
    ],
    bookings: [],
  };
}
