import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { AuthProvider } from "@/lib/AuthContext";
import { ScrollToTop } from "./components/ScrollToTop";

const siteUrl = "https://wheelmanraceworks.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Wheelman Raceworks | Pro Drift & Motorsport Services",
    template: "%s | Wheelman Raceworks",
  },
  description: "Professional drift driving lessons, car tuning, and race prep by Boodie Dabasol — Pro Class drifter based in Clark, Philippines.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Wheelman Raceworks",
    images: [
      {
        url: "/images/rx7-drift-smoke.jpg",
        width: 1200,
        height: 630,
        alt: "Wheelman Raceworks — Pro Drift & Motorsport",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/rx7-drift-smoke.jpg"],
  },
  alternates: {
    canonical: siteUrl,
  },
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
