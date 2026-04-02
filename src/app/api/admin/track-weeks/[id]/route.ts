import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }

  const { id } = await params;
  const db = getDb();

  const trackWeek = db.prepare("SELECT * FROM track_weeks WHERE id = ?").get(id);
  if (!trackWeek) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const days = db.prepare("SELECT * FROM track_week_days WHERE track_week_id = ? ORDER BY day_number").all(id);
  const guests = db.prepare("SELECT * FROM track_week_guests WHERE track_week_id = ? ORDER BY created_at").all(id);
  const costs = db.prepare("SELECT * FROM track_week_costs WHERE track_week_id = ? ORDER BY created_at").all(id);

  return NextResponse.json({ trackWeek, days, guests, costs });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }

  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid request body" }, { status: 400 }); }

  const { id } = await params;
  const db = getDb();

  const allowed = [
    "title", "start_date", "end_date", "num_days", "status",
    "hotel_name", "hotel_cost_per_night", "hotel_checkin", "hotel_checkout", "hotel_booked", "hotel_notes",
    "dietary_notes", "meal_plan_notes", "revenue_cents", "notes",
  ];

  const sets: string[] = [];
  const values: unknown[] = [];
  for (const key of allowed) {
    if (key in body) {
      sets.push(`${key} = ?`);
      values.push(body[key]);
    }
  }

  if (sets.length === 0) return NextResponse.json({ error: "No valid fields" }, { status: 400 });

  sets.push("updated_at = datetime('now')");
  values.push(id);

  db.prepare(`UPDATE track_weeks SET ${sets.join(", ")} WHERE id = ?`).run(...values);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }

  const { id } = await params;
  const db = getDb();
  db.prepare("DELETE FROM track_weeks WHERE id = ?").run(id);
  return NextResponse.json({ ok: true });
}
