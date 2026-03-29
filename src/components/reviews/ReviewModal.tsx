"use client";
import { useState } from "react";
import type { Booking, Review } from "@/types";
import { Modal } from "@/components/ui/Modal";
import { Avatar } from "@/components/ui/index";
import { Button } from "@/components/ui/Button";
import { generateId } from "@/lib/utils";

interface ReviewModalProps {
  booking: Booking;
  onClose: () => void;
  onSubmit: (review: Review) => void;
}

export function ReviewModal({ booking, onClose, onSubmit }: ReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    const review: Review = {
      id: generateId(),
      chefId: booking.chefId,
      author: "You",
      rating,
      date: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      text,
    };
    onSubmit(review);
    setSubmitted(true);
  };

  return (
    <Modal onClose={onClose} maxWidth="max-w-md">
      {!submitted ? (
        <>
          <div className="flex items-center gap-3.5 mb-6">
            <Avatar label={booking.chefAvatar} color={booking.chefColor} size={46} />
            <div>
              <div className="font-display text-lg font-bold text-white">
                Review {booking.chefName}
              </div>
              <div className="text-xs text-muted">{booking.specialty}</div>
            </div>
            <button
              onClick={onClose}
              className="ml-auto text-muted text-2xl leading-none hover:text-white transition-colors"
            >
              ×
            </button>
          </div>

          {/* Star picker */}
          <div className="mb-5">
            <div className="text-xs font-semibold text-muted uppercase tracking-widest mb-2">
              Your Rating
            </div>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  onClick={() => setRating(s)}
                  className="text-3xl transition-colors bg-transparent border-none cursor-pointer"
                  style={{ color: s <= rating ? "#F5C842" : "#333" }}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* Review text */}
          <div className="mb-5">
            <div className="text-xs font-semibold text-muted uppercase tracking-widest mb-2">
              Your Review
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Share your experience with this chef..."
              rows={4}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-zinc-600 transition-colors resize-none"
            />
          </div>

          <Button
            accentColor={booking.chefColor}
            full
            disabled={!text}
            onClick={handleSubmit}
          >
            Submit Review
          </Button>
        </>
      ) : (
        <div className="text-center py-5">
          <div className="text-4xl mb-3">⭐</div>
          <div
            className="font-display text-xl font-bold mb-2"
            style={{ color: booking.chefColor }}
          >
            Review submitted!
          </div>
          <p className="text-zinc-500 text-sm mb-6">
            Thank you for helping the community find great chefs.
          </p>
          <Button
            accentColor={booking.chefColor}
            onClick={onClose}
            style={{ padding: "12px 36px" }}
          >
            Done
          </Button>
        </div>
      )}
    </Modal>
  );
}
