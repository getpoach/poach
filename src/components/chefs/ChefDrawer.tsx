"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import type { Chef, Review } from "@/types";
import { Tag, Stars, SectionLabel } from "@/components/ui/index";
import { Button } from "@/components/ui/Button";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

interface ChefDrawerProps {
  chef: Chef;
  reviews: Review[];
  onClose: () => void;
  onBook: (chef: Chef) => void;
}

/** Lightbox for full-screen image preview */
function Lightbox({
  images,
  startIndex,
  onClose,
}: {
  images: string[];
  startIndex: number;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(startIndex);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIdx((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft") setIdx((i) => (i - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [images.length, onClose]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.92)" }}
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 text-white text-3xl leading-none hover:text-zinc-400 transition-colors z-10"
      >
        ×
      </button>

      {/* Prev */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); setIdx((i) => (i - 1 + images.length) % images.length); }}
          className="absolute left-5 text-white text-3xl leading-none hover:text-zinc-400 transition-colors z-10 select-none"
        >
          ‹
        </button>
      )}

      {/* Image */}
      <div onClick={(e) => e.stopPropagation()} className="relative max-w-4xl max-h-[85vh] w-full mx-16">
        <img
          src={images[idx]}
          alt={`Portfolio ${idx + 1}`}
          className="w-full h-full object-contain rounded-xl"
          style={{ maxHeight: "85vh" }}
        />
        <div className="absolute bottom-3 left-0 right-0 text-center text-xs text-zinc-500">
          {idx + 1} / {images.length}
        </div>
      </div>

      {/* Next */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); setIdx((i) => (i + 1) % images.length); }}
          className="absolute right-5 text-white text-3xl leading-none hover:text-zinc-400 transition-colors z-10 select-none"
        >
          ›
        </button>
      )}
    </div>
  );
}

export function ChefDrawer({ chef, reviews, onClose, onBook }: ChefDrawerProps) {
  const chefReviews = reviews.filter((r) => r.chefId === chef.id);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const portfolioImages = chef.portfolioImages ?? [];
  const hasPortfolio = portfolioImages.length > 0;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && lightboxIndex === null) onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose, lightboxIndex]);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 z-40 flex justify-end"
        onClick={onClose}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-[480px] bg-zinc-950 border-l border-zinc-800 h-full overflow-y-auto flex flex-col"
        >

          {/* ── Headshot hero ─────────────────────────────────────────────── */}
          <div className="relative w-full shrink-0" style={{ height: 220 }}>
            {chef.headshot ? (
              <>
                <img
                  src={chef.headshot}
                  alt={chef.name}
                  className="w-full h-full object-cover"
                />
                {/* Gradient fade — stronger at bottom so name is always readable */}
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to bottom, rgba(9,9,11,0.0) 20%, rgba(9,9,11,0.55) 55%, rgba(9,9,11,0.92) 80%, rgba(9,9,11,1) 100%)" }}
                />
              </>
            ) : (
              /* Fallback — color block with initials */
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ background: chef.color + "18" }}
              >
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center font-display font-bold text-4xl"
                  style={{ background: chef.color + "22", border: `3px solid ${chef.color}`, color: chef.color }}
                >
                  {chef.avatar}
                </div>
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to bottom, rgba(9,9,11,0.0) 20%, rgba(9,9,11,0.55) 55%, rgba(9,9,11,0.92) 80%, rgba(9,9,11,1) 100%)" }}
                />
              </div>
            )}

            {/* Back button */}
            <button
              onClick={onClose}
              className="absolute top-4 left-4 text-white text-sm font-semibold px-3 py-1.5 rounded-full transition-colors hover:bg-white/10"
              style={{ background: "rgba(0,0,0,0.45)" }}
            >
              ← Back
            </button>

            {/* Name + rating overlaid at bottom of headshot */}
            <div className="absolute bottom-0 left-0 right-0 px-6 pb-5" style={{ zIndex: 2 }}>
              <div
                className="font-display text-2xl font-black leading-tight"
                style={{ color: chef.color, textShadow: "0 1px 8px rgba(0,0,0,0.8)" }}
              >
                {chef.name}
              </div>
              <Stars rating={chef.rating} size={13} />
              <div className="text-xs text-zinc-400 mt-0.5">
                {chef.reviewCount} reviews · {chef.bookingCount} bookings · {chef.experience}
              </div>
              <div className="text-xs text-zinc-500 mt-0.5">🎓 {chef.trained}</div>
            </div>
          </div>

          {/* ── Content ───────────────────────────────────────────────────── */}
          <div className="flex flex-col gap-4 px-6 pb-8 mt-4">

            {/* Portfolio gallery */}
            {hasPortfolio && (
              <div>
                <SectionLabel>Portfolio</SectionLabel>
                {/* First image large */}
                <div
                  className="w-full rounded-xl overflow-hidden mb-2 cursor-pointer relative"
                  style={{ height: 200 }}
                  onClick={() => setLightboxIndex(0)}
                >
                  <img
                    src={portfolioImages[0]}
                    alt="Featured dish"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  {portfolioImages.length > 1 && (
                    <div
                      className="absolute inset-0 flex items-end p-3"
                      style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)" }}
                    >
                      <span className="text-xs text-white/70 font-medium">
                        Tap to view all {portfolioImages.length} photos
                      </span>
                    </div>
                  )}
                </div>

                {/* Remaining images in 3-col grid */}
                {portfolioImages.length > 1 && (
                  <div className="grid grid-cols-3 gap-2">
                    {portfolioImages.slice(1, 10).map((src, i) => {
                      const isLast = i === 8 && portfolioImages.length > 10;
                      return (
                        <div
                          key={i}
                          className="relative rounded-lg overflow-hidden cursor-pointer"
                          style={{ aspectRatio: "1" }}
                          onClick={() => setLightboxIndex(i + 1)}
                        >
                          <img
                            src={src}
                            alt={`Dish ${i + 2}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                          {isLast && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                              <span className="text-white font-bold text-sm">+{portfolioImages.length - 9}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

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
                <span className="text-sm text-zinc-500">Session rate</span>
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
                    <div key={r.id} className="bg-zinc-900 rounded-xl p-4">
                      <div className="flex justify-between mb-1.5">
                        <span className="text-sm font-bold text-white">{r.author}</span>
                        <span className="text-xs text-zinc-500">{r.date}</span>
                      </div>
                      <Stars rating={r.rating} size={12} />
                      <p className="text-sm text-zinc-400 leading-relaxed mt-2">{r.text}</p>
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
            >
              Book {chef.name.split(" ")[0]} →
            </Button>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          images={portfolioImages}
          startIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
