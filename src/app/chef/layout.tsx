"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/nav/Navbar";

const NAV_ITEMS = [
  { href: "/chef/dashboard",  icon: "◉",  label: "Dashboard"    },
  { href: "/chef/bookings",   icon: "📅", label: "Bookings"     },
  { href: "/chef/requests",   icon: "🔔", label: "Requests"     },
  { href: "/chef/calendar",   icon: "🗓️", label: "Availability" },
  { href: "/chef/menus",      icon: "🍽️", label: "Menus"        },
  { href: "/chef/profile",    icon: "👤", label: "My Profile"   },
];

const EXPANDED  = 220;
const COLLAPSED = 60;

export default function ChefLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const router   = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const sidebarW = collapsed ? COLLAPSED : EXPANDED;

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

  const initials = user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2);

  return (
    <div style={{ background: "#080808", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── Top Navbar (same as rest of site) ───────────────────────────── */}
      <Navbar />

      <div style={{ display: "flex" }}>

        {/* ── Sidebar ──────────────────────────────────────────────────── */}
        <aside style={{
          width: sidebarW,
          background: "#0a0a0a",
          borderRight: "1px solid #1a1a1a",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          top: 64,
          bottom: 0,
          left: 0,
          zIndex: 30,
          transition: "width 0.25s ease",
          overflow: "hidden",
        }}>

          {/* Collapse toggle */}
          <div style={{
            padding: "10px",
            display: "flex",
            justifyContent: collapsed ? "center" : "space-between",
            alignItems: "center",
            borderBottom: "1px solid #1a1a1a",
            gap: 8,
          }}>
            {!collapsed && (
              <div style={{ fontSize: 10, color: "#3f3f46", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", whiteSpace: "nowrap" }}>
                Chef Portal
              </div>
            )}
            <button
              onClick={() => setCollapsed(v => !v)}
              title={collapsed ? "Expand" : "Collapse"}
              style={{
                width: 26, height: 26, borderRadius: 7,
                background: "transparent", border: "1px solid #27272a",
                color: "#52525b", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, flexShrink: 0, transition: "all 0.15s",
              }}
            >
              {collapsed ? "→" : "←"}
            </button>
          </div>

          {/* Nav items */}
          <nav style={{ flex: 1, padding: collapsed ? "10px 6px" : "8px 8px", overflowY: "auto" }}>
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: collapsed ? "center" : "flex-start",
                    gap: collapsed ? 0 : 10,
                    padding: collapsed ? "10px 0" : "9px 12px",
                    borderRadius: 10,
                    marginBottom: 2,
                    fontSize: 13,
                    fontWeight: active ? 700 : 500,
                    color: active ? "#C8A97E" : "#71717a",
                    background: active ? "#C8A97E12" : "transparent",
                    border: `1px solid ${active ? "#C8A97E30" : "transparent"}`,
                    textDecoration: "none",
                    transition: "all 0.15s",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                  }}
                >
                  <span style={{ fontSize: 16, flexShrink: 0, textAlign: "center", width: collapsed ? "auto" : 20 }}>
                    {item.icon}
                  </span>
                  {!collapsed && item.label}
                </Link>
              );
            })}
          </nav>

          {/* User footer */}
          <div style={{ padding: collapsed ? "10px 6px" : "12px", borderTop: "1px solid #1a1a1a" }}>
            {!collapsed && (
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
                  background: "#C8A97E22", border: "1px solid #C8A97E55",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 800, color: "#C8A97E",
                }}>
                  {initials}
                </div>
                <div style={{ overflow: "hidden", minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#f5f0e8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name}</div>
                  <div style={{ fontSize: 10, color: "#52525b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.email}</div>
                </div>
              </div>
            )}

            {collapsed && (
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                background: "#C8A97E22", border: "1px solid #C8A97E55",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 800, color: "#C8A97E",
                margin: "0 auto 8px",
              }}>
                {initials}
              </div>
            )}

            <button
              onClick={() => { logout(); router.push("/login"); }}
              title={collapsed ? "Sign Out" : undefined}
              style={{
                width: "100%", padding: "7px",
                borderRadius: 8, background: "transparent",
                border: "1px solid #27272a", color: "#71717a",
                fontSize: collapsed ? 13 : 11, cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              {collapsed ? "↩" : "Sign Out"}
            </button>

            {!collapsed && (
              <Link href="/" style={{ display: "block", textAlign: "center", marginTop: 8, fontSize: 11, color: "#3f3f46", textDecoration: "none" }}>
                ← Back to Poach
              </Link>
            )}
          </div>
        </aside>

        {/* ── Main content ─────────────────────────────────────────────── */}
        <main style={{
          marginLeft: sidebarW,
          flex: 1,
          minHeight: "calc(100vh - 64px)",
          transition: "margin-left 0.25s ease",
        }}>
          {children}
        </main>
      </div>
    </div>
  );
}
