import Image from "next/image";
import Link from "next/link";

const trackStats = [
  { value: "4.2km", label: "Full Circuit" },
  { value: "18", label: "Turns" },
  { value: "FIA 4", label: "Grade Certified" },
  { value: "2008", label: "Opened" },
];

const included = [
  { icon: "🏨", title: "7 Nights Accommodation", desc: "Comfortable hotel near the track in Clark Freeport Zone" },
  { icon: "🍽️", title: "All Meals Included", desc: "Breakfast, lunch, and dinner — Filipino cuisine, 5-star quality at local prices" },
  { icon: "🏎️", title: "4 Full Track Days", desc: "Full access to Clark International Speedway with pro instruction" },
  { icon: "🎓", title: "1-on-1 Pro Coaching", desc: "Personal instruction from Boodie Dabasol — Pro Class drift champion" },
  { icon: "🚐", title: "Airport Pickup & Dropoff", desc: "Clark International Airport is 15 minutes from the track" },
  { icon: "🔧", title: "Car & Equipment Provided", desc: "Drive prepped drift and race cars — helmets, suits, everything included" },
];

const whyClark = [
  {
    title: "World-Class Circuit",
    desc: "FIA Grade 4 certified. 4.2km, 18 turns, counter-clockwise. The same track used for Philippine GT Championship, Toyota Vios Cup, and national drift series. Wide runoff areas, modern facilities, and multiple configurations including a dedicated drift pad.",
    image: "/images/why-clark/circuit.png",
  },
  {
    title: "Incredible Food",
    desc: "Clark has everything from five-star restaurants to authentic local Filipino cuisine — and it's all outstanding. Your meals are included in the package, and trust us, you'll eat very well. This is a place where the food alone is worth the trip.",
    image: "/images/why-clark/food.jpg",
  },
  {
    title: "Safe & Well-Organised",
    desc: "Clark Freeport Zone is built on the former US Air Force base. The roads are wide, well-maintained, and laid out with American-style planning — spacious, clean, and easy to navigate. It's one of the safest and most organised areas in the Philippines, with 24/7 security throughout the zone.",
    image: "/images/why-clark/roads.jpg",
  },
  {
    title: "Perfect Weather",
    desc: "Year-round warm weather. Dry season (November to May) is ideal for track days — clear skies, 28-32°C. No snow, no freezing paddocks, no cancelled sessions.",
    image: "/images/why-clark/weather.jpg",
  },
  {
    title: "Easy To Get To",
    desc: "Clark International Airport (CRK) has direct flights from across Asia — Singapore, Hong Kong, Seoul, Taipei, KL, Dubai. The track is 15 minutes from the airport. No 3-hour drive to a remote circuit.",
    image: "/images/why-clark/airport.jpg",
  },
  {
    title: "Subic Bay — Deep Sea Fishing",
    desc: "Want a rest day off the track? Subic Bay is just an hour away — world-class deep sea fishing, yacht charters, and stunning coastline. We can organise a fishing day for you and the crew. Catch tuna, mahi-mahi, and marlin, then eat your catch for dinner. Not a bad way to spend your day off.",
    image: "/images/why-clark/fishing.jpg",
  },
];

const galleryImages = [
  { src: "/images/venue/aerial-circuit.jpg", alt: "Aerial view of Clark International Speedway" },
  { src: "/images/venue/gtr-on-track.jpg", alt: "Nissan GT-R on circuit" },
  { src: "/images/venue/civic-type-r.jpg", alt: "Honda Civic Type R at speed" },
  { src: "/images/venue/porsche-gt3-track.jpg", alt: "Porsche 911 GT3 on track" },
  { src: "/images/venue/gr-toyota-racing.jpg", alt: "GR Toyota racing" },
  { src: "/images/venue/pit-crew.jpg", alt: "Pit crew at work" },
  { src: "/images/venue/photographer-trackside.jpg", alt: "Photographer capturing the action" },
  { src: "/images/venue/civic-paddock.jpg", alt: "Cars in the paddock" },
];

