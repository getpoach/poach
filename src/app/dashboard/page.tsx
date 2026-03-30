"use client";
import { useState } from "react";
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
      background: "#0f0f0f",
      border: "1px solid #1e1e1e",
      borderRadius: 14,
      padding: "20px 22px",
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color: accent ?? "#f5f0e8", fontFamily: "var(--font-playfair)", lineHeight: 1 }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: 11, color: "#52525b", marginTop: 5 }}>{sub}</div>}
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
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>
          Welcome back
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: "#f5f0e8", fontFamily: "var(--font-playfair)", margin: 0 }}>
          {chef.name} <span style={{ color: "#C8A97E" }}>✦</span>
        </h1>
        <p style={{ fontSize: 13, color: "#71717a", marginTop: 6 }}>
          {chef.location} · {chef.cuisine.join(", ")}
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 32 }}>
        <StatCard label="This Month" value={`$${thisMonthEarnings.toLocaleString()}`} sub="↑ 12% from last month" accent="#C8A97E" />
        <StatCard label="Total Bookings" value={String(totalBookings)} sub="All time" />
        <StatCard label="Avg. Rating" value={String(chef.rating)} sub={`${chef.reviewCount} reviews`} accent="#facc15" />
        <StatCard label="Pending Requests" value={String(pending.length)} sub="Awaiting your response" accent={pending.length > 0 ? "#C8A97E" : undefined} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

        {/* Incoming requests */}
        <div style={{ background: "#0f0f0f", border: "1px solid #1e1e1e", borderRadius: 16, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #1a1a1a", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontWeight: 700, color: "#f5f0e8", fontSize: 14 }}>🔔 Booking Requests</span>
            <Link href="/chef/requests" style={{ fontSize: 11, color: "#C8A97E", textDecoration: "none" }}>View all →</Link>
          </div>
          <div>
            {requests.map((req) => (
              <div key={req.id} style={{ padding: "14px 20px", borderBottom: "1px solid #141414" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <div>
                    <div style={{ fontWeight: 700, color: "#f5f0e8", fontSize: 13 }}>{req.diner}</div>
                    <div style={{ fontSize: 11, color: "#71717a" }}>{req.date} · {req.guests} guests · {req.cuisine}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 700, color: "#C8A97E", fontSize: 14 }}>${req.amount}</div>
                    {req.status === "pending" ? (
                      <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                        <button onClick={() => handleRequest(req.id, "accepted")}
                          style={{ padding: "4px 10px", borderRadius: 6, background: "#C8A97E", color: "#080808", border: "none", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                          Accept
                        </button>
                        <button onClick={() => handleRequest(req.id, "declined")}
                          style={{ padding: "4px 10px", borderRadius: 6, background: "transparent", color: "#71717a", border: "1px solid #27272a", fontSize: 11, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
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
        <div style={{ background: "#0f0f0f", border: "1px solid #1e1e1e", borderRadius: 16, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #1a1a1a", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontWeight: 700, color: "#f5f0e8", fontSize: 14 }}>📅 Upcoming Sessions</span>
            <Link href="/chef/bookings" style={{ fontSize: 11, color: "#C8A97E", textDecoration: "none" }}>View all →</Link>
          </div>
          <div>
            {MOCK_UPCOMING.map((b) => (
              <div key={b.id} style={{ padding: "16px 20px", borderBottom: "1px solid #141414", display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 10,
                  background: "#C8A97E18", border: "1px solid #C8A97E33",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#C8A97E" }}>{b.date.split(" ")[0].toUpperCase()}</div>
                  <div style={{ fontSize: 15, fontWeight: 900, color: "#C8A97E", lineHeight: 1 }}>{b.date.split(" ")[1]}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: "#f5f0e8", fontSize: 13 }}>{b.diner}</div>
                  <div style={{ fontSize: 11, color: "#71717a" }}>{b.time} · {b.guests} guests</div>
                </div>
                <div style={{ fontWeight: 700, color: "#C8A97E", fontSize: 14 }}>${b.total}</div>
              </div>
            ))}
            {MOCK_UPCOMING.length === 0 && (
              <div style={{ padding: "32px", textAlign: "center", color: "#52525b", fontSize: 13 }}>
                No upcoming sessions
              </div>
            )}
          </div>

          {/* Quick links */}
          <div style={{ padding: "14px 20px", background: "#0a0a0a", display: "flex", gap: 8 }}>
            <Link href="/chef/calendar" style={{ flex: 1, padding: "9px", borderRadius: 8, background: "#141414", border: "1px solid #1e1e1e", color: "#a1a1aa", fontSize: 12, textAlign: "center", textDecoration: "none" }}>
              🗓️ Set Availability
            </Link>
            <Link href="/chef/menus" style={{ flex: 1, padding: "9px", borderRadius: 8, background: "#141414", border: "1px solid #1e1e1e", color: "#a1a1aa", fontSize: 12, textAlign: "center", textDecoration: "none" }}>
              🍽️ Edit Menus
            </Link>
          </div>
        </div>
      </div>

      {/* Profile completion nudge */}
      <div style={{ marginTop: 20, padding: "16px 20px", borderRadius: 14, background: "#0a0a0a", border: "1px solid #C8A97E30", display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, color: "#f5f0e8", fontSize: 14, marginBottom: 4 }}>
            ✦ Complete your profile to attract more bookings
          </div>
          <div style={{ fontSize: 12, color: "#71717a" }}>
            Add portfolio photos, update your bio, and create your signature menus.
          </div>
        </div>
        <Link href="/chef/profile" style={{ padding: "10px 18px", borderRadius: 10, background: "#C8A97E", color: "#080808", fontWeight: 700, fontSize: 13, textDecoration: "none", whiteSpace: "nowrap" }}>
          Edit Profile
        </Link>
      </div>
    </div>
  );
}
