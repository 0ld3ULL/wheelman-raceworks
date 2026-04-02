import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  // M3 FIX: Pagination
  const url = new URL(req.url);
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "100"), 200);
  const offset = parseInt(url.searchParams.get("offset") || "0");

  const events = db.prepare(`
    SELECT e.*,
      (SELECT COUNT(*) FROM rsvps WHERE event_id = e.id AND status = 'confirmed') as registered
    FROM events e
    ORDER BY e.date DESC
    LIMIT ? OFFSET ?
  `).all(limit, offset) as { id: number; [key: string]: unknown }[];

  // Fetch RSVP attendees for each event
  const getAttendees = db.prepare(`
    SELECT u.name, u.email FROM rsvps r
    JOIN users u ON u.id = r.user_id
    WHERE r.event_id = ? AND r.status = 'confirmed'
    ORDER BY r.created_at
  `);

  const eventsWithAttendees = events.map(event => ({
    ...event,
    attendees: getAttendees.all(event.id) as { name: string; email: string }[],
  }));

  return NextResponse.json({ events: eventsWithAttendees });
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // M4 FIX: Handle malformed JSON
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { title, date, time, location, description, image, capacity, type } = body;

  if (!title || !date || !time || !location) {
    return NextResponse.json({ error: "Title, date, time, and location are required" }, { status: 400 });
  }

  // Validate type
  const validTypes = ["competition", "lesson", "meetup"];
  if (type && !validTypes.includes(type)) {
    return NextResponse.json({ error: "Invalid event type" }, { status: 400 });
  }

  const db = getDb();
  const result = db.prepare(`
    INSERT INTO events (title, date, time, location, description, image, capacity, type)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    String(title).slice(0, 200),
    String(date).slice(0, 20),
    String(time).slice(0, 50),
    String(location).slice(0, 300),
    description ? String(description).slice(0, 2000) : null,
    image ? String(image).slice(0, 500) : null,
    typeof capacity === "number" ? Math.max(0, Math.floor(capacity)) : 0,
    type || "meetup"
  );

  return NextResponse.json({ event: { id: result.lastInsertRowid } });
}

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { id, title, date, time, location, description, image, capacity, type, published } = body;

  if (!id || typeof id !== "number") {
    return NextResponse.json({ error: "Valid event ID required" }, { status: 400 });
  }

  // Validate type if provided
  const validTypes = ["competition", "lesson", "meetup"];
  if (type !== undefined && !validTypes.includes(type)) {
    return NextResponse.json({ error: "Invalid event type" }, { status: 400 });
  }

  const db = getDb();

  // M2 FIX: Build update dynamically instead of COALESCE (allows clearing fields)
  const fields: string[] = [];
  const values: unknown[] = [];

  if (title !== undefined) { fields.push("title = ?"); values.push(String(title).slice(0, 200)); }
  if (date !== undefined) { fields.push("date = ?"); values.push(String(date).slice(0, 20)); }
  if (time !== undefined) { fields.push("time = ?"); values.push(String(time).slice(0, 50)); }
  if (location !== undefined) { fields.push("location = ?"); values.push(String(location).slice(0, 300)); }
  if (description !== undefined) { fields.push("description = ?"); values.push(description ? String(description).slice(0, 2000) : null); }
  if (image !== undefined) { fields.push("image = ?"); values.push(image ? String(image).slice(0, 500) : null); }
  if (capacity !== undefined) { fields.push("capacity = ?"); values.push(typeof capacity === "number" ? Math.max(0, Math.floor(capacity)) : 0); }
  if (type !== undefined) { fields.push("type = ?"); values.push(type); }
  if (published !== undefined) { fields.push("published = ?"); values.push(published ? 1 : 0); }

  if (fields.length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  fields.push("updated_at = datetime('now')");
  values.push(id);

  db.prepare(`UPDATE events SET ${fields.join(", ")} WHERE id = ?`).run(...values);

  return NextResponse.json({ ok: true });
}

// M1 FIX: DELETE uses query param instead of body
export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const id = parseInt(url.searchParams.get("id") || "");

  if (isNaN(id)) {
    // Fallback: try body for backwards compat with admin panel
    try {
      const body = await req.json();
      if (body.id) {
        const db = getDb();
        db.prepare("DELETE FROM rsvps WHERE event_id = ?").run(body.id);
        db.prepare("DELETE FROM events WHERE id = ?").run(body.id);
        return NextResponse.json({ ok: true });
      }
    } catch { /* ignore */ }
    return NextResponse.json({ error: "Event ID required" }, { status: 400 });
  }

  const db = getDb();
  db.prepare("DELETE FROM rsvps WHERE event_id = ?").run(id);
  db.prepare("DELETE FROM events WHERE id = ?").run(id);

  return NextResponse.json({ ok: true });
}
