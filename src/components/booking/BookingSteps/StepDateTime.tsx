"use client";
import { useState } from "react";
import type { Chef } from "@/types";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS_SHORT = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const DAY_MAP: Record<string, number> = { Sun:0, Mon:1, Tue:2, Wed:3, Thu:4, Fri:5, Sat:6 };

const TIME_SLOTS = [
  "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM",
  "5:00 PM",  "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM",
];

interface StepDateTimeProps {
  chef: Chef;
  selectedDate: Date | null;
  time: string | null;
  onDate: (d: Date) => void;
  onTime: (t: string) => void;
  onNext: () => void;
}

function getDaysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }
function getFirstDay(y: number, m: number)    { return new Date(y, m, 1).getDay(); }

export function StepDateTime({ chef, selectedDate, time, onDate, onTime, onNext }: StepDateTimeProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewYear,  setViewYear]  = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay    = getFirstDay(viewYear, viewMonth);

  // Available day names from chef profile
  const availDays = new Set(chef.available.map(d => DAY_MAP[d]));

  function isAvailable(day: number): boolean {
    const date = new Date(viewYear, viewMonth, day);
    if (date <= today) return false; // must be future
    return availDays.has(date.getDay());
  }

  function isSelected(day: number): boolean {
    if (!selectedDate) return false;
    return selectedDate.getFullYear() === viewYear &&
           selectedDate.getMonth() === viewMonth &&
           selectedDate.getDate() === day;
  }

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  }

  // Don't allow going back before current month
  const canGoPrev = viewYear > today.getFullYear() || viewMonth > today.getMonth();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Calendar */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
          Select a Date
        </div>

        {/* Month nav */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <button onClick={prevMonth} disabled={!canGoPrev}
            style={{ width: 28, height: 28, borderRadius: 7, background: "var(--bg-tertiary)", border: "1px solid var(--border-strong)", color: canGoPrev ? "var(--text-primary)" : "var(--text-faint)", cursor: canGoPrev ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ChevronLeft size={14} strokeWidth={2} />
          </button>
          <span style={{ fontSize: 15, fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-playfair)" }}>
            {MONTHS[viewMonth]} {viewYear}
          </span>
          <button onClick={nextMonth}
            style={{ width: 28, height: 28, borderRadius: 7, background: "var(--bg-tertiary)", border: "1px solid var(--border-strong)", color: "var(--text-primary)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ChevronRight size={14} strokeWidth={2} />
          </button>
        </div>

        {/* Day headers */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: 4 }}>
          {DAYS_SHORT.map(d => (
            <div key={d} style={{ textAlign: "center", fontSize: 10, fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", paddingBottom: 6 }}>{d}</div>
          ))}
        </div>

        {/* Date grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3 }}>
          {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
            const avail = isAvailable(day);
            const sel   = isSelected(day);
            const isPast = new Date(viewYear, viewMonth, day) <= today;
            return (
              <button key={day}
                disabled={!avail}
                onClick={() => onDate(new Date(viewYear, viewMonth, day))}
                style={{
                  aspectRatio: "1",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: sel ? 800 : avail ? 600 : 400,
                  border: sel
                    ? `2px solid ${chef.color}`
                    : avail
                    ? `1px solid ${chef.color}88`
                    : "1px solid var(--border-mid)",
                  background: sel
                    ? chef.color
                    : avail
                    ? chef.color + "22"
                    : "var(--bg-tertiary)",
                  color: sel
                    ? "#ffffff"
                    : avail
                    ? chef.color
                    : "var(--text-dim)",
                  cursor: avail ? "pointer" : "default",
                  transition: "all 0.12s",
                  opacity: isPast ? 0.3 : 1,
                  boxShadow: sel ? `0 2px 8px ${chef.color}44` : "none",
                }}
              >
                {day}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{ display: "flex", gap: 12, marginTop: 10, fontSize: 10, color: "var(--text-secondary)" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: chef.color + "22", border: `1px solid ${chef.color}55`, display: "inline-block" }} />
            Available
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: "transparent", border: "1px solid var(--border-subtle)", display: "inline-block" }} />
            Unavailable
          </span>
        </div>
      </div>

      {/* Time slots */}
      {selectedDate && (
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
            Select a Time
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
            {TIME_SLOTS.map(t => {
              const sel = time === t;
              return (
                <button key={t} onClick={() => onTime(t)}
                  style={{
                    padding: "9px 6px",
                    borderRadius: 8,
                    fontSize: 12,
                    border: `1px solid ${sel ? chef.color : "var(--border-strong)"}`,
                    background: sel ? chef.color : "var(--bg-tertiary)",
                    color: sel ? "#ffffff" : "var(--text-primary)",
                    fontWeight: sel ? 700 : 500,
                    cursor: "pointer",
                    transition: "all 0.12s",
                    fontFamily: "'DM Sans', sans-serif",
                    boxShadow: sel ? `0 2px 8px ${chef.color}44` : "none",
                  }}>
                  {t}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <Button accentColor={chef.color} full disabled={!selectedDate || !time} onClick={onNext}>
        Continue →
      </Button>
    </div>
  );
}
