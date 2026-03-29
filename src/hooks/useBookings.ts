"use client";
import { useState, useEffect } from "react";
import type { Booking } from "@/types";
import { sampleBookings } from "@/data/reviews";

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("poach_bookings");
    if (stored) {
      setBookings(JSON.parse(stored));
    } else {
      setBookings(sampleBookings);
    }
    setHydrated(true);
  }, []);

  const addBooking = (booking: Booking) => {
    setBookings((prev) => {
      const next = [booking, ...prev];
      localStorage.setItem("poach_bookings", JSON.stringify(next));
      return next;
    });
  };

  return { bookings, addBooking, hydrated };
}
