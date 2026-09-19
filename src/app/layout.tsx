import type { Metadata } from "next";
import { Inter, Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Framer to HTML Exporter | NoCodeExport",
  description:
    "Free Framer exporter: 10 single-page exports a month, no credit card. Export Framer to HTML, CSS and JavaScript from a published URL; full sites on Pro.",
  keywords: [
    "Framer export",
    "Framer to HTML",
    "export Framer site",
    "Framer to code",
    "self-host Framer",
  ],
  openGraph: {
    title: "Framer to HTML Exporter | NoCodeExport",
    description:
      "Export your published Framer site as portable HTML, CSS and JavaScript for self-hosting, editing or developer handoff.",
    siteName: "NoCodeExport",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${outfit.variable} ${jetbrainsMono.variable} antialiased bg-background text-foreground font-sans`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
