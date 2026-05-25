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
  { id: "b1", chef: "Beau Thibodaux",   chefBusiness: "Bayou Table",       date: "Sat Mar 29", isoDate: "2026-03-29", time: "7:00 PM", guests: 5,  cuisine: "French",        total: 650,  status: "upcoming",  paymentStatus: "pending", note: "Nut allergy — please avoid all tree nuts." },
  { id: "b2", chef: "Beau Thibodaux",   chefBusiness: "Bayou Table",       date: "Sun Mar 30", isoDate: "2026-03-30", time: "6:30 PM", guests: 8,  cuisine: "Fusion",         total: 1040, status: "upcoming",  paymentStatus: "paid",    note: "" },
  { id: "b3", chef: "Céleste Fontenot", chefBusiness: "La Méditerranée",   date: "Sat Apr 5",  isoDate: "2026-04-05", time: "7:30 PM", guests: 6,  cuisine: "Mediterranean",  total: 510,  status: "upcoming",  paymentStatus: "pending", note: "Anniversary dinner — please make it special!" },
  { id: "b4", chef: "Beau Thibodaux",   chefBusiness: "Bayou Table",       date: "Sun Mar 23", isoDate: "2026-03-23", time: "6:00 PM", guests: 4,  cuisine: "French",         total: 380,  status: "completed", paymentStatus: "paid",    note: "" },
  { id: "b5", chef: "Simone Trosclair", chefBusiness: "Simone's Table",    date: "Sat Mar 15", isoDate: "2026-03-15", time: "7:00 PM", guests: 2,  cuisine: "Fusion",         total: 130,  status: "completed", paymentStatus: "paid",    note: "Vegetarian menu requested.", rating: 5, reviewText: "Absolutely incredible. One of the best meals of our lives." },
  { id: "b6", chef: "Jaxon Broussard",  chefBusiness: "The Smoking Spoon", date: "Fri Mar 7",  isoDate: "2026-03-07", time: "8:00 PM", guests: 10, cuisine: "Cajun",          total: 450,  status: "cancelled", paymentStatus: "refunded", note: "" },
  { id: "b7", chef: "Céleste Fontenot", chefBusiness: "La Méditerranée",   date: "Sat Feb 21", isoDate: "2026-02-21", time: "7:00 PM", guests: 4,  cuisine: "Mediterranean",  total: 340,  status: "completed", paymentStatus: "paid",    note: "", rating: 4, reviewText: "Wonderful food, lovely atmosphere." },
  { id: "b8", chef: "Beau Thibodaux",   chefBusiness: "Bayou Table",       date: "Sat Apr 19", isoDate: "2026-04-19", time: "7:00 PM", guests: 6,  cuisine: "French",         total: 570,  status: "upcoming",  paymentStatus: "pending", note: "Birthday surprise for my wife." },
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
          <Star size={22} fill={(hovered || value) >= i ? "#facc15" : "none"} color={(hovered || value) >= i ? "#facc15" : "#3f3f46"} strokeWidth={1.5} />
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
    width: "100%", background: "#141414", border: "1px solid #2a2a2a", borderRadius: 10,
    padding: "10px 14px", fontSize: 13, color: "#f5f0e8", outline: "none",
    fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box",
  };

  return (
    <div style={{ maxWidth: 900, fontFamily: "'DM Sans', sans-serif", margin: "0 auto" }}>

      {/* ── User header ───────────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 32 }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", overflow: "hidden", border: "3px solid #C8A97E", boxShadow: "0 0 18px #C8A97E33", flexShrink: 0, background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {user?.avatar
            ? <img src={user.avatar} alt={user?.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <span style={{ fontSize: 22, fontWeight: 800, color: "#C8A97E" }}>{initials}</span>
          }
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Welcome back</div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: "#f5f0e8", fontFamily: "var(--font-playfair)", margin: "0 0 4px" }}>
            {user?.name ?? "My Bookings"}
          </h1>
          <p style={{ fontSize: 13, color: "#71717a", margin: 0 }}>
            {upcoming} upcoming · {bookings.filter(b => b.status === "completed").length} completed
          </p>
        </div>
      </div>

      {/* ── Calendar ──────────────────────────────────────────────────── */}
      <div style={{ background: "#0f0f0f", border: "1px solid #1e1e1e", borderRadius: 16, overflow: "hidden", marginBottom: 28 }}>
        {/* Month nav */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: "1px solid #1a1a1a" }}>
          <button onClick={prevMonth} style={{ padding: "5px 12px", borderRadius: 8, background: "transparent", border: "1px solid #27272a", color: "#a1a1aa", cursor: "pointer", fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}>←</button>
          <span style={{ fontWeight: 800, color: "#f5f0e8", fontSize: 15, fontFamily: "var(--font-playfair)" }}>{MONTHS[viewMonth]} {viewYear}</span>
          <button onClick={nextMonth} style={{ padding: "5px 12px", borderRadius: 8, background: "transparent", border: "1px solid #27272a", color: "#a1a1aa", cursor: "pointer", fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}>→</button>
        </div>

        {/* Day headers */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", padding: "10px 12px 0" }}>
          {DAYS_OF_WEEK.map(d => (
            <div key={d} style={{ textAlign: "center", fontSize: 10, fontWeight: 700, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.06em", paddingBottom: 6 }}>{d}</div>
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
                  minHeight: 72, borderRadius: 8, padding: "5px 6px",
                  border: isSelected ? `2px solid ${col}` : isToday ? "1px solid #C8A97E55" : hasBookings ? `1px solid ${col}44` : "1px solid #1a1a1a",
                  background: hasBookings ? col + "1a" : isToday ? "#C8A97E08" : "#0a0a0a",
                  cursor: hasBookings ? "pointer" : "default",
                  display: "flex", flexDirection: "column", gap: 3,
                  transition: "all 0.15s", overflow: "hidden",
                }}>
                <div style={{ fontSize: 11, fontWeight: isToday ? 800 : 400, color: isToday ? "#C8A97E" : "#ffffff" }}>{day}</div>
                {dayBookings.map((b, i) => (
                  <div key={i} style={{ borderRadius: 3, padding: "2px 4px", background: STATUS_COLORS[b.status].cal + "33", borderLeft: `2px solid ${STATUS_COLORS[b.status].cal}` }}>
                    <div style={{ fontSize: 9, fontWeight: 700, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{b.chefBusiness}</div>
                    <div style={{ fontSize: 8, color: "rgba(255,255,255,0.55)" }}>{b.time}</div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{ display: "flex", gap: 16, padding: "10px 20px", borderTop: "1px solid #1a1a1a", background: "#0a0a0a", alignItems: "center" }}>
          {(["upcoming","completed","cancelled"] as BookingStatus[]).map(s => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: STATUS_COLORS[s].cal + "44", border: `1px solid ${STATUS_COLORS[s].cal}88` }} />
              <span style={{ fontSize: 10, color: "#71717a", textTransform: "capitalize" }}>{s}</span>
            </div>
          ))}
          <span style={{ marginLeft: "auto", fontSize: 10, color: "#3f3f46" }}>Click a date to expand</span>
        </div>

        {/* Selected day detail */}
        {selectedDay && (byDate[selectedDay] ?? []).length > 0 && (
          <div style={{ borderTop: "1px solid #1a1a1a", padding: "14px 20px", background: "#0c0c0c" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
              {new Date(selectedDay + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </div>
            {(byDate[selectedDay] ?? []).map(b => {
              const s = STATUS_COLORS[b.status];
              return (
                <div key={b.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 10, background: "#141414", border: `1px solid ${s.border}`, marginBottom: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.cal, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#f5f0e8" }}>{b.chefBusiness}</div>
                    <div style={{ fontSize: 11, color: "#71717a" }}>with {b.chef} · {b.time} · {b.guests} guests</div>
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
            style={{ padding: "7px 14px", borderRadius: 99, fontSize: 12, fontWeight: 600, cursor: "pointer", border: `1px solid ${filter === f ? "#C8A97E" : "#2a2a2a"}`, background: filter === f ? "#C8A97E18" : "transparent", color: filter === f ? "#C8A97E" : "#71717a", fontFamily: "'DM Sans', sans-serif", textTransform: "capitalize" }}>
            {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
            <span style={{ marginLeft: 6, background: "#1a1a1a", borderRadius: 99, padding: "1px 6px", fontSize: 10, color: "#71717a" }}>
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
            <div key={booking.id} style={{ background: "#0f0f0f", border: "1px solid #1e1e1e", borderRadius: 14, overflow: "hidden" }}>
              <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 16, cursor: "pointer" }}
                onClick={() => setExpanded(isOpen ? null : booking.id)}>
                <div style={{ width: 50, height: 50, borderRadius: 10, background: s.bg, border: `1px solid ${s.border}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: s.text, textTransform: "uppercase" }}>{booking.date.split(" ")[0]}</div>
                  <div style={{ fontSize: 17, fontWeight: 900, color: "#fff", lineHeight: 1 }}>{booking.date.split(" ")[1]}</div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3, flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 700, color: "#f5f0e8", fontSize: 14 }}>{booking.chefBusiness}</span>
                    <span style={{ fontSize: 11, color: "#52525b" }}>with {booking.chef}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: s.bg, border: `1px solid ${s.border}`, color: s.text }}>{s.label}</span>
                    {booking.paymentStatus === "pending" && <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: "#C8A97E18", border: "1px solid #C8A97E44", color: "#C8A97E" }}>Payment due</span>}
                  </div>
                  <div style={{ fontSize: 12, color: "#71717a" }}>{booking.date} · {booking.time} · {booking.guests} guests · {booking.cuisine}</div>
                  {booking.rating && (
                    <div style={{ display: "flex", gap: 2, marginTop: 4 }}>
                      {[1,2,3,4,5].map(i => <Star key={i} size={11} fill={i <= booking.rating! ? "#facc15" : "none"} color={i <= booking.rating! ? "#facc15" : "#3f3f46"} strokeWidth={1.5} />)}
                    </div>
                  )}
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontWeight: 800, color: "#C8A97E", fontSize: 16 }}>${booking.total}</div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: PAY_COLORS[booking.paymentStatus], marginTop: 2, textTransform: "capitalize" }}>
                    {booking.paymentStatus === "paid" ? "✓ Paid" : booking.paymentStatus === "pending" ? "Pending" : "Refunded"}
                  </div>
                  <div style={{ fontSize: 10, color: "#3f3f46", marginTop: 4 }}>{isOpen ? "▲" : "▼"}</div>
                </div>
              </div>

              {isOpen && (
                <div style={{ borderTop: "1px solid #141414" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1, background: "#1a1a1a" }}>
                    {[
                      { label: "Time",    value: booking.time,                Icon: Clock },
                      { label: "Guests",  value: `${booking.guests} guests`,  Icon: Users },
                      { label: "Cuisine", value: booking.cuisine,             Icon: UtensilsCrossed },
                    ].map(({ label, value, Icon }) => (
                      <div key={label} style={{ padding: "10px 14px", background: "#111" }}>
                        <div style={{ fontSize: 9, fontWeight: 700, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{label}</div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#f5f0e8", display: "flex", alignItems: "center", gap: 6 }}>
                          <Icon size={12} color="#C8A97E" strokeWidth={1.75} />{value}
                        </div>
                      </div>
                    ))}
                  </div>
                  {booking.note && (
                    <div style={{ padding: "10px 14px", borderTop: "1px solid #1a1a1a", background: "#111" }}>
                      <div style={{ fontSize: 9, fontWeight: 700, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Your note to chef</div>
                      <div style={{ fontSize: 12, color: "#a1a1aa", fontStyle: "italic" }}>{booking.note}</div>
                    </div>
                  )}
                  {booking.status === "completed" && booking.rating && !isReviewing && (
                    <div style={{ padding: "12px 14px", borderTop: "1px solid #1a1a1a", background: "#0c0c0c" }}>
                      <div style={{ fontSize: 9, fontWeight: 700, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Your Review</div>
                      <div style={{ display: "flex", gap: 3, marginBottom: 5 }}>
                        {[1,2,3,4,5].map(i => <Star key={i} size={14} fill={i <= booking.rating! ? "#facc15" : "none"} color={i <= booking.rating! ? "#facc15" : "#3f3f46"} strokeWidth={1.5} />)}
                      </div>
                      {booking.reviewText && <div style={{ fontSize: 12, color: "#a1a1aa", fontStyle: "italic" }}>"{booking.reviewText}"</div>}
                    </div>
                  )}
                  {isReviewing && (
                    <div style={{ padding: "16px 20px", borderTop: "1px solid #1a1a1a", background: "#0c0c0c" }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#f5f0e8", marginBottom: 12 }}>Leave a Review</div>
                      <StarRating value={reviewRating} onChange={setReviewRating} />
                      <textarea value={reviewText} onChange={e => setReviewText(e.target.value)} placeholder="Share your experience..." rows={3}
                        style={{ ...inputStyle, marginTop: 10, resize: "vertical", lineHeight: 1.6 }} />
                      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                        <button onClick={() => submitReview(booking.id)} disabled={!reviewRating}
                          style={{ padding: "9px 20px", borderRadius: 10, background: reviewRating ? "#C8A97E" : "#2a2a2a", color: reviewRating ? "#080808" : "#52525b", fontWeight: 700, fontSize: 13, border: "none", cursor: reviewRating ? "pointer" : "default", fontFamily: "'DM Sans', sans-serif" }}>
                          Submit Review
                        </button>
                        <button onClick={() => setReviewingId(null)} style={{ padding: "9px 14px", borderRadius: 10, background: "transparent", border: "1px solid #27272a", color: "#71717a", fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Cancel</button>
                      </div>
                    </div>
                  )}
                  {isPaying && (
                    <div style={{ padding: "16px 20px", borderTop: "1px solid #1a1a1a", background: "#0c0c0c" }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#f5f0e8", marginBottom: 4 }}>Payment</div>
                      <div style={{ fontSize: 12, color: "#71717a", marginBottom: 14 }}>Total due: <span style={{ color: "#C8A97E", fontWeight: 700 }}>${booking.total}</span></div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                        <div>
                          <div style={{ fontSize: 10, fontWeight: 700, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 5 }}>Card Number</div>
                          <input type="text" placeholder="4242 4242 4242 4242" style={inputStyle} />
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                          <div>
                            <div style={{ fontSize: 10, fontWeight: 700, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 5 }}>Expiry</div>
                            <input type="text" placeholder="MM/YY" style={inputStyle} />
                          </div>
                          <div>
                            <div style={{ fontSize: 10, fontWeight: 700, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 5 }}>CVC</div>
                            <input type="text" placeholder="123" style={inputStyle} />
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => submitPayment(booking.id)} style={{ padding: "10px 24px", borderRadius: 10, background: "#C8A97E", color: "#080808", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                          Pay ${booking.total}
                        </button>
                        <button onClick={() => setPayingId(null)} style={{ padding: "10px 14px", borderRadius: 10, background: "transparent", border: "1px solid #27272a", color: "#71717a", fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Cancel</button>
                      </div>
                    </div>
                  )}
                  {!isReviewing && !isPaying && (
                    <div style={{ padding: "12px 20px", borderTop: "1px solid #1a1a1a", background: "#0a0a0a", display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {booking.status === "upcoming" && booking.paymentStatus === "pending" && (
                        <button onClick={() => { setPayingId(booking.id); setReviewingId(null); }}
                          style={{ padding: "8px 16px", borderRadius: 8, background: "#C8A97E", border: "none", color: "#080808", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: 6 }}>
                          <CreditCard size={13} strokeWidth={1.75} /> Pay Now
                        </button>
                      )}
                      {booking.status === "upcoming" && (
                        <button style={{ padding: "8px 16px", borderRadius: 8, background: "#141414", border: "1px solid #27272a", color: "#a1a1aa", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: 6 }}>
                          <MessageCircle size={13} strokeWidth={1.75} /> Message Chef
                        </button>
                      )}
                      {booking.status === "upcoming" && (
                        <button style={{ padding: "8px 16px", borderRadius: 8, background: "#C87E7E18", border: "1px solid #C87E7E44", color: "#C87E7E", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: 6 }}>
                          <XCircle size={13} strokeWidth={1.75} /> Cancel
                        </button>
                      )}
                      {booking.status === "completed" && !booking.rating && (
                        <button onClick={() => { setReviewingId(booking.id); setPayingId(null); }}
                          style={{ padding: "8px 16px", borderRadius: 8, background: "#C8A97E18", border: "1px solid #C8A97E44", color: "#C8A97E", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: 6 }}>
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
          <div style={{ textAlign: "center", padding: "48px 0", color: "#52525b", fontSize: 13 }}>No bookings here</div>
        )}
      </div>
    </div>
  );
}
