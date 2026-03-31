"use client";
import { useState } from "react";

type BookingStatus = "upcoming" | "completed" | "cancelled";

const MOCK_BOOKINGS = [
  { id: "b1", diner: "Sarah & Tom Kim",    date: "Sat Mar 29", time: "7:00 PM", guests: 5, cuisine: "French",      total: 650,  status: "upcoming"  as BookingStatus, note: "Nut allergy — please avoid all tree nuts." },
  { id: "b2", diner: "The Broussard Fam",  date: "Sun Mar 30", time: "6:30 PM", guests: 8, cuisine: "Fusion",      total: 1040, status: "upcoming"  as BookingStatus, note: "" },
  { id: "b3", diner: "Marcus Webb",        date: "Sat Apr 5",  time: "7:30 PM", guests: 6, cuisine: "French",      total: 780,  status: "upcoming"  as BookingStatus, note: "Anniversary dinner — please make it special!" },
  { id: "b4", diner: "Layla Fontenot",     date: "Sun Mar 23", time: "6:00 PM", guests: 4, cuisine: "West African",total: 520,  status: "completed" as BookingStatus, note: "" },
  { id: "b5", diner: "Jake & Priya Patel", date: "Sat Mar 15", time: "7:00 PM", guests: 2, cuisine: "French",      total: 260,  status: "completed" as BookingStatus, note: "Vegetarian menu requested." },
  { id: "b6", diner: "Theo Landry",        date: "Fri Mar 7",  time: "8:00 PM", guests: 10,cuisine: "Fusion",      total: 1300, status: "cancelled" as BookingStatus, note: "" },
];

const STATUS_COLORS: Record<BookingStatus, { bg: string; border: string; text: string; label: string }> = {
  upcoming:  { bg: "#C8A97E18", border: "#C8A97E44", text: "#C8A97E", label: "Upcoming" },
  completed: { bg: "#7EC87E18", border: "#7EC87E44", text: "#7EC87E", label: "Completed" },
  cancelled: { bg: "#C87E7E18", border: "#C87E7E44", text: "#C87E7E", label: "Cancelled" },
};

export default function ChefBookings() {
  const [filter, setFilter] = useState<BookingStatus | "all">("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const shown = filter === "all" ? MOCK_BOOKINGS : MOCK_BOOKINGS.filter((b) => b.status === filter);
  const earnings = MOCK_BOOKINGS.filter((b) => b.status === "completed").reduce((s, b) => s + b.total, 0);

  return (
    <div style={{ padding: "32px 36px", maxWidth: 900 }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: "#f5f0e8", fontFamily: "var(--font-playfair)", margin: "0 0 6px" }}>
          Bookings
        </h1>
        <p style={{ fontSize: 13, color: "#71717a", margin: 0 }}>
          {MOCK_BOOKINGS.filter((b) => b.status === "upcoming").length} upcoming · ${earnings.toLocaleString()} earned this month
        </p>
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
        {(["all", "upcoming", "completed", "cancelled"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            style={{
              padding: "7px 14px", borderRadius: 99, fontSize: 12, fontWeight: 600, cursor: "pointer",
              border: `1px solid ${filter === f ? "#C8A97E" : "#2a2a2a"}`,
              background: filter === f ? "#C8A97E18" : "transparent",
              color: filter === f ? "#C8A97E" : "#71717a",
              fontFamily: "'DM Sans', sans-serif",
              textTransform: "capitalize",
            }}>
            {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
            <span style={{ marginLeft: 6, background: "#1a1a1a", borderRadius: 99, padding: "1px 6px", fontSize: 10 }}>
              {f === "all" ? MOCK_BOOKINGS.length : MOCK_BOOKINGS.filter((b) => b.status === f).length}
            </span>
          </button>
        ))}
      </div>

      {/* Bookings list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {shown.map((booking) => {
          const s = STATUS_COLORS[booking.status];
          const isOpen = expanded === booking.id;
          return (
            <div key={booking.id}
              style={{ background: "#0f0f0f", border: "1px solid #1e1e1e", borderRadius: 14, overflow: "hidden" }}>
              {/* Main row */}
              <div
                style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 16, cursor: "pointer" }}
                onClick={() => setExpanded(isOpen ? null : booking.id)}
              >
                {/* Date block */}
                <div style={{ width: 48, height: 48, borderRadius: 10, background: s.bg, border: `1px solid ${s.border}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: s.text, textTransform: "uppercase" }}>{booking.date.split(" ")[0]}</div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: s.text, lineHeight: 1 }}>{booking.date.split(" ")[1]}</div>
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                    <span style={{ fontWeight: 700, color: "#f5f0e8", fontSize: 14 }}>{booking.diner}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: s.bg, border: `1px solid ${s.border}`, color: s.text }}>
                      {s.label}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: "#71717a" }}>
                    {booking.date} · {booking.time} · {booking.guests} guests · {booking.cuisine}
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 800, color: "#C8A97E", fontSize: 16 }}>${booking.total}</div>
                  <div style={{ fontSize: 10, color: "#52525b", marginTop: 2 }}>{isOpen ? "▲" : "▼"}</div>
                </div>
              </div>

              {/* Expanded detail */}
              {isOpen && (
                <div style={{ padding: "0 20px 20px", borderTop: "1px solid #141414" }}>
                  <div style={{ paddingTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div style={{ background: "#141414", borderRadius: 10, padding: "12px 14px" }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Session Details</div>
                      <div style={{ fontSize: 12, color: "#a1a1aa", lineHeight: 1.8 }}>
                        <div>⏰ {booking.time}</div>
                        <div>👥 {booking.guests} guests</div>
                        <div>🍽️ {booking.cuisine} menu</div>
                      </div>
                    </div>
                    <div style={{ background: "#141414", borderRadius: 10, padding: "12px 14px" }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Guest Note</div>
                      <div style={{ fontSize: 12, color: booking.note ? "#a1a1aa" : "#52525b", fontStyle: booking.note ? "normal" : "italic", lineHeight: 1.6 }}>
                        {booking.note || "No special notes"}
                      </div>
                    </div>
                  </div>
                  {booking.status === "upcoming" && (
                    <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                      <button style={{ padding: "8px 16px", borderRadius: 8, background: "#141414", border: "1px solid #27272a", color: "#a1a1aa", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                        Message Diner
                      </button>
                      <button style={{ padding: "8px 16px", borderRadius: 8, background: "#C87E7E18", border: "1px solid #C87E7E44", color: "#C87E7E", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                        Cancel Booking
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
