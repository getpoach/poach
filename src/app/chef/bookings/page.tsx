"use client";
import { useState } from "react";

type BookingStatus = "upcoming" | "completed" | "cancelled";

interface Booking {
  id: string;
  diner: string;
  date: string;
  isoDate: string;
  time: string;
  guests: number;
  cuisine: string;
  total: number;
  status: BookingStatus;
  note: string;
}

const MOCK_BOOKINGS: Booking[] = [
  { id: "b1", diner: "Sarah & Tom Kim",    date: "Sat Mar 29", isoDate: "2026-03-29", time: "7:00 PM", guests: 5,  cuisine: "French",       total: 650,  status: "upcoming",  note: "Nut allergy — please avoid all tree nuts." },
  { id: "b2", diner: "The Broussard Fam",  date: "Sun Mar 30", isoDate: "2026-03-30", time: "6:30 PM", guests: 8,  cuisine: "Fusion",       total: 1040, status: "upcoming",  note: "" },
  { id: "b3", diner: "Marcus Webb",        date: "Sat Apr 5",  isoDate: "2026-04-05", time: "7:30 PM", guests: 6,  cuisine: "French",       total: 780,  status: "upcoming",  note: "Anniversary dinner — please make it special!" },
  { id: "b4", diner: "Layla Fontenot",     date: "Sun Mar 23", isoDate: "2026-03-23", time: "6:00 PM", guests: 4,  cuisine: "West African", total: 520,  status: "completed", note: "" },
  { id: "b5", diner: "Jake & Priya Patel", date: "Sat Mar 15", isoDate: "2026-03-15", time: "7:00 PM", guests: 2,  cuisine: "French",       total: 260,  status: "completed", note: "Vegetarian menu requested." },
  { id: "b6", diner: "Theo Landry",        date: "Fri Mar 7",  isoDate: "2026-03-07", time: "8:00 PM", guests: 10, cuisine: "Fusion",       total: 1300, status: "cancelled", note: "" },
];

const STATUS_COLORS: Record<BookingStatus, { bg: string; border: string; text: string; dot: string; label: string }> = {
  upcoming:  { bg: "#C8A97E18", border: "#C8A97E55", text: "#C8A97E", dot: "#C8A97E", label: "Upcoming"  },
  completed: { bg: "#7EC87E18", border: "#7EC87E55", text: "#7EC87E", dot: "#7EC87E", label: "Completed" },
  cancelled: { bg: "#C87E7E18", border: "#C87E7E55", text: "#C87E7E", dot: "#C87E7E", label: "Cancelled" },
};

const CAL_FILL: Record<BookingStatus, string> = {
  upcoming:  "#C8A97E",
  completed: "#5a9e5a",
  cancelled: "#b05555",
};

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function getDaysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }
function getFirstDay(y: number, m: number)    { return new Date(y, m, 1).getDay(); }

