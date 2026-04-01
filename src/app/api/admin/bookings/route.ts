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
  const bookings = db.prepare(`
    SELECT * FROM bookings ORDER BY created_at DESC
  `).all();

  return NextResponse.json({ bookings });
}

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, status } = await req.json();

  if (!id || !status) {
    return NextResponse.json({ error: "Booking ID and status required" }, { status: 400 });
  }

  const db = getDb();
  db.prepare("UPDATE bookings SET status = ?, updated_at = datetime('now') WHERE id = ?")
    .run(status, id);

  return NextResponse.json({ ok: true });
}
