import type { Chef } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { SectionLabel } from "@/components/ui/index";
import { serviceFee } from "@/lib/utils";

interface StepDetailsProps {
  chef: Chef;
  guests: number;
  selectedMenuId: string | null;
  note: string;
  name: string;
  email: string;
  onGuests: (n: number) => void;
  onMenuId: (id: string) => void;
  onNote: (s: string) => void;
  onName: (s: string) => void;
  onEmail: (s: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export function StepDetails({
  chef, guests, selectedMenuId, note, name, email,
  onGuests, onMenuId, onNote, onName, onEmail, onBack, onNext,
}: StepDetailsProps) {

  const menus = chef.menus ?? [];
  const selectedMenu = menus.find(m => m.id === selectedMenuId) ?? null;
  const pricePerPerson = selectedMenu
    ? selectedMenu.pricePerPerson
    : (menus.length > 0 ? Math.min(...menus.map(m => m.pricePerPerson)) : chef.price);

  const subtotal = pricePerPerson * guests;
  const fee      = serviceFee(subtotal);
  const total    = subtotal + fee;

  const canContinue = !!name && !!email && (menus.length === 0 || !!selectedMenuId);

  return (
    <div className="flex flex-col gap-5">

      {/* Menu selection */}
      {menus.length > 0 && (
        <div>
          <SectionLabel>Select a Menu</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {menus.map(menu => {
              const sel = selectedMenuId === menu.id;
              const courseCount = Array.isArray(menu.courses) ? menu.courses.length : menu.courses;
              return (
                <button key={menu.id} onClick={() => onMenuId(menu.id)}
                  style={{
                    padding: "12px 14px",
                    borderRadius: 10,
                    border: `1px solid ${sel ? chef.color : "var(--border-mid)"}`,
                    background: sel ? chef.color + "14" : "var(--bg-tertiary)",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s",
                    fontFamily: "'DM Sans', sans-serif",
                  }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 2 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: sel ? chef.color : "var(--text-primary)", fontFamily: "var(--font-playfair)" }}>
                        {menu.name}
                      </span>
                      {menu.tag && (
                        <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 99, background: chef.color + "22", border: `1px solid ${chef.color}44`, color: chef.color, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                          {menu.tag}
                        </span>
                      )}
                    </div>
                    <span style={{ fontWeight: 800, color: chef.color, fontSize: 15, fontFamily: "var(--font-playfair)" }}>
                      ${menu.pricePerPerson}<span style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 400 }}>/pp</span>
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                    {courseCount} courses · {menu.description.slice(0, 60)}…
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Guests */}
      <div>
        <SectionLabel>Number of Guests</SectionLabel>
        <div className="flex items-center gap-4">
          <button
            onClick={() => onGuests(Math.max(1, guests - 1))}
            className="w-9 h-9 rounded-lg border border-[var(--border-mid)] bg-[var(--bg-secondary)] text-lg hover:border-zinc-500 transition-colors"
            style={{ color: "var(--text-primary)" }}
          >−</button>
          <span className="font-display text-2xl font-bold min-w-[30px] text-center" style={{ color: chef.color }}>
            {guests}
          </span>
          <button
            onClick={() => onGuests(Math.min(100, guests + 1))}
            className="w-9 h-9 rounded-lg border border-[var(--border-mid)] bg-[var(--bg-secondary)] text-lg hover:border-zinc-500 transition-colors"
            style={{ color: "var(--text-primary)" }}
          >+</button>
          <span className="text-muted text-sm">guests (max 100)</span>
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
          <Input value={name} onChange={(e) => onName(e.target.value)} placeholder="Full name" />
          <Input value={email} onChange={(e) => onEmail(e.target.value)} placeholder="Email address" type="email" />
        </div>
      </div>

      {/* Fee breakdown */}
      <div className="bg-[var(--bg-secondary)] rounded-xl p-4">
        {selectedMenu && (
          <div className="flex justify-between mb-1" style={{ fontSize: 11, color: "var(--text-dim)", marginBottom: 6 }}>
            <span>Menu: {selectedMenu.name}</span>
          </div>
        )}
        <div className="flex justify-between mb-1.5">
          <span className="text-sm text-muted">${pricePerPerson} × {guests} {guests === 1 ? "person" : "people"}</span>
          <span className="text-sm" style={{ color: "var(--text-primary)" }}>${subtotal}</span>
        </div>
        <div className="flex justify-between mb-1.5">
          <span className="text-sm text-muted">Service fee (12%)</span>
          <span className="text-sm" style={{ color: "var(--text-primary)" }}>${fee}</span>
        </div>
        <div className="border-t border-[var(--border)] pt-2 mt-2 flex justify-between">
          <span className="font-bold" style={{ color: "var(--text-primary)" }}>Total</span>
          <span className="font-display font-bold text-lg" style={{ color: chef.color }}>${total}</span>
        </div>
        {!selectedMenuId && menus.length > 0 && (
          <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 4 }}>
            Select a menu above to confirm pricing
          </div>
        )}
      </div>

      <div className="flex gap-2.5">
        <Button variant="outline" onClick={onBack} style={{ flex: 1 }}>← Back</Button>
        <Button accentColor={chef.color} disabled={!canContinue} onClick={onNext} style={{ flex: 2 }}>
          Continue →
        </Button>
      </div>
    </div>
  );
}
