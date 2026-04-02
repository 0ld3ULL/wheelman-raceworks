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

    -- Track Week management
    CREATE TABLE IF NOT EXISTS track_weeks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      num_days INTEGER DEFAULT 7,
      status TEXT DEFAULT 'planning' CHECK(status IN ('planning','confirmed','active','completed','cancelled')),
      hotel_name TEXT,
      hotel_cost_per_night INTEGER DEFAULT 0,
      hotel_checkin TEXT,
      hotel_checkout TEXT,
      hotel_booked INTEGER DEFAULT 0,
      hotel_notes TEXT,
      dietary_notes TEXT,
      meal_plan_notes TEXT,
      revenue_cents INTEGER DEFAULT 0,
      notes TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS track_week_days (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      track_week_id INTEGER NOT NULL,
      day_number INTEGER NOT NULL,
      date TEXT NOT NULL,
      day_type TEXT DEFAULT 'off' CHECK(day_type IN ('arrival','track','off','departure')),
      start_time TEXT,
      end_time TEXT,
      notes TEXT,
      FOREIGN KEY (track_week_id) REFERENCES track_weeks(id) ON DELETE CASCADE,
      UNIQUE(track_week_id, day_number)
    );

    CREATE TABLE IF NOT EXISTS track_week_guests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      track_week_id INTEGER NOT NULL,
      booking_id INTEGER,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      needs_pickup INTEGER DEFAULT 0,
      arrival_flight TEXT,
      arrival_datetime TEXT,
      departure_flight TEXT,
      departure_datetime TEXT,
      dietary TEXT,
      notes TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (track_week_id) REFERENCES track_weeks(id) ON DELETE CASCADE,
      FOREIGN KEY (booking_id) REFERENCES bookings(id)
    );

    CREATE TABLE IF NOT EXISTS track_week_costs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      track_week_id INTEGER NOT NULL,
      category TEXT NOT NULL CHECK(category IN ('hotel','food','track_fees','transport','equipment','other')),
      description TEXT NOT NULL,
      amount_cents INTEGER NOT NULL,
      currency TEXT DEFAULT 'USD',
      paid INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (track_week_id) REFERENCES track_weeks(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_track_weeks_status ON track_weeks(status);
    CREATE INDEX IF NOT EXISTS idx_track_weeks_start ON track_weeks(start_date);
    CREATE INDEX IF NOT EXISTS idx_tw_days_week ON track_week_days(track_week_id);
    CREATE INDEX IF NOT EXISTS idx_tw_guests_week ON track_week_guests(track_week_id);
    CREATE INDEX IF NOT EXISTS idx_tw_costs_week ON track_week_costs(track_week_id);
  `);

  // Migrate: add columns if missing
  const cols = db.prepare("PRAGMA table_info(bookings)").all() as { name: string }[];
  if (!cols.some(c => c.name === "completed_at")) {
    db.exec("ALTER TABLE bookings ADD COLUMN completed_at TEXT");
  }
  if (!cols.some(c => c.name === "track_week_options")) {
    db.exec("ALTER TABLE bookings ADD COLUMN track_week_options TEXT");
  }

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
