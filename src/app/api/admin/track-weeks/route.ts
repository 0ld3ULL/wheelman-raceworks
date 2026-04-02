import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }

  const db = getDb();
  const url = new URL(req.url);
  const status = url.searchParams.get("status");

  let query = `
    SELECT tw.*,
      (SELECT COUNT(*) FROM track_week_guests g WHERE g.track_week_id = tw.id) as guest_count,
      (SELECT COALESCE(SUM(c.amount_cents), 0) FROM track_week_costs c WHERE c.track_week_id = tw.id) as total_costs_cents
    FROM track_weeks tw
  `;
  const params: string[] = [];
  if (status && status !== "all") {
    query += " WHERE tw.status = ?";
    params.push(status);
  }
  query += " ORDER BY tw.start_date DESC";

  const trackWeeks = db.prepare(query).all(...params);
  return NextResponse.json({ trackWeeks });
}

export async function POST(req: NextRequest) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }

  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid request body" }, { status: 400 }); }

  const { title, start_date, num_days = 7, revenue_cents = 0 } = body;
  if (!title || !start_date) {
    return NextResponse.json({ error: "Title and start date are required" }, { status: 400 });
  }

  const days = Math.max(1, Math.min(num_days, 30));
  const startDate = new Date(start_date);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + days - 1);
  const end_date = endDate.toISOString().split("T")[0];

  const db = getDb();
  const result = db.transaction(() => {
    const tw = db.prepare(`
      INSERT INTO track_weeks (title, start_date, end_date, num_days, revenue_cents)
      VALUES (?, ?, ?, ?, ?)
    `).run(title.slice(0, 200), start_date, end_date, days, revenue_cents);

    const twId = tw.lastInsertRowid;
    const insertDay = db.prepare(`
      INSERT INTO track_week_days (track_week_id, day_number, date, day_type, start_time, end_time)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    for (let i = 0; i < days; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split("T")[0];

      let dayType = "track";
      let startTime: string | null = "09:00";
      let endTime: string | null = "17:00";

      if (i === 0) { dayType = "arrival"; startTime = null; endTime = null; }
      else if (i === days - 1) { dayType = "departure"; startTime = null; endTime = null; }
      else if (i === days - 2) { dayType = "off"; startTime = null; endTime = null; }

      insertDay.run(twId, i + 1, dateStr, dayType, startTime, endTime);
    }

    return twId;
  })();

  return NextResponse.json({ trackWeek: { id: result } });
}
