import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }

  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid request body" }, { status: 400 }); }

  const { id } = await params;
  const { name, email, phone, needs_pickup, arrival_flight, arrival_datetime, departure_flight, departure_datetime, dietary, notes, booking_id } = body;

  if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });

  const db = getDb();
  const result = db.prepare(`
    INSERT INTO track_week_guests (track_week_id, booking_id, name, email, phone, needs_pickup, arrival_flight, arrival_datetime, departure_flight, departure_datetime, dietary, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, booking_id || null, name.slice(0, 200), email || null, phone || null, needs_pickup ? 1 : 0, arrival_flight || null, arrival_datetime || null, departure_flight || null, departure_datetime || null, dietary || null, notes || null);

  return NextResponse.json({ guest: { id: result.lastInsertRowid } });
}

export async function PUT(req: NextRequest) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }

  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid request body" }, { status: 400 }); }

  const { guest_id } = body;
  if (!guest_id) return NextResponse.json({ error: "guest_id required" }, { status: 400 });

  const allowed = ["name", "email", "phone", "needs_pickup", "arrival_flight", "arrival_datetime", "departure_flight", "departure_datetime", "dietary", "notes"];
  const sets: string[] = [];
  const values: unknown[] = [];

  for (const key of allowed) {
    if (key in body) {
      sets.push(`${key} = ?`);
      values.push(key === "needs_pickup" ? (body[key] ? 1 : 0) : (body[key] || null));
    }
  }

  if (sets.length === 0) return NextResponse.json({ error: "No fields to update" }, { status: 400 });

  values.push(guest_id);
  const db = getDb();
  db.prepare(`UPDATE track_week_guests SET ${sets.join(", ")} WHERE id = ?`).run(...values);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }

  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid request body" }, { status: 400 }); }

  const { guest_id } = body;
  if (!guest_id) return NextResponse.json({ error: "guest_id required" }, { status: 400 });

  const db = getDb();
  db.prepare("DELETE FROM track_week_guests WHERE id = ?").run(guest_id);
  return NextResponse.json({ ok: true });
}
