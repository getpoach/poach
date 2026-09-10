"use client";
import { useState } from "react";
import { CalendarDays, Bell, UtensilsCrossed, Pencil, CheckCircle2, XCircle } from "lucide-react";
const G = ({ icon: I, size=14 }: { icon: React.ElementType; size?: number }) => 
  <I size={size} color="var(--gold)" strokeWidth={1.75} style={{ display:"inline-block", verticalAlign:"middle", marginRight:4 }} />;
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { chefs } from "@/data/chefs";

const MOCK_REQUESTS = [
  { id: "r1", diner: "Marcus Webb",    date: "Sat Apr 5",  guests: 6, cuisine: "French",     status: "pending",  amount: 780 },
  { id: "r2", diner: "Layla Fontenot", date: "Sun Apr 6",  guests: 4, cuisine: "Fusion",     status: "pending",  amount: 520 },
  { id: "r3", diner: "James Tran",     date: "Fri Apr 11", guests: 8, cuisine: "West African",status: "accepted", amount: 1040 },
];

const MOCK_UPCOMING = [
  { id: "b1", diner: "Sarah & Tom Kim",  date: "Sat Mar 29", time: "7:00 PM", guests: 5, total: 650 },
  { id: "b2", diner: "The Broussard Fam",date: "Sun Mar 30", time: "6:30 PM", guests: 8, total: 1040 },
];

function StatCard({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: string }) {
  return (
    <div style={{
      background: "var(--bg-secondary)",
      border: "1px solid #1e1e1e",
      borderRadius: 3,
      padding: "20px 22px",
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color: accent ?? "var(--text-primary)", fontFamily: "Georgia, serif", lineHeight: 1 }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 5 }}>{sub}</div>}
    </div>
  );
}

