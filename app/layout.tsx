import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CareerAI — Find Hidden Jobs From Company Career Pages",
  description:
    "AI-powered job discovery that searches official company career pages to find fresh opportunities tailored to your skills.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}