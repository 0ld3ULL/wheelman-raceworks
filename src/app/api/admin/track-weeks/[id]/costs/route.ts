import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

const VALID_CATEGORIES = ["hotel", "food", "track_fees", "transport", "equipment", "other"];

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }

  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid request body" }, { status: 400 }); }

  const { id } = await params;
  const { category, description, amount_cents, currency = "USD" } = body;

  if (!category || !VALID_CATEGORIES.includes(category)) {
    return NextResponse.json({ error: `Invalid category. Must be: ${VALID_CATEGORIES.join(", ")}` }, { status: 400 });
  }
  if (!description || !amount_cents) {
    return NextResponse.json({ error: "Description and amount required" }, { status: 400 });
  }

  const db = getDb();
  const result = db.prepare(`
    INSERT INTO track_week_costs (track_week_id, category, description, amount_cents, currency)
    VALUES (?, ?, ?, ?, ?)
  `).run(id, category, description.slice(0, 200), Math.round(amount_cents), currency);

  return NextResponse.json({ cost: { id: result.lastInsertRowid } });
}

export async function PUT(req: NextRequest) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }

  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid request body" }, { status: 400 }); }

  const { cost_id } = body;
  if (!cost_id) return NextResponse.json({ error: "cost_id required" }, { status: 400 });

  const sets: string[] = [];
  const values: unknown[] = [];

  if (body.category && VALID_CATEGORIES.includes(body.category)) { sets.push("category = ?"); values.push(body.category); }
  if (body.description) { sets.push("description = ?"); values.push(body.description.slice(0, 200)); }
  if (body.amount_cents !== undefined) { sets.push("amount_cents = ?"); values.push(Math.round(body.amount_cents)); }
  if (body.paid !== undefined) { sets.push("paid = ?"); values.push(body.paid ? 1 : 0); }

  if (sets.length === 0) return NextResponse.json({ error: "No fields to update" }, { status: 400 });

  values.push(cost_id);
  const db = getDb();
  db.prepare(`UPDATE track_week_costs SET ${sets.join(", ")} WHERE id = ?`).run(...values);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }

  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid request body" }, { status: 400 }); }

  const { cost_id } = body;
  if (!cost_id) return NextResponse.json({ error: "cost_id required" }, { status: 400 });

  const db = getDb();
  db.prepare("DELETE FROM track_week_costs WHERE id = ?").run(cost_id);
  return NextResponse.json({ ok: true });
}
