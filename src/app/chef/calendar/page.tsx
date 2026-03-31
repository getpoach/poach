"use client";
import { useState } from "react";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

type DayStatus = "available" | "booked" | "blocked" | "default";

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function ChefCalendar() {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [dayStatus, setDayStatus] = useState<Record<string, DayStatus>>({
    [`${today.getFullYear()}-${today.getMonth()}-29`]: "booked",
    [`${today.getFullYear()}-${today.getMonth()}-30`]: "booked",
    [`${today.getFullYear()}-${today.getMonth() + 1}-5`]: "booked",
    [`${today.getFullYear()}-${today.getMonth()}-15`]: "blocked",
    [`${today.getFullYear()}-${today.getMonth()}-22`]: "blocked",
  });
  const [paintMode, setPaintMode] = useState<DayStatus>("available");

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  function dayKey(day: number) {
    return `${viewYear}-${viewMonth}-${day}`;
  }

  function getStatus(day: number): DayStatus {
    return dayStatus[dayKey(day)] ?? "default";
  }

  function handleDayClick(day: number) {
    const key = dayKey(day);
    const current = dayStatus[key] ?? "default";
    if (current === paintMode) {
      setDayStatus((prev) => { const n = { ...prev }; delete n[key]; return n; });
    } else {
      setDayStatus((prev) => ({ ...prev, [key]: paintMode }));
    }
  }

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  }

  const STATUS_STYLES: Record<DayStatus, { bg: string; border: string; color: string }> = {
    available: { bg: "#7EC87E22", border: "#7EC87E55", color: "#7EC87E" },
    booked:    { bg: "#C8A97E22", border: "#C8A97E55", color: "#C8A97E" },
    blocked:   { bg: "#C87E7E18", border: "#C87E7E44", color: "#C87E7E" },
    default:   { bg: "transparent", border: "#1e1e1e", color: "#71717a" },
  };

  const counts = {
    available: Object.values(dayStatus).filter(s => s === "available").length,
    booked:    Object.values(dayStatus).filter(s => s === "booked").length,
    blocked:   Object.values(dayStatus).filter(s => s === "blocked").length,
  };

  return (
    <div style={{ padding: "32px 36px", maxWidth: 860 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: "#f5f0e8", fontFamily: "var(--font-playfair)", margin: "0 0 6px" }}>
          Availability Calendar
        </h1>
        <p style={{ fontSize: 13, color: "#71717a", margin: 0 }}>
          Click days to mark them. Diners can only book on days you mark as available.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 20 }}>
        {/* Calendar */}
        <div style={{ background: "#0f0f0f", border: "1px solid #1e1e1e", borderRadius: 16, overflow: "hidden" }}>
          {/* Month nav */}
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #1a1a1a", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <button onClick={prevMonth}
              style={{ padding: "6px 12px", borderRadius: 8, background: "transparent", border: "1px solid #27272a", color: "#a1a1aa", cursor: "pointer", fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}>
              ←
            </button>
            <span style={{ fontWeight: 800, color: "#f5f0e8", fontSize: 28, fontFamily: "var(--font-playfair)" }}>
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button onClick={nextMonth}
              style={{ padding: "6px 12px", borderRadius: 8, background: "transparent", border: "1px solid #27272a", color: "#a1a1aa", cursor: "pointer", fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}>
              →
            </button>
          </div>

          {/* Day headers */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", padding: "12px 16px 0" }}>
            {DAYS_OF_WEEK.map((d) => (
              <div key={d} style={{ textAlign: "center", fontSize: 11, fontWeight: 700, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.06em", paddingBottom: 8 }}>
                {d}
              </div>
            ))}
          </div>

          {/* Day grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, padding: "0 16px 16px" }}>
            {/* Empty cells for first week */}
            {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}

            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
              const status = getStatus(day);
              const s = STATUS_STYLES[status];
              const isPast = new Date(viewYear, viewMonth, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
              const isToday = day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();

              return (
                <button key={day}
                  onClick={() => !isPast && handleDayClick(day)}
                  style={{
                    aspectRatio: "1",
                    borderRadius: 8,
                    border: `1px solid ${isToday ? "#C8A97E" : s.border}`,
                    background: isToday ? "#C8A97E22" : s.bg,
                    color: isPast ? "#2a2a2a" : s.color,
                    fontSize: 13,
                    fontWeight: isToday ? 800 : 600,
                    cursor: isPast ? "default" : "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                    transition: "all 0.1s",
                    position: "relative",
                  }}
                >
                  {day}
                  {status === "booked" && (
                    <div style={{ position: "absolute", bottom: 3, left: "50%", transform: "translateX(-50%)", width: 4, height: 4, borderRadius: "50%", background: "#C8A97E" }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Paint mode */}
          <div style={{ background: "#0f0f0f", border: "1px solid #1e1e1e", borderRadius: 14, padding: "16px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
              Mark days as...
            </div>
            {([
              { value: "available" as DayStatus, label: "✓ Available", color: "#7EC87E", desc: "Open for bookings" },
              { value: "blocked"   as DayStatus, label: "✗ Blocked",   color: "#C87E7E", desc: "Not available" },
            ]).map((opt) => (
              <button key={opt.value} onClick={() => setPaintMode(opt.value)}
                style={{
                  width: "100%", padding: "10px 12px", borderRadius: 10, marginBottom: 8,
                  border: `1px solid ${paintMode === opt.value ? opt.color + "88" : "#1e1e1e"}`,
                  background: paintMode === opt.value ? opt.color + "18" : "#141414",
                  textAlign: "left", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                  transition: "all 0.15s",
                }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: paintMode === opt.value ? opt.color : "#a1a1aa" }}>{opt.label}</div>
                <div style={{ fontSize: 11, color: "#52525b", marginTop: 2 }}>{opt.desc}</div>
              </button>
            ))}
          </div>

          {/* Legend */}
          <div style={{ background: "#0f0f0f", border: "1px solid #1e1e1e", borderRadius: 14, padding: "16px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
              This Month
            </div>
            {([
              { color: "#7EC87E", label: "Available", count: counts.available },
              { color: "#C8A97E", label: "Booked",    count: counts.booked },
              { color: "#C87E7E", label: "Blocked",   count: counts.blocked },
            ]).map((item) => (
              <div key={item.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: item.color + "44", border: `1px solid ${item.color}88` }} />
                  <span style={{ fontSize: 13, color: "#a1a1aa" }}>{item.label}</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: item.color }}>{item.count}</span>
              </div>
            ))}
          </div>

          {/* Tip */}
          <div style={{ padding: "14px", borderRadius: 12, background: "#0a0a0a", border: "1px solid #1a1a1a", fontSize: 12, color: "#52525b", lineHeight: 1.6 }}>
            💡 Tip: Booked days are set automatically when a booking is confirmed. You can only block or open days manually.
          </div>
        </div>
      </div>
    </div>
  );
}
