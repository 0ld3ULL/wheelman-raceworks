import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  const db = getDb();
  const events = db.prepare(`
    SELECT e.*,
      (SELECT COUNT(*) FROM rsvps WHERE event_id = e.id AND status = 'confirmed') as registered
    FROM events e
    WHERE e.published = 1
    ORDER BY e.date ASC
  `).all();

  return NextResponse.json({ events });
}
