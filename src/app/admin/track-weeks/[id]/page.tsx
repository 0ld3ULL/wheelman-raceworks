"use client";

import { useAuth } from "@/lib/AuthContext";
import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface TrackWeek {
  id: number; title: string; start_date: string; end_date: string; num_days: number; status: string;
  hotel_name: string | null; hotel_cost_per_night: number; hotel_checkin: string | null; hotel_checkout: string | null;
  hotel_booked: number; hotel_notes: string | null; dietary_notes: string | null; meal_plan_notes: string | null;
  revenue_cents: number; notes: string | null;
}
interface Day { id: number; day_number: number; date: string; day_type: string; start_time: string | null; end_time: string | null; notes: string | null; }
interface Guest {
  id: number; name: string; email: string | null; phone: string | null; needs_pickup: number;
  arrival_flight: string | null; arrival_datetime: string | null; departure_flight: string | null; departure_datetime: string | null;
  dietary: string | null; notes: string | null; booking_id: number | null;
}
interface Cost { id: number; category: string; description: string; amount_cents: number; currency: string; paid: number; }

const DAY_TYPES = ["arrival", "track", "off", "departure"];
const COST_CATEGORIES = ["hotel", "food", "track_fees", "transport", "equipment", "other"];
const STATUS_OPTIONS = ["planning", "confirmed", "active", "completed", "cancelled"];

