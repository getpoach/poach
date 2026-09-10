"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Clock, Users, UtensilsCrossed, Star, CreditCard, MessageCircle, XCircle } from "lucide-react";

type BookingStatus = "upcoming" | "completed" | "cancelled";
type PaymentStatus = "paid" | "pending" | "refunded";

interface Booking {
  id: string;
  chef: string;
  chefBusiness: string;
  date: string;
  isoDate: string;
  time: string;
  guests: number;
  cuisine: string;
  total: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  note: string;
  rating?: number;
  reviewText?: string;
}

const MOCK_BOOKINGS: Booking[] = [
  // ── Upcoming ────────────────────────────────────────────────────────────
  { id: "b1",  chef: "Beau Thibodaux",    chefBusiness: "Bayou Table",             date: "Sat May 9",  isoDate: "2026-05-09", time: "7:00 PM", guests: 5,  cuisine: "French",         total: 650,  status: "upcoming",  paymentStatus: "pending", note: "Nut allergy — please avoid all tree nuts." },
  { id: "b2",  chef: "Céleste Fontenot",  chefBusiness: "La Méditerranée",         date: "Sat May 16", isoDate: "2026-05-16", time: "7:30 PM", guests: 6,  cuisine: "Mediterranean",  total: 595,  status: "upcoming",  paymentStatus: "paid",    note: "Anniversary dinner — please make it special!" },
  { id: "b3",  chef: "Wesley Duhon",      chefBusiness: "Duhon's Reserve",         date: "Fri May 22", isoDate: "2026-05-22", time: "8:00 PM", guests: 4,  cuisine: "French",         total: 840,  status: "upcoming",  paymentStatus: "pending", note: "Celebrating a promotion — make it memorable!" },
  { id: "b4",  chef: "Marcus Delacroix",  chefBusiness: "Delacroix Experiential",  date: "Sat Jun 7",  isoDate: "2026-06-07", time: "7:00 PM", guests: 8,  cuisine: "Fusion",         total: 1100, status: "upcoming",  paymentStatus: "pending", note: "Birthday dinner for the whole crew." },
  // ── Completed ───────────────────────────────────────────────────────────
  { id: "b5",  chef: "Beau Thibodaux",    chefBusiness: "Bayou Table",             date: "Sat Apr 19", isoDate: "2026-04-19", time: "7:00 PM", guests: 6,  cuisine: "French",         total: 760,  status: "completed", paymentStatus: "paid",    note: "Wife's birthday — she loved it!", rating: 5, reviewText: "Beau outdid himself. Every course was perfect. Already planning our next booking." },
  { id: "b6",  chef: "Simone Trosclair",  chefBusiness: "Simone's Table",          date: "Sun Apr 6",  isoDate: "2026-04-06", time: "6:00 PM", guests: 4,  cuisine: "Southern",       total: 392,  status: "completed", paymentStatus: "paid",    note: "Vegetarian options needed for 2 guests.", rating: 5, reviewText: "Simone brought so much warmth and soul to our table. Absolutely beautiful food." },
  { id: "b7",  chef: "Céleste Fontenot",  chefBusiness: "La Méditerranée",         date: "Sat Mar 28", isoDate: "2026-03-28", time: "7:00 PM", guests: 4,  cuisine: "Mediterranean",  total: 480,  status: "completed", paymentStatus: "paid",    note: "", rating: 4, reviewText: "Wonderful food. The lamb was extraordinary. Will book again." },
  { id: "b8",  chef: "Anita Tureaud",     chefBusiness: "Tureaud & Table",         date: "Sat Mar 14", isoDate: "2026-03-14", time: "6:30 PM", guests: 8,  cuisine: "Creole",         total: 840,  status: "completed", paymentStatus: "paid",    note: "Family reunion dinner.", rating: 5, reviewText: "Anita cooked with so much love. Everyone left full and happy." },
  { id: "b9",  chef: "Beau Thibodaux",    chefBusiness: "Bayou Table",             date: "Sat Feb 28", isoDate: "2026-02-28", time: "7:30 PM", guests: 2,  cuisine: "French",         total: 268,  status: "completed", paymentStatus: "paid",    note: "Valentine's dinner.", rating: 5, reviewText: "The most romantic evening. Chef Beau set the perfect tone." },
  { id: "b10", chef: "Darnell Savoy",     chefBusiness: "Savoy Supper Club",       date: "Sat Feb 14", isoDate: "2026-02-14", time: "7:00 PM", guests: 6,  cuisine: "American",       total: 480,  status: "completed", paymentStatus: "paid",    note: "Supper club vibes please!", rating: 4, reviewText: "Darnell made our dinner feel like a real supper club night. The bananas Foster was showstopping." },
  { id: "b11", chef: "Jaxon Broussard",   chefBusiness: "The Smoking Spoon",       date: "Sat Jan 31", isoDate: "2026-01-31", time: "5:00 PM", guests: 12, cuisine: "Cajun",          total: 660,  status: "completed", paymentStatus: "paid",    note: "Super Bowl watch party food!", rating: 5, reviewText: "Best BBQ we've ever had. Jaxon brought the whole pit experience to our backyard." },
  // ── Cancelled ───────────────────────────────────────────────────────────
  { id: "b12", chef: "Théo Arceneaux",    chefBusiness: "Arceneaux Private Dining", date: "Sat Jan 17", isoDate: "2026-01-17", time: "7:00 PM", guests: 4,  cuisine: "Cajun",          total: 360,  status: "cancelled", paymentStatus: "refunded", note: "Had a scheduling conflict, unfortunately." },
];

