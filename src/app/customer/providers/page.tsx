"use client";

import { useNearbyProviders } from "@/hooks/use-providers";
import { useSearchStore } from "@/stores/search-store";
import { ProviderGrid } from "@/components/providers/provider-card";
import { ProviderCardSkeleton } from "@/components/shared/loading-skeleton";
import { ErrorState } from "@/components/shared/error-state";

export default function CustomerProvidersPage() {
  const { location, filters } = useSearchStore();
  const { data: providers, isLoading, error, refetch } = useNearbyProviders({
    latitude: location.coordinates.latitude,
    longitude: location.coordinates.longitude,
    radiusKm: 15,
    sortBy: filters.sortBy ?? "recommended",
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Nearby Providers</h1>
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => <ProviderCardSkeleton key={i} />)}
        </div>
      ) : error ? (
        <ErrorState onRetry={() => refetch()} />
      ) : providers ? (
        <ProviderGrid providers={providers} />
      ) : null}
    </div>
  );
}
