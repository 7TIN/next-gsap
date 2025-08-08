import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Scroll Video Frames",
  description: "Scroll-triggered video made from frames using GSAP"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    // REMOVED overflow-hidden from here
    <html lang="en" className="h-full bg-white">
      {/* REMOVED overflow-hidden from here */}
      <body className="h-full m-0 p-0">{children}</body>
    </html>
  );
}