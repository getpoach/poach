"use client";
import { useState } from "react";
import type { Chef } from "@/types";
import { Avatar, Tag, Stars } from "@/components/ui/index";
import { Button } from "@/components/ui/Button";

interface ChefCardProps {
  chef: Chef;
  onBook: (chef: Chef) => void;
  onView: (chef: Chef) => void;
}

export function ChefCard({ chef, onBook, onView }: ChefCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onView(chef)}
      className="cursor-pointer"
      style={{
        background: "var(--bg-secondary)",
        border: `1px solid ${hovered ? chef.color : "var(--border-mid)"}`,
        borderRadius: 4,
        overflow: "hidden",
        transform: hovered ? "translateY(-4px)" : "none",
        boxShadow: hovered
          ? `0 12px 48px rgba(0,0,0,0.4), inset 0 1px 0 ${chef.color}33`
          : `0 2px 8px var(--card-shadow), inset 0 1px 0 var(--border-subtle)`,
        transition: "all 0.25s ease",
        position: "relative",
      }}
    >
      {/* Subtle marble vein overlay */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
        background: `
          linear-gradient(127deg, transparent 42%, var(--vein) 42.5%, var(--vein) 43%, transparent 43%),
          linear-gradient(53deg,  transparent 65%, var(--vein) 65.5%, var(--vein) 65.8%, transparent 65.8%)
        `,
      }} />

      {/* Chef color accent bar at top */}
      <div style={{ height: 3, background: `linear-gradient(to right, ${chef.color}, ${chef.color}88)`, position: "relative", zIndex: 1 }} />

      <div style={{ padding: "20px 20px 16px", position: "relative", zIndex: 1 }}>

        {/* Business name */}
        {chef.businessName && (
          <div style={{
            fontFamily: "Georgia, serif",
            fontSize: 19,
            fontWeight: 400,
            fontStyle: "italic",
            color: chef.color,
            letterSpacing: "0.01em",
            lineHeight: 1.2,
            marginBottom: 14,
          }}>
            {chef.businessName}
          </div>
        )}

        {/* Brass hairline */}
        <div style={{ height: "0.5px", background: `linear-gradient(to right, ${chef.color}44, transparent)`, marginBottom: 14 }} />

        {/* Header — photo + name + price */}
        <div className="flex items-center gap-3.5" style={{ marginBottom: 14 }}>
          {/* Photo with stone frame */}
          <div style={{
            width: 54, height: 54, borderRadius: 2, overflow: "hidden",
            border: `1px solid ${chef.color}66`,
            flexShrink: 0, background: "var(--bg-tertiary)",
            boxShadow: `0 0 0 2px var(--bg-secondary), 0 0 0 3px ${chef.color}33`,
          }}>
            {chef.headshot
              ? <img src={chef.headshot} alt={chef.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : <Avatar label={chef.avatar} color={chef.color} size={54} />
            }
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 16, fontWeight: 400, color: "var(--text-primary)", marginBottom: 2 }}>
              {chef.name}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
              {chef.location}
            </div>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 400, color: chef.color }}>
              ${chef.price}
            </div>
            <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>per person</div>
          </div>
        </div>

        {/* Cuisine tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 12 }}>
          {chef.cuisine.map(c => (
            <span key={c} style={{
              fontSize: 10, padding: "3px 9px", letterSpacing: "0.08em",
              textTransform: "uppercase", fontWeight: 500,
              border: `1px solid ${chef.color}55`,
              color: chef.color, borderRadius: 2,
              background: chef.color + "0e",
            }}>{c}</span>
          ))}
        </div>

        {/* Specialty */}
        <div style={{
          fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.65,
          paddingLeft: 10, marginBottom: 12,
          borderLeft: `1.5px solid ${chef.color}55`,
          fontStyle: "italic",
        }}>
          {chef.specialty}
        </div>

        {/* Rating */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <Stars rating={chef.rating} />
          <span style={{ fontSize: 11, color: "var(--text-muted)", letterSpacing: "0.02em" }}>
            {chef.reviewCount} reviews
          </span>
        </div>

        {/* Available days */}
        <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
          {chef.available.map(d => (
            <span key={d} style={{
              fontSize: 9, padding: "2px 7px", borderRadius: 2,
              border: "1px solid var(--border-mid)",
              color: "var(--text-dim)",
              letterSpacing: "0.06em", textTransform: "uppercase",
              background: "var(--bg-tertiary)",
            }}>{d}</span>
          ))}
        </div>

        {/* Book button — brass style */}
        <button
          onClick={e => { e.stopPropagation(); onBook(chef); }}
          style={{
            width: "100%", padding: "11px 0",
            background: `linear-gradient(135deg, ${chef.color}, ${chef.color}cc)`,
            color: "#16151A",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12, fontWeight: 700,
            letterSpacing: "0.1em", textTransform: "uppercase",
            border: "none", borderRadius: 2,
            cursor: "pointer",
            boxShadow: `0 2px 12px ${chef.color}33`,
            transition: "opacity 0.15s",
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
        >
          Reserve a Table
        </button>
      </div>
    </div>
  );
}
