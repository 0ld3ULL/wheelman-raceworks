import type { Metadata } from "next";
import GalleryContent from "./GalleryContent";

export const metadata: Metadata = {
  title: "Gallery — Drift Action & RX-7 Photos",
  description: "Photos from the track — Boodie Dabasol's Gulf Oil RX-7 FC, drift action, competitions, and behind the scenes at Clark International Speedway.",
  alternates: { canonical: "https://wheelmanraceworks.com/gallery" },
  openGraph: {
    title: "Gallery — Drift Action & RX-7 Photos | Wheelman Raceworks",
    description: "Drift action, the Gulf Oil RX-7 FC, trophies, and behind-the-scenes at Clark International Speedway.",
    url: "https://wheelmanraceworks.com/gallery",
    images: [{ url: "/images/rx7-drift-action.jpg", width: 1200, height: 630, alt: "Mazda RX-7 FC drift action" }],
  },
};

export default function GalleryPage() {
  return <GalleryContent />;
}
