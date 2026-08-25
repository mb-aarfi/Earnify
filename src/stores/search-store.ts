"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProviderFilters } from "@/types/provider";
import type { Location } from "@/types/location";
import { defaultLocation } from "@/mocks/location";

interface SearchStore {
  query: string;
  filters: ProviderFilters;
  location: Location;
  recentSearches: string[];
  setQuery: (query: string) => void;
  setFilters: (filters: Partial<ProviderFilters>) => void;
  resetFilters: () => void;
  setLocation: (location: Location) => void;
  addRecentSearch: (search: string) => void;
}

export const useSearchStore = create<SearchStore>()(
  persist(
    (set, get) => ({
      query: "",
      filters: { sortBy: "recommended" },
      location: defaultLocation,
      recentSearches: [],
      setQuery: (query) => set({ query }),
      setFilters: (filters) => set({ filters: { ...get().filters, ...filters } }),
      resetFilters: () => set({ filters: { sortBy: "recommended" } }),
      setLocation: (location) => set({ location }),
      addRecentSearch: (search) => {
        const trimmed = search.trim();
        if (!trimmed) return;
        const current = get().recentSearches.filter((s) => s !== trimmed);
        set({ recentSearches: [trimmed, ...current].slice(0, 5) });
      },
    }),
    { name: "earnify-search" }
  )
);
