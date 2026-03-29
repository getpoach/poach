import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "solid" | "outline" | "ghost";
  accentColor?: string;
  full?: boolean;
  size?: "sm" | "md" | "lg";
}

export function Button({
  children,
  variant = "solid",
  accentColor,
  full,
  size = "md",
  className,
  style,
  ...props
}: ButtonProps) {
  const base =
    "font-bold tracking-wide rounded-xl transition-opacity disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer";

  const sizes = {
    sm: "px-3 py-2 text-xs",
    md: "px-5 py-3 text-sm",
    lg: "px-6 py-4 text-base",
  };

  const variants = {
    solid: "bg-gold text-ink hover:opacity-85",
    outline: "border border-gold text-gold bg-transparent hover:opacity-85",
    ghost: "text-muted hover:text-white bg-transparent",
  };

  const accentStyle = accentColor
    ? {
        backgroundColor: variant === "solid" ? accentColor : "transparent",
        borderColor: accentColor,
        color: variant === "solid" ? "#0A0A0A" : accentColor,
        borderWidth: variant === "outline" ? 1 : 0,
        borderStyle: "solid",
      }
    : {};

  return (
    <button
      className={cn(base, sizes[size], variants[variant], full && "w-full", className)}
      style={{ ...accentStyle, ...style }}
      {...props}
    >
      {children}
    </button>
  );
}
