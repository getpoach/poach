"use client";
import { useEffect } from "react";
import type { Chef, Review } from "@/types";
import { Avatar, Tag, Stars, SectionLabel } from "@/components/ui/index";
import { Button } from "@/components/ui/Button";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

interface ChefDrawerProps {
  chef: Chef;
  reviews: Review[];
  onClose: () => void;
  onBook: (chef: Chef) => void;
}

export function ChefDrawer({ chef, reviews, onClose, onBook }: ChefDrawerProps) {
  const chefReviews = reviews.filter((r) => r.chefId === chef.id);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/85 z-40 flex justify-end"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[460px] bg-zinc-950 border-l border-zinc-800 h-full overflow-y-auto p-8 flex flex-col gap-4"
      >
        {/* Back */}
        <button
          onClick={onClose}
          className="text-muted text-xl self-start hover:text-white transition-colors mb-2"
        >
          ← Back
        </button>

        {/* Chef header */}
        <div className="flex gap-4 items-center mb-2">
          <Avatar label={chef.avatar} color={chef.color} size={72} />
          <div>
            <div className="font-display text-2xl font-bold text-white">
              {chef.name}
            </div>
            <Stars rating={chef.rating} size={14} />
            <div className="text-xs text-muted mt-1">
              {chef.reviewCount} reviews · {chef.bookingCount} bookings ·{" "}
              {chef.experience}
            </div>
            <div className="text-xs text-zinc-500 mt-0.5">
              🎓 {chef.trained}
            </div>
          </div>
        </div>

        {/* About */}
        <div className="bg-zinc-900 rounded-xl p-4">
          <SectionLabel>About</SectionLabel>
          <p className="text-sm text-zinc-300 leading-relaxed">{chef.bio}</p>
        </div>

        {/* Cuisines */}
        <div className="bg-zinc-900 rounded-xl p-4">
          <SectionLabel>Cuisines & Specialty</SectionLabel>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {chef.cuisine.map((c) => (
              <Tag key={c} label={c} color={chef.color} />
            ))}
          </div>
          <div
            className="text-sm text-zinc-400 pl-2.5"
            style={{ borderLeft: `2px solid ${chef.color}` }}
          >
            {chef.specialty}
          </div>
        </div>

        {/* Availability */}
        <div className="bg-zinc-900 rounded-xl p-4">
          <SectionLabel>Availability</SectionLabel>
          <div className="flex gap-2 flex-wrap">
            {DAYS.map((d) => {
              const avail = chef.available.includes(d);
              return (
                <span
                  key={d}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                  style={{
                    background: avail ? chef.color + "20" : "#1A1A1A",
                    border: `1px solid ${avail ? chef.color + "44" : "#222"}`,
                    color: avail ? chef.color : "#444",
                  }}
                >
                  {d}
                </span>
              );
            })}
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-zinc-900 rounded-xl p-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted">Session rate</span>
            <span
              className="font-display text-xl font-bold"
              style={{ color: chef.color }}
            >
              ${chef.price}
            </span>
          </div>
          <div className="text-xs text-zinc-600 mt-1">
            Up to 3 hours · ingredients billed separately
          </div>
        </div>

        {/* Reviews */}
        {chefReviews.length > 0 && (
          <div>
            <SectionLabel>Reviews</SectionLabel>
            <div className="flex flex-col gap-3">
              {chefReviews.map((r) => (
                <div
                  key={r.id}
                  className="bg-zinc-900 rounded-xl p-4"
                >
                  <div className="flex justify-between mb-1.5">
                    <span className="text-sm font-bold text-white">
                      {r.author}
                    </span>
                    <span className="text-xs text-muted">{r.date}</span>
                  </div>
                  <Stars rating={r.rating} size={12} />
                  <p className="text-sm text-zinc-400 leading-relaxed mt-2">
                    {r.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Book CTA */}
        <Button
          accentColor={chef.color}
          full
          size="lg"
          onClick={() => onBook(chef)}
          className="mt-2"
        >
          Book {chef.name.split(" ")[0]} →
        </Button>
      </div>
    </div>
  );
}