export default function ChefDashboard() {
  const { user } = useAuth();
  const chef = chefs.find((c) => c.id === user?.chefId) ?? chefs[0];
  const [requests, setRequests] = useState(MOCK_REQUESTS);

  function handleRequest(id: string, action: "accepted" | "declined") {
    setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: action } : r));
  }

  const pending = requests.filter((r) => r.status === "pending");
  const thisMonthEarnings = 3840;
  const totalBookings = 421;

  return (
    <div style={{ padding: "32px 36px", maxWidth: 1100 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 32 }}>
        {/* Chef photo */}
        <div style={{
          width: 80, height: 80, borderRadius: "50%", flexShrink: 0,
          overflow: "hidden", border: `3px solid ${chef.color}`,
          boxShadow: `0 0 20px ${chef.color}44`,
        }}>
          {chef.headshot
            ? <img src={chef.headshot} alt={chef.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <div style={{ width: "100%", height: "100%", background: chef.color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 800, color: chef.color }}>
                {chef.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
              </div>
          }
        </div>

        {/* Name + meta */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>
            Welcome back
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: "var(--text-primary)", fontFamily: "Georgia, serif", margin: "0 0 2px" }}>
            {chef.name} <span style={{ color: "var(--gold)" }}>✦</span>
          </h1>
          {chef.businessName && (
            <div style={{ fontSize: 18, fontWeight: 400, color: "var(--gold)", marginBottom: 4, fontFamily: "Georgia, serif", fontStyle: "italic", letterSpacing: "0.02em" }}>
              {chef.businessName}
            </div>
          )}
          <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>
            {chef.location} · {chef.cuisine.join(", ")}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 32 }}>
        <StatCard label="This Month" value={`$${thisMonthEarnings.toLocaleString()}`} sub="↑ 12% from last month" accent="var(--gold)" />
        <StatCard label="Total Bookings" value={String(totalBookings)} sub="All time" />
        <StatCard label="Avg. Rating" value={String(chef.rating)} sub={`${chef.reviewCount} reviews`} accent="#facc15" />
        <StatCard label="Pending Requests" value={String(pending.length)} sub="Awaiting your response" accent={pending.length > 0 ? "var(--gold)" : undefined} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

        {/* Incoming requests */}
        <div style={{ background: "var(--bg-secondary)", border: "1px solid #1e1e1e", borderRadius: 3, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #1a1a1a", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: 14 }}>🔔 Booking Requests</span>
            <Link href="/chef/requests" style={{ fontSize: 11, color: "var(--gold)", textDecoration: "none" }}>View all →</Link>
          </div>
          <div>
            {requests.map((req) => (
              <div key={req.id} style={{ padding: "14px 20px", borderBottom: "1px solid #141414" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <div>
                    <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: 13 }}>{req.diner}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{req.date} · {req.guests} guests · {req.cuisine}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 700, color: "var(--gold)", fontSize: 14 }}>${req.amount}</div>
                    {req.status === "pending" ? (
                      <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                        <button onClick={() => handleRequest(req.id, "accepted")}
                          style={{ padding: "4px 10px", borderRadius: 6, background: "var(--gold)", color: "var(--bg)", border: "none", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                          Accept
                        </button>
                        <button onClick={() => handleRequest(req.id, "declined")}
                          style={{ padding: "4px 10px", borderRadius: 6, background: "transparent", color: "var(--text-muted)", border: "1px solid #27272a", fontSize: 11, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                          Decline
                        </button>
                      </div>
                    ) : (
                      <div style={{ fontSize: 11, fontWeight: 700, marginTop: 6,
                        color: req.status === "accepted" ? "#7EC87E" : "#C87E7E" }}>
                        {req.status === "accepted" ? "✓ Accepted" : "✗ Declined"}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming sessions */}
        <div style={{ background: "var(--bg-secondary)", border: "1px solid #1e1e1e", borderRadius: 3, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #1a1a1a", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: 14 }}>📅 Upcoming Sessions</span>
            <Link href="/chef/bookings" style={{ fontSize: 11, color: "var(--gold)", textDecoration: "none" }}>View all →</Link>
          </div>
          <div>
            {MOCK_UPCOMING.map((b) => (
              <div key={b.id} style={{ padding: "16px 20px", borderBottom: "1px solid #141414", display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 3,
                  background: "#C8A97E18", border: "1px solid #C8A97E33",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "var(--gold)" }}>{b.date.split(" ")[0].toUpperCase()}</div>
                  <div style={{ fontSize: 15, fontWeight: 900, color: "var(--gold)", lineHeight: 1 }}>{b.date.split(" ")[1]}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: 13 }}>{b.diner}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{b.time} · {b.guests} guests</div>
                </div>
                <div style={{ fontWeight: 700, color: "var(--gold)", fontSize: 14 }}>${b.total}</div>
              </div>
            ))}
            {MOCK_UPCOMING.length === 0 && (
              <div style={{ padding: "32px", textAlign: "center", color: "var(--text-dim)", fontSize: 13 }}>
                No upcoming sessions
              </div>
            )}
          </div>

          {/* Quick links */}
          <div style={{ padding: "14px 20px", background: "var(--bg)", display: "flex", gap: 8 }}>
            <Link href="/chef/calendar" style={{ flex: 1, padding: "9px", borderRadius: 3, background: "var(--bg-tertiary)", border: "1px solid #1e1e1e", color: "var(--text-secondary)", fontSize: 12, textAlign: "center", textDecoration: "none" }}>
              🗓️ Set Availability
            </Link>
            <Link href="/chef/menus" style={{ flex: 1, padding: "9px", borderRadius: 3, background: "var(--bg-tertiary)", border: "1px solid #1e1e1e", color: "var(--text-secondary)", fontSize: 12, textAlign: "center", textDecoration: "none" }}>
              🍽️ Edit Menus
            </Link>
          </div>
        </div>
      </div>

      {/* Profile completion nudge */}
      <div style={{ marginTop: 20, padding: "16px 20px", borderRadius: 3, background: "var(--bg)", border: "1px solid #C8A97E30", display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: 14, marginBottom: 4 }}>
            ✦ Complete your profile to attract more bookings
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
            Add portfolio photos, update your bio, and create your signature menus.
          </div>
        </div>
        <Link href="/chef/profile" style={{ padding: "10px 18px", borderRadius: 3, background: "var(--gold)", color: "var(--bg)", fontWeight: 700, fontSize: 13, textDecoration: "none", whiteSpace: "nowrap" }}>
          Edit Profile
        </Link>
      </div>
    </div>
  );
}
