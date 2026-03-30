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
      className="bg-surface rounded-2xl p-6 flex flex-col gap-4 cursor-pointer transition-all duration-200"
      style={{
        border: `1px solid ${hovered ? chef.color : "#222"}`,
        transform: hovered ? "translateY(-3px)" : "none",
        boxShadow: hovered ? `0 8px 40px ${chef.color}22` : "none",
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3.5">
        <Avatar label={chef.avatar} color={chef.color} size={52} />
        <div className="flex-1 min-w-0">
          <div className="font-display font-bold text-[17px] text-white truncate">
            {chef.name}
          </div>
          <div className="text-xs text-muted mt-0.5">
            {chef.location} · {chef.distance}
          </div>
          <div className="text-[10px] mt-1 font-semibold"
            style={{ color: chef.color }}>
            📍 {chef.serviceRadius ?? 10} mi serving area
          </div>
        </div>
        <div className="text-right shrink-0">
          <div
            className="font-display text-xl font-bold"
            style={{ color: chef.color }}
          >
            ${chef.price}
          </div>
          <div className="text-xs text-muted">/ person</div>
          <div className="text-[10px]" style={{ color: chef.color + "99" }}>starting from</div>
        </div>
      </div>

      {/* Cuisine tags */}
      <div className="flex flex-wrap gap-1.5">
        {chef.cuisine.map((c) => (
          <Tag key={c} label={c} color={chef.color} />
        ))}
      </div>

      {/* Specialty */}
      <div
        className="text-sm text-zinc-400 leading-relaxed pl-2.5"
        style={{ borderLeft: `2px solid ${chef.color}44` }}
      >
        {chef.specialty}
      </div>

      {/* Rating & stats */}
      <div className="flex items-center justify-between">
        <Stars rating={chef.rating} />
        <span className="text-xs text-muted">
          {chef.reviewCount} reviews · {chef.bookingCount} bookings
        </span>
      </div>

      {/* Available days */}
      <div className="flex gap-1.5">
        {chef.available.map((d) => (
          <span
            key={d}
            className="bg-zinc-900 border border-zinc-800 rounded-md px-2 py-0.5 text-[10px] text-zinc-500"
          >
            {d}
          </span>
        ))}
      </div>

      {/* Book button */}
      <Button
        accentColor={chef.color}
        full
        onClick={(e) => {
          e.stopPropagation();
          onBook(chef);
        }}
      >
        Book This Chef
      </Button>
    </div>
  );
}
