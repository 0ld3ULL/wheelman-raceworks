import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  const events = db.prepare(`
    SELECT e.*,
      (SELECT COUNT(*) FROM rsvps WHERE event_id = e.id AND status = 'confirmed') as registered
    FROM events e
    ORDER BY e.date DESC
  `).all();

  return NextResponse.json({ events });
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, date, time, location, description, image, capacity, type } = await req.json();

  if (!title || !date || !time || !location) {
    return NextResponse.json({ error: "Title, date, time, and location are required" }, { status: 400 });
  }

  const db = getDb();
  const result = db.prepare(`
    INSERT INTO events (title, date, time, location, description, image, capacity, type)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(title, date, time, location, description || null, image || null, capacity || 0, type || "meetup");

  return NextResponse.json({ event: { id: result.lastInsertRowid } });
}

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, title, date, time, location, description, image, capacity, type, published } = await req.json();

  if (!id) {
    return NextResponse.json({ error: "Event ID required" }, { status: 400 });
  }

  const db = getDb();
  db.prepare(`
    UPDATE events SET
      title = COALESCE(?, title),
      date = COALESCE(?, date),
      time = COALESCE(?, time),
      location = COALESCE(?, location),
      description = COALESCE(?, description),
      image = COALESCE(?, image),
      capacity = COALESCE(?, capacity),
      type = COALESCE(?, type),
      published = COALESCE(?, published),
      updated_at = datetime('now')
    WHERE id = ?
  `).run(title, date, time, location, description, image, capacity, type, published, id);

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await req.json();
  const db = getDb();
  db.prepare("DELETE FROM rsvps WHERE event_id = ?").run(id);
  db.prepare("DELETE FROM events WHERE id = ?").run(id);

  return NextResponse.json({ ok: true });
}
