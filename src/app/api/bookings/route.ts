import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getCurrentUser, isValidEmail } from "@/lib/auth";
import { bookingLimiter, getClientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  // C3 FIX: Rate limiting
  const ip = getClientIp(req);
  const limit = bookingLimiter(ip);
  if (!limit.ok) {
    return NextResponse.json({ error: "Too many booking requests. Try again later." }, { status: 429 });
  }

  // M4 FIX: Handle malformed JSON
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  try {
    const { name, email, phone, preferred_date, notes, service_slugs } = body;

    if (!name || !email || !preferred_date || !service_slugs?.length) {
      return NextResponse.json({ error: "Name, email, date, and at least one service are required" }, { status: 400 });
    }

    // H3 FIX: Email validation
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    // H1 FIX: Cap service_slugs to prevent oversized queries
    if (!Array.isArray(service_slugs) || service_slugs.length > 10) {
      return NextResponse.json({ error: "Invalid services selection" }, { status: 400 });
    }

    // Validate slugs are strings
    if (service_slugs.some((s: unknown) => typeof s !== "string")) {
      return NextResponse.json({ error: "Invalid service format" }, { status: 400 });
    }

    const db = getDb();
    const user = await getCurrentUser();

    const services = db.prepare(
      `SELECT * FROM services WHERE slug IN (${service_slugs.map(() => "?").join(",")}) AND active = 1`
    ).all(...service_slugs) as { slug: string; title: string; price_cents: number }[];

    if (services.length === 0) {
      return NextResponse.json({ error: "No valid services selected" }, { status: 400 });
    }

    const total_cents = services.reduce((sum, s) => sum + s.price_cents, 0);

    const result = db.prepare(`
      INSERT INTO bookings (user_id, name, email, phone, preferred_date, notes, services_json, total_cents, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `).run(
      user?.id || null,
      name.slice(0, 200),
      email.toLowerCase().slice(0, 200),
      phone ? String(phone).slice(0, 50) : null,
      preferred_date,
      notes ? String(notes).slice(0, 1000) : null,
      JSON.stringify(services.map(s => ({ slug: s.slug, title: s.title, price_cents: s.price_cents }))),
      total_cents
    );

    return NextResponse.json({
      booking: {
        id: result.lastInsertRowid,
        status: "pending",
        total_cents,
        services: services.map(s => s.title),
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Booking failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
