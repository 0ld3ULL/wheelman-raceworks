import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { getDb } from "./db";

const JWT_SECRET = process.env.JWT_SECRET || "wheelman-dev-secret-change-in-production";
const TOKEN_COOKIE = "wrw_token";

export interface UserPayload {
  id: number;
  email: string;
  name: string;
  role: "user" | "admin";
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function createToken(user: UserPayload): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): UserPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserPayload;
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

export function registerUser(email: string, password: string, name: string, phone?: string): UserPayload {
  const db = getDb();
  const hash = bcrypt.hashSync(password, 12);
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

export function loginUser(email: string, password: string): UserPayload | null {
  const db = getDb();
  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email.toLowerCase()) as {
    id: number;
    email: string;
    name: string;
    password_hash: string;
    role: "user" | "admin";
  } | undefined;

  if (!user) return null;
  if (!bcrypt.compareSync(password, user.password_hash)) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}
