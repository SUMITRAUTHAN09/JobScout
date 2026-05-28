import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JobScout — Find Hidden Jobs From Company Career Pages", //this is the main title
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