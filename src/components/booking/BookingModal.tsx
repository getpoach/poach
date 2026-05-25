"use client";
import { useState } from "react";
import type { Chef, Booking, Day } from "@/types";
import { Avatar } from "@/components/ui/index";
import { StepDateTime } from "./BookingSteps/StepDateTime";
import { StepDetails } from "./BookingSteps/StepDetails";
import { StepPayment } from "./BookingSteps/StepPayment";
import { Button } from "@/components/ui/Button";
import { generateId, totalWithFee } from "@/lib/utils";
import { ChevronDown, ChevronUp, UtensilsCrossed, CheckCircle2, LogIn } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const STEP_LABELS = ["Date & Time", "Details", "Terms", "Deposit"];

interface BookingModalProps {
  chef: Chef;
  onClose: () => void;
  onSuccess: (booking: Booking) => void;
}

function TermsStep({
  chef,
  guests,
  onBack,
  onAgree,
}: {
  chef: Chef;
  guests: number;
  onBack: () => void;
  onAgree: () => void;
}) {
  const [open, setOpen] = useState<number | null>(0);
  const [agreed, setAgreed] = useState(false);

  const total    = totalWithFee(chef.price * guests);
  const deposit  = Math.round(total * 0.25);
  const balance  = total - deposit;

  const sections = [
    {
      title: "How booking works",
      content: (
        <ol style={{ paddingLeft: 16, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            "You submit this request — no charge yet.",
            `${chef.name} reviews and accepts or declines within 48 hours.`,
            `Once accepted, you'll pay a 25% deposit ($${deposit}) to confirm the date.`,
            `The remaining balance ($${balance}) is charged automatically 48 hours before your event.`,
            "After your experience, you'll be invited to leave a review.",
          ].map((step, i) => (
            <li key={i} style={{ fontSize: 13, color: "#a1a1aa", lineHeight: 1.6 }}>
              <span style={{ color: chef.color, fontWeight: 700, marginRight: 6 }}>{i + 1}.</span>{step}
            </li>
          ))}
        </ol>
      ),
    },
    {
      title: "Payment schedule",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { label: "Deposit (due on acceptance)",     amount: `$${deposit}`, note: "25% of total — secures your date", color: chef.color },
            { label: "Balance (due 48hrs before event)",amount: `$${balance}`, note: "75% of total — charged automatically", color: "#a1a1aa" },
            { label: "Total",                           amount: `$${total}`,   note: `$${chef.price} × ${guests} guests + platform fee`, color: "#f5f0e8" },
          ].map(row => (
            <div key={row.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: "#141414", borderRadius: 8 }}>
              <div>
                <div style={{ fontSize: 13, color: "#f5f0e8" }}>{row.label}</div>
                <div style={{ fontSize: 11, color: "#52525b", marginTop: 2 }}>{row.note}</div>
              </div>
              <div style={{ fontWeight: 800, fontSize: 15, color: row.color }}>{row.amount}</div>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Cancellation policy",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            { when: "7+ days before event",   diner: "Full deposit refund",    chef: "No penalty" },
            { when: "3–6 days before event",  diner: "50% deposit refund",     chef: "No penalty" },
            { when: "Under 72 hours",         diner: "No refund",              chef: "No penalty" },
            { when: "Chef cancels (any time)",diner: "Full refund",            chef: "Penalty fee applies" },
          ].map(row => (
            <div key={row.when} style={{ padding: "10px 12px", background: "#141414", borderRadius: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#f5f0e8", marginBottom: 4 }}>{row.when}</div>
              <div style={{ display: "flex", gap: 16, fontSize: 11, color: "#71717a" }}>
                <span>You: <span style={{ color: "#a1a1aa" }}>{row.diner}</span></span>
                <span>Chef: <span style={{ color: "#a1a1aa" }}>{row.chef}</span></span>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "What happens after",
      content: (
        <p style={{ fontSize: 13, color: "#a1a1aa", lineHeight: 1.7, margin: 0 }}>
          After your experience, Poach holds the chef's payment for 24 hours while you have the opportunity to flag any issues. If no dispute is raised, funds are released to the chef automatically. You'll receive a prompt to leave a review — your feedback helps other diners and supports the chef's reputation on Poach.
        </p>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: "#f5f0e8", fontFamily: "var(--font-playfair)", marginBottom: 4 }}>
          Booking Terms
        </div>
        <p style={{ fontSize: 13, color: "#71717a", margin: 0 }}>
          Please review what you're agreeing to before proceeding.
        </p>
      </div>

      {/* Accordion sections */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
        {sections.map((s, i) => (
          <div key={i} style={{ background: "#0f0f0f", border: `1px solid ${open === i ? chef.color + "44" : "#1e1e1e"}`, borderRadius: 10, overflow: "hidden", transition: "border-color 0.2s" }}>
            <button onClick={() => setOpen(open === i ? null : i)}
              style={{ width: "100%", padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "transparent", border: "none", cursor: "pointer", color: open === i ? "#f5f0e8" : "#a1a1aa", fontWeight: open === i ? 700 : 500, fontSize: 13, fontFamily: "'DM Sans', sans-serif", textAlign: "left" }}>
              {s.title}
              {open === i
                ? <ChevronUp size={14} color={chef.color} strokeWidth={2} />
                : <ChevronDown size={14} color="#52525b" strokeWidth={2} />}
            </button>
            {open === i && (
              <div style={{ padding: "0 14px 14px" }}>{s.content}</div>
            )}
          </div>
        ))}
      </div>

      {/* Full terms link */}
      <p style={{ fontSize: 11, color: "#52525b", marginBottom: 16, textAlign: "center" }}>
        Read the full{" "}
        <Link href="/terms" target="_blank" style={{ color: chef.color, textDecoration: "underline" }}>
          Poach Booking Terms & Conditions
        </Link>
      </p>

      {/* Agreement checkbox */}
      <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", marginBottom: 20, padding: "12px 14px", background: agreed ? chef.color + "0e" : "#0f0f0f", border: `1px solid ${agreed ? chef.color + "44" : "#1e1e1e"}`, borderRadius: 10, transition: "all 0.2s" }}>
        <div style={{ width: 18, height: 18, borderRadius: 5, border: `2px solid ${agreed ? chef.color : "#3f3f46"}`, background: agreed ? chef.color : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1, transition: "all 0.15s" }}>
          {agreed && <CheckCircle2 size={12} color="#080808" strokeWidth={3} />}
        </div>
        <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ display: "none" }} />
        <span style={{ fontSize: 13, color: "#a1a1aa", lineHeight: 1.5 }}>
          I understand and agree to the booking terms, payment schedule, and cancellation policy above.
        </span>
      </label>

      {/* Nav */}
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={onBack}
          style={{ padding: "11px 20px", borderRadius: 10, background: "transparent", border: "1px solid #27272a", color: "#71717a", fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
          ← Back
        </button>
        <button onClick={onAgree} disabled={!agreed}
          style={{ flex: 1, padding: "11px", borderRadius: 10, background: agreed ? chef.color : "#2a2a2a", color: agreed ? "#080808" : "#52525b", fontWeight: 800, fontSize: 13, border: "none", cursor: agreed ? "pointer" : "default", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" }}>
          Agree & Continue →
        </button>
      </div>
    </div>
  );
}

export function BookingModal({ chef, onClose, onSuccess }: BookingModalProps) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [day,     setDay]     = useState<Day | null>(null);
  const [time,    setTime]    = useState<string | null>(null);
  const [guests,  setGuests]  = useState(2);
  const [note,    setNote]    = useState("");
  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [card,    setCard]    = useState("");
  const [expiry,  setExpiry]  = useState("");
  const [cvv,     setCvv]     = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const total   = totalWithFee(chef.price * guests);
  const deposit = Math.round(total * 0.25);

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
      total,
      status: "upcoming",
      note,
    };
    onSuccess(booking);
    setConfirmed(true);
  };

  // Auth gate — must be logged in as diner
  if (!user || user.role !== "diner") {
    return (
      <div className="fixed inset-0 bg-black/88 z-50 flex items-center justify-center p-5" onClick={onClose}>
        <div onClick={e => e.stopPropagation()}
          className="bg-zinc-950 rounded-2xl w-full max-w-lg p-8"
          style={{ border: `1px solid ${chef.color}`, boxShadow: `0 0 40px ${chef.color}18` }}>
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            {/* Chef photo */}
            <div style={{ marginBottom: 20, display: "flex", justifyContent: "center" }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", overflow: "hidden", border: `3px solid ${chef.color}`, boxShadow: `0 0 20px ${chef.color}44`, background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {chef.headshot
                  ? <img src={chef.headshot} alt={chef.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <Avatar label={chef.avatar} color={chef.color} size={56} />
                }
              </div>
            </div>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#f5f0e8", fontFamily: "var(--font-playfair)", marginBottom: 8 }}>
              Sign in to Book
            </div>
            <p style={{ fontSize: 14, color: "#71717a", lineHeight: 1.7, marginBottom: 24 }}>
              You need a Poach diner account to book <strong style={{ color: "#f5f0e8" }}>{chef.name}</strong>.
              {user?.role === "chef" && (
                <span style={{ display: "block", marginTop: 8, fontSize: 12, color: "#C87E7E" }}>
                  You're currently logged in as a chef. Please sign in with a diner account.
                </span>
              )}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
              <Link href="/login"
                onClick={onClose}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px", borderRadius: 12, background: chef.color, color: "#080808", fontWeight: 800, fontSize: 14, textDecoration: "none", fontFamily: "'DM Sans', sans-serif" }}>
                <LogIn size={16} strokeWidth={2} /> Sign In
              </Link>
              <Link href="/login?mode=signup"
                onClick={onClose}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px", borderRadius: 12, background: "transparent", border: `1px solid ${chef.color}44`, color: chef.color, fontWeight: 700, fontSize: 14, textDecoration: "none", fontFamily: "'DM Sans', sans-serif" }}>
                Create a Diner Account
              </Link>
            </div>
            <button onClick={onClose}
              style={{ fontSize: 12, color: "#52525b", background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/88 z-50 flex items-center justify-center p-5" onClick={onClose}>
      <div onClick={e => e.stopPropagation()}
        className="bg-zinc-950 rounded-2xl w-full max-w-lg p-8 max-h-[92vh] overflow-y-auto"
        style={{ border: `1px solid ${chef.color}`, boxShadow: `0 0 40px ${chef.color}18` }}>

        {!confirmed ? (
          <>
            {/* Header */}
            <div className="flex items-center gap-3.5 mb-6">
              <div style={{ width: 46, height: 46, borderRadius: "50%", overflow: "hidden", border: `2px solid ${chef.color}`, flexShrink: 0, background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {chef.headshot
                  ? <img src={chef.headshot} alt={chef.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <Avatar label={chef.avatar} color={chef.color} size={46} />
                }
              </div>
              <div>
                <div className="font-display text-lg font-bold text-white">Book {chef.name}</div>
                <div className="text-xs text-muted">{chef.specialty}</div>
              </div>
              <button onClick={onClose} className="ml-auto text-muted text-2xl leading-none hover:text-white transition-colors">×</button>
            </div>

            {/* Step tabs */}
            <div className="flex bg-zinc-900 rounded-xl p-1 mb-6">
              {STEP_LABELS.map((label, i) => (
                <button key={label} onClick={() => i < step - 1 && setStep(i + 1)}
                  className="flex-1 py-2 px-1 rounded-lg text-xs font-bold transition-all"
                  style={{ background: step === i + 1 ? chef.color : "transparent", color: step === i + 1 ? "#0A0A0A" : step > i + 1 ? chef.color + "88" : "#666", cursor: i < step - 1 ? "pointer" : "default" }}>
                  {step > i + 1 ? "✓ " : ""}{label}
                </button>
              ))}
            </div>

            {step === 1 && (
              <StepDateTime chef={chef} day={day} time={time} onDay={setDay} onTime={setTime} onNext={() => setStep(2)} />
            )}
            {step === 2 && (
              <StepDetails chef={chef} guests={guests} note={note} name={name} email={email}
                onGuests={setGuests} onNote={setNote} onName={setName} onEmail={setEmail}
                onBack={() => setStep(1)} onNext={() => setStep(3)} />
            )}
            {step === 3 && (
              <TermsStep chef={chef} guests={guests} onBack={() => setStep(2)} onAgree={() => setStep(4)} />
            )}
            {step === 4 && (
              <StepPayment chef={chef} day={day!} time={time!} guests={guests}
                card={card} expiry={expiry} cvv={cvv}
                onCard={setCard} onExpiry={setExpiry} onCvv={setCvv}
                onBack={() => setStep(3)} onConfirm={handleConfirm} />
            )}
          </>
        ) : (
          /* Confirmation */
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: chef.color + "22", border: `2px solid ${chef.color}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <UtensilsCrossed size={28} color={chef.color} strokeWidth={1.75} />
            </div>
            <div style={{ fontSize: 22, fontWeight: 900, color: chef.color, fontFamily: "var(--font-playfair)", marginBottom: 8 }}>
              Request Submitted!
            </div>
            <p style={{ fontSize: 14, color: "#a1a1aa", lineHeight: 1.7, marginBottom: 4 }}>
              {chef.name} has been notified and will respond within <strong style={{ color: "#f5f0e8" }}>48 hours</strong>.
            </p>
            <p style={{ fontSize: 13, color: "#52525b", marginBottom: 24 }}>
              Confirmation sent to <strong style={{ color: "#a1a1aa" }}>{email}</strong>
            </p>

            {/* What happens next */}
            <div style={{ background: "#0f0f0f", border: `1px solid ${chef.color}33`, borderRadius: 12, padding: "16px", marginBottom: 24, textAlign: "left" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>What happens next</div>
              {[
                { step: "1", text: `${chef.name} accepts your request (within 48hrs)`, color: chef.color },
                { step: "2", text: `You pay the $${deposit} deposit to lock in your date`, color: "#C8A97E" },
                { step: "3", text: `Balance charged 48hrs before your event`, color: "#7E9BC8" },
                { step: "4", text: "Enjoy your private dining experience", color: "#7EC87E" },
              ].map(item => (
                <div key={item.step} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: item.color + "22", border: `1px solid ${item.color}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: item.color, flexShrink: 0 }}>
                    {item.step}
                  </div>
                  <span style={{ fontSize: 13, color: "#a1a1aa", lineHeight: 1.5 }}>{item.text}</span>
                </div>
              ))}
            </div>

            <Button accentColor={chef.color} onClick={onClose} style={{ padding: "12px 40px" }}>Done</Button>
          </div>
        )}
      </div>
    </div>
  );
}
