"use client";
import { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
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
  theme,
}: {
  images: string[];
  startIndex: number;
  onClose: () => void;
  theme: string;
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
      style={{ background: theme === "light" ? "rgba(255,255,255,0.95)" : "rgba(0,0,0,0.92)" }}
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 text-white text-3xl leading-none hover:text-[var(--text-secondary)] transition-colors z-10"
      >
        ×
      </button>

      {/* Prev */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); setIdx((i) => (i - 1 + images.length) % images.length); }}
          className="absolute left-5 text-white text-3xl leading-none hover:text-[var(--text-secondary)] transition-colors z-10 select-none"
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
        <div className="absolute bottom-3 left-0 right-0 text-center text-xs text-[var(--text-dim)]">
          {idx + 1} / {images.length}
        </div>
      </div>

      {/* Next */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); setIdx((i) => (i + 1) % images.length); }}
          className="absolute right-5 text-white text-3xl leading-none hover:text-[var(--text-secondary)] transition-colors z-10 select-none"
        >
          ›
        </button>
      )}
    </div>
  );
}

export function ChefDrawer({ chef, reviews, onClose, onBook }: ChefDrawerProps) {
  const { theme } = useTheme();
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
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
          className="w-full max-w-[480px] bg-[var(--bg-secondary)] h-full overflow-y-auto flex flex-col"
          style={{ borderLeft: `4px solid ${chef.color}`, boxShadow: `-4px 0 24px ${chef.color}22` }}
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
                  style={{ background: theme === "light" ? "linear-gradient(to bottom, rgba(255,253,248,0.0) 20%, rgba(255,253,248,0.6) 55%, rgba(255,253,248,0.92) 80%, rgba(255,253,248,1) 100%)" : "linear-gradient(to bottom, rgba(9,9,11,0.0) 20%, rgba(9,9,11,0.55) 55%, rgba(9,9,11,0.92) 80%, rgba(9,9,11,1) 100%)" }}
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
                  style={{ background: theme === "light" ? "linear-gradient(to bottom, rgba(255,253,248,0.0) 20%, rgba(255,253,248,0.6) 55%, rgba(255,253,248,0.92) 80%, rgba(255,253,248,1) 100%)" : "linear-gradient(to bottom, rgba(9,9,11,0.0) 20%, rgba(9,9,11,0.55) 55%, rgba(9,9,11,0.92) 80%, rgba(9,9,11,1) 100%)" }}
                />
              </div>
            )}

            {/* Back button */}
            <button
              onClick={onClose}
              className="absolute top-4 left-4 text-white text-sm font-semibold px-3 py-1.5 rounded-full transition-colors hover:bg-white/10"
              style={{ background: theme === "light" ? "rgba(0,0,0,0.15)" : "rgba(0,0,0,0.45)" }}
            >
              ← Back
            </button>

            {/* Name + rating overlaid at bottom of headshot */}
            <div className="absolute bottom-0 left-0 right-0 px-6 pb-5" style={{ zIndex: 2 }}>
              <div
                className="font-display text-2xl font-black leading-tight"
                style={{ color: theme === "light" ? "#1a1a1a" : "#ffffff", textShadow: theme === "light" ? "0 1px 4px rgba(255,255,255,0.8)" : "0 1px 8px rgba(0,0,0,0.8)" }}
              >
                {chef.name}
              </div>
              {chef.businessName && (
                <div style={{ fontSize: 14, fontWeight: 600, color: chef.color, fontFamily: "var(--font-playfair)", fontStyle: "italic", marginTop: 2, textShadow: theme === "light" ? "0 1px 4px rgba(255,255,255,0.8)" : "0 1px 6px rgba(0,0,0,0.8)" }}>
                  {chef.businessName}
                </div>
              )}
              <Stars rating={chef.rating} size={13} />
              <div className="text-xs text-[var(--text-secondary)] mt-0.5">
                {chef.reviewCount} reviews · {chef.bookingCount} bookings · {chef.experience}
              </div>
              <div className="text-xs text-[var(--text-dim)] mt-0.5">🎓 {chef.trained}</div>
              <div className="text-xs mt-1.5 inline-flex items-center gap-1.5 px-2 py-1 rounded-full"
                style={{ background: chef.color + "15", border: `1px solid ${chef.color}40`, color: chef.color }}>
                📍 Serves up to {chef.serviceRadius ?? 10} miles
              </div>
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
                      style={{ background: theme === "light" ? "linear-gradient(to top, rgba(0,0,0,0.2) 0%, transparent 60%)" : "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)" }}
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
            <div className="bg-[var(--bg-tertiary)] rounded-xl p-4">
              <SectionLabel>About</SectionLabel>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{chef.bio}</p>
            </div>

            {/* Cuisines */}
            <div className="bg-[var(--bg-tertiary)] rounded-xl p-4">
              <SectionLabel>Cuisines & Specialty</SectionLabel>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {chef.cuisine.map((c) => (
                  <Tag key={c} label={c} color={chef.color} />
                ))}
              </div>
              <div
                className="text-sm pl-2.5"
                style={{ borderLeft: `2px solid ${chef.color}`, color: "var(--text-primary)", fontWeight: 500 }}
              >
                {chef.specialty}
              </div>
            </div>

            {/* Availability */}
            <div className="bg-[var(--bg-tertiary)] rounded-xl p-4">
              <SectionLabel>Availability</SectionLabel>
              <div className="flex gap-2 flex-wrap">
                {DAYS.map((d) => {
                  const avail = chef.available.includes(d);
                  return (
                    <span
                      key={d}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                      style={{
                        background: avail ? chef.color + "22" : "var(--bg-hover)",
                        border: `1px solid ${avail ? chef.color + "88" : "var(--border-mid)"}`,
                        color: avail ? chef.color : "var(--text-dim)",
                        fontWeight: avail ? 700 : 500,
                      }}
                    >
                      {d}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Menus — with lowest price on right */}
            {chef.menus && chef.menus.length > 0 && (
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <div className="text-xs font-semibold text-muted uppercase tracking-widest">Menus</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                    <span style={{ fontSize: 11, color: "var(--text-muted)" }}>from</span>
                    <span style={{ fontSize: 20, fontWeight: 900, color: chef.color, fontFamily: "var(--font-playfair)" }}>
                      ${Math.min(...chef.menus.map((m: { pricePerPerson: number }) => m.pricePerPerson))}
                    </span>
                    <span style={{ fontSize: 11, color: "var(--text-muted)" }}>/pp</span>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  {chef.menus.map((menu: { id: string; name: string; description: string; pricePerPerson: number; courses: { name: string; description: string; imageUrl?: string }[] | number; tag?: string }) => {
                    const isOpen = expandedMenu === menu.id;
                    const courseList = Array.isArray(menu.courses) ? menu.courses : [];
                    const courseCount = Array.isArray(menu.courses) ? menu.courses.length : menu.courses;
                    return (
                      <div key={menu.id}
                        style={{ background: "var(--bg-tertiary)", border: `1px solid ${isOpen ? chef.color + "66" : chef.color + "33"}`, borderRadius: 12, overflow: "hidden", transition: "border-color 0.2s" }}>
                        {/* Clickable header */}
                        <button
                          onClick={() => setExpandedMenu(isOpen ? null : menu.id)}
                          style={{ width: "100%", padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "transparent", border: "none", cursor: "pointer", textAlign: "left" }}>
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                              <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-playfair)" }}>{menu.name}</span>
                              {menu.tag && (
                                <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 99, background: chef.color + "22", border: `1px solid ${chef.color}55`, color: chef.color, textTransform: "uppercase", letterSpacing: "0.07em" }}>{menu.tag}</span>
                              )}
                            </div>
                            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{courseCount} courses · {isOpen ? "hide" : "view offerings"}</div>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ fontWeight: 800, color: chef.color, fontSize: 17, fontFamily: "var(--font-playfair)" }}>
                              ${menu.pricePerPerson}<span style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 400 }}>/pp</span>
                            </div>
                            <span style={{ fontSize: 10, color: isOpen ? chef.color : "var(--text-muted)", transition: "color 0.15s" }}>{isOpen ? "▲" : "▼"}</span>
                          </div>
                        </button>

                        {/* Expanded content */}
                        {isOpen && (
                          <div style={{ borderTop: `1px solid ${chef.color}33` }}>
                            {/* Description */}
                            <div style={{ padding: "10px 14px", borderBottom: courseList.length > 0 ? `1px solid ${chef.color}22` : "none" }}>
                              <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>{menu.description}</p>
                            </div>
                            {/* Courses */}
                            {courseList.length > 0 && (
                              <div>
                                {courseList.map((course, i) => (
                                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderBottom: i < courseList.length - 1 ? `1px solid ${chef.color}18` : "none" }}>
                                    {/* Thumbnail */}
                                    <div style={{ width: 44, height: 44, borderRadius: 8, overflow: "hidden", background: "var(--bg-hover)", border: `1px solid ${chef.color}33`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                      {course.imageUrl
                                        ? <img src={course.imageUrl} alt={course.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                        : <span style={{ fontSize: 16, color: "var(--text-faint)" }}>🍽</span>
                                      }
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                      <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", marginBottom: 1 }}>{course.name}</div>
                                      <div style={{ fontSize: 11, color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{course.description}</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Reviews */}
            {chefReviews.length > 0 && (
              <div>
                <SectionLabel>Reviews</SectionLabel>
                <div className="flex flex-col gap-3">
                  {chefReviews.map((r) => (
                    <div key={r.id} className="bg-[var(--bg-tertiary)] rounded-xl p-4">
                      <div className="flex justify-between mb-1.5">
                        <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{r.author}</span>
                        <span className="text-xs text-[var(--text-dim)]">{r.date}</span>
                      </div>
                      <Stars rating={r.rating} size={12} />
                      <p className="text-sm leading-relaxed mt-2" style={{ color: "var(--text-secondary)" }}>{r.text}</p>
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
          theme={theme}
        />
      )}
    </>
  );
}
