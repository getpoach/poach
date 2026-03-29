import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "mapbox-gl/dist/mapbox-gl.css";
import "./globals.css";
import { Navbar } from "@/components/nav/Navbar";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "700", "900"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Poach — Private Chef Booking",
  description: "Book world-class chefs to cook in your home.",
  icons: {
    icon: "/poachpin.png",
    apple: "/poachpin.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${dmSans.variable} bg-ink text-white font-sans antialiased`}
      >
        <Navbar />
        <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
