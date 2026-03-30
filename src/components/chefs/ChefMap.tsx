"use client";
import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import Map, { Marker, Popup, NavigationControl } from "react-map-gl/mapbox";
import type { MapRef } from "react-map-gl/mapbox";
// GeoJSON types are included via @types/geojson (installed with mapbox-gl)
import type { Chef, Review } from "@/types";
import { Stars } from "@/components/ui/index";
import { ChefDrawer } from "@/components/chefs/ChefDrawer";
import { BookingModal } from "@/components/booking/BookingModal";
import { useBookings } from "@/hooks/useBookings";
import { reviews as allReviews } from "@/data/reviews";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";
const LOUISIANA_CENTER = { lat: 31.0, lng: -91.8 };
const DEFAULT_ZOOM = 7;

const AREA_FILTERS = [
  { label: "All Areas",     value: "all" },
  { label: "Lafayette",     value: "lafayette" },
  { label: "Baton Rouge",   value: "batonrouge" },
  { label: "New Iberia",    value: "newiberia" },
  { label: "Opelousas",     value: "opelousas" },
  { label: "Breaux Bridge", value: "breauxbridge" },
  { label: "Crowley",       value: "crowley" },
];

const AREA_CENTERS: Record<string, { lat: number; lng: number; zoom: number }> = {
  lafayette:    { lat: 30.2241, lng: -92.0198, zoom: 12 },
  batonrouge:   { lat: 30.4515, lng: -91.1871, zoom: 11 },
  newiberia:    { lat: 30.0035, lng: -91.8187, zoom: 12 },
  opelousas:    { lat: 30.5335, lng: -92.0815, zoom: 12 },
  breauxbridge: { lat: 30.2946, lng: -91.8996, zoom: 12 },
  crowley:      { lat: 30.2141, lng: -92.3746, zoom: 12 },
};

const AREA_BOUNDS: Record<string, { latMin: number; latMax: number; lngMin: number; lngMax: number }> = {
  lafayette:    { latMin: 30.17, latMax: 30.30, lngMin: -92.08, lngMax: -91.95 },
  batonrouge:   { latMin: 30.35, latMax: 30.55, lngMin: -91.25, lngMax: -91.05 },
  newiberia:    { latMin: 29.98, latMax: 30.05, lngMin: -91.85, lngMax: -91.75 },
  opelousas:    { latMin: 30.49, latMax: 30.57, lngMin: -92.12, lngMax: -92.05 },
  breauxbridge: { latMin: 30.27, latMax: 30.32, lngMin: -91.90, lngMax: -91.85 },
  crowley:      { latMin: 30.20, latMax: 30.25, lngMin: -92.40, lngMax: -92.35 },
};

const CUISINES = [
  "All Cuisines",
  "French", "Italian", "Japanese", "Mexican",
  "Indian", "Mediterranean", "West African",
  "Fusion", "Omakase", "Pastry", "Oaxacan",
];

const AVAILABILITY_OPTIONS = [
  { label: "Any Time", value: "all" },
  { label: "This Week", value: "week" },
  { label: "Weekend",   value: "weekend" },
  { label: "Weekdays",  value: "weekdays" },
];

interface ChefMapProps {
  chefs: Chef[];
  onSelect?: (chef: Chef) => void;
  onFilteredChange?: (chefs: Chef[]) => void;
}

function FilterPill({ label, active, color, onClick }: {
  label: string; active: boolean; color?: string; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 whitespace-nowrap border cursor-pointer"
      style={active
        ? { background: color ?? "#C8A97E", borderColor: color ?? "#C8A97E", color: "#0a0a0a" }
        : { borderColor: "#3f3f46", color: "#a1a1aa", background: "transparent" }
      }
    >
      {label}
    </button>
  );
}

