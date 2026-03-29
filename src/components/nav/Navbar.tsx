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
    <nav className="sticky top-0 z-40 bg-ink/95 backdrop-blur-xl border-b border-zinc-900">
      <div className="max-w-6xl mx-auto px-6 flex items-center h-16 gap-5">

        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/poachlogo.png"
            alt="Poach"
            width={100}
            height={48}
            style={{
              height: 40,
              width: "auto",
              objectFit: "contain",
              // Mix-blend-mode screen removes the black background
              // so only the red logo shows on the dark navbar
              mixBlendMode: "screen",
            }}
            priority
          />
        </Link>

        <div className="flex-1 max-w-sm relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600 text-sm">🔍</span>
          <input
            placeholder="Search chefs, cuisine, dish..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-full py-2 pl-9 pr-4 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-zinc-700 transition-colors"
            onChange={(e) => {
              const event = new CustomEvent("poach-search", { detail: e.target.value });
              window.dispatchEvent(event);
            }}
          />
        </div>

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
