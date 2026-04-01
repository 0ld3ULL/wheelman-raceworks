import { NextRequest, NextResponse } from "next/server";
import { loginUser, createToken } from "@/lib/auth";
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
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // H5 FIX: Async bcrypt
    const user = await loginUser(email, password);
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

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
    const message = err instanceof Error ? err.message : "Login failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
