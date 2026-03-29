"use client";
import { useState } from "react";
import type { Booking } from "@/types";
import { useBookings } from "@/hooks/useBookings";
import { ReviewModal } from "@/components/reviews/ReviewModal";
import { Avatar, Stars } from "@/components/ui/index";
import { Button } from "@/components/ui/Button";

type TabType = "upcoming" | "completed" | "all";

const STATUS_BADGE: Record<string, { bg: string; color: string; label: string }> = {
  upcoming: { bg: "#0D1A0D", color: "#7EC87E", label: "Upcoming" },
  completed: { bg: "#1A1A0D", color: "#C8B87E", label: "Completed" },
  cancelled: { bg: "#1A0D0D", color: "#C87E7E", label: "Cancelled" },
};

export default function BookingsPage() {
  const { bookings, hydrated } = useBookings();
  const [tab, setTab] = useState<TabType>("upcoming");
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);

  const filtered =
    tab === "all" ? bookings : bookings.filter((b) => b.status === tab);

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center py-24 text-muted">
        Loading bookings...
      </div>
    );
  }

  return (
    <>
      <div className="mb-2">
        <h1 className="font-display text-3xl font-bold text-white">
          My Bookings
        </h1>
        <p className="text-muted text-sm mt-1">
          Your upcoming and past private dining sessions.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 mt-6">
        {(["upcoming", "completed", "all"] as TabType[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-4 py-2 rounded-full text-sm transition-all capitalize"
            style={{
              border: `1px solid ${tab === t ? "#C8A97E" : "#222"}`,
              background: tab === t ? "#C8A97E15" : "#111",
              color: tab === t ? "#C8A97E" : "#777",
              fontWeight: tab === t ? 700 : 400,
              cursor: "pointer",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Bookings list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted">
          <div className="text-4xl mb-3">📅</div>
          <div className="font-display text-lg">No bookings here</div>
          <div className="text-sm mt-1">
            <a href="/" className="text-gold hover:underline">
              Discover a chef
            </a>{" "}
            to get started
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((b) => {
            const badge = STATUS_BADGE[b.status];
            return (
              <div
                key={b.id}
                className="rounded-2xl p-5"
                style={{ background: "#111", border: "1px solid #1E1E1E" }}
              >
                {/* Chef info */}
                <div className="flex items-center gap-3.5 mb-4">
                  <Avatar label={b.chefAvatar} color={b.chefColor} size={46} />
                  <div className="flex-1">
                    <div className="font-display text-base font-bold text-white">
                      {b.chefName}
                    </div>
                    <div className="text-xs text-muted">{b.specialty}</div>
                  </div>
                  <span
                    className="rounded-full px-3 py-1 text-xs font-bold"
                    style={{ background: badge.bg, color: badge.color }}
                  >
                    {badge.label}
                  </span>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
                  {[
                    ["📅 Date", b.date],
                    ["⏰ Time", b.time],
                    ["👥 Guests", String(b.guests)],
                    ["💰 Total", `$${b.total}`],
                  ].map(([k, v]) => (
                    <div
                      key={k}
                      className="rounded-xl p-3"
                      style={{ background: "#161616" }}
                    >
                      <div className="text-[10px] text-muted mb-1">{k}</div>
                      <div className="text-sm text-white font-semibold">{v}</div>
                    </div>
                  ))}
                </div>

                {/* Note */}
                {b.note && (
                  <div
                    className="rounded-xl px-3.5 py-2.5 mb-4 text-xs text-zinc-400"
                    style={{
                      background: "#141414",
                      borderLeft: `2px solid ${b.chefColor}44`,
                    }}
                  >
                    📝 {b.note}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2.5">
                  {b.status === "upcoming" && (
                    <Button
                      accentColor={b.chefColor}
                      full
                      size="sm"
                    >
                      Manage Booking
                    </Button>
                  )}
                  {b.status === "completed" && (
                    <>
                      <Button
                        accentColor={b.chefColor}
                        size="sm"
                        onClick={() => setReviewBooking(b)}
                        style={{ flex: 1 }}
                      >
                        Leave Review ⭐
                      </Button>
                      <Button
                        accentColor={b.chefColor}
                        variant="outline"
                        size="sm"
                        onClick={() => (window.location.href = "/")}
                        style={{ flex: 1 }}
                      >
                        Book Again
                      </Button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Review modal */}
      {reviewBooking && (
        <ReviewModal
          booking={reviewBooking}
          onClose={() => setReviewBooking(null)}
          onSubmit={() => setReviewBooking(null)}
        />
      )}
    </>
  );
}
