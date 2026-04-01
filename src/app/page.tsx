import Image from "next/image";
import Link from "next/link";

const services = [
  {
    title: "Drift Lessons",
    desc: "Learn the art of controlled chaos from a Pro Class driver. From basics to tandem drifting.",
    icon: "🔥",
  },
  {
    title: "Race Driving",
    desc: "Track-ready driving skills. Braking points, racing lines, and car control at speed.",
    icon: "🏁",
  },
  {
    title: "Car Tuning",
    desc: "Suspension, engine management, and setup tuning for street and competition.",
    icon: "⚙️",
  },
  {
    title: "Race Builds",
    desc: "Full race car preparation. Roll cages, engine swaps, and competition-spec builds.",
    icon: "🔧",
  },
];

const stats = [
  { value: "10+", label: "Years Pro Drifting" },
  { value: "Pro", label: "Class Driver" },
  { value: "100+", label: "Events Competed" },
  { value: "Clark", label: "Speedway Base" },
];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/rx7-drift-smoke.jpg"
            alt="Wheelman RX-7 drifting with smoke"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050811] via-[#050811]/70 to-[#050811]/40" />
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[var(--gulf-teal)]/5 to-transparent" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <p className="font-[family-name:var(--font-accent)] text-[var(--gulf-orange)] text-xs sm:text-sm tracking-[0.4em] uppercase mb-4 animate-fade-up">
            Pro Class Drift Driver
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-6xl sm:text-8xl md:text-9xl leading-[0.85] tracking-[0.05em] uppercase animate-fade-up delay-1">
            <span className="text-[var(--gulf-teal)] glow-teal">Wheelman</span>
            <br />
            <span className="text-white">Raceworks</span>
          </h1>
          <p className="mt-6 text-white/50 text-lg sm:text-xl max-w-xl mx-auto font-light animate-fade-up delay-2">
            Drift driving lessons, race prep &amp; car tuning
            <br />
            <span className="text-white/30">Clark, Philippines</span>
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-fade-up delay-3">
            <Link href="/book" className="btn-primary text-center">
              Book a Session
            </Link>
            <Link href="/events" className="btn-secondary text-center">
              Upcoming Events
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-white/20 text-xs tracking-[0.3em] uppercase font-[family-name:var(--font-accent)]">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-[var(--gulf-teal)]/50 to-transparent" />
        </div>
      </section>

      {/* STATS BAR */}
      <section className="relative bg-[var(--gulf-navy)]/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-[family-name:var(--font-display)] text-4xl text-[var(--gulf-teal)]">
                  {stat.value}
                </div>
                <div className="text-white/30 text-xs tracking-[0.2em] uppercase mt-1 font-[family-name:var(--font-accent)]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src="/images/boodie-arms-open.jpg"
                  alt="Boodie Dabasol — The Wheelman"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050811] via-transparent to-transparent" />
              </div>
              <div className="absolute -bottom-3 -right-3 w-full h-full border border-[var(--gulf-teal)]/20 -z-10" />
              <div className="absolute -bottom-6 -right-6 w-full h-full border border-[var(--gulf-orange)]/10 -z-10" />
            </div>

            <div>
              <p className="font-[family-name:var(--font-accent)] text-[var(--gulf-orange)] text-xs tracking-[0.4em] uppercase mb-3">
                Meet The Driver
              </p>
              <h2 className="font-[family-name:var(--font-display)] text-5xl sm:text-6xl tracking-[0.05em] uppercase text-white mb-6">
                Boodie<br />
                <span className="text-[var(--gulf-teal)]">Dabasol</span>
              </h2>
              <div className="space-y-4 text-white/50 leading-relaxed">
                <p>
                  Known as <span className="text-[var(--gulf-orange)] font-medium">Rocketboodie</span> in the
                  Philippine drift scene, Boodie Dabasol has been shredding tires and chasing sideways glory
                  for over a decade.
                </p>
                <p>
                  A Pro Class competitor in national drift championships, he&apos;s piloted his iconic
                  Gulf Oil-liveried <span className="text-[var(--gulf-teal)]">Mazda RX-7 FC</span> at
                  Clark International Speedway, Drift Fest Manila, Drift Muscle Philippines, and
                  the King of Nations — earning multiple championship trophies along the way.
                </p>
                <p>
                  Now he&apos;s passing that knowledge on. Whether you want to learn to drift,
                  tune your car for the track, or build a full competition machine —
                  Boodie and Wheelman Raceworks have you covered.
                </p>
              </div>
              <div className="mt-8">
                <Link href="/gallery" className="btn-secondary">
                  View Gallery
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-20 sm:py-28 bg-[var(--gulf-navy)]/30 diagonal-top diagonal-bottom">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="font-[family-name:var(--font-accent)] text-[var(--gulf-orange)] text-xs tracking-[0.4em] uppercase mb-3">
              What We Offer
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-5xl sm:text-6xl tracking-[0.05em] uppercase text-white">
              Services
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <div
                key={service.title}
                className="card-lift bg-[#050811]/80 border border-white/5 p-8 group"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="font-[family-name:var(--font-display)] text-2xl tracking-[0.1em] uppercase text-white group-hover:text-[var(--gulf-teal)] transition-colors mb-3">
                  {service.title}
                </h3>
                <p className="text-white/40 text-sm leading-relaxed">
                  {service.desc}
                </p>
                <div className="mt-6">
                  <Link
                    href="/book"
                    className="text-[var(--gulf-teal)] text-sm font-[family-name:var(--font-accent)] tracking-widest uppercase hover:text-[var(--gulf-orange)] transition-colors"
                  >
                    Book &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THE CAR */}
      <section className="py-20 sm:py-28 smoke-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="font-[family-name:var(--font-accent)] text-[var(--gulf-orange)] text-xs tracking-[0.4em] uppercase mb-3">
                The Machine
              </p>
              <h2 className="font-[family-name:var(--font-display)] text-5xl sm:text-6xl tracking-[0.05em] uppercase text-white mb-6">
                Gulf Oil<br />
                <span className="text-[var(--gulf-teal)]">RX-7 FC</span>
              </h2>
              <div className="space-y-4 text-white/50 leading-relaxed">
                <p>
                  Boodie&apos;s signature machine — a Mazda RX-7 FC3S dressed in the iconic
                  Gulf Oil livery. Teal and orange, widebody, caged, and built to slide.
                </p>
                <p>
                  Running BRIDE bucket seats, a full roll cage, orange mesh wheels,
                  and backed by sponsors including Gulf Oil, Sailun Tire, Jordan Racing,
                  and Uni Clutch.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                {["Gulf Oil", "Sailun Tire", "Jordan Racing", "Uni Clutch", "Aguila", "UBEC Mass"].map((s) => (
                  <span
                    key={s}
                    className="text-white/20 text-xs border border-white/10 px-3 py-1 font-[family-name:var(--font-accent)] tracking-widest uppercase"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src="/images/rx7-drift-action.jpg"
                  alt="Mazda RX-7 FC drift car"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -left-4 w-2/3 aspect-[3/2] overflow-hidden border-2 border-[var(--gulf-teal)]/20">
                <Image
                  src="/images/rx7-hood-open-engine.jpg"
                  alt="RX-7 engine bay"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/rx7-stadium-wide.jpg"
            alt="Drift event at stadium"
            fill
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050811] via-[#050811]/90 to-[#050811]" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-[family-name:var(--font-display)] text-5xl sm:text-7xl tracking-[0.05em] uppercase text-white mb-6">
            Ready to <span className="text-[var(--gulf-orange)] glow-orange">Drift</span>?
          </h2>
          <p className="text-white/40 text-lg mb-10 max-w-md mx-auto">
            Book your session with Boodie. Whether it&apos;s your first slide or your hundredth —
            every lap counts.
          </p>
          <Link href="/book" className="btn-primary text-xl px-12 py-4">
            Book Now
          </Link>
        </div>
      </section>
    </>
  );
}
