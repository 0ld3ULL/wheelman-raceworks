"use client";

import Image from "next/image";

const mockPosts = [
  {
    id: 1,
    platform: "facebook",
    date: "Mar 30, 2026",
    text: "What a weekend at Clark International Speedway! 🔥 Pro Class tandem battle was insane. Thanks to everyone who came out and supported. Next event loading... 🏁",
    image: "/images/rx7-tandem-stadium.jpg",
    likes: 342,
    comments: 47,
    shares: 28,
  },
  {
    id: 2,
    platform: "instagram",
    date: "Mar 28, 2026",
    text: "Gulf Oil RX-7 ready for battle. Fresh tires, fresh tune. Let's go sideways. 💨 #drift #rx7 #gulflivery #wheelmanraceworks #clarkspeedway",
    image: "/images/rx7-sailun-tent.jpg",
    likes: 891,
    comments: 63,
    shares: 0,
  },
  {
    id: 3,
    platform: "facebook",
    date: "Mar 25, 2026",
    text: "Teaching the next generation. This kid had more courage than half the adults I've coached. 😂 Never too young to learn car control! 🏎️ #wheelmanraceworks #driftlessons",
    image: "/images/boodie-kid-cockpit.jpg",
    likes: 567,
    comments: 89,
    shares: 45,
  },
  {
    id: 4,
    platform: "instagram",
    date: "Mar 22, 2026",
    text: "Smoke show at the stadium. The crowd was electric. This is what we live for. 🔥🔥🔥 #proclass #drift #philippines #motorsport",
    image: "/images/rx7-drift-smoke.jpg",
    likes: 1243,
    comments: 112,
    shares: 0,
  },
  {
    id: 5,
    platform: "facebook",
    date: "Mar 18, 2026",
    text: "Engine bay looking clean after the rebuild. New turbo setup, fresh plumbing, ready for the next round. Big thanks to the Wheelman crew for putting in the hours. 🔧",
    image: "/images/rx7-hood-open-engine.jpg",
    likes: 234,
    comments: 31,
    shares: 12,
  },
  {
    id: 6,
    platform: "instagram",
    date: "Mar 15, 2026",
    text: "Trophy cabinet getting full. Time to build a bigger shelf. 🏆 #champion #driftlife #wheelmanraceworks",
    image: "/images/trophies-champion.jpg",
    likes: 678,
    comments: 54,
    shares: 0,
  },
];

function PlatformBadge({ platform }: { platform: string }) {
  const isFb = platform === "facebook";
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-[family-name:var(--font-accent)] tracking-widest uppercase px-3 py-1 border ${
        isFb
          ? "text-blue-400 border-blue-400/20 bg-blue-400/5"
          : "text-pink-400 border-pink-400/20 bg-pink-400/5"
      }`}
    >
      {isFb ? (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
      ) : (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
      )}
      {platform}
    </span>
  );
}

export default function NewsPage() {
  return (
    <div className="pt-24 pb-20">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <p className="font-[family-name:var(--font-accent)] text-[var(--gulf-orange)] text-xs tracking-[0.4em] uppercase mb-3">
          Latest Updates
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-5xl sm:text-7xl tracking-[0.05em] uppercase text-white mb-4">
          News & <span className="text-[var(--gulf-teal)]">Social</span>
        </h1>
        <p className="text-white/40 max-w-lg">
          Follow the action from the track, the garage, and everything in between.
          Latest posts from Facebook and Instagram.
        </p>

        {/* Social links */}
        <div className="flex gap-4 mt-6">
          <a
            href="https://www.facebook.com/TeamWheelman/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary text-sm py-2 px-5 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            Follow on Facebook
          </a>
          <a
            href="https://www.instagram.com/rocketboodie/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary text-sm py-2 px-5 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            Follow on Instagram
          </a>
        </div>
      </div>

      <div className="tacho-line max-w-7xl mx-auto mb-12" />

      {/* Posts feed */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
        {mockPosts.map((post) => (
          <article
            key={post.id}
            className="card-lift bg-[#0a0e1a] border border-white/5 overflow-hidden group"
          >
            {/* Image */}
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src={post.image}
                alt=""
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e1a] via-transparent to-transparent" />
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <PlatformBadge platform={post.platform} />
                <span className="text-white/20 text-xs font-[family-name:var(--font-accent)] tracking-wider">
                  {post.date}
                </span>
              </div>
              <p className="text-white/70 leading-relaxed">{post.text}</p>

              {/* Engagement */}
              <div className="flex items-center gap-6 mt-5 pt-4 border-t border-white/5">
                <span className="text-white/30 text-sm flex items-center gap-1.5">
                  ❤️ {post.likes}
                </span>
                <span className="text-white/30 text-sm flex items-center gap-1.5">
                  💬 {post.comments}
                </span>
                {post.shares > 0 && (
                  <span className="text-white/30 text-sm flex items-center gap-1.5">
                    🔄 {post.shares}
                  </span>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
