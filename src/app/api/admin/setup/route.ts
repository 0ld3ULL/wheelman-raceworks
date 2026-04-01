import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const db = getDb();

  // C2 FIX: Only allow setup if no admins exist AND correct setup key provided
  const adminCount = db.prepare("SELECT COUNT(*) as c FROM users WHERE role = 'admin'").get() as { c: number };
  if (adminCount.c > 0) {
    return NextResponse.json({ error: "Admin already exists" }, { status: 403 });
  }

  // Require setup key from environment
  const setupKey = process.env.ADMIN_SETUP_KEY;
  if (setupKey) {
    const providedKey = req.headers.get("x-setup-key");
    if (providedKey !== setupKey) {
      return NextResponse.json({ error: "Invalid setup key" }, { status: 403 });
    }
  }

  // M4 FIX: Handle malformed JSON
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { email, password, name } = body;

  if (!email || !password || !name) {
    return NextResponse.json({ error: "Email, password, and name are required" }, { status: 400 });
  }

  // H5 FIX: Async bcrypt
  const hash = await bcrypt.hash(password, 12);
  db.prepare(
    "INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, 'admin')"
  ).run(email.toLowerCase(), hash, name);

  return NextResponse.json({ ok: true, message: "Admin account created" });
}
