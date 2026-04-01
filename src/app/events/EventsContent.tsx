"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image: string;
  capacity: number;
  registered: number;
  type: "competition" | "lesson" | "meetup";
}

const typeColors = {
  competition: { text: "text-red-400", border: "border-red-400/20", bg: "bg-red-500/10", label: "Competition" },
  lesson: { text: "text-[var(--gulf-teal)]", border: "border-[var(--gulf-teal)]/20", bg: "bg-[var(--gulf-teal)]/10", label: "Lesson" },
  meetup: { text: "text-[var(--gulf-orange)]", border: "border-[var(--gulf-orange)]/20", bg: "bg-[var(--gulf-orange)]/10", label: "Meetup" },
};

// Fallback images for events without custom images
const fallbackImages: Record<string, string> = {
  competition: "/images/rx7-stadium-wide.jpg",
  lesson: "/images/boodie-trackside-laugh.jpg",
  meetup: "/images/boodie-kid-cockpit.jpg",
};

export default function EventsContent() {
  const [events, setEvents] = useState<Event[]>([]);
  const [rsvpd, setRsvpd] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetch("/api/events")
      .then((r) => r.json())
      .then((d) => { setEvents(d.events || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function handleRsvp(id: number) {
    if (!user) {
      alert("Please login to RSVP");
      return;
    }

    const res = await fetch(`/api/events/${id}/rsvp`, { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      setRsvpd((prev) => {
        const next = new Set(prev);
        if (data.status === "confirmed") next.add(id);
        else next.delete(id);
        return next;
      });
      // Refresh events to update count
      const evRes = await fetch("/api/events");
      if (evRes.ok) {
        const evData = await evRes.json();
        setEvents(evData.events || []);
      }
    }
  }

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <p className="font-[family-name:var(--font-accent)] text-[var(--gulf-orange)] text-xs tracking-[0.4em] uppercase mb-3">
          What&apos;s Coming Up
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-5xl sm:text-7xl tracking-[0.05em] uppercase text-white mb-4">
          Events
        </h1>
        <p className="text-white/40 max-w-lg">
          Competitions, lessons, and meetups. {user ? "RSVP to secure your spot." : "Login to RSVP."}
        </p>
      </div>

      <div className="tacho-line max-w-7xl mx-auto mb-12" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
        {loading ? (
          <p className="text-white/30 text-center">Loading events...</p>
        ) : events.length === 0 ? (
          <p className="text-white/30 text-center">No upcoming events. Check back soon!</p>
        ) : (
          events.map((event) => {
            const typeStyle = typeColors[event.type] || typeColors.meetup;
            const isRsvpd = rsvpd.has(event.id);
            const spotsLeft = event.capacity > 0 ? event.capacity - event.registered : null;
            const fillPercent = event.capacity > 0 ? (event.registered / event.capacity) * 100 : 0;
            const imgSrc = event.image || fallbackImages[event.type] || fallbackImages.meetup;

            return (
              <article key={event.id} className="card-lift bg-[#0a0e1a] border border-white/5 overflow-hidden">
                <div className="grid md:grid-cols-[320px_1fr] gap-0">
                  <div className="relative h-48 md:h-auto overflow-hidden">
                    <Image src={imgSrc} alt={event.title} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a0e1a]/50 hidden md:block" />
                  </div>

                  <div className="p-6 sm:p-8">
                    <div className="mb-4">
                      <span className={`inline-block text-xs font-[family-name:var(--font-accent)] tracking-widest uppercase px-3 py-1 border ${typeStyle.text} ${typeStyle.border} ${typeStyle.bg} mb-3`}>
                        {typeStyle.label}
                      </span>
                      <h3 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl tracking-[0.08em] uppercase text-white">
                        {event.title}
                      </h3>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-white/40 mb-4">
                      <span>📅 {event.date}</span>
                      <span>🕐 {event.time}</span>
                      <span>📍 {event.location}</span>
                    </div>

                    {event.description && (
                      <p className="text-white/50 text-sm leading-relaxed mb-6">{event.description}</p>
                    )}

                    {event.capacity > 0 && (
                      <div className="mb-6">
                        <div className="flex justify-between text-xs text-white/30 mb-1.5">
                          <span>{event.registered} registered</span>
                          <span>{spotsLeft} spots left</span>
                        </div>
                        <div className="h-1.5 bg-white/5 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[var(--gulf-teal)] to-[var(--gulf-orange)] transition-all duration-500"
                            style={{ width: `${fillPercent}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => handleRsvp(event.id)}
                      className={isRsvpd ? "btn-primary opacity-80" : "btn-secondary"}
                    >
                      {isRsvpd ? "✓ RSVP'd — You're In" : "RSVP"}
                    </button>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
