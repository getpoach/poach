"use client";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
  maxWidth?: string;
}

export function Modal({ children, onClose, maxWidth = "max-w-lg" }: ModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/88 z-50 flex items-center justify-center p-5"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "bg-zinc-950 border border-zinc-800 rounded-2xl w-full p-8 max-h-[92vh] overflow-y-auto",
          maxWidth
        )}
      >
        {children}
      </div>
    </div>
  );
}
