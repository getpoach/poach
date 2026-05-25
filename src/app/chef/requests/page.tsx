"use client";
import { useState } from "react";

type RequestStatus = "pending" | "accepted" | "declined";

interface BookingRequest {
  id: string;
  submittedAt: string;
  // Diner
  diner: string;
  dinerEmail: string;
  dinerPhone: string;
  dinerHistory: number; // number of previous Poach bookings
  // Event
  date: string;
  time: string;
  city: string;
  address: string;
  guests: number;
  occasion: string;
  // Food
  menuRequested: string;
  cuisine: string;
  courses: number;
  dietaryRestrictions: string[];
  allergies: string[];
  guestNote: string;
  // Financials
  pricePerPerson: number;
  estimatedTotal: number;
  // Status
  status: RequestStatus;
}

const MOCK_REQUESTS: BookingRequest[] = [
  {
    id: "req-1",
    submittedAt: "2 hours ago",
    diner: "Marcus Webb",
    dinerEmail: "marcus.webb@email.com",
    dinerPhone: "(504) 555-0319",
    dinerHistory: 3,
    date: "Sat May 10, 2026",
    time: "7:30 PM",
    city: "Lafayette",
    address: "215 E Pinhook Rd, Lafayette, LA 70501",
    guests: 6,
    occasion: "Anniversary Dinner",
    menuRequested: "Bayou Tasting Menu",
    cuisine: "French",
    courses: 6,
    dietaryRestrictions: ["No red meat (1 guest)"],
    allergies: [],
    guestNote: "This is our 5th anniversary — hoping for something truly special. Candles and a personal touch would mean the world.",
    pricePerPerson: 95,
    estimatedTotal: 570,
    status: "pending",
  },
  {
    id: "req-2",
    submittedAt: "5 hours ago",
    diner: "Pelican Club Events",
    dinerEmail: "events@pelicanclub.com",
    dinerPhone: "(337) 555-0400",
    dinerHistory: 0,
    date: "Fri May 15, 2026",
    time: "6:00 PM",
    city: "Lafayette",
    address: "100 Girard Park Dr, Lafayette, LA 70503",
    guests: 30,
    occasion: "Annual Charity Gala",
    menuRequested: "Grand Celebration Menu",
    cuisine: "Fusion",
    courses: 7,
    dietaryRestrictions: ["Vegetarian (5 guests)", "Gluten-free (6 guests)"],
    allergies: ["Tree nuts (2 guests)", "Shellfish (1 guest)"],
    guestNote: "This is our 10th annual gala. We expect a very distinguished crowd. Presentation is everything.",
    pricePerPerson: 110,
    estimatedTotal: 3300,
    status: "pending",
  },
  {
    id: "req-3",
    submittedAt: "Yesterday",
    diner: "Stephanie Guidry",
    dinerEmail: "sguidry@email.com",
    dinerPhone: "(337) 555-0519",
    dinerHistory: 1,
    date: "Sun May 17, 2026",
    time: "5:30 PM",
    city: "Lafayette",
    address: "903 Moss St, Lafayette, LA 70501",
    guests: 3,
    occasion: "Mother's Day Brunch",
    menuRequested: "Intimate Tasting Menu",
    cuisine: "French",
    courses: 5,
    dietaryRestrictions: [],
    allergies: [],
    guestNote: "Surprising my mom — she has no idea. She loves anything with crab or lobster.",
    pricePerPerson: 95,
    estimatedTotal: 285,
    status: "pending",
  },
  {
    id: "req-4",
    submittedAt: "2 days ago",
    diner: "Xavier & Dominique Roy",
    dinerEmail: "xroy@email.com",
    dinerPhone: "(337) 555-0988",
    dinerHistory: 2,
    date: "Sat May 23, 2026",
    time: "7:00 PM",
    city: "New Iberia",
    address: "310 Main St, New Iberia, LA 70560",
    guests: 6,
    occasion: "Housewarming Party",
    menuRequested: "Creole Heritage Dinner",
    cuisine: "Fusion",
    courses: 5,
    dietaryRestrictions: [],
    allergies: ["Peanuts (1 guest)"],
    guestNote: "New house, new memories. We want something that feels like a celebration.",
    pricePerPerson: 85,
    estimatedTotal: 510,
    status: "accepted",
  },
  {
    id: "req-5",
    submittedAt: "3 days ago",
    diner: "Boudreaux Family Reunion",
    dinerEmail: "boudreaux@email.com",
    dinerPhone: "(337) 555-0733",
    dinerHistory: 0,
    date: "Sat May 30, 2026",
    time: "4:00 PM",
    city: "Lafayette",
    address: "3801 Johnston St, Lafayette, LA 70503",
    guests: 18,
    occasion: "Family Reunion",
    menuRequested: "Grand Celebration Menu",
    cuisine: "Fusion",
    courses: 7,
    dietaryRestrictions: ["Vegetarian (3 guests)", "Halal (4 guests)"],
    allergies: ["Dairy (1 guest)"],
    guestNote: "Annual reunion — go all out! We want something that feels unmistakably Louisiana.",
    pricePerPerson: 110,
    estimatedTotal: 1980,
    status: "declined",
  },
];

