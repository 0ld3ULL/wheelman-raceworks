import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, preferred_date, notes, service_slugs } = await req.json();

    if (!name || !email || !preferred_date || !service_slugs?.length) {
      return NextResponse.json({ error: "Name, email, date, and at least one service are required" }, { status: 400 });
    }

    const db = getDb();
    const user = await getCurrentUser();

    // Look up selected services and compute total
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
      name,
      email.toLowerCase(),
      phone || null,
      preferred_date,
      notes || null,
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
