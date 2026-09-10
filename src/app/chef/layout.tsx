"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { LayoutDashboard, CalendarDays, Bell, CalendarRange, UtensilsCrossed, User, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
const G = ({ icon: I, size=16, color="var(--gold)" }: { icon: React.ElementType; size?: number; color?: string }) => 
  <I size={size} color={color} strokeWidth={1.75} style={{ display:"inline-block", verticalAlign:"middle" }} />;
import { Navbar } from "@/components/nav/Navbar";
import { chefs } from "@/data/chefs";

const NAV_ITEMS = [
  { href: "/chef/dashboard",  icon: LayoutDashboard,  label: "My Kitchen"   },
  { href: "/chef/bookings",   icon: CalendarDays,     label: "Bookings"     },
  { href: "/chef/requests",   icon: Bell,             label: "Requests"     },
  { href: "/chef/calendar",   icon: CalendarRange,    label: "Availability" },
  { href: "/chef/menus",      icon: UtensilsCrossed,  label: "Menus"        },
];

const EXPANDED  = 220;
const COLLAPSED = 60;

export default function ChefLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
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
      <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "var(--gold)", fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>Loading...</div>
      </div>
    );
  }

  const initials  = user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2);
  const chefData  = chefs.find(c => c.id === user.chefId) ?? chefs[0];
  const chefColor = chefData?.color ?? "var(--gold)";

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── Top Navbar — sticky, always on top ───────────────────────── */}
      <div style={{ position: "sticky", top: 0, zIndex: 50 }}>
        <Navbar />
        <div className="nav-gradient-bar" />
      </div>

      <div style={{ display: "flex" }}>

        {/* ── Sidebar ──────────────────────────────────────────────────── */}
        <aside style={{
          width: sidebarW,
          background: "var(--bg)",
          borderRight: "0.5px solid var(--border-gold)",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          top: 64,
          bottom: 0,
          left: 0,
          zIndex: 30,
          transition: "width 0.25s ease",
          overflowX: "hidden",
          overflowY: "auto",
        }}>

          {/* Collapse toggle */}
          <div style={{
            padding: "10px",
            display: "flex",
            justifyContent: collapsed ? "center" : "space-between",
            alignItems: "center",
            borderBottom: "0.5px solid var(--border-gold)",
            gap: 8,
          }}>
            {!collapsed && (
              <div style={{ fontSize: 9, color: "var(--gold)", fontWeight: 400, textTransform: "uppercase", letterSpacing: "0.15em", whiteSpace: "nowrap", fontFamily: "Georgia, serif" }}>
                Chef Portal
              </div>
            )}
            <button
              onClick={() => setCollapsed(v => !v)}
              title={collapsed ? "Expand" : "Collapse"}
              style={{
                width: 26, height: 26, borderRadius: 7,
                background: "transparent", border: "1px solid #27272a",
                color: "var(--text-dim)", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, flexShrink: 0, transition: "all 0.15s",
              }}
            >
              {collapsed ? <ChevronRight size={12} color="var(--text-dim)" strokeWidth={2} /> : <ChevronLeft size={12} color="var(--text-dim)" strokeWidth={2} />}
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
                    borderRadius: 3,
                    marginBottom: 2,
                    fontSize: 13,
                    fontWeight: active ? 700 : 500,
                    color: active ? chefColor : "var(--text-muted)",
                    background: active ? "var(--gold)" + "18" : "transparent",
                    border: `0.5px solid ${active ? "var(--gold)" : "transparent"}`,
                    textDecoration: "none",
                    transition: "all 0.15s",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                  }}
                >
                  <span style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", width: collapsed ? "auto" : 20 }}>
                    <G icon={item.icon} size={16} color={active ? chefColor : "var(--text-muted)"} />
                  </span>
                  {!collapsed && item.label}
                </Link>
              );
            })}
          </nav>

          {/* My Profile — pinned above footer */}
          <div style={{ padding: collapsed ? "6px 6px" : "6px 8px", borderTop: "0.5px solid var(--border-gold)" }}>
            {(() => {
              const active = pathname === "/chef/profile";
              return (
                <Link
                  href="/chef/profile"
                  title={collapsed ? "My Profile" : undefined}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: collapsed ? "center" : "flex-start",
                    gap: collapsed ? 0 : 10,
                    padding: collapsed ? "10px 0" : "9px 12px",
                    borderRadius: 3,
                    fontSize: 13,
                    fontWeight: active ? 700 : 500,
                    color: active ? chefColor : "var(--text-muted)",
                    background: active ? "var(--gold)" + "18" : "transparent",
                    border: `0.5px solid ${active ? "var(--gold)" : "transparent"}`,
                    textDecoration: "none",
                    transition: "all 0.15s",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                  }}
                >
                  <span style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", width: collapsed ? "auto" : 20 }}>
                    <G icon={User} size={16} color={active ? chefColor : "var(--text-muted)"} />
                  </span>
                  {!collapsed && "My Profile"}
                </Link>
              );
            })()}
          </div>

          {/* Footer — Back to Poach */}
          <div style={{ padding: collapsed ? "10px 6px" : "12px", borderTop: "0.5px solid var(--border-gold)" }}>
            {!collapsed && (
              <Link href="/" style={{ display: "block", textAlign: "center", fontSize: 11, color: "var(--text-muted)", textDecoration: "none" }}>
                Back to Poach
              </Link>
            )}
            {collapsed && (
              <Link href="/" title="Back to Poach" style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "var(--border-strong)", textDecoration: "none" }}>
                ←
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
