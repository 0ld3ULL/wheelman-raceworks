import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function PUT(req: NextRequest) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }

  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid request body" }, { status: 400 }); }

  const { day_id, day_type, start_time, end_time, notes } = body;
  if (!day_id) return NextResponse.json({ error: "day_id required" }, { status: 400 });

  const validTypes = ["arrival", "track", "off", "departure"];
  if (day_type && !validTypes.includes(day_type)) {
    return NextResponse.json({ error: "Invalid day_type" }, { status: 400 });
  }

  const db = getDb();
  const sets: string[] = [];
  const values: unknown[] = [];

  if (day_type !== undefined) { sets.push("day_type = ?"); values.push(day_type); }
  if (start_time !== undefined) { sets.push("start_time = ?"); values.push(start_time || null); }
  if (end_time !== undefined) { sets.push("end_time = ?"); values.push(end_time || null); }
  if (notes !== undefined) { sets.push("notes = ?"); values.push(notes || null); }

  if (sets.length === 0) return NextResponse.json({ error: "No fields to update" }, { status: 400 });

  values.push(day_id);
  db.prepare(`UPDATE track_week_days SET ${sets.join(", ")} WHERE id = ?`).run(...values);
  return NextResponse.json({ ok: true });
}
