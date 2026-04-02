import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }

  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid request body" }, { status: 400 }); }

  const { booking_id } = body;
  if (!booking_id) return NextResponse.json({ error: "booking_id required" }, { status: 400 });

  const db = getDb();

  // Get the booking
  const booking = db.prepare("SELECT * FROM bookings WHERE id = ?").get(booking_id) as {
    id: number; name: string; email: string; phone: string | null;
    preferred_date: string; notes: string | null; track_week_options: string | null;
  } | undefined;

  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

  // Parse track week options
  let twOpts: {
    group_size?: number; guest_names?: string; wants_hotel?: boolean;
    wants_lunch?: boolean; wants_dinner?: boolean; day_off_activities?: string[];
    extra_requests?: string; total_usd?: number;
  } = {};
  if (booking.track_week_options) {
    try { twOpts = JSON.parse(booking.track_week_options); } catch { /* ignore */ }
  }

  const groupSize = twOpts.group_size || 1;
  const numDays = 7;
  const revenueCents = Math.round((twOpts.total_usd || 0) * 100);
  const startDate = new Date(booking.preferred_date);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + numDays - 1);
  const endDateStr = endDate.toISOString().split("T")[0];

  const title = `${booking.name}'s Track Week`;

  // Build dietary/meal notes from options
  const mealNotes: string[] = [];
  if (twOpts.wants_lunch === false) mealNotes.push("Customer opted OUT of lunch");
  if (twOpts.wants_dinner === false) mealNotes.push("Customer opted OUT of dinner");
  const mealPlanNotes = mealNotes.length > 0 ? mealNotes.join(". ") : "All meals included";

  const hotelNote = twOpts.wants_hotel === false ? "Customer does NOT want hotel arranged" : null;

  // Day off activities for notes
  const dayOffNotes = twOpts.day_off_activities?.length
    ? `Day off requested: ${twOpts.day_off_activities.join(", ")}`
    : null;

  const allNotes = [
    twOpts.extra_requests ? `Customer notes: ${twOpts.extra_requests}` : null,
    dayOffNotes,
    booking.notes ? `Booking notes: ${booking.notes}` : null,
  ].filter(Boolean).join("\n");

  // Create everything in a transaction
  const result = db.transaction(() => {
    // Create the track week
    const tw = db.prepare(`
      INSERT INTO track_weeks (title, start_date, end_date, num_days, status, revenue_cents,
        hotel_notes, meal_plan_notes, notes)
      VALUES (?, ?, ?, ?, 'planning', ?, ?, ?, ?)
    `).run(
      title, booking.preferred_date, endDateStr, numDays, revenueCents,
      hotelNote, mealPlanNotes, allNotes || null
    );

    const twId = tw.lastInsertRowid;

    // Create default days
    const insertDay = db.prepare(`
      INSERT INTO track_week_days (track_week_id, day_number, date, day_type, start_time, end_time, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    for (let i = 0; i < numDays; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split("T")[0];

      let dayType = "track";
      let startTime: string | null = "09:00";
      let endTime: string | null = "17:00";
      let dayNote: string | null = null;

      if (i === 0) { dayType = "arrival"; startTime = null; endTime = null; }
      else if (i === numDays - 1) { dayType = "departure"; startTime = null; endTime = null; }
      else if (i === numDays - 2) {
        dayType = "off"; startTime = null; endTime = null;
        dayNote = twOpts.day_off_activities?.join(", ") || null;
      }

      insertDay.run(twId, i + 1, dateStr, dayType, startTime, endTime, dayNote);
    }

    // Create guests from booking data
    const insertGuest = db.prepare(`
      INSERT INTO track_week_guests (track_week_id, booking_id, name, email, phone, needs_pickup)
      VALUES (?, ?, ?, ?, ?, 1)
    `);

    // Primary booker is always a guest
    insertGuest.run(twId, booking.id, booking.name, booking.email, booking.phone);

    // Parse additional guest names
    if (twOpts.guest_names) {
      const names = twOpts.guest_names.split(/[,\n]+/).map(n => n.trim()).filter(n => n.length > 0);
      for (const name of names) {
        // Skip if it matches the primary booker
        if (name.toLowerCase() === booking.name.toLowerCase()) continue;
        insertGuest.run(twId, null, name, null, null);
      }
    }

    return twId;
  })();

  return NextResponse.json({ trackWeek: { id: result } });
}
