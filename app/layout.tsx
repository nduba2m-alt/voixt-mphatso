import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MPHATSO — VOIXT Album Launch Concert | 1 August 2026",
  description:
    "Join VOIXT for the MPHATSO Album Launch Concert on Saturday, 1 August 2026 in Lusaka, Zambia. Get your tickets now.",
  openGraph: {
    title: "MPHATSO — VOIXT Album Launch Concert",
    description: "Saturday, 1 August 2026 · Lusaka, Zambia",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
