"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { Utensils, CalendarDays, User, LayoutDashboard, LogOut, BookOpen, Sparkles } from "lucide-react";
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

  // Get profile photo — chef headshot or diner uploaded avatar
  const chefData  = user?.role === "chef" ? chefs.find(c => c.id === user.chefId) ?? chefs[0] : null;
  const chefPhoto = user?.role === "chef" ? chefData?.headshot : user?.avatar;
  const initials  = user ? user.name.split(" ").map(n => n[0]).join("").slice(0, 2) : "";

  const navLinks = user?.role === "chef"
    ? [
        { href: "/",               label: "Discover"   },
        { href: "/chef/dashboard", label: "My Kitchen" },
      ]
    : user
    ? [
        { href: "/",               label: "Discover"        },
        { href: "/bookings",       label: "My Bookings"     },
        { href: "/recommendations",label: "Recommendations" },
      ]
    : [
        { href: "/", label: "Discover" },
      ];

  return (
    <>
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
                {label === "Discover"         && <Utensils         size={13} color="#C8A97E" strokeWidth={1.75} />}
                {label === "My Bookings"     && <CalendarDays      size={13} color="#C8A97E" strokeWidth={1.75} />}
                {label === "My Kitchen"      && <LayoutDashboard   size={13} color="#C8A97E" strokeWidth={1.75} />}
                {label === "Recommendations" && <Sparkles          size={13} color="#C8A97E" strokeWidth={1.75} />}
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
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", overflow: "hidden", background: "#1a1a1a", border: "1px solid #27272a", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {chefPhoto
                          ? <img src={chefPhoto} alt={user.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          : <span style={{ fontSize: 11, fontWeight: 700, color: "#C8A97E" }}>{initials}</span>
                        }
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#f5f0e8" }}>{user.name}</div>
                        <div style={{ fontSize: 11, color: "#52525b" }}>{user.email}</div>
                      </div>
                    </div>
                  </div>

                  {/* Chef options */}
                  {user.role === "chef" && (<>
                    <Link href="/chef/dashboard" className="nav-dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <LayoutDashboard size={15} color="#C8A97E" strokeWidth={1.75} /> My Kitchen
                    </Link>
                    <Link href="/chef/profile" className="nav-dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <User size={15} color="#C8A97E" strokeWidth={1.75} /> My Profile
                    </Link>
                  </>)}

                  {/* Diner options */}
                  {user.role === "diner" && (<>
                    <Link href="/bookings" className="nav-dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <BookOpen size={15} color="#C8A97E" strokeWidth={1.75} /> My Bookings
                    </Link>
                    <Link href="/recommendations" className="nav-dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <Sparkles size={15} color="#C8A97E" strokeWidth={1.75} /> Recommendations
                    </Link>
                    <Link href="/profile" className="nav-dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <User size={15} color="#C8A97E" strokeWidth={1.75} /> My Profile
                    </Link>
                  </>)}

                  <div className="nav-dropdown-divider" />

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
