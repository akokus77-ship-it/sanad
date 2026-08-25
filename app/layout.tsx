import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";

const sans = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});

const display = Fraunces({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "سند | Sanad — فواتير وعروض أسعار",
  description:
    "Bilingual Arabic-first invoice and quotation PDF app for Saudi and Gulf small businesses. Not a ZATCA-certified e-invoice.",
  applicationName: "Sanad",
  icons: { icon: "/icon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${sans.variable} ${display.variable}`}>
      <body style={{ fontFamily: "var(--font-sans), Tahoma, sans-serif" }}>{children}</body>
    </html>
  );
}
