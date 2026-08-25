"use client";

import { useQuery } from "@tanstack/react-query";
import { getProviders, getNearbyProviders, getProviderById, getServiceCategories } from "@/lib/api/providers";
import { queryKeys } from "./query-keys";
import type { ProviderFilters } from "@/types/provider";
import type { LocationSearchParams } from "@/types/location";

export function useProviders(filters?: ProviderFilters) {
  return useQuery({
    queryKey: queryKeys.providers(filters),
    queryFn: async () => {
      const res = await getProviders(filters);
      if (!res.success) throw new Error(res.error?.message);
      return res.data!;
    },
  });
}

export function useNearbyProviders(params: LocationSearchParams & ProviderFilters) {
  return useQuery({
    queryKey: queryKeys.nearbyProviders(params),
    queryFn: async () => {
      const res = await getNearbyProviders(params);
      if (!res.success) throw new Error(res.error?.message);
      return res.data!;
    },
  });
}

export function useProvider(id: string) {
  return useQuery({
    queryKey: queryKeys.provider(id),
    queryFn: async () => {
      const res = await getProviderById(id);
      if (!res.success) throw new Error(res.error?.message);
      return res.data!;
    },
    enabled: !!id,
  });
}

export function useServiceCategories() {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: async () => {
      const res = await getServiceCategories();
      if (!res.success) throw new Error(res.error?.message);
      return res.data!;
    },
  });
}
