"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { Utensils, CalendarDays, User, LayoutDashboard, LogOut } from "lucide-react";
const G = ({ icon: I, size=14 }: { icon: React.ElementType; size?: number }) => 
  <I size={size} color="#C8A97E" strokeWidth={1.75} style={{ display:"inline-block", verticalAlign:"middle" }} />;
import { chefs } from "@/data/chefs";

export function Navbar() {
  const pathname = usePathname();
  const router   = useRouter();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Get chef headshot if logged in as chef
  const chefData = user?.role === "chef"
    ? chefs.find(c => c.id === user.chefId) ?? chefs[0]
    : null;
  const chefPhoto = chefData?.headshot;
  const initials  = user ? user.name.split(" ").map(n => n[0]).join("").slice(0, 2) : "";

  const navLinks = user?.role === "chef"
    ? [
        { href: "/",               label: "Discover"   },
        { href: "/chef/dashboard", label: "My Kitchen" },
      ]
    : user
    ? [
        { href: "/",         label: "Discover" },
        { href: "/bookings", label: "Bookings" },
      ]
    : [
        { href: "/", label: "Discover" },
      ];

  return (
    <>
      <style>{`
        @keyframes navBorderScroll {
          0%   { background-position: 0% 0; }
          100% { background-position: 400% 0; }
        }
        .poach-nav-border { position: relative; }
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
        .chef-avatar-btn { background: none; border: none; cursor: pointer; padding: 0; }
        .chef-avatar-btn:focus { outline: none; }
        .nav-dropdown {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          min-width: 180px;
          background: #0f0f0f;
          border: 1px solid #27272a;
          border-radius: 12px;
          overflow: hidden;
          z-index: 100;
          box-shadow: 0 8px 32px rgba(0,0,0,0.5);
          animation: dropIn 0.15s ease;
        }
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .nav-dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 11px 16px;
          font-size: 13px;
          font-weight: 500;
          color: #a1a1aa;
          text-decoration: none;
          cursor: pointer;
          background: none;
          border: none;
          width: 100%;
          text-align: left;
          font-family: 'DM Sans', sans-serif;
          transition: background 0.1s, color 0.1s;
        }
        .nav-dropdown-item:hover { background: #161616; color: #f5f0e8; }
        .nav-dropdown-item.danger:hover { background: #1a0e0e; color: #C87E7E; }
        .nav-dropdown-divider { height: 1px; background: #1e1e1e; }
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
              style={{ height: 36, width: "auto", objectFit: "contain", mixBlendMode: "screen" }}
              priority
            />
          </Link>

          {/* Nav links */}
          <div className="flex gap-1 ml-auto">
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href}
                className={cn(
                  "px-3.5 py-2 rounded-xl text-sm transition-colors flex items-center gap-1.5",
                  pathname === href ? "bg-zinc-900 text-white font-bold" : "text-muted hover:text-white"
                )}
              >
                {label === "Discover"   && <Utensils    size={13} color="#C8A97E" strokeWidth={1.75} />}
                {label === "Bookings"   && <CalendarDays size={13} color="#C8A97E" strokeWidth={1.75} />}
                {label === "My Kitchen" && <LayoutDashboard size={13} color="#C8A97E" strokeWidth={1.75} />}
                {label}
              </Link>
            ))}
          </div>

          {/* Right side — auth */}
          {user ? (
            /* Logged in — chef photo / initials avatar with dropdown */
            <div ref={dropdownRef} style={{ position: "relative" }}>
              <button
                className="chef-avatar-btn"
                onClick={() => setDropdownOpen(v => !v)}
                title={user.name}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  overflow: "hidden",
                  border: `2px solid ${dropdownOpen ? "#C8A97E" : "#27272a"}`,
                  transition: "border-color 0.15s",
                  background: "#1a1a1a",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  {chefPhoto ? (
                    <img src={chefPhoto} alt={user.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#C8A97E" }}>{initials}</span>
                  )}
                </div>
              </button>

              {dropdownOpen && (
                <div className="nav-dropdown">
                  {/* User info header */}
                  <div style={{ padding: "12px 16px", borderBottom: "1px solid #1e1e1e" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#f5f0e8" }}>{user.name}</div>
                    <div style={{ fontSize: 11, color: "#52525b", marginTop: 2 }}>{user.email}</div>
                  </div>

                  {/* My Kitchen */}
                  <Link href="/chef/dashboard" className="nav-dropdown-item"
                    onClick={() => setDropdownOpen(false)}>
                    <LayoutDashboard size={15} color="#C8A97E" strokeWidth={1.75} /> My Kitchen
                  </Link>

                  {/* My Profile */}
                  <Link href="/chef/profile" className="nav-dropdown-item"
                    onClick={() => setDropdownOpen(false)}>
                    <G icon={User} size={15} /> My Profile
                  </Link>

                  <div className="nav-dropdown-divider" />

                  {/* Sign Out */}
                  <button className="nav-dropdown-item danger"
                    onClick={() => { setDropdownOpen(false); logout(); router.push("/"); }}>
                    <LogOut size={15} color="#C87E7E" strokeWidth={1.75} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login"
              className="text-xs text-zinc-400 hover:text-white transition-colors px-3 py-2 rounded-xl hover:bg-zinc-900 shrink-0">
              Sign in
            </Link>
          )}

          {/* List as Chef — only shown when not logged in as chef */}
          {user?.role !== "chef" && (
            <Link href="/join"
              className="bg-gold text-ink font-bold text-xs px-4 py-2 rounded-xl hover:opacity-85 transition-opacity shrink-0">
              List as Chef
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}
