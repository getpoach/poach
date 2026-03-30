"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "🍴 Discover" },
    { href: "/bookings", label: "📅 Bookings" },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-ink/95 backdrop-blur-xl" style={{
      borderBottom: "1px solid transparent",
      backgroundImage: `linear-gradient(#080808f2, #080808f2), linear-gradient(to right, #C8A97E, #7EC8C8, #C87E7E, #B87EC8, #C8B87E, #7EC87E, #C8A97E, #7E9BC8, #C8C87E, #C87E7E, #7EC87E, #B87EC8, #7E9BC8, #C8A97E, #7EC8C8)`,
      backgroundOrigin: "border-box",
      backgroundClip: "padding-box, border-box",
    }}>
      <div className="max-w-6xl mx-auto px-6 flex items-center h-16 gap-5">

        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/poachnav.png"
            alt="Poach — Let's Cook."
            width={180}
            height={40}
            style={{
              height: 36,
              width: "auto",
              objectFit: "contain",
              mixBlendMode: "screen",
            }}
            priority
          />
        </Link>

        <div className="flex gap-1 ml-auto">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "px-3.5 py-2 rounded-xl text-sm transition-colors",
                pathname === href
                  ? "bg-zinc-900 text-white font-bold"
                  : "text-muted hover:text-white"
              )}
            >
              {label}
            </Link>
          ))}
        </div>

        <Link
          href="/join"
          className="bg-gold text-ink font-bold text-xs px-4 py-2 rounded-xl hover:opacity-85 transition-opacity shrink-0"
        >
          List as Chef
        </Link>
      </div>
    </nav>
  );
}