export default function ChefBookings() {
  const today = new Date();
  const [filter, setFilter] = useState<BookingStatus | "all">("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [viewYear, setViewYear]   = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const shown = filter === "all" ? MOCK_BOOKINGS : MOCK_BOOKINGS.filter((b) => b.status === filter);
  const earnings = MOCK_BOOKINGS.filter((b) => b.status === "completed").reduce((s, b) => s + b.total, 0);

  const byDate: Record<string, Booking[]> = {};
  MOCK_BOOKINGS.forEach((b) => {
    if (!byDate[b.isoDate]) byDate[b.isoDate] = [];
    byDate[b.isoDate].push(b);
  });

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay    = getFirstDay(viewYear, viewMonth);

  function isoKey(day: number) {
    const m = String(viewMonth + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    return `${viewYear}-${m}-${d}`;
  }

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
    setSelectedDay(null);
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
    setSelectedDay(null);
  }

  function dominantStatus(bookings: Booking[]): BookingStatus {
    if (bookings.some(b => b.status === "upcoming"))  return "upcoming";
    if (bookings.some(b => b.status === "completed")) return "completed";
    return "cancelled";
  }

  const selectedBookings = selectedDay ? (byDate[selectedDay] ?? []) : [];

  return (
    <div style={{ padding: "32px 36px", maxWidth: 960, fontFamily: "'DM Sans', sans-serif" }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: "#f5f0e8", fontFamily: "var(--font-playfair)", margin: "0 0 6px" }}>
          Bookings
        </h1>
        <p style={{ fontSize: 13, color: "#71717a", margin: 0 }}>
          {MOCK_BOOKINGS.filter(b => b.status === "upcoming").length} upcoming · ${earnings.toLocaleString()} earned this month
        </p>
      </div>

      {/* ── Calendar ─────────────────────────────────────────────────────── */}
      <div style={{ background: "#0f0f0f", border: "1px solid #1e1e1e", borderRadius: 16, overflow: "hidden", marginBottom: 32 }}>

        {/* Month nav */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid #1a1a1a" }}>
          <button onClick={prevMonth} style={{ padding: "6px 14px", borderRadius: 8, background: "transparent", border: "1px solid #27272a", color: "#a1a1aa", cursor: "pointer", fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}>←</button>
          <span style={{ fontWeight: 800, color: "#f5f0e8", fontSize: 16, fontFamily: "var(--font-playfair)" }}>
            {MONTHS[viewMonth]} {viewYear}
          </span>
          <button onClick={nextMonth} style={{ padding: "6px 14px", borderRadius: 8, background: "transparent", border: "1px solid #27272a", color: "#a1a1aa", cursor: "pointer", fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}>→</button>
        </div>

        {/* Day headers */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", padding: "12px 16px 0" }}>
          {DAYS_OF_WEEK.map(d => (
            <div key={d} style={{ textAlign: "center", fontSize: 11, fontWeight: 700, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.06em", paddingBottom: 8 }}>
              {d}
            </div>
          ))}
        </div>

        {/* Day grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, padding: "0 16px 16px" }}>
          {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
            const key = isoKey(day);
            const dayBookings = byDate[key] ?? [];
            const hasBookings = dayBookings.length > 0;
            const status = hasBookings ? dominantStatus(dayBookings) : null;
            const fill = status ? CAL_FILL[status] : null;
            const isToday = day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
            const isSelected = selectedDay === key;

            return (
              <button
                key={day}
                onClick={() => hasBookings && setSelectedDay(isSelected ? null : key)}
                style={{
                  aspectRatio: "1",
                  borderRadius: 8,
                  border: isSelected
                    ? `2px solid ${fill ?? "#C8A97E"}`
                    : isToday
                    ? "1px solid #C8A97E55"
                    : hasBookings
                    ? `1px solid ${fill}44`
                    : "1px solid #1a1a1a",
                  background: hasBookings
                    ? (fill + "28")
                    : isToday
                    ? "#C8A97E0a"
                    : "transparent",
                  color: "#ffffff",
                  fontSize: 13,
                  fontWeight: hasBookings ? 700 : 400,
                  cursor: hasBookings ? "pointer" : "default",
                  fontFamily: "'DM Sans', sans-serif",
                  position: "relative",
                  transition: "all 0.15s",
                }}
              >
                {day}
                {hasBookings && (
                  <div style={{ position: "absolute", bottom: 3, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 2 }}>
                    {dayBookings.slice(0, 3).map((b, i) => (
                      <div key={i} style={{ width: 4, height: 4, borderRadius: "50%", background: CAL_FILL[b.status] }} />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{ display: "flex", gap: 18, padding: "12px 20px", borderTop: "1px solid #1a1a1a", background: "#0a0a0a", alignItems: "center" }}>
          {(["upcoming", "completed", "cancelled"] as BookingStatus[]).map(s => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: CAL_FILL[s] + "44", border: `1px solid ${CAL_FILL[s]}88` }} />
              <span style={{ fontSize: 11, color: "#71717a", textTransform: "capitalize" }}>{s}</span>
            </div>
          ))}
          <span style={{ marginLeft: "auto", fontSize: 11, color: "#3f3f46" }}>Click a booking day to expand</span>
        </div>

        {/* Selected day drawer */}
        {selectedDay && selectedBookings.length > 0 && (
          <div style={{ borderTop: "1px solid #1a1a1a", padding: "16px 20px", background: "#0c0c0c" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
              {new Date(selectedDay + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {selectedBookings.map(b => {
                const s = STATUS_COLORS[b.status];
                return (
                  <div key={b.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 10, background: "#141414", border: `1px solid ${s.border}` }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#f5f0e8" }}>{b.diner}</div>
                      <div style={{ fontSize: 11, color: "#71717a" }}>{b.time} · {b.guests} guests · {b.cuisine}</div>
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: s.bg, border: `1px solid ${s.border}`, color: s.text }}>{s.label}</span>
                    <span style={{ fontWeight: 700, color: "#C8A97E", fontSize: 14 }}>${b.total}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── List view ──────────────────────────────────────────────────────── */}
      <h2 style={{ fontSize: 16, fontWeight: 800, color: "#f5f0e8", fontFamily: "var(--font-playfair)", margin: "0 0 14px" }}>
        All Bookings
      </h2>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {(["all", "upcoming", "completed", "cancelled"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{
              padding: "7px 14px", borderRadius: 99, fontSize: 12, fontWeight: 600, cursor: "pointer",
              border: `1px solid ${filter === f ? "#C8A97E" : "#2a2a2a"}`,
              background: filter === f ? "#C8A97E18" : "transparent",
              color: filter === f ? "#C8A97E" : "#71717a",
              fontFamily: "'DM Sans', sans-serif",
            }}>
            {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
            <span style={{ marginLeft: 6, background: "#1a1a1a", borderRadius: 99, padding: "1px 6px", fontSize: 10, color: "#71717a" }}>
              {f === "all" ? MOCK_BOOKINGS.length : MOCK_BOOKINGS.filter(b => b.status === f).length}
            </span>
          </button>
        ))}
      </div>

      {/* Booking rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {shown.map(booking => {
          const s = STATUS_COLORS[booking.status];
          const isOpen = expanded === booking.id;
          return (
            <div key={booking.id} style={{ background: "#0f0f0f", border: "1px solid #1e1e1e", borderRadius: 14, overflow: "hidden" }}>
              <div
                style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 16, cursor: "pointer" }}
                onClick={() => setExpanded(isOpen ? null : booking.id)}
              >
                <div style={{ width: 48, height: 48, borderRadius: 10, background: s.bg, border: `1px solid ${s.border}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: "#ffffff", textTransform: "uppercase" }}>{booking.date.split(" ")[0]}</div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: "#ffffff", lineHeight: 1 }}>{booking.date.split(" ")[1]}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                    <span style={{ fontWeight: 700, color: "#f5f0e8", fontSize: 14 }}>{booking.diner}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: s.bg, border: `1px solid ${s.border}`, color: s.text }}>{s.label}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "#71717a" }}>{booking.date} · {booking.time} · {booking.guests} guests · {booking.cuisine}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 800, color: "#C8A97E", fontSize: 16 }}>${booking.total}</div>
                  <div style={{ fontSize: 10, color: "#52525b", marginTop: 2 }}>{isOpen ? "▲" : "▼"}</div>
                </div>
              </div>

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
