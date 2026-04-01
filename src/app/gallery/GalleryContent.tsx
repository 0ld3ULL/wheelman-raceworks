"use client";

import Image from "next/image";
import { useState } from "react";

const images = [
  { src: "/images/rx7-drift-smoke.jpg", alt: "RX-7 drifting with smoke", category: "action" },
  { src: "/images/rx7-drift-action.jpg", alt: "RX-7 sideways at stadium", category: "action" },
  { src: "/images/rx7-tandem-stadium.jpg", alt: "Tandem drift at stadium", category: "action" },
  { src: "/images/rx7-stadium-wide.jpg", alt: "RX-7 at drift event", category: "action" },
  { src: "/images/rx7-rear-low-angle.jpg", alt: "RX-7 rear angle", category: "car" },
  { src: "/images/rx7-fire-extinguisher.jpg", alt: "RX-7 at track", category: "action" },
  { src: "/images/rx7-hood-open-engine.jpg", alt: "RX-7 engine bay", category: "car" },
  { src: "/images/rx7-sailun-tent.jpg", alt: "RX-7 in paddock", category: "car" },
  { src: "/images/rx7-paddock-daytime.jpg", alt: "RX-7 paddock day", category: "car" },
  { src: "/images/s14-purple-sailun.jpg", alt: "Silvia S14 Sailun livery", category: "car" },
  { src: "/images/boodie-arms-open.jpg", alt: "Boodie celebrating", category: "boodie" },
  { src: "/images/boodie-fistbump.jpg", alt: "Boodie fist bump", category: "boodie" },
  { src: "/images/boodie-working-on-car.jpg", alt: "Boodie working on car", category: "boodie" },
  { src: "/images/boodie-trackside-laugh.jpg", alt: "Boodie laughing trackside", category: "boodie" },
  { src: "/images/boodie-fan-selfie.jpg", alt: "Boodie with fan", category: "boodie" },
  { src: "/images/boodie-standing-trackside.jpg", alt: "Boodie at track", category: "boodie" },
  { src: "/images/boodie-kid-cockpit.jpg", alt: "Boodie with kid in car", category: "boodie" },
  { src: "/images/trophies-champion.jpg", alt: "Championship trophies", category: "trophies" },
  { src: "/images/promo-pro-class.jpg", alt: "Pro Class Driver announcement", category: "promo" },
  { src: "/images/logo-bw.jpg", alt: "Wheelman Raceworks logo", category: "promo" },
];

const categories = [
  { id: "all", label: "All" },
  { id: "action", label: "Drift Action" },
  { id: "car", label: "The Cars" },
  { id: "boodie", label: "Boodie" },
  { id: "trophies", label: "Trophies" },
  { id: "promo", label: "Promo" },
];

export default function GalleryContent() {
  const [filter, setFilter] = useState("all");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = filter === "all" ? images : images.filter((img) => img.category === filter);

  return (
    <div className="pt-24 pb-20">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <p className="font-[family-name:var(--font-accent)] text-[var(--gulf-orange)] text-xs tracking-[0.4em] uppercase mb-3">
          On &amp; Off The Track
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-5xl sm:text-7xl tracking-[0.05em] uppercase text-white mb-4">
          Gallery
        </h1>
      </div>

      {/* Filter tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`font-[family-name:var(--font-display)] text-sm tracking-[0.12em] uppercase px-4 py-2 border transition-all ${
                filter === cat.id
                  ? "bg-[var(--gulf-teal)] border-[var(--gulf-teal)] text-white"
                  : "bg-transparent border-white/10 text-white/40 hover:text-white hover:border-white/30"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="tacho-line max-w-7xl mx-auto mb-12" />

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {filtered.map((img, idx) => (
            <div
              key={img.src}
              className="break-inside-avoid relative group cursor-pointer overflow-hidden"
              onClick={() => setLightbox(idx)}
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={800}
                height={600}
                className="w-full h-auto group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-[#050811]/0 group-hover:bg-[#050811]/40 transition-colors flex items-end p-4">
                <span className="text-white/0 group-hover:text-white/80 transition-colors text-sm font-[family-name:var(--font-body)]">
                  {img.alt}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-6 right-6 text-white/60 hover:text-white text-3xl font-[family-name:var(--font-display)]"
          >
            &times;
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setLightbox(Math.max(0, lightbox - 1)); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-4xl font-[family-name:var(--font-display)]"
          >
            &#8249;
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setLightbox(Math.min(filtered.length - 1, lightbox + 1)); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-4xl font-[family-name:var(--font-display)]"
          >
            &#8250;
          </button>
          <div className="relative max-w-5xl max-h-[85vh] w-full" onClick={(e) => e.stopPropagation()}>
            <Image
              src={filtered[lightbox].src}
              alt={filtered[lightbox].alt}
              width={1200}
              height={800}
              className="w-full h-auto max-h-[85vh] object-contain"
            />
            <p className="text-white/50 text-center mt-4 text-sm">
              {filtered[lightbox].alt}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
