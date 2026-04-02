import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

const VALID_STATUSES = ["pending", "confirmed", "paid", "completed", "cancelled"];

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

  const bookings = db.prepare(`
    SELECT * FROM bookings ORDER BY created_at DESC LIMIT ? OFFSET ?
  `).all(limit, offset);

  return NextResponse.json({ bookings });
}

export async function PUT(req: NextRequest) {
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

  const { id, status } = body;

  if (!id || typeof id !== "number") {
    return NextResponse.json({ error: "Valid booking ID required" }, { status: 400 });
  }

  // H4 FIX: Validate status against allowed values
  if (!status || !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` }, { status: 400 });
  }

  const db = getDb();
  if (status === "completed") {
    db.prepare("UPDATE bookings SET status = ?, updated_at = datetime('now'), completed_at = datetime('now') WHERE id = ?")
      .run(status, id);
  } else {
    db.prepare("UPDATE bookings SET status = ?, updated_at = datetime('now'), completed_at = NULL WHERE id = ?")
      .run(status, id);
  }

  return NextResponse.json({ ok: true });
}
