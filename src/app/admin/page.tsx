"use client";

import { useAuth } from "@/lib/AuthContext";
import { useState, useEffect, useCallback } from "react";

interface Stats {
  users: number;
  events: number;
  upcomingEvents: number;
  totalBookings: number;
  pendingBookings: number;
  totalRsvps: number;
  revenueCents: number;
}

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image: string;
  capacity: number;
  type: string;
  published: number;
  registered: number;
}

interface Booking {
  id: number;
  name: string;
  email: string;
  phone: string;
  preferred_date: string;
  notes: string;
  services_json: string;
  total_cents: number;
  status: string;
  created_at: string;
}

export default function AdminPage() {
  const { user, loading } = useAuth();
  const [tab, setTab] = useState<"dashboard" | "events" | "bookings">("dashboard");
  const [stats, setStats] = useState<Stats | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showEventForm, setShowEventForm] = useState(false);

  const fetchStats = useCallback(async () => {
    const res = await fetch("/api/admin/stats");
    if (res.ok) {
      const data = await res.json();
      setStats(data.stats);
    }
  }, []);

  const fetchEvents = useCallback(async () => {
    const res = await fetch("/api/admin/events");
    if (res.ok) {
      const data = await res.json();
      setEvents(data.events);
    }
  }, []);

  const fetchBookings = useCallback(async () => {
    const res = await fetch("/api/admin/bookings");
    if (res.ok) {
      const data = await res.json();
      setBookings(data.bookings);
    }
  }, []);

  useEffect(() => {
    if (user?.role === "admin") {
      fetchStats();
      fetchEvents();
      fetchBookings();
    }
  }, [user, fetchStats, fetchEvents, fetchBookings]);

  if (loading) return <div className="pt-24 text-center text-white/40">Loading...</div>;
  if (!user || user.role !== "admin") {
    return (
      <div className="pt-24 pb-20 text-center">
        <h1 className="font-[family-name:var(--font-display)] text-4xl text-white mt-20">Admin Access Required</h1>
        <p className="text-white/40 mt-4">Login with an admin account to access this page.</p>
      </div>
    );
  }

  async function updateBookingStatus(id: number, status: string) {
    await fetch("/api/admin/bookings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    fetchBookings();
    fetchStats();
  }

  async function deleteEvent(id: number) {
    if (!confirm("Delete this event?")) return;
    await fetch("/api/admin/events", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchEvents();
    fetchStats();
  }

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="font-[family-name:var(--font-accent)] text-[var(--gulf-orange)] text-xs tracking-[0.4em] uppercase mb-1">
              Admin Panel
            </p>
            <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl tracking-[0.05em] uppercase text-white">
              Dashboard
            </h1>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-white/10">
          {(["dashboard", "events", "bookings"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`font-[family-name:var(--font-display)] text-lg tracking-[0.12em] uppercase px-6 py-3 border-b-2 transition-colors ${
                tab === t
                  ? "border-[var(--gulf-teal)] text-[var(--gulf-teal)]"
                  : "border-transparent text-white/40 hover:text-white"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Dashboard */}
        {tab === "dashboard" && stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Users", value: stats.users, color: "var(--gulf-teal)" },
              { label: "Events", value: stats.events, color: "var(--gulf-teal)" },
              { label: "Upcoming", value: stats.upcomingEvents, color: "var(--gulf-orange)" },
              { label: "Total RSVPs", value: stats.totalRsvps, color: "var(--gulf-teal)" },
              { label: "Total Bookings", value: stats.totalBookings, color: "var(--gulf-teal)" },
              { label: "Pending", value: stats.pendingBookings, color: "var(--gulf-orange)" },
              { label: "Revenue", value: `₱${(stats.revenueCents / 100).toLocaleString()}`, color: "var(--gulf-teal)" },
            ].map((s) => (
              <div key={s.label} className="bg-[#0a0e1a] border border-white/5 p-6">
                <div className="font-[family-name:var(--font-display)] text-3xl" style={{ color: s.color }}>
                  {s.value}
                </div>
                <div className="text-white/30 text-xs font-[family-name:var(--font-accent)] tracking-widest uppercase mt-1">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Events */}
        {tab === "events" && (
          <div>
            <button onClick={() => setShowEventForm(!showEventForm)} className="btn-primary mb-6">
              {showEventForm ? "Cancel" : "+ New Event"}
            </button>

            {showEventForm && <EventForm onSaved={() => { setShowEventForm(false); fetchEvents(); fetchStats(); }} />}

            <div className="space-y-4">
              {events.map((event) => (
                <div key={event.id} className="bg-[#0a0e1a] border border-white/5 p-6 flex justify-between items-start">
                  <div>
                    <span className={`text-xs font-[family-name:var(--font-accent)] tracking-widest uppercase px-2 py-0.5 border mr-2 ${
                      event.type === "competition" ? "text-red-400 border-red-400/20" :
                      event.type === "lesson" ? "text-[var(--gulf-teal)] border-[var(--gulf-teal)]/20" :
                      "text-[var(--gulf-orange)] border-[var(--gulf-orange)]/20"
                    }`}>
                      {event.type}
                    </span>
                    <h3 className="font-[family-name:var(--font-display)] text-xl tracking-wider uppercase text-white mt-2">
                      {event.title}
                    </h3>
                    <p className="text-white/40 text-sm mt-1">{event.date} | {event.time} | {event.location}</p>
                    <p className="text-white/30 text-sm mt-1">{event.registered} RSVPs / {event.capacity} capacity</p>
                  </div>
                  <button onClick={() => deleteEvent(event.id)} className="text-red-400/50 hover:text-red-400 text-sm">
                    Delete
                  </button>
                </div>
              ))}
              {events.length === 0 && <p className="text-white/30">No events yet.</p>}
            </div>
          </div>
        )}

        {/* Bookings */}
        {tab === "bookings" && (() => {
          const pending = bookings.filter(b => b.status === "pending");
          const booked = bookings.filter(b => b.status === "confirmed").sort((a, b) => a.preferred_date.localeCompare(b.preferred_date));
          const completed = bookings.filter(b => b.status === "completed").sort((a, b) => b.created_at.localeCompare(a.created_at));
          const cancelled = bookings.filter(b => b.status === "cancelled");

          // Calendar: build a map of dates → bookings for confirmed + pending
          const calendarBookings = [...pending, ...booked];
          const dateMap: Record<string, Booking[]> = {};
          calendarBookings.forEach(b => {
            if (!dateMap[b.preferred_date]) dateMap[b.preferred_date] = [];
            dateMap[b.preferred_date].push(b);
          });
          const today = new Date();
          const calendarDays: Date[] = [];
          for (let i = 0; i < 28; i++) {
            const d = new Date(today);
            d.setDate(d.getDate() + i);
            calendarDays.push(d);
          }

          function BookingCard({ booking, showActions }: { booking: Booking; showActions?: boolean }) {
            const services = JSON.parse(booking.services_json) as { title: string; price_cents: number }[];
            return (
              <div className="bg-[#0a0e1a] border border-white/5 p-5">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-[family-name:var(--font-display)] text-lg tracking-wider uppercase text-white">
                      {booking.name}
                    </h3>
                    <p className="text-white/40 text-xs">{booking.email} {booking.phone && `| ${booking.phone}`}</p>
                  </div>
                  <div className="font-[family-name:var(--font-display)] text-lg text-[var(--gulf-orange)]">
                    ₱{(booking.total_cents / 100).toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-white/30 mb-2">
                  <span>📅 {booking.preferred_date}</span>
                  <span>🕐 Submitted {new Date(booking.created_at).toLocaleDateString()}</span>
                </div>
                <div className="text-white/30 text-sm mb-2">
                  {services.map((s) => s.title).join(" + ")}
                </div>
                {booking.notes && <p className="text-white/20 text-xs italic mb-2">&quot;{booking.notes}&quot;</p>}
                {showActions && (
                  <div className="flex gap-2 mt-3">
                    {booking.status === "pending" && (
                      <>
                        <button onClick={() => updateBookingStatus(booking.id, "confirmed")} className="btn-primary text-xs py-1 px-4">Confirm</button>
                        <button onClick={() => updateBookingStatus(booking.id, "cancelled")} className="btn-secondary text-xs py-1 px-4">Cancel</button>
                      </>
                    )}
                    {booking.status === "confirmed" && (
                      <button onClick={() => updateBookingStatus(booking.id, "completed")} className="btn-primary text-xs py-1 px-4">Mark Completed</button>
                    )}
                  </div>
                )}
              </div>
            );
          }

          return (
            <div className="space-y-10">
              {/* Calendar — next 4 weeks */}
              <div>
                <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-[0.1em] uppercase text-white mb-4">
                  Calendar
                </h2>
                <div className="grid grid-cols-7 gap-1">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                    <div key={d} className="text-center text-white/30 text-xs font-[family-name:var(--font-accent)] tracking-widest uppercase py-2">{d}</div>
                  ))}
                  {/* Leading empty cells to align first day */}
                  {Array.from({ length: calendarDays[0].getDay() }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}
                  {calendarDays.map(day => {
                    const dateStr = day.toISOString().split("T")[0];
                    const dayBookings = dateMap[dateStr] || [];
                    const isToday = dateStr === today.toISOString().split("T")[0];
                    return (
                      <div
                        key={dateStr}
                        className={`min-h-[60px] p-1.5 border text-xs ${
                          isToday ? "border-[var(--gulf-teal)]/40 bg-[var(--gulf-teal)]/5" :
                          dayBookings.length > 0 ? "border-[var(--gulf-orange)]/30 bg-[var(--gulf-orange)]/5" :
                          "border-white/5 bg-[#0a0e1a]"
                        }`}
                      >
                        <div className={`font-[family-name:var(--font-accent)] text-[10px] tracking-wider ${isToday ? "text-[var(--gulf-teal)]" : "text-white/40"}`}>
                          {day.getDate()}
                        </div>
                        {dayBookings.map(b => (
                          <div key={b.id} className={`mt-0.5 truncate text-[10px] px-1 py-0.5 ${
                            b.status === "pending" ? "bg-yellow-400/10 text-yellow-400" : "bg-[var(--gulf-teal)]/10 text-[var(--gulf-teal)]"
                          }`}>
                            {b.name.split(" ")[0]}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pending — needs action */}
              {pending.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-[0.1em] uppercase text-yellow-400">
                      Pending
                    </h2>
                    <span className="text-xs font-[family-name:var(--font-accent)] tracking-widest text-yellow-400/60 border border-yellow-400/20 px-2 py-0.5">
                      {pending.length} AWAITING
                    </span>
                  </div>
                  <div className="space-y-3">
                    {pending.map(b => <BookingCard key={b.id} booking={b} showActions />)}
                  </div>
                </div>
              )}

              {/* Booked — confirmed, upcoming */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-[0.1em] uppercase text-[var(--gulf-teal)]">
                    Booked
                  </h2>
                  <span className="text-xs font-[family-name:var(--font-accent)] tracking-widest text-[var(--gulf-teal)]/60 border border-[var(--gulf-teal)]/20 px-2 py-0.5">
                    {booked.length} UPCOMING
                  </span>
                </div>
                {booked.length === 0 ? (
                  <p className="text-white/30 text-sm">No upcoming bookings.</p>
                ) : (
                  <div className="space-y-3">
                    {booked.map(b => <BookingCard key={b.id} booking={b} showActions />)}
                  </div>
                )}
              </div>

              {/* Completed */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-[0.1em] uppercase text-white/40">
                    Completed
                  </h2>
                  <span className="text-xs font-[family-name:var(--font-accent)] tracking-widest text-white/20 border border-white/10 px-2 py-0.5">
                    {completed.length} DONE
                  </span>
                </div>
                {completed.length === 0 ? (
                  <p className="text-white/30 text-sm">No completed bookings yet.</p>
                ) : (
                  <div className="space-y-3">
                    {completed.map(b => <BookingCard key={b.id} booking={b} />)}
                  </div>
                )}
              </div>

              {/* Cancelled (collapsed) */}
              {cancelled.length > 0 && (
                <div>
                  <h2 className="font-[family-name:var(--font-display)] text-lg tracking-[0.1em] uppercase text-red-400/40 mb-3">
                    Cancelled ({cancelled.length})
                  </h2>
                  <div className="space-y-2 opacity-50">
                    {cancelled.map(b => <BookingCard key={b.id} booking={b} />)}
                  </div>
                </div>
              )}
            </div>
          );
        })()}
      </div>
    </div>
  );
}

function EventForm({ onSaved }: { onSaved: () => void }) {
  const [form, setForm] = useState({
    title: "",
    date: "",
    time: "",
    location: "Clark International Speedway, Mabalacat",
    description: "",
    capacity: 50,
    type: "meetup",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) onSaved();
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#0a0e1a] border border-white/5 p-6 mb-6 space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-white/30 text-xs font-[family-name:var(--font-accent)] tracking-widest uppercase mb-1">Title</label>
          <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full bg-[#050811] border border-white/10 px-4 py-3 text-white focus:border-[var(--gulf-teal)] focus:outline-none" />
        </div>
        <div>
          <label className="block text-white/30 text-xs font-[family-name:var(--font-accent)] tracking-widest uppercase mb-1">Type</label>
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full bg-[#050811] border border-white/10 px-4 py-3 text-white focus:border-[var(--gulf-teal)] focus:outline-none">
            <option value="competition">Competition</option>
            <option value="lesson">Lesson</option>
            <option value="meetup">Meetup</option>
          </select>
        </div>
        <div>
          <label className="block text-white/30 text-xs font-[family-name:var(--font-accent)] tracking-widest uppercase mb-1">Date</label>
          <input type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full bg-[#050811] border border-white/10 px-4 py-3 text-white focus:border-[var(--gulf-teal)] focus:outline-none" />
        </div>
        <div>
          <label className="block text-white/30 text-xs font-[family-name:var(--font-accent)] tracking-widest uppercase mb-1">Time</label>
          <input required value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} placeholder="9:00 AM - 5:00 PM" className="w-full bg-[#050811] border border-white/10 px-4 py-3 text-white focus:border-[var(--gulf-teal)] focus:outline-none" />
        </div>
        <div>
          <label className="block text-white/30 text-xs font-[family-name:var(--font-accent)] tracking-widest uppercase mb-1">Location</label>
          <input required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full bg-[#050811] border border-white/10 px-4 py-3 text-white focus:border-[var(--gulf-teal)] focus:outline-none" />
        </div>
        <div>
          <label className="block text-white/30 text-xs font-[family-name:var(--font-accent)] tracking-widest uppercase mb-1">Capacity</label>
          <input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: parseInt(e.target.value) })} className="w-full bg-[#050811] border border-white/10 px-4 py-3 text-white focus:border-[var(--gulf-teal)] focus:outline-none" />
        </div>
      </div>
      <div>
        <label className="block text-white/30 text-xs font-[family-name:var(--font-accent)] tracking-widest uppercase mb-1">Description</label>
        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full bg-[#050811] border border-white/10 px-4 py-3 text-white focus:border-[var(--gulf-teal)] focus:outline-none resize-none" />
      </div>
      <button type="submit" className="btn-primary">Create Event</button>
    </form>
  );
}
