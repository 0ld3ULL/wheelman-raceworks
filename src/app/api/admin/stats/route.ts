import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();

  const users = db.prepare("SELECT COUNT(*) as c FROM users WHERE role = 'user'").get() as { c: number };
  const events = db.prepare("SELECT COUNT(*) as c FROM events WHERE published = 1").get() as { c: number };
  const upcomingEvents = db.prepare("SELECT COUNT(*) as c FROM events WHERE date >= date('now') AND published = 1").get() as { c: number };
  const totalBookings = db.prepare("SELECT COUNT(*) as c FROM bookings").get() as { c: number };
  const pendingBookings = db.prepare("SELECT COUNT(*) as c FROM bookings WHERE status = 'pending'").get() as { c: number };
  const totalRsvps = db.prepare("SELECT COUNT(*) as c FROM rsvps WHERE status = 'confirmed'").get() as { c: number };
  const revenue = db.prepare("SELECT COALESCE(SUM(total_cents), 0) as total FROM bookings WHERE status IN ('paid', 'completed')").get() as { total: number };

  return NextResponse.json({
    stats: {
      users: users.c,
      events: events.c,
      upcomingEvents: upcomingEvents.c,
      totalBookings: totalBookings.c,
      pendingBookings: pendingBookings.c,
      totalRsvps: totalRsvps.c,
      revenueCents: revenue.total,
    },
  });
}
