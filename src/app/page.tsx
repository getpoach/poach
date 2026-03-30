"use client";
import { useState, useMemo } from "react";
import type { Chef, Review } from "@/types";
import { chefs as allChefs } from "@/data/chefs";
import { reviews as allReviews } from "@/data/reviews";
import { useChefFilter } from "@/hooks/useChefFilter";
import { useBookings } from "@/hooks/useBookings";
import { ChefCard } from "@/components/chefs/ChefCard";
import { ChefDrawer } from "@/components/chefs/ChefDrawer";
import { ChefMap } from "@/components/chefs/ChefMap";
import { BookingModal } from "@/components/booking/BookingModal";

const CUISINES = [
  "All", "French", "Japanese", "West African", "Italian",
  "Mexican", "Indian", "Fusion", "Omakase",
] as const;

const SORT_OPTIONS = [
  { label: "Nearest",   value: "nearest" },
  { label: "Top Rated", value: "rating"  },
  { label: "Price: Low",value: "price"   },
] as const;
type SortOption = typeof SORT_OPTIONS[number]["value"];

export default function DiscoverPage() {
  const { search, setSearch, cuisine, setCuisine, filtered } = useChefFilter(allChefs);
  const [reviews, setReviews] = useState<Review[]>(allReviews);
  const { addBooking } = useBookings();
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [viewChef, setViewChef] = useState<Chef | null>(null);
  const [bookingChef, setBookingChef] = useState<Chef | null>(null);
  const [sortBy, setSortBy]           = useState<SortOption>("nearest");
  const [gridFiltersOpen, setGridFiltersOpen] = useState(false);
  const [mapFilteredChefs, setMapFilteredChefs] = useState<Chef[]>(allChefs);
  const [gridPriceRange, setGridPriceRange]     = useState<[number, number]>([0, 150]);
  const [gridAvailability, setGridAvailability] = useState("all");
  const [gridLocation, setGridLocation]         = useState("all");

  const GRID_AREA_FILTERS = [
    { label: "All Areas",     value: "all" },
    { label: "Lafayette",     value: "lafayette" },
    { label: "Baton Rouge",   value: "batonrouge" },
    { label: "New Iberia",    value: "newiberia" },
    { label: "Opelousas",     value: "opelousas" },
    { label: "Breaux Bridge", value: "breauxbridge" },
    { label: "Crowley",       value: "crowley" },
  ];

  const GRID_AREA_BOUNDS: Record<string, { latMin: number; latMax: number; lngMin: number; lngMax: number }> = {
    lafayette:    { latMin: 30.17, latMax: 30.30, lngMin: -92.08, lngMax: -91.95 },
    batonrouge:   { latMin: 30.35, latMax: 30.55, lngMin: -91.25, lngMax: -91.05 },
    newiberia:    { latMin: 29.98, latMax: 30.05, lngMin: -91.85, lngMax: -91.75 },
    opelousas:    { latMin: 30.49, latMax: 30.57, lngMin: -92.12, lngMax: -92.05 },
    breauxbridge: { latMin: 30.27, latMax: 30.32, lngMin: -91.90, lngMax: -91.85 },
    crowley:      { latMin: 30.20, latMax: 30.25, lngMin: -92.40, lngMax: -92.35 },
  };

  const sorted = useMemo(() => {
    let arr = [...filtered];

    // Location filter
    if (gridLocation !== "all") {
      const b = GRID_AREA_BOUNDS[gridLocation];
      if (b) arr = arr.filter((chef) => chef.lat >= b.latMin && chef.lat <= b.latMax && chef.lng >= b.lngMin && chef.lng <= b.lngMax);
    }

    // Only apply price filter if user has actually moved the slider
    const priceActive = gridPriceRange[0] > 0 || gridPriceRange[1] < 150;
    if (priceActive) {
      arr = arr.filter((chef) => chef.price >= gridPriceRange[0] && chef.price <= gridPriceRange[1]);
    }

    // Only apply availability filter if not "all"
    if (gridAvailability !== "all") {
      const allowed: string[] = {
        weekdays: ["Mon","Tue","Wed","Thu","Fri"],
        weekend:  ["Sat","Sun"],
      }[gridAvailability] ?? [];
      arr = arr.filter((chef) => chef.available.some((d) => allowed.includes(d)));
    }

    switch (sortBy) {
      case "rating":
        return arr.sort((a, b) => b.rating - a.rating);
      case "price":
        return arr.sort((a, b) => a.price - b.price);
      case "nearest":
      default:
        return arr.sort((a, b) => {
          const da = parseFloat(a.distance.replace(" mi", ""));
          const db = parseFloat(b.distance.replace(" mi", ""));
          return da - db;
        });
    }
  }, [filtered, sortBy, gridPriceRange, gridAvailability, gridLocation]);

  const gridActiveFilters = (gridPriceRange[0] > 0 || gridPriceRange[1] < 150 ? 1 : 0) +
    (gridAvailability !== "all" ? 1 : 0) +
    (cuisine !== "All" ? 1 : 0) +
    (gridLocation !== "all" ? 1 : 0);

  return (
    <>
      {/* ── Video Hero ─────────────────────────────────────────────────────── */}
      <div
        className="mb-8 rounded-2xl relative overflow-hidden"
        style={{
          border: "1px solid #1E1A14",
          minHeight: 280,
        }}
      >
        {/* Background video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: 0 }}
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>

        {/* Medium overlay — lets video show through while keeping text readable */}
        <div
          className="absolute inset-0"
          style={{
            zIndex: 1,
            background: "linear-gradient(135deg, rgba(10,8,4,0.52) 0%, rgba(8,8,16,0.44) 50%, rgba(10,8,4,0.52) 100%)",
          }}
        />

        {/* Content — sits above video and overlay */}
        <div className="relative p-10" style={{ zIndex: 2 }}>
          <div
            className="absolute -right-10 -top-10 w-72 h-72 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, #C8A97E08 0%, transparent 70%)" }}
          />
          <div className="text-xs font-bold text-gold uppercase tracking-widest mb-3" style={{ textShadow: "0 1px 8px rgba(0,0,0,0.9)" }}>
            Private Dining · Your Home
          </div>
          <h1 className="font-display text-4xl font-black text-white leading-tight mb-4 max-w-xl" style={{ textShadow: "0 2px 20px rgba(0,0,0,0.8), 0 1px 6px rgba(0,0,0,0.6)" }}>
            World-class chefs.<br />
            <span className="text-gold" style={{ textShadow: "0 2px 20px rgba(0,0,0,0.8), 0 0 30px rgba(200,169,126,0.3)" }}>Your kitchen.</span>
          </h1>
          <p className="text-zinc-400 text-sm max-w-md leading-relaxed mb-6" style={{ textShadow: "0 1px 8px rgba(0,0,0,0.9)" }}>
            Book a professional chef to cook in your home. Explore cuisine styles,
            browse availability, and reserve your private dining experience.
          </p>
          <div className="flex gap-6">
            {[["15+", "Chefs nearby"], ["4.9", "Avg. rating"], ["1,200+", "Sessions booked"]].map(
              ([val, label]) => (
                <div key={label}>
                  <div className="font-display text-xl font-bold text-gold">{val}</div>
                  <div className="text-xs text-zinc-500">{label}</div>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* ── View tabs ────────────────────────────────────────────────────── */}
      <div className="flex items-end gap-0 mb-0" style={{ marginBottom: 0 }}>
        {/* Tab bar bottom line — left side */}
        <div style={{ flex: 1, borderBottom: "1px solid #2a2a2a" }} />
        {(["grid", "map"] as const).map((m) => {
          const active = viewMode === m;
          return (
            <button
              key={m}
              onClick={() => setViewMode(m)}
              className="px-5 py-2.5 text-xs font-bold transition-all cursor-pointer"
              style={{
                background: active ? "#111" : "transparent",
                color: active ? "#F5F0E8" : "#555",
                border: "1px solid",
                borderColor: active ? "#2a2a2a" : "transparent",
                borderBottom: active ? "1px solid #111" : "1px solid #2a2a2a",
                borderRadius: "10px 10px 0 0",
                marginBottom: active ? "-1px" : "0",
                letterSpacing: "0.04em",
                zIndex: active ? 2 : 1,
                position: "relative",
              }}
            >
              {m === "grid" ? "▦  Grid" : "📍  Map"}
            </button>
          );
        })}
      </div>

      {/* Tab content wrapper */}
      <div style={{ border: "1px solid #2a2a2a", borderTop: "none", borderRadius: "0 0 16px 16px", background: "#111", padding: "20px 0 0 0", marginBottom: 28 }}>

      {/* ── Map view ──────────────────────────────────────────────────────── */}
      {viewMode === "map" && (
        <div className="px-5">
          <ChefMap
            chefs={allChefs}
            onSelect={(chef) => {
              setViewMode("grid");
              setViewChef(chef);
            }}
            onFilteredChange={setMapFilteredChefs}
          />
        </div>
      )}

      {/* ── Results header + grid filters ─────────────────────────────────── */}
      {viewMode === "grid" && (
        <div>
          {/* Header — exact copy of map header */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 20px", borderBottom: "1px solid #18181b" }}>
            <span style={{ color: "#C8A97E" }}>▦</span>
            <span style={{ fontWeight: 700, color: "#fff", fontSize: 15, fontFamily: "var(--font-playfair)" }}>Chefs</span>
            <span style={{ background: "#18181b", borderRadius: 99, padding: "2px 10px", fontSize: 11, color: "#a1a1aa" }}>
              {sorted.length} of {allChefs.length}
            </span>
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
              {gridActiveFilters > 0 && (
                <button onClick={() => { setGridPriceRange([0, 150]); setGridAvailability("all"); setCuisine("All"); setGridLocation("all"); }}
                  style={{ fontSize: 11, color: "#71717a", cursor: "pointer", background: "none", border: "none", textDecoration: "underline" }}>
                  Clear
                </button>
              )}
              <button
                onClick={() => setGridFiltersOpen((v) => !v)}
                style={{
                  display: "flex", alignItems: "center", gap: 6, padding: "6px 12px",
                  borderRadius: 99, fontSize: 11, fontWeight: 600, cursor: "pointer",
                  border: `1px solid ${gridFiltersOpen || gridActiveFilters > 0 ? "#C8A97E" : "#3f3f46"}`,
                  color: gridFiltersOpen || gridActiveFilters > 0 ? "#C8A97E" : "#a1a1aa",
                  background: gridFiltersOpen || gridActiveFilters > 0 ? "#D4AF3712" : "transparent",
                }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M1 3h10M3 6h6M5 9h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                Filters
                {gridActiveFilters > 0 && (
                  <span style={{ background: "#C8A97E", color: "#0a0a0a", borderRadius: 99, width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700 }}>
                    {gridActiveFilters}
                  </span>
                )}
              </button>
              <span style={{ background: "#18181b", borderRadius: 99, padding: "4px 12px", fontSize: 11, color: "#71717a" }}>
                Louisiana
              </span>
            </div>
          </div>

          {/* Price slider row — always visible, same as map */}
          <div style={{ padding: "10px 20px", borderBottom: "1px solid #18181b", background: "#0b0b0b", display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#71717a", whiteSpace: "nowrap" }}>💰 Price / person</span>
            <div style={{ position: "relative", flex: 1, height: 20, display: "flex", alignItems: "center" }}>
              <div style={{ position: "absolute", left: 0, right: 0, height: 3, background: "#27272a", borderRadius: 99 }} />
              <div style={{ position: "absolute", left: `${(gridPriceRange[0]/150)*100}%`, right: `${100-(gridPriceRange[1]/150)*100}%`, height: 3, background: "#C8A97E", borderRadius: 99 }} />
              <input type="range" min={0} max={150} step={5} value={gridPriceRange[0]}
                onChange={(e) => setGridPriceRange([Math.min(Number(e.target.value), gridPriceRange[1]-5), gridPriceRange[1]])}
                style={{ position: "absolute", width: "100%", appearance: "none", WebkitAppearance: "none", background: "transparent", outline: "none", cursor: "pointer" }} />
              <input type="range" min={0} max={150} step={5} value={gridPriceRange[1]}
                onChange={(e) => setGridPriceRange([gridPriceRange[0], Math.max(Number(e.target.value), gridPriceRange[0]+5)])}
                style={{ position: "absolute", width: "100%", appearance: "none", WebkitAppearance: "none", background: "transparent", outline: "none", cursor: "pointer" }} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#C8A97E", whiteSpace: "nowrap", minWidth: 90, textAlign: "right" }}>
              ${gridPriceRange[0]} — {gridPriceRange[1] >= 150 ? "$150+" : `$${gridPriceRange[1]}`}
            </span>
          </div>

          {/* Sort row — same position as map search bar */}
          <div style={{ padding: "10px 16px", borderBottom: "1px solid #18181b", background: "#0a0a0a", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 11, color: "#52525b", fontWeight: 600 }}>Sort:</span>
            {SORT_OPTIONS.map((s) => {
              const active = sortBy === s.value;
              return (
                <button key={s.value} onClick={() => setSortBy(s.value)}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 whitespace-nowrap border cursor-pointer"
                  style={active
                    ? { background: "#C8A97E", borderColor: "#C8A97E", color: "#0a0a0a" }
                    : { borderColor: "#3f3f46", color: "#a1a1aa", background: "transparent" }
                  }>
                  {active && "✓ "}{s.label}
                </button>
              );
            })}
          </div>

          {/* Collapsible filter panel — exact copy of map filter panel */}
          {gridFiltersOpen && (
            <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 16, background: "#060A06", borderBottom: "1px solid #18181b" }}>
              {/* Location */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">🗺️</span>
                  <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Location</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {GRID_AREA_FILTERS.map((a) => {
                    const active = gridLocation === a.value;
                    return (
                      <button key={a.value} onClick={() => setGridLocation(a.value)}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 whitespace-nowrap border cursor-pointer"
                        style={active
                          ? { background: "#C8A97E", borderColor: "#C8A97E", color: "#0a0a0a" }
                          : { borderColor: "#3f3f46", color: "#a1a1aa", background: "transparent" }
                        }>{a.label}</button>
                    );
                  })}
                </div>
              </div>
              {/* Cuisine */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">🍽️</span>
                  <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Cuisine</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {CUISINES.map((c) => {
                    const active = cuisine === c;
                    return (
                      <button key={c} onClick={() => setCuisine(c === "All" ? "All" : (c as typeof cuisine))}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 whitespace-nowrap border cursor-pointer"
                        style={active
                          ? { background: "#C8A97E", borderColor: "#C8A97E", color: "#0a0a0a" }
                          : { borderColor: "#3f3f46", color: "#a1a1aa", background: "transparent" }
                        }>{c}</button>
                    );
                  })}
                </div>
              </div>
              {/* Availability */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">🕐</span>
                  <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Availability</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[{ label: "Any Day", value: "all" }, { label: "Weekdays", value: "weekdays" }, { label: "Weekends", value: "weekend" }].map((a) => {
                    const active = gridAvailability === a.value;
                    return (
                      <button key={a.value} onClick={() => setGridAvailability(a.value)}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 whitespace-nowrap border cursor-pointer"
                        style={active
                          ? { background: "#A78BFA", borderColor: "#A78BFA", color: "#0a0a0a" }
                          : { borderColor: "#3f3f46", color: "#a1a1aa", background: "transparent" }
                        }>{a.label}</button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

            {/* Results count + card strip for map view */}
      {viewMode === "map" && (
        <>
          <style>{`
            @keyframes cardFadeUp {
              from { opacity: 0; transform: translateY(24px); }
              to   { opacity: 1; transform: translateY(0); }
            }
            @keyframes tabArrow {
              0%, 100% { transform: translateY(0); }
              50%       { transform: translateY(4px); }
            }
            @keyframes tabPulse {
              0%, 100% { opacity: 1; }
              50%       { opacity: 0.6; }
            }
            .map-chef-card { animation: cardFadeUp 0.4s ease both; }
            .tab-arrow     { animation: tabArrow 1.2s ease-in-out infinite; display: inline-block; }
            .tab-text      { animation: tabPulse 1.2s ease-in-out infinite; }
          `}</style>

          {/* Chef cards tab row */}
          <div className="flex items-end gap-0 mt-4" style={{ marginBottom: 0 }}>
            <div
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold select-none"
              style={{
                background: "#0a0a0a",
                border: "1px solid #C8A97E55",
                borderBottom: "1px solid #0a0a0a",
                borderRadius: "10px 10px 0 0",
                color: "#C8A97E",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                marginBottom: "-1px",
                zIndex: 2,
                position: "relative",
              }}
            >
              <span className="tab-arrow" style={{ fontSize: 13 }}>↓</span>
              <span className="tab-text">Chefs Below</span>
            </div>
            <div style={{ flex: 1, borderBottom: "1px solid #C8A97E55" }} />
            <div className="text-xs text-zinc-500 pb-1 pr-1">
              <span className="text-white font-bold">{mapFilteredChefs.length}</span> matching
            </div>
          </div>

          {/* Panel the tab sits on */}
          <div
            className="mb-8 p-4 rounded-b-2xl rounded-tr-2xl"
            style={{
              border: "1px solid #C8A97E55",
              borderTop: "none",
              background: "#0a0a0a",
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mapFilteredChefs.map((chef, i) => (
                <div
                  key={chef.id}
                  className="map-chef-card"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <ChefCard
                    chef={chef}
                    onBook={setBookingChef}
                    onView={setViewChef}
                  />
                </div>
              ))}
              {mapFilteredChefs.length === 0 && (
                <div className="col-span-3 text-center py-16 text-muted">
                  <div className="text-4xl mb-3">🍴</div>
                  <div className="font-display text-lg">No chefs match your filters</div>
                  <div className="text-sm mt-1">Try adjusting the map filters</div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* ── Chef grid ──────────────────────────────────────────────────────── */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
          {sorted.map((chef) => (
            <ChefCard
              key={chef.id}
              chef={chef}
              onBook={setBookingChef}
              onView={setViewChef}
            />
          ))}
          {sorted.length === 0 && (
            <div className="col-span-3 text-center py-16 text-muted">
              <div className="text-4xl mb-3">🍴</div>
              <div className="font-display text-lg">No chefs found</div>
              <div className="text-sm mt-1">Try a different cuisine or clear filters</div>
            </div>
          )}
        </div>
      )}

      </div>{/* end tab content wrapper */}

      {/* ── Chef CTA ───────────────────────────────────────────────────────── */}
      <div
        className="mt-12 rounded-2xl p-8 flex items-center justify-between flex-wrap gap-5"
        style={{ background: "#0D0D0D", border: "1px solid #1E1E1E" }}
      >
        <div>
          <div className="font-display text-xl font-bold text-white mb-1.5">
            Are you a chef?
          </div>
          <p className="text-muted text-sm max-w-sm">
            Create your profile, set your cuisine and availability, and start
            accepting private bookings near you.
          </p>
        </div>
        <a
          href="/join"
          className="bg-gold text-ink font-bold text-sm px-7 py-3.5 rounded-xl hover:opacity-85 transition-opacity"
        >
          Join Poach as a Chef →
        </a>
      </div>

      {/* ── Chef drawer ────────────────────────────────────────────────────── */}
      {viewChef && !bookingChef && (
        <ChefDrawer
          chef={viewChef}
          reviews={reviews}
          onClose={() => setViewChef(null)}
          onBook={(chef) => {
            setViewChef(null);
            setBookingChef(chef);
          }}
        />
      )}

      {/* ── Booking modal ──────────────────────────────────────────────────── */}
      {bookingChef && (
        <BookingModal
          chef={bookingChef}
          onClose={() => setBookingChef(null)}
          onSuccess={(booking) => {
            addBooking(booking);
          }}
        />
      )}
    </>
  );
}