const STATUS_STYLES: Record<RequestStatus, { bg: string; border: string; text: string; label: string }> = {
  pending:  { bg: "#C8A97E18", border: "#C8A97E55", text: "#C8A97E", label: "Pending"  },
  accepted: { bg: "#7EC87E18", border: "#7EC87E55", text: "#7EC87E", label: "Accepted" },
  declined: { bg: "#C87E7E18", border: "#C87E7E55", text: "#C87E7E", label: "Declined" },
};

function InfoCell({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div style={{ padding: "10px 14px", background: "#111" }}>
      <div style={{ fontSize: 9, fontWeight: 700, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>
        {label}
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: color ?? "#f5f0e8" }}>{value}</div>
    </div>
  );
}

function RequestCard({ request, onAction }: { request: BookingRequest; onAction: (id: string, action: RequestStatus) => void }) {
  const [expanded, setExpanded] = useState(request.status === "pending");
  const s = STATUS_STYLES[request.status];
  const isPending = request.status === "pending";
  const hasAllergies = request.allergies.length > 0;
  const hasDietary = request.dietaryRestrictions.length > 0;

  return (
    <div style={{
      background: "#0f0f0f",
      border: `1px solid ${isPending ? "#C8A97E33" : "#1e1e1e"}`,
      borderRadius: 16,
      overflow: "hidden",
      opacity: request.status === "declined" ? 0.6 : 1,
      transition: "opacity 0.2s",
    }}>

      {/* Header row */}
      <div
        style={{ padding: "16px 20px", display: "flex", alignItems: "flex-start", gap: 14, cursor: "pointer" }}
        onClick={() => setExpanded(v => !v)}
      >
        {/* Date block */}
        <div style={{
          width: 52, height: 52, borderRadius: 10, flexShrink: 0,
          background: s.bg, border: `1px solid ${s.border}`,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: s.text, textTransform: "uppercase" }}>
            {request.date.split(" ")[0]}
          </div>
          <div style={{ fontSize: 18, fontWeight: 900, color: "#ffffff", lineHeight: 1 }}>
            {request.date.split(" ")[1].replace(",", "")}
          </div>
          <div style={{ fontSize: 9, color: s.text, fontWeight: 600 }}>
            {request.date.split(" ")[2]}
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
            <span style={{ fontSize: 15, fontWeight: 800, color: "#f5f0e8" }}>{request.diner}</span>
            <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 9px", borderRadius: 99, background: s.bg, border: `1px solid ${s.border}`, color: s.text }}>
              {s.label}
            </span>
            {request.dinerHistory > 0 && (
              <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 99, background: "#7EC87E12", border: "1px solid #7EC87E33", color: "#7EC87E" }}>
                ✓ {request.dinerHistory}× returning
              </span>
            )}
            {hasAllergies && (
              <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: "#C87E7E18", border: "1px solid #C87E7E55", color: "#C87E7E" }}>
                ⚠️ Allergy
              </span>
            )}
          </div>
          <div style={{ fontSize: 12, color: "#71717a" }}>
            {request.occasion} · {request.time} · {request.guests} guests · {request.city}
          </div>
          <div style={{ fontSize: 11, color: "#52525b", marginTop: 2 }}>
            Submitted {request.submittedAt}
          </div>
        </div>

        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#C8A97E" }}>
            ${request.estimatedTotal.toLocaleString()}
          </div>
          <div style={{ fontSize: 11, color: "#52525b", marginTop: 2 }}>
            ${request.pricePerPerson}/person
          </div>
          <div style={{ fontSize: 11, color: "#3f3f46", marginTop: 6 }}>
            {expanded ? "▲" : "▼"}
          </div>
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div style={{ borderTop: "1px solid #1a1a1a" }}>

          {/* Info grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: "#1a1a1a" }}>
            <InfoCell label="Date" value={request.date} />
            <InfoCell label="Time" value={request.time} />
            <InfoCell label="Guests" value={`${request.guests} guests`} />
            <InfoCell label="Occasion" value={request.occasion} />
            <InfoCell label="Menu" value={request.menuRequested} />
            <InfoCell label="Cuisine" value={request.cuisine} />
            <InfoCell label="Courses" value={`${request.courses} courses`} />
            <InfoCell label="Est. Total" value={`$${request.estimatedTotal.toLocaleString()}`} color="#C8A97E" />
          </div>

          {/* Location + contact */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "#1a1a1a", borderTop: "1px solid #1a1a1a" }}>
            <div style={{ padding: "12px 14px", background: "#111" }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 5 }}>📍 Location</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#f5f0e8" }}>{request.city}</div>
              <div style={{ fontSize: 11, color: "#71717a", marginTop: 2 }}>{request.address}</div>
            </div>
            <div style={{ padding: "12px 14px", background: "#111" }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 5 }}>📞 Diner Contact</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#f5f0e8" }}>{request.diner}</div>
              <div style={{ fontSize: 11, color: "#71717a", marginTop: 1 }}>{request.dinerPhone}</div>
              <div style={{ fontSize: 11, color: "#71717a" }}>{request.dinerEmail}</div>
              {request.dinerHistory > 0 && (
                <div style={{ fontSize: 10, color: "#7EC87E", marginTop: 4 }}>
                  ✓ Booked through Poach {request.dinerHistory} time{request.dinerHistory > 1 ? "s" : ""} before
                </div>
              )}
            </div>
          </div>

          {/* Dietary + allergies */}
          {(hasDietary || hasAllergies) && (
            <div style={{ display: "grid", gridTemplateColumns: hasDietary && hasAllergies ? "1fr 1fr" : "1fr", gap: 1, background: "#1a1a1a", borderTop: "1px solid #1a1a1a" }}>
              {hasDietary && (
                <div style={{ padding: "12px 14px", background: "#111" }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: "#C8A97E", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
                    🥗 Dietary Restrictions
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {request.dietaryRestrictions.map(r => (
                      <span key={r} style={{ fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 99, background: "#C8A97E18", border: "1px solid #C8A97E44", color: "#C8A97E" }}>
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {hasAllergies && (
                <div style={{ padding: "12px 14px", background: "#111" }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: "#C87E7E", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
                    ⚠️ Allergies — Critical
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {request.allergies.map(a => (
                      <span key={a} style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 99, background: "#C87E7E22", border: "1px solid #C87E7E66", color: "#C87E7E" }}>
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Guest note */}
          {request.guestNote && (
            <div style={{ padding: "12px 14px", background: "#0c0c0c", borderTop: "1px solid #1a1a1a" }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
                💬 Message from {request.diner.split(" ")[0]}
              </div>
              <div style={{ fontSize: 13, color: "#a1a1aa", fontStyle: "italic", lineHeight: 1.7, borderLeft: "2px solid #C8A97E44", paddingLeft: 12 }}>
                "{request.guestNote}"
              </div>
            </div>
          )}

          {/* Actions */}
          {isPending && (
            <div style={{ padding: "14px 20px", borderTop: "1px solid #1a1a1a", background: "#0a0a0a", display: "flex", alignItems: "center", gap: 10 }}>
              <button
                onClick={() => onAction(request.id, "accepted")}
                style={{
                  padding: "10px 24px", borderRadius: 10,
                  background: "#C8A97E", border: "none",
                  color: "#080808", fontWeight: 800, fontSize: 13,
                  cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                  transition: "opacity 0.2s",
                }}
              >
                ✓ Accept Booking
              </button>
              <button
                onClick={() => onAction(request.id, "declined")}
                style={{
                  padding: "10px 20px", borderRadius: 10,
                  background: "transparent", border: "1px solid #C87E7E44",
                  color: "#C87E7E", fontWeight: 600, fontSize: 13,
                  cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                }}
              >
                ✗ Decline
              </button>
              <button
                style={{
                  padding: "10px 16px", borderRadius: 10,
                  background: "transparent", border: "1px solid #27272a",
                  color: "#71717a", fontWeight: 600, fontSize: 13,
                  cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                  marginLeft: "auto",
                }}
              >
                💬 Message Diner
              </button>
            </div>
          )}

          {/* Accepted/declined state */}
          {!isPending && (
            <div style={{ padding: "12px 20px", borderTop: "1px solid #1a1a1a", background: "#0a0a0a", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: s.text }}>
                {request.status === "accepted" ? "✓ You accepted this booking" : "✗ You declined this request"}
              </div>
              {request.status === "declined" && (
                <button
                  onClick={() => onAction(request.id, "accepted")}
                  style={{ marginLeft: "auto", padding: "7px 14px", borderRadius: 8, background: "transparent", border: "1px solid #27272a", color: "#71717a", fontSize: 11, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
                >
                  Reconsider →
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ChefRequests() {
  const [requests, setRequests] = useState<BookingRequest[]>(MOCK_REQUESTS);
  const [filter, setFilter] = useState<RequestStatus | "all">("all");

  function handleAction(id: string, action: RequestStatus) {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: action } : r));
  }

  const pending   = requests.filter(r => r.status === "pending");
  const shown     = filter === "all" ? requests : requests.filter(r => r.status === filter);
  const pendingRevenue = pending.reduce((s, r) => s + r.estimatedTotal, 0);

  return (
    <div style={{ padding: "32px 36px", maxWidth: 900, fontFamily: "'DM Sans', sans-serif" }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: "#f5f0e8", fontFamily: "var(--font-playfair)", margin: "0 0 6px" }}>
          Booking Requests
        </h1>
        <p style={{ fontSize: 13, color: "#71717a", margin: 0 }}>
          {pending.length} pending {pending.length === 1 ? "request" : "requests"} · ${pendingRevenue.toLocaleString()} potential earnings
        </p>
      </div>

      {/* Pending callout */}
      {pending.length > 0 && (
        <div style={{ marginBottom: 24, padding: "14px 18px", borderRadius: 12, background: "#C8A97E0a", border: "1px solid #C8A97E33", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#C8A97E", flexShrink: 0, boxShadow: "0 0 8px #C8A97E" }} />
          <div style={{ fontSize: 13, color: "#C8A97E", fontWeight: 600 }}>
            You have {pending.length} request{pending.length > 1 ? "s" : ""} awaiting your response
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
        {(["all", "pending", "accepted", "declined"] as const).map(f => (
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
            <span style={{ marginLeft: 6, background: "#1a1a1a", borderRadius: 99, padding: "1px 7px", fontSize: 10, color: "#71717a" }}>
              {f === "all" ? requests.length : requests.filter(r => r.status === f).length}
            </span>
          </button>
        ))}
      </div>

      {/* Request cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {shown.map(req => (
          <RequestCard key={req.id} request={req} onAction={handleAction} />
        ))}
        {shown.length === 0 && (
          <div style={{ textAlign: "center", padding: "48px 0", color: "#52525b" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🍽️</div>
            <div style={{ fontSize: 14, color: "#71717a" }}>No requests here</div>
          </div>
        )}
      </div>
    </div>
  );
}
