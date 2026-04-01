// C3 FIX: In-memory rate limiter for Next.js API routes
// Simple sliding window per IP

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const stores = new Map<string, Map<string, RateLimitEntry>>();

function getStore(name: string): Map<string, RateLimitEntry> {
  if (!stores.has(name)) {
    stores.set(name, new Map());
  }
  return stores.get(name)!;
}

export function rateLimit(
  name: string,
  options: { windowMs: number; max: number }
): (ip: string) => { ok: boolean; remaining: number } {
  const store = getStore(name);

  // Cleanup stale entries every 60s
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
      if (entry.resetAt < now) store.delete(key);
    }
  }, 60_000).unref();

  return (ip: string) => {
    const now = Date.now();
    const entry = store.get(ip);

    if (!entry || entry.resetAt < now) {
      store.set(ip, { count: 1, resetAt: now + options.windowMs });
      return { ok: true, remaining: options.max - 1 };
    }

    entry.count++;
    if (entry.count > options.max) {
      return { ok: false, remaining: 0 };
    }

    return { ok: true, remaining: options.max - entry.count };
  };
}

// Pre-configured limiters
export const authLimiter = rateLimit("auth", { windowMs: 15 * 60 * 1000, max: 10 }); // 10 per 15min
export const bookingLimiter = rateLimit("booking", { windowMs: 60 * 60 * 1000, max: 5 }); // 5 per hour
export const apiLimiter = rateLimit("api", { windowMs: 60 * 1000, max: 60 }); // 60 per minute

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
}