function FilterSection({ icon, label, children }: {
  icon: string; label: string; children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1.5">
        <span className="text-sm">{icon}</span>
        <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">{label}</span>
      </div>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function ChefPin({ chef, active, dimmed }: { chef: Chef; active: boolean; dimmed: boolean }) {
  const pinSize = active ? 48 : 38;
  return (
    <div
      className="flex flex-col items-center select-none"
      style={{
        opacity: dimmed ? 0.12 : 1,
        filter: dimmed ? "grayscale(0.5)" : "none",
        transition: "opacity 0.35s ease, filter 0.35s ease, transform 0.18s",
        transform: active ? "scale(1.12)" : "scale(1)",
        cursor: dimmed ? "default" : "pointer",
      }}
    >
      {/* Pin icon */}
      <img
        src="/poachpin.png"
        alt={chef.name}
        width={pinSize}
        height={pinSize}
        style={{
          width: pinSize,
          height: pinSize,
          objectFit: "contain",
          filter: active
            ? "drop-shadow(0 6px 16px rgba(0,0,0,0.9)) drop-shadow(0 2px 6px rgba(0,0,0,0.7))"
            : "drop-shadow(0 3px 8px rgba(0,0,0,0.8)) drop-shadow(0 1px 3px rgba(0,0,0,0.6))",
          transition: "all 0.2s ease",
          display: "block",
        }}
      />

      {/* Name BELOW pin — frosted glass pill */}
      <div style={{
        marginTop: 5,
        padding: "3px 10px",
        borderRadius: 99,
        background: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.15)",
        boxShadow: `0 2px 12px rgba(0,0,0,0.4), 0 0 16px ${chef.color}22`,
        whiteSpace: "nowrap",
      }}>
        <span style={{
          fontSize: active ? 13 : 11,
          fontWeight: 700,
          color: "#fff",
          fontFamily: "'Playfair Display', serif",
          letterSpacing: "0.01em",
          textShadow: "0 1px 4px rgba(0,0,0,0.8)",
        }}>
          {chef.name}
        </span>
      </div>

      {/* Cuisine — frosted glass badge with profile color border */}
      <div style={{
        marginTop: 3,
        padding: "2px 10px",
        borderRadius: 99,
        background: "rgba(0,0,0,0.35)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        border: `1px solid ${chef.color}`,
        boxShadow: `0 2px 10px rgba(0,0,0,0.4), 0 0 10px ${chef.color}30`,
        whiteSpace: "nowrap",
      }}>
        <span style={{
          fontSize: 10,
          fontWeight: 600,
          color: chef.color,
          fontFamily: "'DM Sans', sans-serif",
          letterSpacing: "0.02em",
        }}>
          {chef.cuisine[0]}
        </span>
      </div>
    </div>
  );
}

export function ChefMap({ chefs, onSelect, onFilteredChange }: ChefMapProps) {
  const mapRef = useRef<MapRef>(null);
  const { addBooking } = useBookings();

  const [popupChef, setPopupChef]     = useState<Chef | null>(null);
  const [viewState, setViewState]     = useState({ longitude: LOUISIANA_CENTER.lng, latitude: LOUISIANA_CENTER.lat, zoom: DEFAULT_ZOOM });
  const [drawerChef, setDrawerChef]   = useState<Chef | null>(null);
  const [bookingChef, setBookingChef] = useState<Chef | null>(null);
  const [reviews]                     = useState<Review[]>(allReviews);

  const [filtersOpen, setFiltersOpen]               = useState(false);
  const [locationFilter, setLocationFilter]         = useState("all");
  const [cuisineFilter, setCuisineFilter]           = useState("All Cuisines");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [searchQuery, setSearchQuery]               = useState("");
  const [searchError, setSearchError]               = useState<string | null>(null);
  const [searchLoading, setSearchLoading]           = useState(false);
  const [priceRange, setPriceRange]                 = useState<[number, number]>([0, 150]);
  const [locationAsked, setLocationAsked]           = useState(false);
  const [locationBanner, setLocationBanner]         = useState(true);

  const activeFilterCount = [
    locationFilter !== "all",
    cuisineFilter !== "All Cuisines",
    availabilityFilter !== "all",
    priceRange[0] > 0 || priceRange[1] < 150,
  ].filter(Boolean).length;

  const filteredIds = useMemo(() => new Set(chefs.filter((chef) => {
    if (locationFilter !== "all") {
      const b = AREA_BOUNDS[locationFilter];
      if (b && !(chef.lat >= b.latMin && chef.lat <= b.latMax && chef.lng >= b.lngMin && chef.lng <= b.lngMax)) return false;
    }
    if (cuisineFilter !== "All Cuisines") {
      const match = (chef.cuisine as string[]).some((c) =>
        c.toLowerCase().includes(cuisineFilter.toLowerCase())
      ) || chef.specialty.toLowerCase().includes(cuisineFilter.toLowerCase());
      if (!match) return false;
    }
    if (availabilityFilter !== "all") {
      const dayMap: Record<string, string[]> = {
        week: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
        weekend: ["Sat","Sun"],
        weekdays: ["Mon","Tue","Wed","Thu","Fri"],
      };
      if (!chef.available.some((d) => (dayMap[availabilityFilter] ?? []).includes(d))) return false;
    }
    // Price filter
    if (chef.price < priceRange[0] || chef.price > priceRange[1]) return false;
    return true;
  }).map((c) => c.id)), [chefs, locationFilter, cuisineFilter, availabilityFilter, priceRange]);

  // Notify parent whenever the filtered set changes
  const filteredChefsForParent = useMemo(
    () => chefs.filter((c) => filteredIds.has(c.id)),
    [chefs, filteredIds]
  );
  useEffect(() => {
    onFilteredChange?.(filteredChefsForParent);
  }, [filteredChefsForParent, onFilteredChange]);

  // Glow border: is the map center within the selected chef's service radius?
  const inRadius = useMemo(() => {
    if (!popupChef) return false;
    const toRad = (d: number) => (d * Math.PI) / 180;
    const R = 3958.8; // miles
    const dLat = toRad(viewState.latitude  - popupChef.lat);
    const dLng = toRad(viewState.longitude - popupChef.lng);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(popupChef.lat)) * Math.cos(toRad(viewState.latitude)) *
      Math.sin(dLng / 2) ** 2;
    const distMiles = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return distMiles <= (popupChef.serviceRadius ?? 10);
  }, [popupChef, viewState.latitude, viewState.longitude]);


  const handleAreaFilter = useCallback((value: string) => {
    setLocationFilter(value);
    setPopupChef(null);
    const target = value === "all"
      ? { lng: LOUISIANA_CENTER.lng, lat: LOUISIANA_CENTER.lat, zoom: DEFAULT_ZOOM }
      : AREA_CENTERS[value];
    if (target && mapRef.current) {
      mapRef.current.flyTo({ center: [target.lng, target.lat], zoom: target.zoom, duration: 1200 });
    }
  }, []);

  function handleUseMyLocation() {
    setLocationBanner(false);
    if (!navigator.geolocation) {
      setSearchError("Your browser doesn't support location access.");
      return;
    }
    setSearchLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        // Check within Louisiana 50-mile bounds
        const withinBounds = lat >= 29.50 && lat <= 30.95 && lng >= -92.89 && lng <= -91.15;
        if (!withinBounds) {
          setSearchError("You're outside our current service area. We're only in the Lafayette, LA area right now — but stay tuned! 🚀");
          setSearchLoading(false);
          return;
        }
        mapRef.current?.flyTo({ center: [lng, lat], zoom: 12, duration: 1400 });
        setSearchLoading(false);
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setSearchError("Location access was denied. You can search by city name instead.");
        } else {
          setSearchError("Couldn't get your location. Please try searching by city name.");
        }
        setSearchLoading(false);
      },
      { timeout: 8000 }
    );
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchError(null);
    setSearchLoading(true);

    try {
      const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${token}&country=US&types=place,locality,neighborhood&limit=1`
      );
      const data = await res.json();

      if (!data.features || data.features.length === 0) {
        setSearchError("We couldn't find that location. Try a city name like 'Lafayette' or 'Baton Rouge'.");
        setSearchLoading(false);
        return;
      }

      const [lng, lat] = data.features[0].center;
      const placeName: string = data.features[0].place_name ?? "";

      // Check if it's in Louisiana
      const isLouisiana = placeName.toLowerCase().includes("louisiana") || placeName.toLowerCase().includes(", la");

      if (!isLouisiana) {
        setSearchError(`We're not in ${data.features[0].text ?? searchQuery} yet — but we're growing fast! Stay tuned for Poach expanding to your city soon. 🚀`);
        setSearchLoading(false);
        return;
      }

      // Check if within our 50-mile bounds
      const withinBounds = lat >= 29.50 && lat <= 30.95 && lng >= -92.89 && lng <= -91.15;

      if (!withinBounds) {
        setSearchError(`We're not in ${data.features[0].text ?? searchQuery} yet — but we're growing across Louisiana! Check back soon. 🚀`);
        setSearchLoading(false);
        return;
      }

      // Fly to the searched location
      mapRef.current?.flyTo({ center: [lng, lat], zoom: 12, duration: 1400 });
      setSearchError(null);
    } catch {
      setSearchError("Something went wrong. Please try again.");
    }

    setSearchLoading(false);
  }

  function clearFilters() {
    setLocationFilter("all");
    setCuisineFilter("All Cuisines");
    setAvailabilityFilter("all");
    setPriceRange([0, 150]);
    setPopupChef(null);
    mapRef.current?.flyTo({ center: [LOUISIANA_CENTER.lng, LOUISIANA_CENTER.lat], zoom: DEFAULT_ZOOM, duration: 1000 });
  }

  const filteredCount = chefs.filter((c) => filteredIds.has(c.id)).length;

  return (
    <>
      {/* Outer wrapper — NO overflow:hidden, use border-radius via inline style only */}
      <div style={{ borderRadius: 16, border: "1px solid #27272a", background: "#09090b", marginBottom: 28 }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 20px", borderBottom: "1px solid #18181b" }}>
          <span style={{ color: "#C8A97E" }}>📍</span>
          <span style={{ fontWeight: 700, color: "#fff", fontSize: 15, fontFamily: "var(--font-playfair)" }}>Chefs Near You</span>
          <span style={{ background: "#18181b", borderRadius: 99, padding: "2px 10px", fontSize: 11, color: "#a1a1aa" }}>
            {filteredCount} of {chefs.length}
          </span>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
            {activeFilterCount > 0 && (
              <button onClick={clearFilters} style={{ fontSize: 11, color: "#71717a", cursor: "pointer", background: "none", border: "none", textDecoration: "underline" }}>
                Clear
              </button>
            )}
            <button
              onClick={() => setFiltersOpen((v) => !v)}
              style={{
                display: "flex", alignItems: "center", gap: 6, padding: "6px 12px",
                borderRadius: 99, fontSize: 11, fontWeight: 600, cursor: "pointer",
                border: `1px solid ${filtersOpen || activeFilterCount > 0 ? "#C8A97E" : "#3f3f46"}`,
                color: filtersOpen || activeFilterCount > 0 ? "#C8A97E" : "#a1a1aa",
                background: filtersOpen || activeFilterCount > 0 ? "#D4AF3712" : "transparent",
              }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 3h10M3 6h6M5 9h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Filters
              {activeFilterCount > 0 && (
                <span style={{ background: "#C8A97E", color: "#0a0a0a", borderRadius: 99, width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700 }}>
                  {activeFilterCount}
                </span>
              )}
            </button>
            <span style={{ background: "#18181b", borderRadius: 99, padding: "4px 12px", fontSize: 11, color: "#71717a" }}>
              Louisiana
            </span>
          </div>
        </div>



        {/* Price slider row */}
        <div style={{ padding: "10px 20px", borderBottom: "1px solid #18181b", background: "#0b0b0b", display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#71717a", whiteSpace: "nowrap" }}>💰 Price / person</span>
          {/* Slider track */}
          <div style={{ position: "relative", flex: 1, height: 20, display: "flex", alignItems: "center" }}>
            <div style={{ position: "absolute", left: 0, right: 0, height: 3, background: "#27272a", borderRadius: 99 }} />
            <div style={{
              position: "absolute",
              left: `${(priceRange[0] / 150) * 100}%`,
              right: `${100 - (priceRange[1] / 150) * 100}%`,
              height: 3, background: "#C8A97E", borderRadius: 99,
            }} />
            <input type="range" min={0} max={150} step={5} value={priceRange[0]}
              onChange={(e) => setPriceRange([Math.min(Number(e.target.value), priceRange[1] - 5), priceRange[1]])}
              style={{ position: "absolute", width: "100%", appearance: "none", WebkitAppearance: "none", background: "transparent", outline: "none", cursor: "pointer" }}
            />
            <input type="range" min={0} max={150} step={5} value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Math.max(Number(e.target.value), priceRange[0] + 5)])}
              style={{ position: "absolute", width: "100%", appearance: "none", WebkitAppearance: "none", background: "transparent", outline: "none", cursor: "pointer" }}
            />
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#C8A97E", whiteSpace: "nowrap", minWidth: 90, textAlign: "right" }}>
            ${priceRange[0]} — {priceRange[1] >= 150 ? "$150+" : `$${priceRange[1]}`}
          </span>
        </div>

        {/* Search bar */}
        <div style={{ padding: "10px 16px", borderBottom: "1px solid #18181b", background: "#0a0a0a" }}>
          <form onSubmit={handleSearch} style={{ display: "flex", gap: 8 }}>
            <div style={{ flex: 1, position: "relative" }}>
              <span style={{
                position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)",
                fontSize: 14, color: "#52525b", pointerEvents: "none",
              }}>🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setSearchError(null); }}
                placeholder="Search a city in Louisiana..."
                style={{
                  width: "100%", background: "#18181b", border: "1px solid #27272a",
                  borderRadius: 10, padding: "8px 12px 8px 32px", fontSize: 12,
                  color: "#f5f0e8", outline: "none", fontFamily: "'DM Sans', sans-serif",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <button
              type="submit"
              disabled={searchLoading}
              style={{
                background: "#C8A97E", color: "#0a0a0a", border: "none",
                borderRadius: 10, padding: "8px 16px", fontSize: 12,
                fontWeight: 700, cursor: searchLoading ? "wait" : "pointer",
                fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap",
                opacity: searchLoading ? 0.7 : 1,
              }}
            >
              {searchLoading ? "..." : "Go"}
            </button>
          </form>

          {/* Error message */}
          {searchError && (
            <div style={{
              marginTop: 8, padding: "8px 12px", borderRadius: 8,
              background: "#1a1010", border: "1px solid #C8A97E44",
              fontSize: 11, color: "#C8A97E", lineHeight: 1.5,
              fontFamily: "'DM Sans', sans-serif",
            }}>
              {searchError}
            </div>
          )}
          {/* Use My Location — directly under search input */}
          {locationBanner && (
            <div style={{
              marginTop: 8,
              display: "flex", alignItems: "center", gap: 8,
              padding: "8px 10px",
              background: "#0e0d0b",
              border: "1px solid #27272a",
              borderRadius: 10,
            }}>
              <span style={{ fontSize: 14 }}>📍</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#f5f0e8" }}>Find chefs near you</div>
                <div style={{ fontSize: 10, color: "#71717a" }}>Allow location to see nearby chefs</div>
              </div>
              <button
                onClick={handleUseMyLocation}
                style={{
                  background: "#C8A97E", color: "#0a0a0a", border: "none",
                  borderRadius: 7, padding: "5px 12px", fontSize: 11,
                  fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Use My Location
              </button>
              <button
                onClick={() => setLocationBanner(false)}
                style={{ background: "none", border: "none", color: "#52525b", cursor: "pointer", fontSize: 15, lineHeight: 1 }}
              >
                ×
              </button>
            </div>
          )}
        </div>

        {/* Filter panel */}
        {filtersOpen && (
          <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 16, background: "#060A06", borderBottom: "1px solid #18181b" }}>
            <FilterSection icon="🗺️" label="Location">
              {AREA_FILTERS.map((a) => (
                <FilterPill key={a.value} label={a.label} active={locationFilter === a.value}
                  color="#C8A97E" onClick={() => handleAreaFilter(a.value)} />
              ))}
            </FilterSection>
            <FilterSection icon="🍽️" label="Cuisine">
              {CUISINES.map((c) => (
                <FilterPill key={c} label={c} active={cuisineFilter === c}
                  color="#7EC8A4" onClick={() => { setCuisineFilter(c); setPopupChef(null); }} />
              ))}
            </FilterSection>
            <FilterSection icon="🕐" label="Availability">
              {AVAILABILITY_OPTIONS.map((a) => (
                <FilterPill key={a.value} label={a.label} active={availabilityFilter === a.value}
                  color="#A78BFA" onClick={() => { setAvailabilityFilter(a.value); setPopupChef(null); }} />
              ))}
            </FilterSection>

          </div>
        )}

        {/* Map — explicit height, position relative, NO overflow hidden on any ancestor */}
        <style>{`
          @keyframes radiusGlow {
            0%, 100% { box-shadow: 0 0 0px 0px var(--glow-color), inset 0 0 0px 0px var(--glow-color); }
            50%       { box-shadow: 0 0 28px 6px var(--glow-color), inset 0 0 20px 3px var(--glow-color); }
          }
          .map-in-radius { animation: radiusGlow 1.6s ease-in-out infinite; }
        `}</style>
        <div
          className={inRadius && popupChef ? "map-in-radius" : undefined}
          style={{
            height: 340,
            position: "relative",
            transition: "box-shadow 0.5s ease",
            ...(inRadius && popupChef
              ? { ["--glow-color" as string]: popupChef.color + "99" }
              : {}),
          }}
        >
          <Map
            ref={mapRef}
            mapboxAccessToken={MAPBOX_TOKEN}
            initialViewState={{ longitude: LOUISIANA_CENTER.lng, latitude: LOUISIANA_CENTER.lat, zoom: DEFAULT_ZOOM }}
            onMove={(evt) => setViewState(evt.viewState)}
            style={{ width: "100%", height: "100%" }}
            mapStyle="mapbox://styles/poach/cmnax21j0004401sjemgk6n4h"
            maxBounds={[[-94.5, 28.8], [-88.5, 33.1]]}
            onClick={() => setPopupChef(null)}
          >
            <NavigationControl position="top-right" showCompass={false} />

            {chefs.map((chef) => (
              <Marker
                key={chef.id}
                longitude={chef.lng}
                latitude={chef.lat}
                anchor="bottom"
                onClick={(e) => {
                  e.originalEvent.stopPropagation();
                  if (!filteredIds.has(chef.id)) return;
                  setPopupChef((prev) => prev?.id === chef.id ? null : chef);
                }}
              >
                <ChefPin
                  chef={chef}
                  active={popupChef?.id === chef.id}
                  dimmed={!filteredIds.has(chef.id) || (popupChef !== null && popupChef.id !== chef.id)}
                />
              </Marker>
            ))}

            {popupChef && (
              <Popup
                longitude={popupChef.lng}
                latitude={popupChef.lat}
                anchor="top"
                offset={14}
                closeButton={false}
                closeOnClick={false}
                style={{ padding: 0, zIndex: 999 }}
              >
                <div
                  onClick={() => { setPopupChef(null); setDrawerChef(popupChef); }}
                  style={{
                    background: "rgba(10, 12, 10, 0.55)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    border: `1px solid ${popupChef.color}`,
                    boxShadow: `0 4px 24px ${popupChef.color}30, 0 2px 12px rgba(0,0,0,0.5)`,
                    borderRadius: 14, padding: "14px 16px", minWidth: 220,
                    fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: "50%", background: popupChef.color + "22",
                      border: `2px solid ${popupChef.color}`, display: "flex", alignItems: "center",
                      justifyContent: "center", fontSize: 13, fontWeight: 800, color: popupChef.color,
                    }}>
                      {popupChef.avatar}
                    </div>
                    <div>
                      <div style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>{popupChef.name}</div>
                      <div style={{ color: "#888", fontSize: 11 }}>{popupChef.location}</div>
                      <div style={{
                        marginTop: 3, fontSize: 10, fontWeight: 600,
                        color: popupChef.color,
                        background: popupChef.color + "15",
                        border: `1px solid ${popupChef.color}40`,
                        borderRadius: 99, padding: "1px 7px",
                        display: "inline-block",
                      }}>
                        📍 {popupChef.serviceRadius ?? 10} mi serving area
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 10 }}>
                    {popupChef.cuisine.slice(0, 3).map((c) => (
                      <span key={c} style={{ background: popupChef.color + "18", color: popupChef.color, borderRadius: 99, padding: "2px 8px", fontSize: 10, fontWeight: 600 }}>{c}</span>
                    ))}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <Stars rating={popupChef.rating} size={12} />
                    <div style={{ textAlign: "right" }}>
                      <div style={{ color: popupChef.color, fontWeight: 700, fontSize: 15 }}>
                        ${popupChef.price}<span style={{ color: "#555", fontWeight: 400, fontSize: 10 }}>/person</span>
                      </div>
                      <div style={{ color: "#555", fontSize: 9, marginTop: 1 }}>starting from</div>
                    </div>
                  </div>
                  <div style={{
                    background: popupChef.color, color: "#0A0A0A", borderRadius: 10,
                    padding: "9px 0", textAlign: "center", fontWeight: 700, fontSize: 12,
                  }}>
                    View Chef →
                  </div>
                </div>
              </Popup>
            )}

            {/* Ripple radius overlay */}
            {popupChef && (() => {
              const mapInstance = mapRef.current?.getMap?.();
              if (!mapInstance) return null;
              try {
                const point       = mapInstance.project([popupChef.lng, popupChef.lat]);
                const radiusMiles = popupChef.serviceRadius ?? 10;
                const radiusKm    = radiusMiles * 1.60934;
                const radiusDeg   = radiusKm / 110.574;
                const edgePoint   = mapInstance.project([popupChef.lng, popupChef.lat + radiusDeg]);
                const radiusPx    = Math.abs(point.y - edgePoint.y);
                if (!radiusPx || radiusPx <= 0) return null;
                const c   = popupChef.color;
                const uid = `r${popupChef.id}`;
                return (
                  <svg
                    key="radius-svg"
                    style={{
                      position: "absolute",
                      top: 0, left: 0,
                      width: "100%", height: "100%",
                      pointerEvents: "none",
                      zIndex: 0,
                      overflow: "visible",
                    }}
                  >
                    <defs>
                      <radialGradient id={`${uid}-fill`} cx="50%" cy="50%" r="50%">
                        <stop offset="60%" stopColor={c} stopOpacity={0} />
                        <stop offset="100%" stopColor={c} stopOpacity={0.13} />
                      </radialGradient>
                      <filter id={`${uid}-glow`} x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="2.5" result="blur" />
                        <feMerge>
                          <feMergeNode in="blur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                      <style>{`
                        @keyframes rp1-${uid} {
                          0%   { r: ${radiusPx}px; opacity: 0.65; }
                          100% { r: ${radiusPx * 1.18}px; opacity: 0; }
                        }
                        @keyframes rp2-${uid} {
                          0%   { r: ${radiusPx}px; opacity: 0.45; }
                          100% { r: ${radiusPx * 1.18}px; opacity: 0; }
                        }
                        @keyframes rp3-${uid} {
                          0%   { r: ${radiusPx}px; opacity: 0.25; }
                          100% { r: ${radiusPx * 1.18}px; opacity: 0; }
                        }
                      `}</style>
                    </defs>

                    {/* Soft radial fill */}
                    <circle cx={point.x} cy={point.y} r={radiusPx}
                      fill={`url(#${uid}-fill)`} />

                    {/* Solid base ring with glow */}
                    <circle cx={point.x} cy={point.y} r={radiusPx}
                      fill="none"
                      stroke={c}
                      strokeWidth={1.5}
                      strokeOpacity={0.55}
                      filter={`url(#${uid}-glow)`}
                    />

                    {/* Ripple 1 */}
                    <circle cx={point.x} cy={point.y} r={radiusPx}
                      fill="none" stroke={c} strokeWidth={1.5}
                      style={{ animation: `rp1-${uid} 2.6s ease-out infinite` }}
                    />
                    {/* Ripple 2 */}
                    <circle cx={point.x} cy={point.y} r={radiusPx}
                      fill="none" stroke={c} strokeWidth={1}
                      style={{ animation: `rp2-${uid} 2.6s ease-out 0.87s infinite` }}
                    />
                    {/* Ripple 3 */}
                    <circle cx={point.x} cy={point.y} r={radiusPx}
                      fill="none" stroke={c} strokeWidth={0.6}
                      style={{ animation: `rp3-${uid} 2.6s ease-out 1.73s infinite` }}
                    />
                  </svg>
                );
              } catch { return null; }
            })()}
            {/* Map overlay hint — bottom-center */}
            <div style={{
              position: "absolute",
              bottom: 16,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 10,
              pointerEvents: filteredCount === 0 ? "auto" : "none",
            }}>
              {filteredCount > 0 ? (
                <div style={{
                  background: "rgba(8,8,8,0.72)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid #ffffff12",
                  borderRadius: 99,
                  padding: "6px 16px",
                  fontSize: 11,
                  color: "#a1a1aa",
                  whiteSpace: "nowrap",
                }}>
                  <span style={{ color: "#C8A97E", fontWeight: 700 }}>{filteredCount}</span>
                  {" "}chef{filteredCount !== 1 ? "s" : ""} in this area · tap a pin to view
                </div>
              ) : (
                <div style={{
                  background: "rgba(8,8,8,0.82)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid #C8A97E44",
                  borderRadius: 99,
                  padding: "6px 16px",
                  fontSize: 11,
                  color: "#a1a1aa",
                  whiteSpace: "nowrap",
                  pointerEvents: "auto",
                }}>
                  No chefs match ·{" "}
                  <button onClick={clearFilters} style={{ color: "#C8A97E", textDecoration: "underline", background: "none", border: "none", cursor: "pointer", fontSize: 11 }}>
                    clear filters
                  </button>
                </div>
              )}
            </div>
          </Map>
        </div>
      </div>

      {drawerChef && !bookingChef && (
        <ChefDrawer
          chef={drawerChef}
          reviews={reviews}
          onClose={() => setDrawerChef(null)}
          onBook={(chef) => { setDrawerChef(null); setBookingChef(chef); }}
        />
      )}

      {bookingChef && (
        <BookingModal
          chef={bookingChef}
          onClose={() => setBookingChef(null)}
          onSuccess={(booking) => { addBooking(booking); setBookingChef(null); }}
        />
      )}
    </>
  );
}
