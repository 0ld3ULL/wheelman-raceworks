import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Login required to RSVP" }, { status: 401 });
  }

  const { id } = await params;
  const eventId = parseInt(id);

  if (isNaN(eventId)) {
    return NextResponse.json({ error: "Invalid event ID" }, { status: 400 });
  }

  const db = getDb();

  const event = db.prepare("SELECT * FROM events WHERE id = ? AND published = 1").get(eventId);
  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  // H2 FIX: Wrap in transaction to prevent race condition
  const toggleRsvp = db.transaction((userId: number, evId: number) => {
    const existing = db.prepare(
      "SELECT status FROM rsvps WHERE user_id = ? AND event_id = ?"
    ).get(userId, evId) as { status: string } | undefined;

    if (existing) {
      const newStatus = existing.status === "confirmed" ? "cancelled" : "confirmed";
      db.prepare("UPDATE rsvps SET status = ? WHERE user_id = ? AND event_id = ?")
        .run(newStatus, userId, evId);
      return newStatus;
    } else {
      db.prepare("INSERT INTO rsvps (user_id, event_id, status) VALUES (?, ?, 'confirmed')")
        .run(userId, evId);
      return "confirmed";
    }
  });

  try {
    const status = toggleRsvp(user.id, eventId);
    return NextResponse.json({ status });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "RSVP failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
