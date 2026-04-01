"use client";

import { useState } from "react";

interface ServiceOption {
  id: string;
  title: string;
  desc: string;
  price: string;
  duration: string;
  icon: string;
}

const serviceOptions: ServiceOption[] = [
  {
    id: "track-week",
    title: "The Track Week — All Inclusive",
    desc: "7 nights accommodation, 4 full track days at Clark International Speedway, all meals, airport pickup, pro coaching, car & equipment. Just book your flight.",
    price: "$5,999 USD",
    duration: "7 nights / 4 track days",
    icon: "✈️",
  },
  {
    id: "drift-beginner",
    title: "Drift Lesson — Beginner",
    desc: "First-timers welcome. Learn throttle control, clutch kick, handbrake entry, and basic drift technique. Includes safety briefing and in-car instruction.",
    price: "₱5,000",
    duration: "Half Day (4 hours)",
    icon: "🔥",
  },
  {
    id: "drift-advanced",
    title: "Drift Lesson — Advanced",
    desc: "Tandem drifting, transitions, and competition-style runs. Must have prior drift experience. One-on-one coaching with Boodie.",
    price: "₱8,000",
    duration: "Full Day (7 hours)",
    icon: "💨",
  },
  {
    id: "race-driving",
    title: "Race Driving Course",
    desc: "Track driving fundamentals — racing lines, braking points, heel-toe, car control at speed. Suitable for enthusiast and amateur racers.",
    price: "₱6,000",
    duration: "Full Day (6 hours)",
    icon: "🏁",
  },
  {
    id: "drift-experience",
    title: "Drift Ride-Along Experience",
    desc: "Be a passenger in Boodie's RX-7 during a full-speed drift session. Not for the faint-hearted. Great gift idea.",
    price: "₱2,500",
    duration: "30 minutes",
    icon: "🚗",
  },
  {
    id: "car-tuning",
    title: "Car Tuning Consultation",
    desc: "Bring your car — suspension geometry, alignment, engine tune review, and setup advice for street or track. Includes dyno time if available.",
    price: "₱3,500",
    duration: "2–3 hours",
    icon: "⚙️",
  },
  {
    id: "race-build",
    title: "Race Build Consultation",
    desc: "Planning a build? Discuss cage design, engine swaps, drivetrain, aero, and competition requirements. Full project scoping and quote.",
    price: "₱2,000",
    duration: "1–2 hours",
    icon: "🔧",
  },
];

