import { NextRequest, NextResponse } from "next/server";
import { registerUser, createToken, isValidEmail } from "@/lib/auth";
import { authLimiter, getClientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  // C3 FIX: Rate limiting
  const ip = getClientIp(req);
  const limit = authLimiter(ip);
  if (!limit.ok) {
    return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }

  // M4 FIX: Handle malformed JSON
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  try {
    const { email, password, name, phone } = body;

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, password, and name are required" }, { status: 400 });
    }

    // H3 FIX: Email validation
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    // H5 FIX: Async bcrypt
    const user = await registerUser(email, password, name, phone);
    const token = createToken(user);

    const response = NextResponse.json({ user });
    response.cookies.set("wrw_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Registration failed";
    if (message.includes("UNIQUE constraint")) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
