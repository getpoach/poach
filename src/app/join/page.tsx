"use client";
import { useState } from "react";
import type { Cuisine, Day } from "@/types";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Tag, SectionLabel } from "@/components/ui/index";

const CUISINE_OPTIONS: Cuisine[] = [
  "French", "Italian", "Japanese", "Mexican", "Indian",
  "West African", "Mediterranean", "Fusion", "Omakase", "Pastry", "Kerala", "Oaxacan",
];

const DAYS: Day[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const COLOR_OPTIONS = [
  "#C8A97E", "#7E9BC8", "#C87E7E", "#7EC87E",
  "#C8B87E", "#B87EC8", "#7EC8C8", "#C8C87E",
];

interface FormState {
  name: string;
  bio: string;
  location: string;
  experience: string;
  trained: string;
  specialty: string;
  price: string;
  cuisines: Cuisine[];
  available: Day[];
}

export default function JoinPage() {
  const [step, setStep] = useState(1);
  const [color, setColor] = useState("#C8A97E");
  const [done, setDone] = useState(false);
  const [form, setForm] = useState<FormState>({
    name: "", bio: "", location: "", experience: "",
    trained: "", specialty: "", price: "", cuisines: [], available: [],
  });

  const set = (k: keyof FormState, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const toggle = <T,>(k: keyof FormState, v: T) =>
    setForm((f) => ({
      ...f,
      [k]: (f[k] as T[]).includes(v)
        ? (f[k] as T[]).filter((x) => x !== v)
        : [...(f[k] as T[]), v],
    }));

  const initials = form.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "?";

  if (done) {
    return (
      <div className="max-w-lg mx-auto text-center py-20">
        <div className="text-5xl mb-4">👨‍🍳</div>
        <h1
          className="font-display text-3xl font-bold mb-3"
          style={{ color }}
        >
          Welcome to Poach, {form.name.split(" ")[0]}!
        </h1>
        <p className="text-zinc-400 text-sm leading-relaxed mb-8">
          Your chef profile is live. Guests in your area can now discover and book you.
        </p>
        <div
          className="rounded-xl p-5 mb-8 text-left"
          style={{ background: "#141414", border: `1px solid ${color}33` }}
        >
          <div className="font-bold text-white text-sm mb-3">What&apos;s next?</div>
          {[
            "You'll receive push & email notifications for new bookings",
            "Guests can share dietary needs before each session",
            "Payment releases to you 24 hours after each session",
          ].map((item) => (
            <div key={item} className="flex gap-2.5 mb-2 last:mb-0">
              <span style={{ color }}>✓</span>
              <span className="text-zinc-500 text-sm">{item}</span>
            </div>
          ))}
        </div>
        <Button
          accentColor={color}
          onClick={() => (window.location.href = "/")}
          style={{ padding: "13px 40px" }}
        >
          Browse the Platform
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-white">
          Join Poach as a Chef
        </h1>
        <p className="text-muted text-sm mt-1">
          Step {step} of 3 —{" "}
          {["Your Profile", "Cuisine & Pricing", "Availability"][step - 1]}
        </p>
      </div>

      {/* Progress bar */}
      <div className="flex gap-1.5 mb-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex-1 h-1 rounded-full transition-all duration-300"
            style={{ background: i <= step ? color : "#222" }}
          />
        ))}
      </div>

      {/* Step 1 — Profile */}
      {step === 1 && (
        <div className="flex flex-col gap-4">
          <Input
            label="Full Name"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Chef name"
          />
          <Input
            label="Location"
            value={form.location}
            onChange={(e) => set("location", e.target.value)}
            placeholder="e.g. Brooklyn, NY"
          />
          <Input
            label="Years of Experience"
            value={form.experience}
            onChange={(e) => set("experience", e.target.value)}
            placeholder="e.g. 8 years"
          />
          <Input
            label="Trained At"
            value={form.trained}
            onChange={(e) => set("trained", e.target.value)}
            placeholder="e.g. Le Cordon Bleu, Paris"
          />
          <Textarea
            label="Bio"
            value={form.bio}
            onChange={(e) => set("bio", e.target.value)}
            placeholder="Tell guests about your cooking style and background..."
            rows={4}
          />
          <div>
            <SectionLabel>Profile Color</SectionLabel>
            <div className="flex gap-2">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className="w-7 h-7 rounded-full transition-all cursor-pointer"
                  style={{
                    background: c,
                    border: color === c ? "3px solid white" : "3px solid transparent",
                  }}
                />
              ))}
            </div>
          </div>
          <Button
            accentColor={color}
            full
            disabled={!form.name || !form.location}
            onClick={() => setStep(2)}
          >
            Continue →
          </Button>
        </div>
      )}

      {/* Step 2 — Cuisine & Pricing */}
      {step === 2 && (
        <div className="flex flex-col gap-5">
          <div>
            <SectionLabel>Cuisines You Offer</SectionLabel>
            <div className="flex flex-wrap gap-2">
              {CUISINE_OPTIONS.map((c) => {
                const selected = form.cuisines.includes(c);
                return (
                  <button
                    key={c}
                    onClick={() => toggle<Cuisine>("cuisines", c)}
                    className="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer"
                    style={{
                      border: `1px solid ${selected ? color : "#2A2A2A"}`,
                      background: selected ? color + "20" : "#141414",
                      color: selected ? color : "#888",
                      fontWeight: selected ? 700 : 400,
                    }}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>
          <Input
            label="Signature Specialty"
            value={form.specialty}
            onChange={(e) => set("specialty", e.target.value)}
            placeholder="e.g. Handmade Pasta & Tiramisu"
          />
          <div>
            <Input
              label="Session Rate (USD)"
              value={form.price}
              onChange={(e) => set("price", e.target.value.replace(/\D/g, ""))}
              placeholder="0"
              prefix="$"
            />
            <p className="text-xs text-zinc-600 mt-1.5">
              Poach takes a 12% platform fee. You keep the rest.
            </p>
          </div>
          <div className="flex gap-2.5">
            <Button variant="ghost" onClick={() => setStep(1)} style={{ flex: 1 }}>
              ← Back
            </Button>
            <Button
              accentColor={color}
              disabled={form.cuisines.length === 0 || !form.price}
              onClick={() => setStep(3)}
              style={{ flex: 2 }}
            >
              Continue →
            </Button>
          </div>
        </div>
      )}

      {/* Step 3 — Availability */}
      {step === 3 && (
        <div className="flex flex-col gap-5">
          <div>
            <SectionLabel>Your Available Days</SectionLabel>
            <div className="flex gap-2 flex-wrap">
              {DAYS.map((d) => {
                const sel = form.available.includes(d);
                return (
                  <button
                    key={d}
                    onClick={() => toggle<Day>("available", d)}
                    className="px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                    style={{
                      border: `1px solid ${sel ? color : "#2A2A2A"}`,
                      background: sel ? color + "20" : "#141414",
                      color: sel ? color : "#888",
                      fontWeight: sel ? 700 : 400,
                    }}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Profile preview */}
          <div
            className="rounded-xl p-4"
            style={{ background: "#141414", border: "1px solid #222" }}
          >
            <SectionLabel>Profile Preview</SectionLabel>
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center font-display font-bold text-base shrink-0"
                style={{
                  background: color + "22",
                  border: `2px solid ${color}`,
                  color,
                }}
              >
                {initials}
              </div>
              <div className="flex-1">
                <div className="font-display font-bold text-white">
                  {form.name || "Your Name"}
                </div>
                <div className="text-xs text-muted">{form.location || "Location"}</div>
                <div className="flex gap-1.5 mt-1.5 flex-wrap">
                  {form.cuisines.slice(0, 3).map((c) => (
                    <Tag key={c} label={c} color={color} />
                  ))}
                </div>
              </div>
              <div className="text-right">
                <div
                  className="font-display text-lg font-bold"
                  style={{ color }}
                >
                  ${form.price || "0"}
                </div>
                <div className="text-xs text-muted">/ session</div>
              </div>
            </div>
          </div>

          <div className="flex gap-2.5">
            <Button variant="ghost" onClick={() => setStep(2)} style={{ flex: 1 }}>
              ← Back
            </Button>
            <Button
              accentColor={color}
              disabled={form.available.length === 0}
              onClick={() => setDone(true)}
              style={{ flex: 2 }}
            >
              Launch My Profile 🚀
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
