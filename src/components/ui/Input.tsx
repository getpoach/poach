import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  prefix?: string;
}

export function Input({ label, prefix, className, ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-semibold text-muted uppercase tracking-widest mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {prefix && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted text-sm">
            {prefix}
          </span>
        )}
        <input
          className={cn(
            "w-full bg-card border border-zinc-800 rounded-xl px-3.5 py-3 text-sm text-white",
            "placeholder:text-zinc-600 outline-none focus:border-zinc-600 transition-colors",
            prefix && "pl-7",
            className
          )}
          {...props}
        />
      </div>
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function Textarea({ label, className, ...props }: TextareaProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-semibold text-muted uppercase tracking-widest mb-2">
          {label}
        </label>
      )}
      <textarea
        className={cn(
          "w-full bg-card border border-zinc-800 rounded-xl px-3.5 py-3 text-sm text-white resize-none",
          "placeholder:text-zinc-600 outline-none focus:border-zinc-600 transition-colors",
          className
        )}
        {...props}
      />
    </div>
  );
}
