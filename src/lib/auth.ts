import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { getDb } from "./db";

// C1 FIX: Crash if JWT_SECRET not set — no fallback
function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("FATAL: JWT_SECRET environment variable is not set. Cannot start.");
  }
  return secret;
}

const TOKEN_COOKIE = "wrw_token";

export interface UserPayload {
  id: number;
  email: string;
  name: string;
  role: "user" | "admin";
}

// H3 FIX: Email validation
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function createToken(user: UserPayload): string {
  return jwt.sign(user, getJwtSecret(), { expiresIn: "7d" });
}

export function verifyToken(token: string): UserPayload | null {
  try {
    return jwt.verify(token, getJwtSecret()) as UserPayload;
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<UserPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function requireAdmin(): Promise<UserPayload> {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    throw new Error("Unauthorized");
  }
  return user;
}

// H5 FIX: Async bcrypt — non-blocking
export async function registerUser(email: string, password: string, name: string, phone?: string): Promise<UserPayload> {
  const db = getDb();
  const hash = await bcrypt.hash(password, 12);
  const result = db.prepare(
    "INSERT INTO users (email, password_hash, name, phone) VALUES (?, ?, ?, ?)"
  ).run(email.toLowerCase(), hash, name, phone || null);

  return {
    id: result.lastInsertRowid as number,
    email: email.toLowerCase(),
    name,
    role: "user",
  };
}

export async function loginUser(email: string, password: string): Promise<UserPayload | null> {
  const db = getDb();
  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email.toLowerCase()) as {
    id: number;
    email: string;
    name: string;
    password_hash: string;
    role: "user" | "admin";
  } | undefined;

  if (!user) return null;
  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}
