"use client";
import { useState, useMemo } from "react";
import type { Chef, Cuisine } from "@/types";

export function useChefFilter(chefs: Chef[]) {
  const [search, setSearch] = useState("");
  const [cuisine, setCuisine] = useState<Cuisine | "All">("All");

  const filtered = useMemo(
    () =>
      chefs.filter((c) => {
        const matchSearch =
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.cuisine.some((cu) =>
            cu.toLowerCase().includes(search.toLowerCase())
          ) ||
          c.specialty.toLowerCase().includes(search.toLowerCase());
        const matchCuisine =
          cuisine === "All" || c.cuisine.includes(cuisine as Cuisine);
        return matchSearch && matchCuisine;
      }),
    [chefs, search, cuisine]
  );

  return { search, setSearch, cuisine, setCuisine, filtered };
}
