"use client";

import { useAuth } from "@/lib/AuthContext";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface TrackWeek {
  id: number;
  title: string;
  start_date: string;
  end_date: string;
  num_days: number;
  status: string;
  revenue_cents: number;
  guest_count: number;
  total_costs_cents: number;
  hotel_name: string | null;
  hotel_booked: number;
}

const STATUS_COLORS: Record<string, string> = {
  planning: "text-yellow-400 border-yellow-400/20",
  confirmed: "text-[var(--gulf-teal)] border-[var(--gulf-teal)]/20",
  active: "text-green-400 border-green-400/20",
  completed: "text-white/40 border-white/10",
  cancelled: "text-red-400 border-red-400/20",
};

export default function TrackWeeksPage() {
  const { user, loading } = useAuth();
  const [trackWeeks, setTrackWeeks] = useState<TrackWeek[]>([]);
  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", start_date: "", num_days: 7, revenue_cents: 0 });

  const fetchTrackWeeks = useCallback(async () => {
    const url = filter === "all" ? "/api/admin/track-weeks" : `/api/admin/track-weeks?status=${filter}`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      setTrackWeeks(data.trackWeeks || []);
    }
  }, [filter]);

  useEffect(() => {
    if (user?.role === "admin") fetchTrackWeeks();
  }, [user, fetchTrackWeeks]);

  if (loading) return <div className="pt-24 text-center text-white/40">Loading...</div>;
  if (!user || user.role !== "admin") {
    return (
      <div className="pt-24 pb-20 text-center">
        <h1 className="font-[family-name:var(--font-display)] text-4xl text-white mt-20">Admin Access Required</h1>
      </div>
    );
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/track-weeks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        start_date: form.start_date,
        num_days: form.num_days,
        revenue_cents: Math.round(form.revenue_cents * 100),
      }),
    });
    if (res.ok) {
      setShowForm(false);
      setForm({ title: "", start_date: "", num_days: 7, revenue_cents: 0 });
      fetchTrackWeeks();
    }
  }

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <Link href="/admin" className="text-white/30 hover:text-white text-sm">&larr; Admin</Link>
        </div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="font-[family-name:var(--font-accent)] text-[var(--gulf-orange)] text-xs tracking-[0.4em] uppercase mb-1">
              Logistics
            </p>
            <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl tracking-[0.05em] uppercase text-white">
              Track Weeks
            </h1>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            {showForm ? "Cancel" : "+ New Track Week"}
          </button>
        </div>

        {/* New Track Week Form */}
        {showForm && (
          <form onSubmit={handleCreate} className="bg-[#0a0e1a] border border-white/5 p-6 mb-8 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/30 text-xs font-[family-name:var(--font-accent)] tracking-widest uppercase mb-1">Title</label>
                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Mike's Group — Apr 2026"
                  className="w-full bg-[#050811] border border-white/10 px-4 py-3 text-white focus:border-[var(--gulf-teal)] focus:outline-none" />
              </div>
              <div>
                <label className="block text-white/30 text-xs font-[family-name:var(--font-accent)] tracking-widest uppercase mb-1">Start Date</label>
                <input type="date" required value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                  className="w-full bg-[#050811] border border-white/10 px-4 py-3 text-white focus:border-[var(--gulf-teal)] focus:outline-none" />
              </div>
              <div>
                <label className="block text-white/30 text-xs font-[family-name:var(--font-accent)] tracking-widest uppercase mb-1">Number of Days</label>
                <input type="number" min={3} max={30} value={form.num_days} onChange={(e) => setForm({ ...form, num_days: parseInt(e.target.value) || 7 })}
                  className="w-full bg-[#050811] border border-white/10 px-4 py-3 text-white focus:border-[var(--gulf-teal)] focus:outline-none" />
              </div>
              <div>
                <label className="block text-white/30 text-xs font-[family-name:var(--font-accent)] tracking-widest uppercase mb-1">Revenue (USD)</label>
                <input type="number" min={0} step={1} value={form.revenue_cents} onChange={(e) => setForm({ ...form, revenue_cents: parseFloat(e.target.value) || 0 })}
                  placeholder="5999"
                  className="w-full bg-[#050811] border border-white/10 px-4 py-3 text-white focus:border-[var(--gulf-teal)] focus:outline-none" />
              </div>
            </div>
            <button type="submit" className="btn-primary">Create Track Week</button>
          </form>
        )}

        {/* Status Filter */}
        <div className="flex gap-1 mb-6 flex-wrap">
          {["all", "planning", "confirmed", "active", "completed"].map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={`font-[family-name:var(--font-display)] text-sm tracking-[0.12em] uppercase px-4 py-2 border transition-all ${
                filter === s
                  ? "bg-[var(--gulf-teal)] border-[var(--gulf-teal)] text-white"
                  : "bg-transparent border-white/10 text-white/40 hover:text-white hover:border-white/30"
              }`}>
              {s}
            </button>
          ))}
        </div>

        {/* Track Week Cards */}
        <div className="space-y-4">
          {trackWeeks.map((tw) => {
            const profit = tw.revenue_cents - tw.total_costs_cents;
            return (
              <Link key={tw.id} href={`/admin/track-weeks/${tw.id}`}>
                <div className="bg-[#0a0e1a] border border-white/5 p-6 hover:border-[var(--gulf-teal)]/30 transition-colors cursor-pointer mb-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-[family-name:var(--font-display)] text-xl tracking-wider uppercase text-white">
                        ✈️ {tw.title}
                      </h3>
                      <p className="text-white/40 text-sm mt-1">
                        {tw.start_date} — {tw.end_date} &nbsp;|&nbsp; {tw.num_days} days &nbsp;|&nbsp; {tw.guest_count} guest{tw.guest_count !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <span className={`text-xs font-[family-name:var(--font-accent)] tracking-widest uppercase px-2 py-1 border ${STATUS_COLORS[tw.status] || STATUS_COLORS.planning}`}>
                      {tw.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <span className="text-[var(--gulf-teal)]">Revenue: ${(tw.revenue_cents / 100).toLocaleString()}</span>
                    <span className="text-white/30">Costs: ${(tw.total_costs_cents / 100).toLocaleString()}</span>
                    <span className={profit >= 0 ? "text-[var(--gulf-teal)]" : "text-red-400"}>
                      Profit: ${(profit / 100).toLocaleString()}
                    </span>
                    {tw.hotel_name && (
                      <span className="text-white/20">
                        🏨 {tw.hotel_name} {tw.hotel_booked ? "✓" : "⏳"}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
          {trackWeeks.length === 0 && (
            <p className="text-white/30 text-center py-12">No track weeks found. Create one above.</p>
          )}
        </div>
      </div>
    </div>
  );
}
