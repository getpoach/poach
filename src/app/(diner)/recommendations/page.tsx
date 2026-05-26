"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { chefs } from "@/data/chefs";
import type { Chef, Review } from "@/types";
import { ChefDrawer } from "@/components/chefs/ChefDrawer";
import { BookingModal } from "@/components/booking/BookingModal";
import { Star, MapPin, Heart } from "lucide-react";

const MOCK_REVIEWS: Record<string, Review[]> = {};

const MAX_FAVORITES = 5;

// Chefs Alex has booked before
const BOOKED_CHEF_IDS = ["1", "3", "6"]; // Beau, Jaxon, Simone

// Alex's preferred cuisines (would come from profile in real app)
const PREFERRED_CUISINES = ["French", "Fusion", "Mediterranean"];

export default function DinerRecommendations() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>(["1", "6"]); // pre-favorited
  const [activeTab, setActiveTab]   = useState<"favorites" | "suggested" | "nearby">("favorites");
  const [viewChef, setViewChef]       = useState<Chef | null>(null);
  const [bookingChef, setBookingChef] = useState<Chef | null>(null);

  function toggleFavorite(id: string) {
    setFavorites(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= MAX_FAVORITES) return prev; // cap at 5
      return [...prev, id];
    });
  }

  const favoriteChefs = chefs.filter(c => favorites.includes(c.id));

  const suggestedChefs = chefs
    .filter(c => !favorites.includes(c.id))
    .filter(c => c.cuisine.some(cu => PREFERRED_CUISINES.includes(cu)))
    .slice(0, 8);

  const nearbyChefs = chefs
    .filter(c => !favorites.includes(c.id))
    .filter(c => (c.serviceRadius ?? 10) >= 10)
    .slice(0, 8);

  const shownChefs = activeTab === "favorites" ? favoriteChefs
    : activeTab === "suggested" ? suggestedChefs
    : nearbyChefs;

  function ChefCard({ chef }: { chef: Chef }) {
    const isFav = favorites.includes(chef.id);
    const wasBooked = BOOKED_CHEF_IDS.includes(chef.id);
    return (
      <div style={{ background: "var(--bg-secondary)", border: `1px solid ${isFav ? chef.color + "44" : "var(--border)"}`, borderRadius: 14, overflow: "hidden", transition: "border-color 0.2s" }}>
        {/* Headshot */}
        <div style={{ height: 130, position: "relative", overflow: "hidden", background: "var(--bg-tertiary)" }}>
          {chef.headshot && <img src={chef.headshot} alt={chef.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(8,8,8,0.9) 100%)" }} />
          {/* Favorite button */}
          <button onClick={() => toggleFavorite(chef.id)}
            title={isFav ? "Remove from favorites" : favorites.length >= MAX_FAVORITES ? "Favorites full (max 5)" : "Add to favorites"}
            style={{ position: "absolute", top: 10, right: 10, width: 32, height: 32, borderRadius: "50%", background: "rgba(10,10,10,0.7)", border: `1px solid ${isFav ? chef.color : "var(--border-mid)"}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: favorites.length >= MAX_FAVORITES && !isFav ? "not-allowed" : "pointer" }}>
            <Heart size={14} fill={isFav ? chef.color : "none"} color={isFav ? chef.color : "var(--text-muted)"} strokeWidth={1.75} />
          </button>
          {wasBooked && (
            <span style={{ position: "absolute", top: 10, left: 10, fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 99, background: "#7EC87E22", border: "1px solid #7EC87E44", color: "#7EC87E" }}>Booked before</span>
          )}
          {/* Name overlay */}
          <div style={{ position: "absolute", bottom: 10, left: 14, right: 44 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-playfair)", lineHeight: 1.2 }}>{chef.name}</div>
            <div style={{ fontSize: 11, color: chef.color, fontStyle: "italic", fontFamily: "var(--font-playfair)" }}>{chef.businessName}</div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "12px 14px" }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
            {chef.cuisine.map(c => (
              <span key={c} style={{ fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 99, background: chef.color + "18", border: `1px solid ${chef.color}33`, color: chef.color }}>{c}</span>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: 10, fontSize: 11, color: "var(--text-muted)" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                <Star size={11} fill="#facc15" color="#facc15" strokeWidth={1.5} />{chef.rating}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                <MapPin size={11} color="#C8A97E" strokeWidth={1.75} />{chef.location.split(",")[0]}
              </span>
            </div>
            <div style={{ fontWeight: 800, color: "#C8A97E", fontSize: 15 }}>${chef.price}<span style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 400 }}>/pp</span></div>
          </div>
        </div>

        {/* View profile button */}
        <div style={{ padding: "0 14px 14px", display: "flex", gap: 8 }}>
          <button
            onClick={() => setViewChef(chef)}
            style={{ flex: 1, padding: "9px", borderRadius: 10, background: "var(--bg-tertiary)", color: "var(--text-secondary)", fontWeight: 600, fontSize: 12, border: "1px solid var(--border-mid)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
            View Profile
          </button>
          <button
            onClick={() => setBookingChef(chef)}
            style={{ flex: 1, padding: "9px", borderRadius: 10, background: chef.color, color: "var(--bg)", fontWeight: 700, fontSize: 12, border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
            Book
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 860 }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: "var(--text-primary)", fontFamily: "var(--font-playfair)", margin: "0 0 6px" }}>
          Chefs for You
        </h1>
        <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>
          {favorites.length}/{MAX_FAVORITES} favorites saved · Based on your love of {PREFERRED_CUISINES.join(", ")}
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, marginBottom: 24, borderBottom: "1px solid var(--border)" }}>
        {([
          { id: "favorites", label: `Favorites (${favorites.length})` },
          { id: "suggested", label: "Suggested for You" },
          { id: "nearby",    label: "Nearby Chefs" },
        ] as const).map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            style={{ padding: "10px 18px", background: "transparent", border: "none", borderBottom: activeTab === tab.id ? "2px solid #C8A97E" : "2px solid transparent", color: activeTab === tab.id ? "var(--text-primary)" : "var(--text-dim)", fontSize: 13, fontWeight: activeTab === tab.id ? 700 : 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s", marginBottom: -1 }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Favorites limit notice */}
      {favorites.length >= MAX_FAVORITES && activeTab !== "favorites" && (
        <div style={{ marginBottom: 16, padding: "10px 14px", borderRadius: 10, background: "#C8A97E12", border: "1px solid #C8A97E33", fontSize: 12, color: "#C8A97E" }}>
          You've reached your limit of 5 favorites. Remove one to add another.
        </div>
      )}

      {/* Empty favorites */}
      {activeTab === "favorites" && favorites.length === 0 && (
        <div style={{ textAlign: "center", padding: "56px 0", color: "var(--text-dim)" }}>
          <Heart size={32} color="var(--border-mid)" strokeWidth={1.5} style={{ margin: "0 auto 12px", display: "block" }} />
          <div style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 6 }}>No favorites yet</div>
          <div style={{ fontSize: 12 }}>Browse Suggested or Nearby and tap the heart to save a chef</div>
        </div>
      )}

      {/* Chef grid */}
      {shownChefs.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
          {shownChefs.map(chef => <ChefCard key={chef.id} chef={chef} />)}
        </div>
      )}
      {/* Chef Drawer */}
      {viewChef && (
        <ChefDrawer
          chef={viewChef}
          reviews={MOCK_REVIEWS[viewChef.id] ?? []}
          onClose={() => setViewChef(null)}
          onBook={(chef) => { setViewChef(null); setBookingChef(chef); }}
        />
      )}

      {/* Booking Modal */}
      {bookingChef && (
        <BookingModal
          chef={bookingChef}
          onClose={() => setBookingChef(null)}
          onSuccess={() => setBookingChef(null)}
        />
      )}
    </div>
  );
}
