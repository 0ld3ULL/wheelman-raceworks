import type { Metadata } from "next";
import NewsContent from "./NewsContent";

export const metadata: Metadata = {
  title: "News & Social",
  description: "Latest updates from Wheelman Raceworks — drift events, race results, and behind-the-scenes from Clark International Speedway.",
  alternates: { canonical: "https://wheelmanraceworks.com/news" },
  openGraph: {
    title: "News & Social | Wheelman Raceworks",
    description: "Latest drift events, race results, and updates from Clark International Speedway.",
    url: "https://wheelmanraceworks.com/news",
  },
};

export default function NewsPage() {
  return <NewsContent />;
}
