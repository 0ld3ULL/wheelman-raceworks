import type { Metadata } from "next";
import EventsContent from "./EventsContent";

export const metadata: Metadata = {
  title: "Events — Drift Competitions & Track Days",
  description: "Upcoming drift competitions, track days, and driving lessons at Clark International Speedway. RSVP to join the Wheelman Raceworks community.",
  alternates: { canonical: "https://wheelmanraceworks.com/events" },
  openGraph: {
    title: "Events — Drift Competitions & Track Days | Wheelman Raceworks",
    description: "Upcoming drift competitions, track days, and lessons at Clark International Speedway.",
    url: "https://wheelmanraceworks.com/events",
  },
};

export default function EventsPage() {
  return <EventsContent />;
}
