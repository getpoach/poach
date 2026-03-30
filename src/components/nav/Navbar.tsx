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
    <>
      <style>{`
        @keyframes navBorderScroll {
          0%   { background-position: 0% 0; }
          100% { background-position: 400% 0; }
        }
        .poach-nav-border {
          position: relative;
        }
        .poach-nav-border::after {
          content: "";
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(
            to right,
            #C8A97E, #C8C87E, #7EC87E, #7EC8C8,
            #7E9BC8, #B87EC8, #C87E7E, #C8B87E,
            #C8A97E, #C8C87E, #7EC87E, #7EC8C8,
            #7E9BC8, #B87EC8, #C87E7E, #C8A97E
          );
          background-size: 400% 100%;
          animation: navBorderScroll 8s linear infinite;
        }
      `}</style>
      <nav className="poach-nav-border sticky top-0 z-40 bg-ink/95 backdrop-blur-xl">
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
  </>
  );
}
