import { Hono } from "hono";
import { cors } from "hono/cors";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import type { Db } from "./db.js";
import { overlaps } from "./overlap.js";

export function createApp(db: Db) {
  const app = new Hono();

  app.use("*", cors({ origin: "*" }));

  // ── EventTypes ────────────────────────────────────────────────────────────
  app.get("/event-types", (c) => c.json(db.eventTypes));

  app.post(
    "/event-types",
    zValidator(
      "json",
      z.object({
        title: z.string().min(1),
        description: z.string(),
        durationMinutes: z.number().int().positive(),
      }),
    ),
    (c) => {
      const body = c.req.valid("json");
      const et = { id: randomUUID(), ...body };
      db.eventTypes.push(et);
      return c.json(et, 201);
    },
  );

  // ── Slots ─────────────────────────────────────────────────────────────────
  app.get("/slots", (c) => {
    const eventTypeId = c.req.query("eventTypeId");
    if (!eventTypeId) return c.json({ code: "MISSING_PARAM", message: "eventTypeId required" }, 400);

    const et = db.eventTypes.find((e) => e.id === eventTypeId);
    if (!et) return c.json({ code: "NOT_FOUND", message: "Event type not found" }, 404);

    const now = new Date();
    const cutoff = new Date(now.getTime() + 14 * 24 * 60 * 60_000);
    const bookedSlotIds = new Set(db.bookings.map((b) => b.slotId));

    const available = db.slots.filter((s) => {
      if (s.eventTypeId !== eventTypeId) return false;
      const start = new Date(s.startTime);
      if (start <= now || start > cutoff) return false;
      if (bookedSlotIds.has(s.id)) return false;
      // exclude slots that overlap with any existing booking
      return !db.bookings.some((b) =>
        overlaps(s.startTime, et.durationMinutes, b.startTime, b.durationMinutes),
      );
    });

    return c.json(available);
  });

  // ── Bookings ──────────────────────────────────────────────────────────────
  app.get("/bookings", (c) => {
    const now = new Date();
    const upcoming = db.bookings
      .filter((b) => new Date(b.startTime) >= now)
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    return c.json(upcoming);
  });

  app.post(
    "/bookings",
    zValidator(
      "json",
      z.object({
        slotId: z.string(),
        bookerName: z.string().min(1),
        bookerEmail: z.email(),
      }),
    ),
    (c) => {
      const { slotId, bookerName, bookerEmail } = c.req.valid("json");

      const slot = db.slots.find((s) => s.id === slotId);
      if (!slot) return c.json({ code: "NOT_FOUND", message: "Slot not found" }, 404);

      const et = db.eventTypes.find((e) => e.id === slot.eventTypeId);
      if (!et) return c.json({ code: "NOT_FOUND", message: "Event type not found" }, 404);

      const now = new Date();
      if (new Date(slot.startTime) <= now) {
        return c.json({ code: "SLOT_UNAVAILABLE", message: "Slot is in the past" }, 409);
      }

      const conflict = db.bookings.some((b) =>
        overlaps(slot.startTime, et.durationMinutes, b.startTime, b.durationMinutes),
      );
      if (conflict) {
        return c.json({ code: "SLOT_UNAVAILABLE", message: "This time is already booked" }, 409);
      }

      const booking = {
        id: randomUUID(),
        slotId,
        eventTypeId: et.id,
        startTime: slot.startTime,
        durationMinutes: et.durationMinutes,
        bookerName,
        bookerEmail,
      };
      db.bookings.push(booking);
      return c.json(booking, 201);
    },
  );

  app.delete("/bookings/:id", (c) => {
    const id = c.req.param("id");
    const idx = db.bookings.findIndex((b) => b.id === id);
    if (idx === -1) return c.json({ code: "NOT_FOUND", message: "Booking not found" }, 404);
    db.bookings.splice(idx, 1);
    return new Response(null, { status: 204 });
  });

  return app;
}