export default function TrackWeekDetailPage() {
  const { user, loading: authLoading } = useAuth();
  const params = useParams<{ id: string }>();
  const twId = params.id;

  const [tw, setTw] = useState<TrackWeek | null>(null);
  const [days, setDays] = useState<Day[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [costs, setCosts] = useState<Cost[]>([]);
  const [saved, setSaved] = useState("");

  const fetchAll = useCallback(async () => {
    const res = await fetch(`/api/admin/track-weeks/${twId}`);
    if (res.ok) {
      const data = await res.json();
      setTw(data.trackWeek);
      setDays(data.days);
      setGuests(data.guests);
      setCosts(data.costs);
    }
  }, [twId]);

  useEffect(() => { if (user?.role === "admin") fetchAll(); }, [user, fetchAll]);

  function flash(msg: string) { setSaved(msg); setTimeout(() => setSaved(""), 1500); }

  async function updateTw(fields: Record<string, unknown>) {
    await fetch(`/api/admin/track-weeks/${twId}`, {
      method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(fields),
    });
    flash("Saved"); fetchAll();
  }

  async function updateDay(day_id: number, fields: Record<string, unknown>) {
    await fetch(`/api/admin/track-weeks/${twId}/days`, {
      method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ day_id, ...fields }),
    });
    flash("Saved"); fetchAll();
  }

  // Guest CRUD
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [guestForm, setGuestForm] = useState({ name: "", email: "", phone: "", needs_pickup: false, arrival_flight: "", arrival_datetime: "", departure_flight: "", departure_datetime: "", dietary: "", notes: "" });
  const [editingGuest, setEditingGuest] = useState<number | null>(null);

  async function saveGuest(e: React.FormEvent) {
    e.preventDefault();
    if (editingGuest) {
      await fetch(`/api/admin/track-weeks/${twId}/guests`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guest_id: editingGuest, ...guestForm }),
      });
    } else {
      await fetch(`/api/admin/track-weeks/${twId}/guests`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(guestForm),
      });
    }
    setShowGuestForm(false); setEditingGuest(null);
    setGuestForm({ name: "", email: "", phone: "", needs_pickup: false, arrival_flight: "", arrival_datetime: "", departure_flight: "", departure_datetime: "", dietary: "", notes: "" });
    flash("Guest saved"); fetchAll();
  }

  async function deleteGuest(guest_id: number) {
    if (!confirm("Remove this guest?")) return;
    await fetch(`/api/admin/track-weeks/${twId}/guests`, {
      method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ guest_id }),
    });
    flash("Guest removed"); fetchAll();
  }

  function editGuest(g: Guest) {
    setEditingGuest(g.id);
    setGuestForm({
      name: g.name, email: g.email || "", phone: g.phone || "", needs_pickup: !!g.needs_pickup,
      arrival_flight: g.arrival_flight || "", arrival_datetime: g.arrival_datetime || "",
      departure_flight: g.departure_flight || "", departure_datetime: g.departure_datetime || "",
      dietary: g.dietary || "", notes: g.notes || "",
    });
    setShowGuestForm(true);
  }

  // Cost CRUD
  const [showCostForm, setShowCostForm] = useState(false);
  const [costForm, setCostForm] = useState({ category: "hotel", description: "", amount: 0 });

  async function saveCost(e: React.FormEvent) {
    e.preventDefault();
    await fetch(`/api/admin/track-weeks/${twId}/costs`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category: costForm.category, description: costForm.description, amount_cents: Math.round(costForm.amount * 100) }),
    });
    setShowCostForm(false);
    setCostForm({ category: "hotel", description: "", amount: 0 });
    flash("Cost added"); fetchAll();
  }

  async function toggleCostPaid(cost_id: number, currentPaid: number) {
    await fetch(`/api/admin/track-weeks/${twId}/costs`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cost_id, paid: currentPaid ? 0 : 1 }),
    });
    fetchAll();
  }

  async function deleteCost(cost_id: number) {
    if (!confirm("Remove this cost?")) return;
    await fetch(`/api/admin/track-weeks/${twId}/costs`, {
      method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ cost_id }),
    });
    flash("Cost removed"); fetchAll();
  }

  if (authLoading) return <div className="pt-24 text-center text-white/40">Loading...</div>;
  if (!user || user.role !== "admin") return <div className="pt-24 text-center text-white">Admin access required</div>;
  if (!tw) return <div className="pt-24 text-center text-white/40">Loading track week...</div>;

  const totalCosts = costs.reduce((s, c) => s + c.amount_cents, 0);
  const profit = tw.revenue_cents - totalCosts;
  const dayLabel = (d: string) => new Date(d + "T12:00:00").toLocaleDateString("en", { weekday: "short", month: "short", day: "numeric" });

  const inputCls = "w-full bg-[#050811] border border-white/10 px-3 py-2 text-white text-sm focus:border-[var(--gulf-teal)] focus:outline-none";
  const labelCls = "block text-white/30 text-[10px] font-[family-name:var(--font-accent)] tracking-widest uppercase mb-1";
  const sectionCls = "bg-[#0a0e1a] border border-white/5 p-5 sm:p-6";

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Back + saved indicator */}
        <div className="flex items-center justify-between mb-2">
          <Link href="/admin/track-weeks" className="text-white/30 hover:text-white text-sm">&larr; Track Weeks</Link>
          {saved && <span className="text-[var(--gulf-teal)] text-xs font-[family-name:var(--font-accent)] tracking-widest animate-pulse">{saved}</span>}
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <p className="font-[family-name:var(--font-accent)] text-[var(--gulf-orange)] text-xs tracking-[0.4em] uppercase mb-1">
              Track Week
            </p>
            <h1 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl tracking-[0.05em] uppercase text-white">
              {tw.title}
            </h1>
            <p className="text-white/40 text-sm mt-1">{tw.start_date} — {tw.end_date} &nbsp;|&nbsp; {tw.num_days} days</p>
          </div>
          <select value={tw.status} onChange={(e) => updateTw({ status: e.target.value })}
            className="bg-[#050811] border border-white/10 px-4 py-2 text-white text-sm font-[family-name:var(--font-accent)] tracking-widest uppercase focus:outline-none">
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="space-y-8">
          {/* ═══ SCHEDULE ═══ */}
          <div className={sectionCls}>
            <h2 className="font-[family-name:var(--font-display)] text-xl tracking-[0.1em] uppercase text-[var(--gulf-teal)] mb-4">Schedule</h2>
            <div className="space-y-2">
              {days.map((day) => (
                <div key={day.id} className="grid grid-cols-[auto_1fr_auto_auto_1fr] sm:grid-cols-[50px_120px_110px_80px_80px_1fr] gap-2 items-center">
                  <span className="text-white/20 text-xs font-[family-name:var(--font-accent)] tracking-wider">D{day.day_number}</span>
                  <span className="text-white/40 text-xs">{dayLabel(day.date)}</span>
                  <select value={day.day_type} onChange={(e) => updateDay(day.id, { day_type: e.target.value })}
                    className={`bg-[#050811] border border-white/10 px-2 py-1.5 text-xs text-white focus:outline-none ${
                      day.day_type === "track" ? "border-[var(--gulf-teal)]/30" : ""
                    }`}>
                    {DAY_TYPES.map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
                  </select>
                  {day.day_type === "track" ? (
                    <>
                      <input type="time" value={day.start_time || "09:00"} onChange={(e) => updateDay(day.id, { start_time: e.target.value })}
                        className="bg-[#050811] border border-white/10 px-2 py-1.5 text-xs text-white focus:outline-none" />
                      <input type="time" value={day.end_time || "17:00"} onChange={(e) => updateDay(day.id, { end_time: e.target.value })}
                        className="bg-[#050811] border border-white/10 px-2 py-1.5 text-xs text-white focus:outline-none" />
                    </>
                  ) : (
                    <input key={`dn-${day.id}-${day.notes}`} defaultValue={day.notes || ""} placeholder={day.day_type === "off" ? "e.g. Fishing trip" : ""}
                      onBlur={(e) => updateDay(day.id, { notes: e.target.value })}
                      onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
                      className="bg-[#050811] border border-white/10 px-2 py-1.5 text-xs text-white/50 focus:outline-none col-span-2" />
                  )}
                  {day.day_type === "track" && (
                    <input key={`tn-${day.id}-${day.notes}`} defaultValue={day.notes || ""} placeholder="Notes..."
                      onBlur={(e) => updateDay(day.id, { notes: e.target.value })}
                      onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
                      className="bg-transparent border-none px-0 py-1.5 text-xs text-white/30 focus:outline-none" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ═══ GUESTS ═══ */}
          <div className={sectionCls}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-[family-name:var(--font-display)] text-xl tracking-[0.1em] uppercase text-[var(--gulf-teal)]">
                Guests ({guests.length})
              </h2>
              <button onClick={() => { setShowGuestForm(!showGuestForm); setEditingGuest(null); setGuestForm({ name: "", email: "", phone: "", needs_pickup: false, arrival_flight: "", arrival_datetime: "", departure_flight: "", departure_datetime: "", dietary: "", notes: "" }); }}
                className="btn-secondary text-xs py-1 px-4">
                {showGuestForm ? "Cancel" : "+ Add Guest"}
              </button>
            </div>

            {showGuestForm && (
              <form onSubmit={saveGuest} className="border border-white/10 p-4 mb-4 space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div><label className={labelCls}>Name</label><input required value={guestForm.name} onChange={(e) => setGuestForm({ ...guestForm, name: e.target.value })} className={inputCls} /></div>
                  <div><label className={labelCls}>Email</label><input value={guestForm.email} onChange={(e) => setGuestForm({ ...guestForm, email: e.target.value })} className={inputCls} /></div>
                  <div><label className={labelCls}>Phone</label><input value={guestForm.phone} onChange={(e) => setGuestForm({ ...guestForm, phone: e.target.value })} className={inputCls} /></div>
                  <div><label className={labelCls}>Arrival Flight</label><input value={guestForm.arrival_flight} onChange={(e) => setGuestForm({ ...guestForm, arrival_flight: e.target.value })} placeholder="CX 905" className={inputCls} /></div>
                  <div><label className={labelCls}>Arrival Date/Time</label><input type="datetime-local" value={guestForm.arrival_datetime} onChange={(e) => setGuestForm({ ...guestForm, arrival_datetime: e.target.value })} className={inputCls} /></div>
                  <div><label className={labelCls}>Departure Flight</label><input value={guestForm.departure_flight} onChange={(e) => setGuestForm({ ...guestForm, departure_flight: e.target.value })} className={inputCls} /></div>
                  <div><label className={labelCls}>Departure Date/Time</label><input type="datetime-local" value={guestForm.departure_datetime} onChange={(e) => setGuestForm({ ...guestForm, departure_datetime: e.target.value })} className={inputCls} /></div>
                  <div><label className={labelCls}>Dietary</label><input value={guestForm.dietary} onChange={(e) => setGuestForm({ ...guestForm, dietary: e.target.value })} placeholder="No shellfish" className={inputCls} /></div>
                  <div className="flex items-end pb-1">
                    <label className="flex items-center gap-2 text-white/50 text-sm cursor-pointer">
                      <input type="checkbox" checked={guestForm.needs_pickup} onChange={(e) => setGuestForm({ ...guestForm, needs_pickup: e.target.checked })} className="accent-[var(--gulf-teal)]" />
                      Airport pickup
                    </label>
                  </div>
                </div>
                <div><label className={labelCls}>Notes</label><input value={guestForm.notes} onChange={(e) => setGuestForm({ ...guestForm, notes: e.target.value })} className={inputCls} /></div>
                <button type="submit" className="btn-primary text-xs py-1 px-4">{editingGuest ? "Update Guest" : "Add Guest"}</button>
              </form>
            )}

            <div className="space-y-3">
              {guests.map((g) => (
                <div key={g.id} className="border border-white/5 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-[family-name:var(--font-display)] text-lg tracking-wider uppercase text-white">{g.name}</h4>
                      <p className="text-white/40 text-xs">{g.email} {g.phone && `| ${g.phone}`}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => editGuest(g)} className="text-[var(--gulf-teal)] text-xs hover:underline">Edit</button>
                      <button onClick={() => deleteGuest(g.id)} className="text-red-400/50 hover:text-red-400 text-xs">Remove</button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-white/30">
                    {g.needs_pickup ? <span className="text-[var(--gulf-teal)]">🚐 Pickup: YES</span> : <span>🚐 Pickup: No</span>}
                    {g.arrival_flight && <span>✈️ In: {g.arrival_flight} {g.arrival_datetime && new Date(g.arrival_datetime).toLocaleString("en", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>}
                    {g.departure_flight && <span>✈️ Out: {g.departure_flight} {g.departure_datetime && new Date(g.departure_datetime).toLocaleString("en", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>}
                    {g.dietary && <span>🍽️ {g.dietary}</span>}
                  </div>
                  {g.notes && <p className="text-white/20 text-xs mt-2 italic">{g.notes}</p>}
                </div>
              ))}
              {guests.length === 0 && <p className="text-white/30 text-sm">No guests added yet.</p>}
            </div>
          </div>

          {/* ═══ HOTEL ═══ */}
          <div className={sectionCls}>
            <h2 className="font-[family-name:var(--font-display)] text-xl tracking-[0.1em] uppercase text-[var(--gulf-teal)] mb-4">Hotel</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>Hotel Name</label>
                <input key={`hn-${tw.hotel_name}`} defaultValue={tw.hotel_name || ""} onBlur={(e) => updateTw({ hotel_name: e.target.value })}
                  placeholder="Quest Hotel Clark" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Cost/Night (USD)</label>
                <input type="number" key={`hc-${tw.hotel_cost_per_night}`} defaultValue={tw.hotel_cost_per_night / 100 || ""} onBlur={(e) => updateTw({ hotel_cost_per_night: Math.round(parseFloat(e.target.value || "0") * 100) })}
                  placeholder="45" className={inputCls} />
              </div>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 text-white/50 text-sm cursor-pointer">
                  <input type="checkbox" checked={!!tw.hotel_booked} onChange={(e) => updateTw({ hotel_booked: e.target.checked ? 1 : 0 })} className="accent-[var(--gulf-teal)]" />
                  Rooms Booked
                </label>
              </div>
              <div>
                <label className={labelCls}>Check-in</label>
                <input type="date" value={tw.hotel_checkin || ""} onChange={(e) => updateTw({ hotel_checkin: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Check-out</label>
                <input type="date" value={tw.hotel_checkout || ""} onChange={(e) => updateTw({ hotel_checkout: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Hotel Notes</label>
                <input key={`hnt-${tw.hotel_notes}`} defaultValue={tw.hotel_notes || ""} onBlur={(e) => updateTw({ hotel_notes: e.target.value })}
                  className={inputCls} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className={labelCls}>Dietary Notes (Group)</label>
                <input key={`diet-${tw.dietary_notes}`} defaultValue={tw.dietary_notes || ""} onBlur={(e) => updateTw({ dietary_notes: e.target.value })}
                  placeholder="No pork for guest 2" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Meal Plan Notes</label>
                <input key={`meal-${tw.meal_plan_notes}`} defaultValue={tw.meal_plan_notes || ""} onBlur={(e) => updateTw({ meal_plan_notes: e.target.value })}
                  placeholder="Breakfast at hotel, lunch at track" className={inputCls} />
              </div>
            </div>
          </div>

          {/* ═══ COSTS ═══ */}
          <div className={sectionCls}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-[family-name:var(--font-display)] text-xl tracking-[0.1em] uppercase text-[var(--gulf-teal)]">Costs</h2>
              <button onClick={() => setShowCostForm(!showCostForm)} className="btn-secondary text-xs py-1 px-4">
                {showCostForm ? "Cancel" : "+ Add Expense"}
              </button>
            </div>

            {showCostForm && (
              <form onSubmit={saveCost} className="border border-white/10 p-4 mb-4 grid grid-cols-3 gap-3 items-end">
                <div>
                  <label className={labelCls}>Category</label>
                  <select value={costForm.category} onChange={(e) => setCostForm({ ...costForm, category: e.target.value })} className={inputCls}>
                    {COST_CATEGORIES.map(c => <option key={c} value={c}>{c.replace("_", " ")}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Description</label>
                  <input required value={costForm.description} onChange={(e) => setCostForm({ ...costForm, description: e.target.value })} placeholder="Hotel 7 nights" className={inputCls} />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className={labelCls}>Amount (USD)</label>
                    <input type="number" required min={0} step={0.01} value={costForm.amount || ""} onChange={(e) => setCostForm({ ...costForm, amount: parseFloat(e.target.value) || 0 })} className={inputCls} />
                  </div>
                  <button type="submit" className="btn-primary text-xs py-2 px-3 self-end">Add</button>
                </div>
              </form>
            )}

            {/* Summary */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="font-[family-name:var(--font-display)] text-2xl text-[var(--gulf-teal)]">${(tw.revenue_cents / 100).toLocaleString()}</div>
                <div className="text-white/30 text-[10px] font-[family-name:var(--font-accent)] tracking-widest uppercase">Revenue</div>
              </div>
              <div className="text-center">
                <div className="font-[family-name:var(--font-display)] text-2xl text-[var(--gulf-orange)]">${(totalCosts / 100).toLocaleString()}</div>
                <div className="text-white/30 text-[10px] font-[family-name:var(--font-accent)] tracking-widest uppercase">Costs</div>
              </div>
              <div className="text-center">
                <div className={`font-[family-name:var(--font-display)] text-2xl ${profit >= 0 ? "text-[var(--gulf-teal)]" : "text-red-400"}`}>${(profit / 100).toLocaleString()}</div>
                <div className="text-white/30 text-[10px] font-[family-name:var(--font-accent)] tracking-widest uppercase">Profit</div>
              </div>
            </div>

            {/* Line items */}
            <div className="space-y-1">
              {costs.map((c) => (
                <div key={c.id} className="flex items-center justify-between text-sm py-1.5 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <button onClick={() => toggleCostPaid(c.id, c.paid)}
                      className={`w-4 h-4 border flex items-center justify-center ${c.paid ? "border-[var(--gulf-teal)] bg-[var(--gulf-teal)]" : "border-white/20"}`}>
                      {c.paid ? <span className="text-white text-[10px]">✓</span> : null}
                    </button>
                    <span className="text-white/20 text-xs uppercase w-20">{c.category.replace("_", " ")}</span>
                    <span className={c.paid ? "text-white/40 line-through" : "text-white/60"}>{c.description}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[var(--gulf-orange)] font-[family-name:var(--font-accent)] tracking-wider">${(c.amount_cents / 100).toLocaleString()}</span>
                    <button onClick={() => deleteCost(c.id)} className="text-red-400/30 hover:text-red-400 text-xs">×</button>
                  </div>
                </div>
              ))}
              {costs.length === 0 && <p className="text-white/30 text-sm">No costs tracked yet.</p>}
            </div>
          </div>

          {/* ═══ NOTES ═══ */}
          <div className={sectionCls}>
            <h2 className="font-[family-name:var(--font-display)] text-xl tracking-[0.1em] uppercase text-[var(--gulf-teal)] mb-4">Notes</h2>
            <textarea key={`notes-${tw.notes}`} defaultValue={tw.notes || ""} onBlur={(e) => updateTw({ notes: e.target.value })}
              rows={4} placeholder="General notes about this Track Week..."
              className="w-full bg-[#050811] border border-white/10 px-4 py-3 text-white text-sm focus:border-[var(--gulf-teal)] focus:outline-none resize-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