export default function BookPage() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);

  function toggleService(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const [submitError, setSubmitError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          preferred_date: formData.date,
          notes: formData.notes,
          service_slugs: Array.from(selected),
        }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        setSubmitError(data.error || "Booking failed");
      }
    } catch {
      setSubmitError("Network error — please try again");
    }
  }

  if (submitted) {
    return (
      <div className="pt-24 pb-20 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-6">🏁</div>
          <h2 className="font-[family-name:var(--font-display)] text-4xl tracking-[0.05em] uppercase text-[var(--gulf-teal)] mb-4">
            Booking Received!
          </h2>
          <p className="text-white/50 mb-2">
            Thanks {formData.name}! We&apos;ll be in touch within 24 hours to confirm your session.
          </p>
          <p className="text-white/30 text-sm mb-8">
            Check your email at {formData.email} for confirmation.
          </p>
          <button
            onClick={() => { setSubmitted(false); setSelected(new Set()); setFormData({ name: "", email: "", phone: "", date: "", notes: "" }); }}
            className="btn-secondary"
          >
            Book Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <p className="font-[family-name:var(--font-accent)] text-[var(--gulf-orange)] text-xs tracking-[0.4em] uppercase mb-3">
          Get On Track
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-5xl sm:text-7xl tracking-[0.05em] uppercase text-white mb-4">
          Book a <span className="text-[var(--gulf-teal)]">Session</span>
        </h1>
        <p className="text-white/40 max-w-lg">
          Select one or more services, pick a date, and we&apos;ll get back to you.
        </p>
      </div>

      <div className="tacho-line max-w-7xl mx-auto mb-12" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <form onSubmit={handleSubmit}>
          {/* Service selection */}
          <div className="mb-12">
            <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-[0.1em] uppercase text-white/80 mb-6">
              1. Choose Services
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {serviceOptions.map((service) => {
                const isSelected = selected.has(service.id);
                return (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => toggleService(service.id)}
                    className={`text-left p-6 border transition-all group ${
                      isSelected
                        ? "bg-[var(--gulf-teal)]/10 border-[var(--gulf-teal)]/40"
                        : "bg-[#0a0e1a] border-white/5 hover:border-white/15"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-2xl">{service.icon}</span>
                      <div className={`w-5 h-5 border-2 flex items-center justify-center transition-colors ${
                        isSelected
                          ? "border-[var(--gulf-teal)] bg-[var(--gulf-teal)]"
                          : "border-white/20"
                      }`}>
                        {isSelected && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <h3 className={`font-[family-name:var(--font-display)] text-lg tracking-[0.08em] uppercase mb-2 transition-colors ${
                      isSelected ? "text-[var(--gulf-teal)]" : "text-white"
                    }`}>
                      {service.title}
                    </h3>
                    <p className="text-white/30 text-xs leading-relaxed mb-3">
                      {service.desc}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[var(--gulf-orange)] font-[family-name:var(--font-accent)] tracking-wider">
                        {service.price}
                      </span>
                      <span className="text-white/20">{service.duration}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Contact details */}
          <div className="mb-12">
            <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-[0.1em] uppercase text-white/80 mb-6">
              2. Your Details
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/30 text-xs font-[family-name:var(--font-accent)] tracking-widest uppercase mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#0a0e1a] border border-white/10 px-4 py-3 text-white focus:border-[var(--gulf-teal)] focus:outline-none transition-colors"
                  placeholder="Juan Cruz"
                />
              </div>
              <div>
                <label className="block text-white/30 text-xs font-[family-name:var(--font-accent)] tracking-widest uppercase mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#0a0e1a] border border-white/10 px-4 py-3 text-white focus:border-[var(--gulf-teal)] focus:outline-none transition-colors"
                  placeholder="you@email.com"
                />
              </div>
              <div>
                <label className="block text-white/30 text-xs font-[family-name:var(--font-accent)] tracking-widest uppercase mb-2">
                  Phone / Viber
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#0a0e1a] border border-white/10 px-4 py-3 text-white focus:border-[var(--gulf-teal)] focus:outline-none transition-colors"
                  placeholder="+63 9XX XXX XXXX"
                />
              </div>
              <div>
                <label className="block text-white/30 text-xs font-[family-name:var(--font-accent)] tracking-widest uppercase mb-2">
                  Preferred Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full bg-[#0a0e1a] border border-white/10 px-4 py-3 text-white focus:border-[var(--gulf-teal)] focus:outline-none transition-colors"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-white/30 text-xs font-[family-name:var(--font-accent)] tracking-widest uppercase mb-2">
                  Additional Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full bg-[#0a0e1a] border border-white/10 px-4 py-3 text-white focus:border-[var(--gulf-teal)] focus:outline-none transition-colors resize-none"
                  placeholder="Experience level, car details, special requests..."
                />
              </div>
            </div>
          </div>

          {/* Summary + submit */}
          <div className="bg-[#0a0e1a] border border-white/5 p-6 sm:p-8">
            <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-[0.1em] uppercase text-white/80 mb-4">
              3. Review & Submit
            </h2>

            {selected.size === 0 ? (
              <p className="text-white/30 text-sm">Select at least one service above to continue.</p>
            ) : (
              <>
                <div className="space-y-2 mb-6">
                  {serviceOptions
                    .filter((s) => selected.has(s.id))
                    .map((s) => (
                      <div key={s.id} className="flex justify-between items-center text-sm">
                        <span className="text-white/60">
                          {s.icon} {s.title}
                        </span>
                        <span className="text-[var(--gulf-orange)] font-[family-name:var(--font-accent)] tracking-wider">
                          {s.price}
                        </span>
                      </div>
                    ))}
                </div>
                <div className="tacho-line mb-6" />
                <p className="text-white/20 text-xs mb-6">
                  Payment will be arranged after confirmation. Stripe payment coming soon.
                </p>
                {submitError && <p className="text-red-400 text-sm mb-4">{submitError}</p>}
                <button
                  type="submit"
                  disabled={selected.size === 0}
                  className="btn-primary w-full sm:w-auto"
                >
                  Submit Booking Request
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
