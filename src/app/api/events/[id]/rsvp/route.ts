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
  const db = getDb();

  const event = db.prepare("SELECT * FROM events WHERE id = ? AND published = 1").get(eventId);
  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  // Toggle RSVP
  const existing = db.prepare(
    "SELECT * FROM rsvps WHERE user_id = ? AND event_id = ?"
  ).get(user.id, eventId) as { status: string } | undefined;

  if (existing) {
    const newStatus = existing.status === "confirmed" ? "cancelled" : "confirmed";
    db.prepare("UPDATE rsvps SET status = ? WHERE user_id = ? AND event_id = ?")
      .run(newStatus, user.id, eventId);
    return NextResponse.json({ status: newStatus });
  } else {
    db.prepare("INSERT INTO rsvps (user_id, event_id, status) VALUES (?, ?, 'confirmed')")
      .run(user.id, eventId);
    return NextResponse.json({ status: "confirmed" });
  }
}
