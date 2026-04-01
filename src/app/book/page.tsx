import type { Metadata } from "next";
import BookContent from "./BookContent";

export const metadata: Metadata = {
  title: "Book a Session",
  description: "Book drift lessons, race driving courses, car tuning, or an all-inclusive Track Week with Pro Class driver Boodie Dabasol at Clark International Speedway, Philippines.",
  alternates: { canonical: "https://wheelmanraceworks.com/book" },
  openGraph: {
    title: "Book a Session | Wheelman Raceworks",
    description: "Drift lessons from ₱2,500. All-inclusive Track Weeks from $5,000. Pro coaching at Clark International Speedway.",
    url: "https://wheelmanraceworks.com/book",
  },
};

export default function BookPage() {
  return <BookContent />;
}
