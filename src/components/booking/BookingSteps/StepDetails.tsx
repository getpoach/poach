import type { Chef } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { SectionLabel } from "@/components/ui/index";
import { serviceFee, totalWithFee } from "@/lib/utils";

interface StepDetailsProps {
  chef: Chef;
  guests: number;
  note: string;
  name: string;
  email: string;
  onGuests: (n: number) => void;
  onNote: (s: string) => void;
  onName: (s: string) => void;
  onEmail: (s: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export function StepDetails({
  chef, guests, note, name, email,
  onGuests, onNote, onName, onEmail, onBack, onNext,
}: StepDetailsProps) {
  return (
    <div className="flex flex-col gap-5">
      {/* Guests */}
      <div>
        <SectionLabel>Number of Guests</SectionLabel>
        <div className="flex items-center gap-4">
          <button
            onClick={() => onGuests(Math.max(1, guests - 1))}
            className="w-9 h-9 rounded-lg border border-zinc-700 bg-zinc-900 text-white text-lg hover:border-zinc-500 transition-colors"
          >
            −
          </button>
          <span
            className="font-display text-2xl font-bold min-w-[30px] text-center"
            style={{ color: chef.color }}
          >
            {guests}
          </span>
          <button
            onClick={() => onGuests(Math.min(20, guests + 1))}
            className="w-9 h-9 rounded-lg border border-zinc-700 bg-zinc-900 text-white text-lg hover:border-zinc-500 transition-colors"
          >
            +
          </button>
          <span className="text-muted text-sm">guests</span>
        </div>
      </div>

      {/* Notes */}
      <Textarea
        label="Special Requests"
        value={note}
        onChange={(e) => onNote(e.target.value)}
        placeholder="Allergies, dietary needs, occasion details..."
        rows={3}
      />

      {/* Contact */}
      <div>
        <SectionLabel>Your Details</SectionLabel>
        <div className="flex flex-col gap-2.5">
          <Input
            value={name}
            onChange={(e) => onName(e.target.value)}
            placeholder="Full name"
          />
          <Input
            value={email}
            onChange={(e) => onEmail(e.target.value)}
            placeholder="Email address"
            type="email"
          />
        </div>
      </div>

      {/* Fee breakdown */}
      <div className="bg-zinc-900 rounded-xl p-4">
        <div className="flex justify-between mb-1.5">
          <span className="text-sm text-muted">Session fee</span>
          <span className="text-sm text-white">${chef.price}</span>
        </div>
        <div className="flex justify-between mb-1.5">
          <span className="text-sm text-muted">Service fee (12%)</span>
          <span className="text-sm text-white">${serviceFee(chef.price)}</span>
        </div>
        <div className="border-t border-zinc-800 pt-2 mt-2 flex justify-between">
          <span className="font-bold text-white">Total</span>
          <span
            className="font-display font-bold text-lg"
            style={{ color: chef.color }}
          >
            ${totalWithFee(chef.price)}
          </span>
        </div>
      </div>

      <div className="flex gap-2.5">
        <Button variant="outline" onClick={onBack} style={{ flex: 1 }}>
          ← Back
        </Button>
        <Button
          accentColor={chef.color}
          disabled={!name || !email}
          onClick={onNext}
          style={{ flex: 2 }}
        >
          Continue →
        </Button>
      </div>
    </div>
  );
}
