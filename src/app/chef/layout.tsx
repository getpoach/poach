"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

const NAV_ITEMS = [
  { href: "/chef/dashboard",  icon: "◉", label: "Dashboard" },
  { href: "/chef/bookings",   icon: "📅", label: "Bookings" },
  { href: "/chef/requests",   icon: "🔔", label: "Requests" },
  { href: "/chef/calendar",   icon: "🗓️", label: "Availability" },
  { href: "/chef/menus",      icon: "🍽️", label: "Menus" },
  { href: "/chef/profile",    icon: "👤", label: "My Profile" },
];

export default function ChefLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "chef")) {
      router.replace("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div style={{ minHeight: "100vh", background: "#080808", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#C8A97E", fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#080808", fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <aside style={{
        width: 220,
        background: "#0a0a0a",
        borderRight: "1px solid #1a1a1a",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        top: 0, bottom: 0, left: 0,
        zIndex: 40,
      }}>
        {/* Logo */}
        <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid #1a1a1a" }}>
          <Link href="/chef/dashboard">
            <Image
              src="/poachnav.png"
              alt="Poach"
              width={120}
              height={32}
              style={{ height: 28, width: "auto", objectFit: "contain", mixBlendMode: "screen" }}
            />
          </Link>
          <div style={{ fontSize: 10, color: "#52525b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 6 }}>
            Chef Portal
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 10px" }}>
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "9px 12px",
                  borderRadius: 10,
                  marginBottom: 2,
                  fontSize: 13,
                  fontWeight: active ? 700 : 500,
                  color: active ? "#C8A97E" : "#71717a",
                  background: active ? "#C8A97E12" : "transparent",
                  border: `1px solid ${active ? "#C8A97E30" : "transparent"}`,
                  textDecoration: "none",
                  transition: "all 0.15s",
                }}
              >
                <span style={{ fontSize: 15, width: 20, textAlign: "center" }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User footer */}
        <div style={{ padding: "16px", borderTop: "1px solid #1a1a1a" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{
              width: 34, height: 34, borderRadius: "50%",
              background: "#C8A97E22", border: "1px solid #C8A97E55",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 800, color: "#C8A97E",
            }}>
              {user.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#f5f0e8" }}>{user.name}</div>
              <div style={{ fontSize: 10, color: "#52525b" }}>{user.email}</div>
            </div>
          </div>
          <button
            onClick={() => { logout(); router.push("/login"); }}
            style={{
              width: "100%", padding: "8px", borderRadius: 8,
              background: "transparent", border: "1px solid #27272a",
              color: "#71717a", fontSize: 12, cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              transition: "all 0.15s",
            }}
          >
            Sign Out
          </button>
          <Link href="/" style={{ display: "block", textAlign: "center", marginTop: 8, fontSize: 11, color: "#3f3f46", textDecoration: "none" }}>
            ← Back to Poach
          </Link>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <main style={{ marginLeft: 220, flex: 1, minHeight: "100vh" }}>
        {children}
      </main>
    </div>
  );
}
