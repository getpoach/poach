"use client";
import { useState } from "react";
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

const SORT_OPTIONS = ["Nearest", "Top Rated", "Price: Low"];

export default function DiscoverPage() {
  const { search, setSearch, cuisine, setCuisine, filtered } = useChefFilter(allChefs);
  const [reviews, setReviews] = useState<Review[]>(allReviews);
  const { addBooking } = useBookings();
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [viewChef, setViewChef] = useState<Chef | null>(null);
  const [bookingChef, setBookingChef] = useState<Chef | null>(null);

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
          <source src="/hero.mov" type="video/quicktime" />
          <source src="/hero.mov" type="video/mp4" />
        </video>

        {/* Medium overlay — lets video show through while keeping text readable */}
        <div
          className="absolute inset-0"
          style={{
            zIndex: 1,
            background: "linear-gradient(135deg, rgba(10,8,4,0.38) 0%, rgba(8,8,16,0.32) 50%, rgba(10,8,4,0.38) 100%)",
          }}
        />

        {/* Content — sits above video and overlay */}
        <div className="relative p-10" style={{ zIndex: 2 }}>
          <div
            className="absolute -right-10 -top-10 w-72 h-72 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, #C8A97E08 0%, transparent 70%)" }}
          />
          <div className="text-xs font-bold text-gold uppercase tracking-widest mb-3">
            Private Dining · Your Home
          </div>
          <h1 className="font-display text-4xl font-black text-white leading-tight mb-4 max-w-xl">
            World-class chefs.<br />
            <span className="text-gold">Your kitchen.</span>
          </h1>
          <p className="text-zinc-400 text-sm max-w-md leading-relaxed mb-6">
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

      {/* ── Search + Filter bar ────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="flex gap-2 overflow-x-auto no-scrollbar flex-1">
          {CUISINES.map((c) => (
            <button
              key={c}
              onClick={() => setCuisine(c === "All" ? "All" : (c as typeof cuisine))}
              className="shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all"
              style={{
                border: `1px solid ${cuisine === c ? "#C8A97E" : "#222"}`,
                background: cuisine === c ? "#C8A97E15" : "#111",
                color: cuisine === c ? "#C8A97E" : "#777",
                cursor: "pointer",
              }}
            >
              {c}
            </button>
          ))}
        </div>

        {/* View toggle */}
        <div className="flex gap-1 bg-zinc-900 rounded-xl p-1 shrink-0">
          {(["grid", "map"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setViewMode(m)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all"
              style={{
                background: viewMode === m ? "#222" : "transparent",
                color: viewMode === m ? "#F5F0E8" : "#666",
                cursor: "pointer",
              }}
            >
              {m === "grid" ? "▦ Grid" : "📍 Map"}
            </button>
          ))}
        </div>
      </div>

      {/* ── Map view ──────────────────────────────────────────────────────── */}
      {viewMode === "map" && (
        <ChefMap
          chefs={filtered}
          onSelect={(chef) => {
            setViewMode("grid");
            setViewChef(chef);
          }}
        />
      )}

      {/* ── Results header ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-muted">
          <span className="text-white font-bold">{filtered.length}</span> chefs available
        </div>
        <div className="flex gap-1.5">
          {SORT_OPTIONS.map((s) => (
            <button
              key={s}
              className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-muted hover:text-white transition-colors cursor-pointer"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* ── Chef grid ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((chef) => (
          <ChefCard
            key={chef.id}
            chef={chef}
            onBook={setBookingChef}
            onView={setViewChef}
          />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-3 text-center py-16 text-muted">
            <div className="text-4xl mb-3">🍴</div>
            <div className="font-display text-lg">No chefs found</div>
            <div className="text-sm mt-1">Try a different search or cuisine</div>
          </div>
        )}
      </div>

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
