import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/toaster";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const outfit = Outfit({ variable: "--font-outfit", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "SnapSite — Export any website to HTML, CSS & JS",
  description:
    "SnapSite turns a published site into portable HTML, CSS and JavaScript: scan the URL, pick your pages, download a ready-to-host ZIP.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${outfit.variable} antialiased bg-white text-slate-900`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