const STATUS_COLORS: Record<BookingStatus, { bg: string; border: string; text: string; label: string; cal: string }> = {
  upcoming:  { bg: "#C8A97E18", border: "#C8A97E44", text: "#C8A97E", label: "Upcoming",  cal: "#C8A97E" },
  completed: { bg: "#7EC87E18", border: "#7EC87E44", text: "#7EC87E", label: "Completed", cal: "#5a9e5a" },
  cancelled: { bg: "#C87E7E18", border: "#C87E7E44", text: "#C87E7E", label: "Cancelled", cal: "#b05555" },
};

const PAY_COLORS: Record<PaymentStatus, string> = {
  paid: "#7EC87E", pending: "#C8A97E", refunded: "#C87E7E",
};

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS_OF_WEEK = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function getDaysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }
function getFirstDay(y: number, m: number)    { return new Date(y, m, 1).getDay(); }

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[1,2,3,4,5].map(i => (
        <button key={i} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(0)} onClick={() => onChange(i)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <Star size={22} fill={(hovered || value) >= i ? "#facc15" : "none"} color={(hovered || value) >= i ? "#facc15" : "var(--border-strong)"} strokeWidth={1.5} />
        </button>
      ))}
    </div>
  );
}

export default function DinerBookings() {
  const { user } = useAuth();
  const [filter, setFilter]     = useState<BookingStatus | "all">("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [reviewingId, setReviewingId]   = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText]     = useState("");
  const [payingId, setPayingId] = useState<string | null>(null);

  // Calendar
  const today = new Date();
  const [viewYear, setViewYear]   = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const shown    = filter === "all" ? bookings : bookings.filter(b => b.status === filter);
  const upcoming = bookings.filter(b => b.status === "upcoming").length;

  const byDate: Record<string, Booking[]> = {};
  bookings.forEach(b => { if (!byDate[b.isoDate]) byDate[b.isoDate] = []; byDate[b.isoDate].push(b); });

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay    = getFirstDay(viewYear, viewMonth);

  function isoKey(day: number) {
    return `${viewYear}-${String(viewMonth + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
  }
  function prevMonth() { if (viewMonth === 0) { setViewYear(y => y-1); setViewMonth(11); } else setViewMonth(m => m-1); setSelectedDay(null); }
  function nextMonth() { if (viewMonth === 11) { setViewYear(y => y+1); setViewMonth(0); } else setViewMonth(m => m+1); setSelectedDay(null); }

  function dominantStatus(bs: Booking[]): BookingStatus {
    if (bs.some(b => b.status === "upcoming"))  return "upcoming";
    if (bs.some(b => b.status === "completed")) return "completed";
    return "cancelled";
  }

  function submitReview(id: string) {
    if (!reviewRating) return;
    setBookings(prev => prev.map(b => b.id === id ? { ...b, rating: reviewRating, reviewText } : b));
    setReviewingId(null); setReviewRating(0); setReviewText("");
  }
  function submitPayment(id: string) {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, paymentStatus: "paid" } : b));
    setPayingId(null);
  }

  const initials = user ? user.name.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase() : "";

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "var(--bg-tertiary)", border: "1px solid var(--border-mid)", borderRadius: 3,
    padding: "10px 14px", fontSize: 13, color: "var(--text-primary)", outline: "none",
    fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box",
  };

  return (
    <div style={{ maxWidth: 900, fontFamily: "'DM Sans', sans-serif", margin: "0 auto" }}>

      {/* ── User header ───────────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 32 }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", overflow: "hidden", border: "3px solid #C8A97E", boxShadow: "0 0 18px #C8A97E33", flexShrink: 0, background: "var(--bg-hover)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {user?.avatar
            ? <img src={user.avatar} alt={user?.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <span style={{ fontSize: 22, fontWeight: 800, color: "#C8A97E" }}>{initials}</span>
          }
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Welcome back</div>
          <h1 style={{ fontSize: 26, fontWeight: 400, color: "var(--text-primary)", fontFamily: "Georgia, serif", letterSpacing: "-0.01em", margin: "0 0 4px" }}>
            {user?.name ?? "My Bookings"}
          </h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>
            {upcoming} upcoming · {bookings.filter(b => b.status === "completed").length} completed
          </p>
        </div>
      </div>

      {/* ── Calendar ──────────────────────────────────────────────────── */}
      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 3, overflow: "hidden", marginBottom: 28 }}>
        {/* Month nav */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: "1px solid var(--border-subtle)" }}>
          <button onClick={prevMonth} style={{ padding: "5px 12px", borderRadius: 3, background: "transparent", border: "1px solid var(--border-mid)", color: "var(--text-secondary)", cursor: "pointer", fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}>←</button>
          <span style={{ fontWeight: 800, color: "var(--text-primary)", fontSize: 15, fontFamily: "Georgia, serif" }}>{MONTHS[viewMonth]} {viewYear}</span>
          <button onClick={nextMonth} style={{ padding: "5px 12px", borderRadius: 3, background: "transparent", border: "1px solid var(--border-mid)", color: "var(--text-secondary)", cursor: "pointer", fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}>→</button>
        </div>

        {/* Day headers */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", padding: "10px 12px 0" }}>
          {DAYS_OF_WEEK.map(d => (
            <div key={d} style={{ textAlign: "center", fontSize: 10, fontWeight: 700, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.06em", paddingBottom: 6 }}>{d}</div>
          ))}
        </div>

        {/* Day cells */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3, padding: "0 12px 12px" }}>
          {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
            const key = isoKey(day);
            const dayBookings = byDate[key] ?? [];
            const hasBookings = dayBookings.length > 0;
            const status = hasBookings ? dominantStatus(dayBookings) : null;
            const col  = status ? STATUS_COLORS[status].cal : null;
            const isToday = day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
            const isSelected = selectedDay === key;

            return (
              <div key={day} onClick={() => hasBookings && setSelectedDay(isSelected ? null : key)}
                style={{
                  minHeight: 72, borderRadius: 3, padding: "5px 6px",
                  border: isSelected ? `2px solid ${col}` : isToday ? "1px solid #C8A97E55" : hasBookings ? `1px solid ${col}44` : "1px solid var(--border-subtle)",
                  background: hasBookings ? col + "1a" : isToday ? "#C8A97E08" : "var(--bg)",
                  cursor: hasBookings ? "pointer" : "default",
                  display: "flex", flexDirection: "column", gap: 3,
                  transition: "all 0.15s", overflow: "hidden",
                }}>
                <div style={{ fontSize: 11, fontWeight: isToday ? 800 : 400, color: isToday ? "#C8A97E" : "var(--text-primary)" }}>{day}</div>
                {dayBookings.map((b, i) => (
                  <div key={i} style={{ borderRadius: 3, padding: "2px 4px", background: STATUS_COLORS[b.status].cal + "33", borderLeft: `2px solid ${STATUS_COLORS[b.status].cal}` }}>
                    <div style={{ fontSize: 9, fontWeight: 700, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{b.chefBusiness}</div>
                    <div style={{ fontSize: 8, color: "rgba(255,255,255,0.55)" }}>{b.time}</div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{ display: "flex", gap: 16, padding: "10px 20px", borderTop: "1px solid var(--border-subtle)", background: "var(--bg)", alignItems: "center" }}>
          {(["upcoming","completed","cancelled"] as BookingStatus[]).map(s => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: STATUS_COLORS[s].cal + "44", border: `1px solid ${STATUS_COLORS[s].cal}88` }} />
              <span style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "capitalize" }}>{s}</span>
            </div>
          ))}
          <span style={{ marginLeft: "auto", fontSize: 10, color: "var(--border-strong)" }}>Click a date to expand</span>
        </div>

        {/* Selected day detail */}
        {selectedDay && (byDate[selectedDay] ?? []).length > 0 && (
          <div style={{ borderTop: "1px solid var(--border-subtle)", padding: "14px 20px", background: "var(--bg-secondary)" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
              {new Date(selectedDay + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </div>
            {(byDate[selectedDay] ?? []).map(b => {
              const s = STATUS_COLORS[b.status];
              return (
                <div key={b.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 3, background: "var(--bg-tertiary)", border: `1px solid ${s.border}`, marginBottom: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.cal, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>{b.chefBusiness}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>with {b.chef} · {b.time} · {b.guests} guests</div>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: s.bg, border: `1px solid ${s.border}`, color: s.text }}>{s.label}</span>
                  <span style={{ fontWeight: 700, color: "#C8A97E", fontSize: 14 }}>${b.total}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Bookings list ─────────────────────────────────────────────── */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {(["all","upcoming","completed","cancelled"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding: "7px 14px", borderRadius: 99, fontSize: 12, fontWeight: 600, cursor: "pointer", border: `1px solid ${filter === f ? "#C8A97E" : "var(--border-mid)"}`, background: filter === f ? "var(--gold)" + "18" : "transparent", color: filter === f ? "#C8A97E" : "var(--text-muted)", fontFamily: "'DM Sans', sans-serif", textTransform: "capitalize" }}>
            {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
            <span style={{ marginLeft: 6, background: "var(--bg-hover)", borderRadius: 99, padding: "1px 6px", fontSize: 10, color: "var(--text-muted)" }}>
              {f === "all" ? bookings.length : bookings.filter(b => b.status === f).length}
            </span>
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {shown.map(booking => {
          const s = STATUS_COLORS[booking.status];
          const isOpen = expanded === booking.id;
          const isReviewing = reviewingId === booking.id;
          const isPaying    = payingId    === booking.id;

          return (
            <div key={booking.id} style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 3, overflow: "hidden" }}>
              <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 16, cursor: "pointer" }}
                onClick={() => setExpanded(isOpen ? null : booking.id)}>
                <div style={{ width: 50, height: 50, borderRadius: 3, background: s.bg, border: `1px solid ${s.border}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: s.text, textTransform: "uppercase" }}>{booking.date.split(" ")[0]}</div>
                  <div style={{ fontSize: 17, fontWeight: 900, color: "var(--text-primary)", lineHeight: 1 }}>{booking.date.split(" ")[1]}</div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3, flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 400, color: "var(--text-primary)", fontSize: 14, fontFamily: "Georgia, serif" }}>{booking.chefBusiness}</span>
                    <span style={{ fontSize: 11, color: "var(--text-dim)" }}>with {booking.chef}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: s.bg, border: `1px solid ${s.border}`, color: s.text }}>{s.label}</span>
                    {booking.paymentStatus === "pending" && <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: "#C8A97E18", border: "1px solid #C8A97E44", color: "#C8A97E" }}>Payment due</span>}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{booking.date} · {booking.time} · {booking.guests} guests · {booking.cuisine}</div>
                  {booking.rating && (
                    <div style={{ display: "flex", gap: 2, marginTop: 4 }}>
                      {[1,2,3,4,5].map(i => <Star key={i} size={11} fill={i <= booking.rating! ? "#facc15" : "none"} color={i <= booking.rating! ? "#facc15" : "var(--border-strong)"} strokeWidth={1.5} />)}
                    </div>
                  )}
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontWeight: 800, color: "#C8A97E", fontSize: 16 }}>${booking.total}</div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: PAY_COLORS[booking.paymentStatus], marginTop: 2, textTransform: "capitalize" }}>
                    {booking.paymentStatus === "paid" ? "✓ Paid" : booking.paymentStatus === "pending" ? "Pending" : "Refunded"}
                  </div>
                  <div style={{ fontSize: 10, color: "var(--border-strong)", marginTop: 4 }}>{isOpen ? "▲" : "▼"}</div>
                </div>
              </div>

              {isOpen && (
                <div style={{ borderTop: "1px solid var(--border-subtle)" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1, background: "var(--bg-hover)" }}>
                    {[
                      { label: "Time",    value: booking.time,                Icon: Clock },
                      { label: "Guests",  value: `${booking.guests} guests`,  Icon: Users },
                      { label: "Cuisine", value: booking.cuisine,             Icon: UtensilsCrossed },
                    ].map(({ label, value, Icon }) => (
                      <div key={label} style={{ padding: "10px 14px", background: "var(--bg-secondary)" }}>
                        <div style={{ fontSize: 9, fontWeight: 700, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{label}</div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 6 }}>
                          <Icon size={12} color="#C8A97E" strokeWidth={1.75} />{value}
                        </div>
                      </div>
                    ))}
                  </div>
                  {booking.note && (
                    <div style={{ padding: "10px 14px", borderTop: "1px solid var(--border-subtle)", background: "var(--bg-secondary)" }}>
                      <div style={{ fontSize: 9, fontWeight: 700, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Your note to chef</div>
                      <div style={{ fontSize: 12, color: "var(--text-secondary)", fontStyle: "italic" }}>{booking.note}</div>
                    </div>
                  )}
                  {booking.status === "completed" && booking.rating && !isReviewing && (
                    <div style={{ padding: "12px 14px", borderTop: "1px solid var(--border-subtle)", background: "var(--bg-secondary)" }}>
                      <div style={{ fontSize: 9, fontWeight: 700, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Your Review</div>
                      <div style={{ display: "flex", gap: 3, marginBottom: 5 }}>
                        {[1,2,3,4,5].map(i => <Star key={i} size={14} fill={i <= booking.rating! ? "#facc15" : "none"} color={i <= booking.rating! ? "#facc15" : "var(--border-strong)"} strokeWidth={1.5} />)}
                      </div>
                      {booking.reviewText && <div style={{ fontSize: 12, color: "var(--text-secondary)", fontStyle: "italic" }}>"{booking.reviewText}"</div>}
                    </div>
                  )}
                  {isReviewing && (
                    <div style={{ padding: "16px 20px", borderTop: "1px solid var(--border-subtle)", background: "var(--bg-secondary)" }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", marginBottom: 12 }}>Leave a Review</div>
                      <StarRating value={reviewRating} onChange={setReviewRating} />
                      <textarea value={reviewText} onChange={e => setReviewText(e.target.value)} placeholder="Share your experience..." rows={3}
                        style={{ ...inputStyle, marginTop: 10, resize: "vertical", lineHeight: 1.6 }} />
                      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                        <button onClick={() => submitReview(booking.id)} disabled={!reviewRating}
                          style={{ padding: "9px 20px", borderRadius: 3, background: reviewRating ? "#C8A97E" : "var(--border-mid)", color: reviewRating ? "var(--bg)" : "var(--text-dim)", fontWeight: 700, fontSize: 13, border: "none", cursor: reviewRating ? "pointer" : "default", fontFamily: "'DM Sans', sans-serif" }}>
                          Submit Review
                        </button>
                        <button onClick={() => setReviewingId(null)} style={{ padding: "9px 14px", borderRadius: 3, background: "transparent", border: "1px solid var(--border-mid)", color: "var(--text-muted)", fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Cancel</button>
                      </div>
                    </div>
                  )}
                  {isPaying && (
                    <div style={{ padding: "16px 20px", borderTop: "1px solid var(--border-subtle)", background: "var(--bg-secondary)" }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>Payment</div>
                      <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 14 }}>Total due: <span style={{ color: "#C8A97E", fontWeight: 700 }}>${booking.total}</span></div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                        <div>
                          <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 5 }}>Card Number</div>
                          <input type="text" placeholder="4242 4242 4242 4242" style={inputStyle} />
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                          <div>
                            <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 5 }}>Expiry</div>
                            <input type="text" placeholder="MM/YY" style={inputStyle} />
                          </div>
                          <div>
                            <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 5 }}>CVC</div>
                            <input type="text" placeholder="123" style={inputStyle} />
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => submitPayment(booking.id)} style={{ padding: "10px 24px", borderRadius: 3, background: "#C8A97E", color: "var(--bg)", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                          Pay ${booking.total}
                        </button>
                        <button onClick={() => setPayingId(null)} style={{ padding: "10px 14px", borderRadius: 3, background: "transparent", border: "1px solid var(--border-mid)", color: "var(--text-muted)", fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Cancel</button>
                      </div>
                    </div>
                  )}
                  {!isReviewing && !isPaying && (
                    <div style={{ padding: "12px 20px", borderTop: "1px solid var(--border-subtle)", background: "var(--bg)", display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {booking.status === "upcoming" && booking.paymentStatus === "pending" && (
                        <button onClick={() => { setPayingId(booking.id); setReviewingId(null); }}
                          style={{ padding: "8px 16px", borderRadius: 3, background: "#C8A97E", border: "none", color: "var(--bg)", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: 6 }}>
                          <CreditCard size={13} strokeWidth={1.75} /> Pay Now
                        </button>
                      )}
                      {booking.status === "upcoming" && (
                        <button style={{ padding: "8px 16px", borderRadius: 3, background: "var(--bg-tertiary)", border: "1px solid var(--border-mid)", color: "var(--text-secondary)", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: 6 }}>
                          <MessageCircle size={13} strokeWidth={1.75} /> Message Chef
                        </button>
                      )}
                      {booking.status === "upcoming" && (
                        <button style={{ padding: "8px 16px", borderRadius: 3, background: "#C87E7E18", border: "1px solid #C87E7E44", color: "#C87E7E", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: 6 }}>
                          <XCircle size={13} strokeWidth={1.75} /> Cancel
                        </button>
                      )}
                      {booking.status === "completed" && !booking.rating && (
                        <button onClick={() => { setReviewingId(booking.id); setPayingId(null); }}
                          style={{ padding: "8px 16px", borderRadius: 3, background: "#C8A97E18", border: "1px solid #C8A97E44", color: "#C8A97E", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: 6 }}>
                          <Star size={13} strokeWidth={1.75} /> Leave a Review
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {shown.length === 0 && (
          <div style={{ textAlign: "center", padding: "48px 0", color: "var(--text-dim)", fontSize: 13 }}>No bookings here</div>
        )}
      </div>
    </div>
  );
}
