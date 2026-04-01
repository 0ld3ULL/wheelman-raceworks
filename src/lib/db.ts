import Database from "better-sqlite3";
import path from "path";

const DB_PATH = process.env.DB_PATH || path.join(process.cwd(), "data", "wheelman.db");

let db: Database.Database;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    initSchema(db);
  }
  return db;
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      phone TEXT,
      role TEXT DEFAULT 'user' CHECK(role IN ('user', 'admin')),
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      location TEXT NOT NULL,
      description TEXT,
      image TEXT,
      capacity INTEGER DEFAULT 0,
      type TEXT DEFAULT 'meetup' CHECK(type IN ('competition', 'lesson', 'meetup')),
      published INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS rsvps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      event_id INTEGER NOT NULL,
      status TEXT DEFAULT 'confirmed' CHECK(status IN ('confirmed', 'cancelled')),
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (event_id) REFERENCES events(id),
      UNIQUE(user_id, event_id)
    );

    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      price_cents INTEGER NOT NULL,
      currency TEXT DEFAULT 'PHP',
      duration TEXT,
      icon TEXT,
      active INTEGER DEFAULT 1,
      sort_order INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      preferred_date TEXT NOT NULL,
      notes TEXT,
      services_json TEXT NOT NULL,
      total_cents INTEGER NOT NULL,
      currency TEXT DEFAULT 'PHP',
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'confirmed', 'paid', 'completed', 'cancelled')),
      stripe_session_id TEXT,
      stripe_payment_intent TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
    CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(email);
    CREATE INDEX IF NOT EXISTS idx_rsvps_event ON rsvps(event_id);
    CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
  `);

  // Seed services if empty
  const count = db.prepare("SELECT COUNT(*) as c FROM services").get() as { c: number };
  if (count.c === 0) {
    const insert = db.prepare(
      "INSERT INTO services (slug, title, description, price_cents, duration, icon, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)"
    );
    const services = [
      ["drift-beginner", "Drift Lesson — Beginner", "First-timers welcome. Learn throttle control, clutch kick, handbrake entry, and basic drift technique. Includes safety briefing and in-car instruction.", 500000, "Half Day (4 hours)", "🔥", 1],
      ["drift-advanced", "Drift Lesson — Advanced", "Tandem drifting, transitions, and competition-style runs. Must have prior drift experience. One-on-one coaching with Boodie.", 800000, "Full Day (7 hours)", "💨", 2],
      ["race-driving", "Race Driving Course", "Track driving fundamentals — racing lines, braking points, heel-toe, car control at speed. Suitable for enthusiast and amateur racers.", 600000, "Full Day (6 hours)", "🏁", 3],
      ["drift-experience", "Drift Ride-Along Experience", "Be a passenger in Boodie's RX-7 during a full-speed drift session. Not for the faint-hearted. Great gift idea.", 250000, "30 minutes", "🚗", 4],
      ["car-tuning", "Car Tuning Consultation", "Bring your car — suspension geometry, alignment, engine tune review, and setup advice for street or track. Includes dyno time if available.", 350000, "2–3 hours", "⚙️", 5],
      ["race-build", "Race Build Consultation", "Planning a build? Discuss cage design, engine swaps, drivetrain, aero, and competition requirements. Full project scoping and quote.", 200000, "1–2 hours", "🔧", 6],
      ["track-week", "The Track Week — All Inclusive", "7 nights accommodation, 4 full track days on Clark International Speedway, all meals, airport pickup, pro coaching from Boodie, car and equipment provided. Just book your flight to Clark (CRK).", 33594400, "7 nights / 4 track days", "✈️", 0],
    ];
    const insertMany = db.transaction(() => {
      for (const s of services) {
        insert.run(...s);
      }
    });
    insertMany();
  }

  // Seed default admin if no admins exist
  const adminCount = db.prepare("SELECT COUNT(*) as c FROM users WHERE role = 'admin'").get() as { c: number };
  if (adminCount.c === 0) {
    // Will be set up via CLI or first-run
    console.log("[DB] No admin user found. Create one via /api/admin/setup");
  }
}
