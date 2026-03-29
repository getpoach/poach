"use client";
import { useState } from "react";
import type { Chef, Booking, Day } from "@/types";
import { Modal } from "@/components/ui/Modal";
import { Avatar } from "@/components/ui/index";
import { StepDateTime } from "./BookingSteps/StepDateTime";
import { StepDetails } from "./BookingSteps/StepDetails";
import { StepPayment } from "./BookingSteps/StepPayment";
import { Button } from "@/components/ui/Button";
import { generateId, totalWithFee } from "@/lib/utils";

const STEP_LABELS = ["Date & Time", "Details", "Payment"];

interface BookingModalProps {
  chef: Chef;
  onClose: () => void;
  onSuccess: (booking: Booking) => void;
}

export function BookingModal({ chef, onClose, onSuccess }: BookingModalProps) {
  const [step, setStep] = useState(1);
  const [day, setDay] = useState<Day | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [guests, setGuests] = useState(2);
  const [note, setNote] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [card, setCard] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    const booking: Booking = {
      id: generateId(),
      chefId: chef.id,
      chefName: chef.name,
      chefColor: chef.color,
      chefAvatar: chef.avatar,
      specialty: chef.specialty,
      day: day!,
      time: time!,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      guests,
      total: totalWithFee(chef.price),
      status: "upcoming",
      note,
    };
    onSuccess(booking);
    setConfirmed(true);
  };

  return (
    <Modal onClose={onClose}>
      {!confirmed ? (
        <>
          {/* Header */}
          <div className="flex items-center gap-3.5 mb-6">
            <Avatar label={chef.avatar} color={chef.color} size={46} />
            <div>
              <div className="font-display text-lg font-bold text-white">
                Book {chef.name}
              </div>
              <div className="text-xs text-muted">{chef.specialty}</div>
            </div>
            <button
              onClick={onClose}
              className="ml-auto text-muted text-2xl leading-none hover:text-white transition-colors"
            >
              ×
            </button>
          </div>

          {/* Step tabs */}
          <div className="flex bg-zinc-900 rounded-xl p-1 mb-6">
            {STEP_LABELS.map((label, i) => (
              <button
                key={label}
                onClick={() => i < step - 1 && setStep(i + 1)}
                className="flex-1 py-2 px-1 rounded-lg text-xs font-bold transition-all"
                style={{
                  background: step === i + 1 ? chef.color : "transparent",
                  color: step === i + 1 ? "#0A0A0A" : "#666",
                  cursor: i < step - 1 ? "pointer" : "default",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Steps */}
          {step === 1 && (
            <StepDateTime
              chef={chef}
              day={day}
              time={time}
              onDay={setDay}
              onTime={setTime}
              onNext={() => setStep(2)}
            />
          )}
          {step === 2 && (
            <StepDetails
              chef={chef}
              guests={guests}
              note={note}
              name={name}
              email={email}
              onGuests={setGuests}
              onNote={setNote}
              onName={setName}
              onEmail={setEmail}
              onBack={() => setStep(1)}
              onNext={() => setStep(3)}
            />
          )}
          {step === 3 && (
            <StepPayment
              chef={chef}
              day={day!}
              time={time!}
              guests={guests}
              card={card}
              expiry={expiry}
              cvv={cvv}
              onCard={setCard}
              onExpiry={setExpiry}
              onCvv={setCvv}
              onBack={() => setStep(2)}
              onConfirm={handleConfirm}
            />
          )}
        </>
      ) : (
        /* Confirmation screen */
        <div className="text-center py-5">
          <div className="text-5xl mb-4">🍽️</div>
          <div
            className="font-display text-2xl font-bold mb-2"
            style={{ color: chef.color }}
          >
            You&apos;re booked!
          </div>
          <p className="text-zinc-400 text-sm leading-relaxed mb-1.5">
            {chef.name} has been notified for{" "}
            <strong className="text-white">
              {day} at {time}
            </strong>
            .
          </p>
          <p className="text-zinc-600 text-sm mb-6">
            Confirmation sent to{" "}
            <strong className="text-zinc-400">{email}</strong>
          </p>
          <div
            className="bg-zinc-900 rounded-xl p-4 mb-6 text-left"
            style={{ border: `1px solid ${chef.color}33` }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span>🔔</span>
              <span className="text-white font-bold text-sm">
                Chef Notification Sent
              </span>
            </div>
            <p className="text-zinc-500 text-xs">
              {chef.name} received a push notification and email with your
              booking details, {guests} guests
              {note ? ", and your special requests" : ""}.
            </p>
          </div>
          <Button accentColor={chef.color} onClick={onClose} style={{ padding: "12px 40px" }}>
            Done
          </Button>
        </div>
      )}
    </Modal>
  );
}