export default function VenuePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative h-[80vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/venue/aerial-circuit.jpg"
            alt="Clark International Speedway aerial view"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050811] via-[#050811]/60 to-[#050811]/30" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <div className="flex justify-center mb-6">
            <Image
              src="/images/venue/cis-logo.png"
              alt="Clark International Speedway logo"
              width={80}
              height={80}
              className="opacity-80"
            />
          </div>
          <p className="font-[family-name:var(--font-accent)] text-[var(--gulf-orange)] text-xs sm:text-sm tracking-[0.4em] uppercase mb-4 animate-fade-up">
            The Venue
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-5xl sm:text-7xl md:text-8xl leading-[0.85] tracking-[0.05em] uppercase animate-fade-up delay-1">
            <span className="text-white">Clark</span>
            <br />
            <span className="text-[var(--gulf-teal)] glow-teal">International</span>
            <br />
            <span className="text-white">Speedway</span>
          </h1>
          <p className="mt-6 text-white/50 text-lg sm:text-xl max-w-2xl mx-auto font-light animate-fade-up delay-2">
            FIA-certified. 4.2km. 18 turns. The Philippines&apos; premier motorsport circuit —
            and your classroom for the week.
          </p>
        </div>
      </section>

      {/* TRACK STATS */}
      <section className="relative bg-[var(--gulf-navy)]/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trackStats.map((stat) => (
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

      {/* THE PITCH */}
      <section className="py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-[family-name:var(--font-accent)] text-[var(--gulf-orange)] text-xs tracking-[0.4em] uppercase mb-3">
            The Ultimate Driving Holiday
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-4xl sm:text-6xl tracking-[0.05em] uppercase text-white mb-8">
            Book Your Flight.<br />
            <span className="text-[var(--gulf-teal)]">We Handle The Rest.</span>
          </h2>
          <p className="text-white/50 text-lg leading-relaxed max-w-2xl mx-auto">
            Imagine a week where all you do is drive. A world-class FIA-certified circuit.
            A Pro Class drift champion as your personal coach. Comfortable accommodation,
            incredible food, and perfect weather — all for a fraction of what you&apos;d pay
            anywhere else on the planet.
          </p>
          <p className="text-white/40 text-lg mt-4 max-w-2xl mx-auto">
            That&apos;s the <span className="text-[var(--gulf-teal)] font-medium">Wheelman Track Week</span>.
            Boodie books everything — hotel, meals, track time, equipment.
            You just show up ready to drive.
          </p>
        </div>
      </section>

      {/* THE PACKAGE */}
      <section className="py-20 sm:py-28 bg-[var(--gulf-navy)]/30 diagonal-top diagonal-bottom">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="font-[family-name:var(--font-accent)] text-[var(--gulf-orange)] text-xs tracking-[0.4em] uppercase mb-3">
              All-Inclusive Package
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-5xl sm:text-7xl tracking-[0.05em] uppercase text-white mb-4">
              The Track Week
            </h2>
            {/* Pricing tiers */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-10 max-w-4xl mx-auto">
            <div className="bg-[#050811]/80 border border-white/10 px-5 py-8 text-center">
              <div className="text-white/30 text-xs font-[family-name:var(--font-accent)] tracking-widest uppercase mb-2">
                Solo
              </div>
              <div className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl text-white">
                $5,999
              </div>
              <div className="text-white/30 text-sm mt-1">per driver</div>
            </div>
            <div className="bg-[#050811]/80 border border-white/10 px-5 py-8 text-center">
              <div className="text-white/40 text-xs font-[family-name:var(--font-accent)] tracking-widest uppercase mb-2">
                2 Drivers
              </div>
              <div className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl text-[var(--gulf-teal)]">
                $5,500
              </div>
              <div className="text-white/30 text-sm mt-1">per driver</div>
              <div className="text-[var(--gulf-teal)] text-xs mt-2">Save $499 each</div>
            </div>
            <div className="bg-[#050811]/80 border border-white/10 px-5 py-8 text-center">
              <div className="text-white/40 text-xs font-[family-name:var(--font-accent)] tracking-widest uppercase mb-2">
                3 Drivers
              </div>
              <div className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl text-[var(--gulf-teal)]">
                $5,250
              </div>
              <div className="text-white/30 text-sm mt-1">per driver</div>
              <div className="text-[var(--gulf-teal)] text-xs mt-2">Save $749 each</div>
            </div>
            <div className="bg-[#050811]/80 border border-[var(--gulf-orange)]/30 px-5 py-8 text-center relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--gulf-orange)] text-white text-xs font-[family-name:var(--font-accent)] tracking-widest uppercase px-3 py-1">
                Best Value
              </div>
              <div className="text-[var(--gulf-orange)] text-xs font-[family-name:var(--font-accent)] tracking-widest uppercase mb-2">
                4+ Drivers
              </div>
              <div className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl text-[var(--gulf-orange)] glow-orange">
                $5,000
              </div>
              <div className="text-white/30 text-sm mt-1">per driver</div>
              <div className="text-[var(--gulf-orange)] text-xs mt-2">Save $999 each</div>
            </div>
          </div>
          <p className="text-white/20 text-xs mt-6 font-[family-name:var(--font-accent)] tracking-wider">
            7 NIGHTS / 4 TRACK DAYS — ALL-INCLUSIVE — JUST BOOK YOUR FLIGHT
          </p>
          <p className="text-white/10 text-xs mt-2">
            Grab your mates. 4 drivers = $20,000 total. That&apos;s $4K less than booking solo.
          </p>
          </div>

          {/* What's included */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {included.map((item) => (
              <div
                key={item.title}
                className="bg-[#050811]/80 border border-white/5 p-6 card-lift"
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-[family-name:var(--font-display)] text-xl tracking-[0.1em] uppercase text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-white/40 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/book" className="btn-primary text-xl px-12 py-4">
              Book Your Track Week
            </Link>
            <p className="text-white/20 text-xs mt-4 font-[family-name:var(--font-accent)] tracking-wider">
              JUST BOOK YOUR FLIGHT TO CLARK (CRK) — WE DO THE REST
            </p>
          </div>
        </div>
      </section>

      {/* WHY CLARK */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="font-[family-name:var(--font-accent)] text-[var(--gulf-orange)] text-xs tracking-[0.4em] uppercase mb-3">
              Why This Place
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-5xl sm:text-6xl tracking-[0.05em] uppercase text-white">
              Why Clark?
            </h2>
          </div>

          <div className="space-y-12">
            {whyClark.map((item, idx) => (
              <div key={item.title} className={`grid md:grid-cols-2 gap-8 items-center ${idx % 2 === 1 ? "md:direction-rtl" : ""}`}>
                <div className={idx % 2 === 1 ? "md:order-2" : ""}>
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                    <div className="absolute top-4 left-4 font-[family-name:var(--font-display)] text-5xl text-[var(--gulf-teal)]/30 leading-none">
                      {String(idx + 1).padStart(2, "0")}
                    </div>
                  </div>
                </div>
                <div className={idx % 2 === 1 ? "md:order-1" : ""}>
                  <h3 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl tracking-[0.08em] uppercase text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-white/40 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SUBIC BAY — REST DAY */}
      <section className="py-20 sm:py-28 bg-[var(--gulf-navy)]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="font-[family-name:var(--font-accent)] text-[var(--gulf-orange)] text-xs tracking-[0.4em] uppercase mb-3">
                Your Day Off The Track
              </p>
              <h2 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl tracking-[0.05em] uppercase text-white mb-6">
                Subic Bay<br />
                <span className="text-[var(--gulf-teal)]">Deep Sea Fishing</span>
              </h2>
              <div className="space-y-4 text-white/50 leading-relaxed">
                <p>
                  An hour from Clark lies Subic Bay — crystal clear waters, stunning mountain coastline,
                  and some of the best deep sea fishing in Southeast Asia.
                </p>
                <p>
                  On your rest day, we can organise a full day charter with{" "}
                  <span className="text-[var(--gulf-teal)]">Subic Fishing &amp; Yacht Charter</span>.
                  Head out on the open water, catch tuna, snapper, mahi-mahi — then have your
                  catch cooked up for dinner that evening.
                </p>
                <p className="text-white/30">
                  It&apos;s the perfect break between track days. Drive hard, fish harder.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="relative aspect-square overflow-hidden">
                <Image src="/images/subic/catch-tuna.jpg" alt="Tuna catch at Subic Bay" fill className="object-cover" />
              </div>
              <div className="relative aspect-square overflow-hidden">
                <Image src="/images/subic/catch-ocean.jpg" alt="Deep sea fishing Subic" fill className="object-cover" />
              </div>
              <div className="relative aspect-square overflow-hidden">
                <Image src="/images/subic/catch-red.jpg" alt="Red snapper catch" fill className="object-cover" />
              </div>
              <div className="relative aspect-square overflow-hidden">
                <Image src="/images/subic/catch-snapper.jpg" alt="Fishing at Subic Bay" fill className="object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CIRCUIT MAP */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="font-[family-name:var(--font-accent)] text-[var(--gulf-orange)] text-xs tracking-[0.4em] uppercase mb-3">
                The Circuit
              </p>
              <h2 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl tracking-[0.05em] uppercase text-white mb-6">
                Track Layout
              </h2>
              <div className="space-y-3 text-white/50 text-sm leading-relaxed">
                <p><span className="text-[var(--gulf-teal)] font-medium">Full Circuit:</span> 4.189km — 18 turns — counter-clockwise</p>
                <p><span className="text-[var(--gulf-teal)] font-medium">West Course:</span> 1.960km — 12 turns — technical section</p>
                <p><span className="text-[var(--gulf-teal)] font-medium">East Course:</span> 1.900km — 8 turns — high-speed section</p>
                <p><span className="text-[var(--gulf-teal)] font-medium">Drag Strip:</span> 1km — National Drag Racing Championship venue</p>
              </div>
              <p className="text-white/30 text-sm mt-6">
                The circuit can be split into separate sections, meaning drift and grip events
                can run simultaneously. Wide runoff areas and modern pit facilities make it
                ideal for both experienced drivers and beginners.
              </p>

              <div className="mt-8 space-y-2">
                <p className="text-white/20 text-xs font-[family-name:var(--font-accent)] tracking-widest uppercase">Events hosted here include:</p>
                <div className="flex flex-wrap gap-2">
                  {["Philippine GT Championship", "Toyota Vios Cup", "Drift Muscle Philippines", "King of Nations", "FlatOut Race Series", "National Drag Racing"].map((e) => (
                    <span key={e} className="text-white/20 text-xs border border-white/10 px-3 py-1 font-[family-name:var(--font-accent)] tracking-wider">
                      {e}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="relative aspect-[16/10] overflow-hidden border border-white/5">
                <Image
                  src="/images/venue/circuit-3d.png"
                  alt="Clark International Speedway 3D view"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-[16/10] overflow-hidden border border-white/5">
                <Image
                  src="/images/venue/circuit-satellite.png"
                  alt="Clark International Speedway satellite view"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl tracking-[0.05em] uppercase text-white">
              On The Track
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {galleryImages.map((img) => (
              <div key={img.src} className="relative aspect-[4/3] overflow-hidden group">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-[#050811]/0 group-hover:bg-[#050811]/30 transition-colors" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* YOUR COACH */}
      <section className="py-20 sm:py-28 bg-[var(--gulf-navy)]/30 diagonal-top">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-[300px_1fr] gap-10 items-center">
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image
                src="/images/boodie-arms-open.jpg"
                alt="Boodie Dabasol — your coach"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="font-[family-name:var(--font-accent)] text-[var(--gulf-orange)] text-xs tracking-[0.4em] uppercase mb-3">
                Your Coach
              </p>
              <h2 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl tracking-[0.05em] uppercase text-white mb-6">
                Boodie <span className="text-[var(--gulf-teal)]">Dabasol</span>
              </h2>
              <div className="space-y-4 text-white/50 leading-relaxed">
                <p>
                  You&apos;re not learning from a driving school instructor.
                  You&apos;re learning from a <span className="text-[var(--gulf-teal)] font-medium">Pro Class drift champion</span> who
                  competes at the national level — on this exact track.
                </p>
                <p>
                  Boodie knows every corner, every surface change, every braking point
                  on this circuit. He&apos;s been sliding his Gulf Oil RX-7 here for over a decade.
                  He&apos;ll ride with you, coach you through the radio, and push you
                  to levels you didn&apos;t think you could reach.
                </p>
                <p className="text-white/30 text-sm">
                  Whether you want to learn drift fundamentals, sharpen your track driving,
                  or just experience what it feels like to go flat-out on a real race circuit —
                  Boodie will tailor the week to you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/venue/porsche-gt3-track.jpg"
            alt="Porsche on Clark circuit"
            fill
            className="object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050811] via-[#050811]/90 to-[#050811]/80" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-[family-name:var(--font-display)] text-5xl sm:text-7xl tracking-[0.05em] uppercase text-white mb-4">
            Your Best <span className="text-[var(--gulf-orange)] glow-orange">Week</span>
          </h2>
          <p className="text-white/40 text-lg mb-4 max-w-xl mx-auto">
            4 days on a world-class circuit. Pro coaching. All-inclusive.
          </p>
          <div className="font-[family-name:var(--font-display)] text-4xl text-[var(--gulf-teal)] mb-2">
            From $5,000 USD
          </div>
          <p className="text-white/30 text-sm mb-8">per driver — group discounts available</p>
          <Link href="/book" className="btn-primary text-xl px-12 py-4">
            Book Your Track Week
          </Link>
          <p className="text-white/20 text-sm mt-6">
            Just book your flight to Clark International Airport (CRK).<br />
            Boodie handles everything else.
          </p>
        </div>
      </section>
    </>
  );
}
