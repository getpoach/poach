import type { Chef, Day } from "@/types";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/index";

const DAYS: Day[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TIME_SLOTS = [
  "12:00 PM", "1:00 PM", "2:00 PM",
  "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM",
];

interface StepDateTimeProps {
  chef: Chef;
  day: Day | null;
  time: string | null;
  onDay: (d: Day) => void;
  onTime: (t: string) => void;
  onNext: () => void;
}

export function StepDateTime({ chef, day, time, onDay, onTime, onNext }: StepDateTimeProps) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <SectionLabel>Available Days</SectionLabel>
        <div className="flex gap-2 flex-wrap">
          {DAYS.map((d) => {
            const avail = chef.available.includes(d);
            const sel = day === d;
            return (
              <button
                key={d}
                disabled={!avail}
                onClick={() => onDay(d)}
                className="px-3.5 py-2 rounded-lg text-xs font-semibold transition-all"
                style={{
                  border: `1px solid ${sel ? chef.color : avail ? "#333" : "#1A1A1A"}`,
                  background: sel ? chef.color : "transparent",
                  color: sel ? "#0A0A0A" : avail ? "#DDD" : "#444",
                  cursor: avail ? "pointer" : "not-allowed",
                }}
              >
                {d}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <SectionLabel>Time Slot</SectionLabel>
        <div className="grid grid-cols-2 gap-2">
          {TIME_SLOTS.map((t) => {
            const sel = time === t;
            return (
              <button
                key={t}
                onClick={() => onTime(t)}
                className="p-2.5 rounded-lg text-sm transition-all"
                style={{
                  border: `1px solid ${sel ? chef.color : "#2A2A2A"}`,
                  background: sel ? chef.color + "22" : "#141414",
                  color: sel ? chef.color : "#AAA",
                  fontWeight: sel ? 700 : 400,
                  cursor: "pointer",
                }}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      <Button
        accentColor={chef.color}
        full
        disabled={!day || !time}
        onClick={onNext}
      >
        Continue →
      </Button>
    </div>
  );
}
