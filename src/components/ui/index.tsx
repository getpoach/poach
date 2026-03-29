interface AvatarProps {
  label: string;
  color: string;
  size?: number;
}

export function Avatar({ label, color, size = 52 }: AvatarProps) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: color + "22",
        border: `2px solid ${color}`,
        color,
        fontSize: size * 0.3,
        flexShrink: 0,
      }}
      className="flex items-center justify-center font-display font-bold"
    >
      {label}
    </div>
  );
}

interface TagProps {
  label: string;
  color: string;
}

export function Tag({ label, color }: TagProps) {
  return (
    <span
      style={{ background: color + "18", color }}
      className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
    >
      {label}
    </span>
  );
}

interface StarsProps {
  rating: number;
  size?: number;
}

export function Stars({ rating, size = 13 }: StarsProps) {
  return (
    <span style={{ fontSize: size }} className="text-yellow-400">
      {"★".repeat(Math.floor(rating))}
      {rating % 1 !== 0 ? "½" : ""}
      <span style={{ fontSize: size - 1 }} className="text-muted ml-1">
        {rating}
      </span>
    </span>
  );
}

interface SectionLabelProps {
  children: React.ReactNode;
}

export function SectionLabel({ children }: SectionLabelProps) {
  return (
    <div className="text-xs font-semibold text-muted uppercase tracking-widest mb-2">
      {children}
    </div>
  );
}
