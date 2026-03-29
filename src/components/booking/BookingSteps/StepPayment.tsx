import type { Chef, Day } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SectionLabel } from "@/components/ui/index";
import { totalWithFee } from "@/lib/utils";

interface StepPaymentProps {
  chef: Chef;
  day: Day;
  time: string;
  guests: number;
  card: string;
  expiry: string;
  cvv: string;
  onCard: (s: string) => void;
  onExpiry: (s: string) => void;
  onCvv: (s: string) => void;
  onBack: () => void;
  onConfirm: () => void;
}

function formatCard(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

export function StepPayment({
  chef, day, time, guests, card, expiry, cvv,
  onCard, onExpiry, onCvv, onBack, onConfirm,
}: StepPaymentProps) {
  const total = totalWithFee(chef.price);
  const cardValid = card.replace(/\s/g, "").length === 16;
  const canConfirm = cardValid && expiry.length >= 4 && cvv.length >= 3;

  return (
    <div className="flex flex-col gap-5">
      {/* Card inputs */}
      <div>
        <SectionLabel>Payment Details</SectionLabel>
        <div className="flex flex-col gap-2.5">
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base">💳</span>
            <input
              value={card}
              onChange={(e) => onCard(formatCard(e.target.value))}
              placeholder="Card number"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-zinc-600 transition-colors"
            />
          </div>
          <div className="flex gap-2.5">
            <Input
              value={expiry}
              onChange={(e) => onExpiry(e.target.value)}
              placeholder="MM / YY"
            />
            <Input
              value={cvv}
              onChange={(e) => onCvv(e.target.value.slice(0, 4))}
              placeholder="CVV"
            />
          </div>
        </div>
      </div>

      {/* Booking summary */}
      <div className="bg-zinc-900 rounded-xl p-4">
        <SectionLabel>Booking Summary</SectionLabel>
        {[
          ["Chef", chef.name],
          ["Day", day],
          ["Time", time],
          ["Guests", String(guests)],
          ["Total", `$${total}`],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between mb-1.5 last:mb-0">
            <span className="text-sm text-muted">{k}</span>
            <span
              className="text-sm font-semibold"
              style={{ color: k === "Total" ? chef.color : "#DDD" }}
            >
              {v}
            </span>
          </div>
        ))}
      </div>

      <p className="text-xs text-zinc-600">
        🔒 Payment is secured and encrypted. {chef.name} will be notified
        immediately upon confirmation.
      </p>

      <div className="flex gap-2.5">
        <Button variant="outline" onClick={onBack} style={{ flex: 1 }}>
          ← Back
        </Button>
        <Button
          accentColor={chef.color}
          disabled={!canConfirm}
          onClick={onConfirm}
          style={{ flex: 2 }}
        >
          Pay ${total} & Confirm
        </Button>
      </div>
    </div>
  );
}
