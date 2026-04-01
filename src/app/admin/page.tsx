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
        {tab === "bookings" && (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const services = JSON.parse(booking.services_json) as { title: string; price_cents: number }[];
              return (
                <div key={booking.id} className="bg-[#0a0e1a] border border-white/5 p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-[family-name:var(--font-display)] text-xl tracking-wider uppercase text-white">
                        {booking.name}
                      </h3>
                      <p className="text-white/40 text-sm">{booking.email} {booking.phone && `| ${booking.phone}`}</p>
                      <p className="text-white/30 text-xs mt-1">Date: {booking.preferred_date} | Booked: {new Date(booking.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-[family-name:var(--font-accent)] tracking-widest uppercase px-2 py-1 border ${
                        booking.status === "pending" ? "text-yellow-400 border-yellow-400/20" :
                        booking.status === "confirmed" ? "text-[var(--gulf-teal)] border-[var(--gulf-teal)]/20" :
                        booking.status === "paid" ? "text-green-400 border-green-400/20" :
                        booking.status === "completed" ? "text-white/40 border-white/10" :
                        "text-red-400 border-red-400/20"
                      }`}>
                        {booking.status}
                      </span>
                      <div className="font-[family-name:var(--font-display)] text-xl text-[var(--gulf-orange)] mt-2">
                        ₱{(booking.total_cents / 100).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-white/30 text-sm mb-3">
                    {services.map((s) => s.title).join(" + ")}
                  </div>
                  {booking.notes && <p className="text-white/20 text-sm italic mb-3">&quot;{booking.notes}&quot;</p>}
                  <div className="flex gap-2">
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
                </div>
              );
            })}
            {bookings.length === 0 && <p className="text-white/30">No bookings yet.</p>}
          </div>
        )}
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
