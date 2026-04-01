"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";

const links = [
  { href: "/", label: "Home" },
  { href: "/venue", label: "The Track" },
  { href: "/news", label: "News" },
  { href: "/events", label: "Events" },
  { href: "/book", label: "Book Now" },
  { href: "/gallery", label: "Gallery" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050811]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <Link href="/" className="flex items-center gap-3 group">
              <Image
                src="/images/logo-bw.jpg"
                alt="Wheelman Raceworks"
                width={48}
                height={48}
                className="rounded-full border border-[var(--gulf-teal)]/30 group-hover:border-[var(--gulf-teal)] transition-colors"
              />
              <div className="hidden sm:block">
                <span className="font-[family-name:var(--font-display)] text-xl tracking-[0.15em] text-[var(--gulf-teal)] uppercase">
                  Wheelman
                </span>
                <span className="font-[family-name:var(--font-display)] text-xl tracking-[0.15em] text-[var(--gulf-orange)] uppercase ml-1">
                  Raceworks
                </span>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {links.map((link) => {
                const active = pathname === link.href;
                const isBook = link.href === "/book";
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`
                      font-[family-name:var(--font-display)] text-lg tracking-[0.12em] uppercase px-4 py-2 transition-all
                      ${isBook
                        ? "btn-primary ml-2 py-2 px-6 text-base"
                        : active
                          ? "text-[var(--gulf-teal)]"
                          : "text-white/60 hover:text-white"
                      }
                    `}
                  >
                    {link.label}
                  </Link>
                );
              })}

              {/* Auth */}
              {user ? (
                <div className="flex items-center gap-3 ml-4 border-l border-white/10 pl-4">
                  {user.role === "admin" && (
                    <Link
                      href="/admin"
                      className="font-[family-name:var(--font-accent)] text-xs tracking-widest uppercase text-[var(--gulf-orange)] hover:text-[var(--gulf-orange)]/80 transition-colors"
                    >
                      Admin
                    </Link>
                  )}
                  <span className="text-white/40 text-sm">{user.name}</span>
                  <button
                    onClick={logout}
                    className="text-white/30 hover:text-white text-sm font-[family-name:var(--font-display)] tracking-wider uppercase transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuth(true)}
                  className="ml-4 border-l border-white/10 pl-4 text-white/40 hover:text-white text-sm font-[family-name:var(--font-display)] tracking-wider uppercase transition-colors"
                >
                  Login
                </button>
              )}
            </div>

            <button
              onClick={() => setOpen(!open)}
              className="md:hidden flex flex-col gap-1.5 p-2"
              aria-label="Menu"
            >
              <span className={`block w-6 h-0.5 bg-[var(--gulf-teal)] transition-transform ${open ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block w-6 h-0.5 bg-[var(--gulf-teal)] transition-opacity ${open ? "opacity-0" : ""}`} />
              <span className={`block w-6 h-0.5 bg-[var(--gulf-teal)] transition-transform ${open ? "-rotate-45 -translate-y-2" : ""}`} />
            </button>
          </div>
        </div>

        {open && (
          <div className="md:hidden bg-[#050811]/98 border-t border-white/5">
            <div className="px-4 py-4 space-y-1">
              {links.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`
                      block font-[family-name:var(--font-display)] text-xl tracking-[0.12em] uppercase px-4 py-3 transition-colors
                      ${active ? "text-[var(--gulf-teal)]" : "text-white/60 hover:text-white"}
                    `}
                  >
                    {link.label}
                  </Link>
                );
              })}
              {user ? (
                <>
                  {user.role === "admin" && (
                    <Link href="/admin" onClick={() => setOpen(false)} className="block px-4 py-3 text-[var(--gulf-orange)] font-[family-name:var(--font-display)] text-xl tracking-[0.12em] uppercase">
                      Admin
                    </Link>
                  )}
                  <button onClick={() => { logout(); setOpen(false); }} className="block w-full text-left px-4 py-3 text-white/40 font-[family-name:var(--font-display)] text-xl tracking-[0.12em] uppercase">
                    Logout ({user.name})
                  </button>
                </>
              ) : (
                <button onClick={() => { setShowAuth(true); setOpen(false); }} className="block w-full text-left px-4 py-3 text-white/40 font-[family-name:var(--font-display)] text-xl tracking-[0.12em] uppercase">
                  Login / Register
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Auth Modal */}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
}

function AuthModal({ onClose }: { onClose: () => void }) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = mode === "login"
      ? await login(email, password)
      : await register(email, password, name, phone);

    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4" onClick={onClose}>
      <div className="bg-[#0a0e1a] border border-white/10 w-full max-w-md p-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-[0.1em] uppercase text-white">
            {mode === "login" ? "Login" : "Register"}
          </h2>
          <button onClick={onClose} className="text-white/40 hover:text-white text-2xl">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div>
              <label className="block text-white/30 text-xs font-[family-name:var(--font-accent)] tracking-widest uppercase mb-1">Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#050811] border border-white/10 px-4 py-3 text-white focus:border-[var(--gulf-teal)] focus:outline-none"
              />
            </div>
          )}
          <div>
            <label className="block text-white/30 text-xs font-[family-name:var(--font-accent)] tracking-widest uppercase mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#050811] border border-white/10 px-4 py-3 text-white focus:border-[var(--gulf-teal)] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-white/30 text-xs font-[family-name:var(--font-accent)] tracking-widest uppercase mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#050811] border border-white/10 px-4 py-3 text-white focus:border-[var(--gulf-teal)] focus:outline-none"
            />
          </div>
          {mode === "register" && (
            <div>
              <label className="block text-white/30 text-xs font-[family-name:var(--font-accent)] tracking-widest uppercase mb-1">Phone (optional)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#050811] border border-white/10 px-4 py-3 text-white focus:border-[var(--gulf-teal)] focus:outline-none"
              />
            </div>
          )}

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "..." : mode === "login" ? "Login" : "Create Account"}
          </button>
        </form>

        <p className="text-center text-white/30 text-sm mt-4">
          {mode === "login" ? (
            <>No account? <button onClick={() => setMode("register")} className="text-[var(--gulf-teal)] hover:underline">Register</button></>
          ) : (
            <>Have an account? <button onClick={() => setMode("login")} className="text-[var(--gulf-teal)] hover:underline">Login</button></>
          )}
        </p>
      </div>
    </div>
  );
}
