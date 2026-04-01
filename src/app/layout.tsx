import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { AuthProvider } from "@/lib/AuthContext";
import { ScrollToTop } from "./components/ScrollToTop";

export const metadata: Metadata = {
  title: "Wheelman Raceworks | Pro Drift & Motorsport Services",
  description: "Professional drift driving lessons, car tuning, and race prep by Boodie Dabasol — Pro Class drifter based in Clark, Philippines.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <ScrollToTop />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
