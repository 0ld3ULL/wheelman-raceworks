import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const db = getDb();

  // Only allow setup if no admins exist
  const adminCount = db.prepare("SELECT COUNT(*) as c FROM users WHERE role = 'admin'").get() as { c: number };
  if (adminCount.c > 0) {
    return NextResponse.json({ error: "Admin already exists" }, { status: 403 });
  }

  const { email, password, name } = await req.json();

  if (!email || !password || !name) {
    return NextResponse.json({ error: "Email, password, and name are required" }, { status: 400 });
  }

  const hash = bcrypt.hashSync(password, 12);
  db.prepare(
    "INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, 'admin')"
  ).run(email.toLowerCase(), hash, name);

  return NextResponse.json({ ok: true, message: "Admin account created" });
}
