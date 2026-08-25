import { simulateApiCall } from "@/lib/api/client";
import { mockProviders } from "@/mocks/providers";
import { serviceCategories } from "@/mocks/categories";
import type { Provider, ProviderFilters, ProviderSortOption } from "@/types/provider";
import type { ServiceCategory } from "@/types/provider";
import type { LocationSearchParams } from "@/types/location";

function sortProviders(providers: Provider[], sortBy: ProviderSortOption): Provider[] {
  const sorted = [...providers];
  switch (sortBy) {
    case "nearest":
      return sorted.sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999));
    case "highest_rated":
      return sorted.sort((a, b) => b.rating - a.rating);
    case "lowest_price":
      return sorted.sort((a, b) => a.startingPrice - b.startingPrice);
    case "most_booked":
      return sorted.sort((a, b) => b.totalBookings - a.totalBookings);
    case "recommended":
    default:
      return sorted.sort(
        (a, b) =>
          b.rating * 0.4 +
          (b.reviewCount / 100) * 0.2 +
          (b.verified ? 0.2 : 0) +
          (1 / (b.distanceKm ?? 10)) * 0.2 -
          (a.rating * 0.4 +
            (a.reviewCount / 100) * 0.2 +
            (a.verified ? 0.2 : 0) +
            (1 / (a.distanceKm ?? 10)) * 0.2)
      );
  }
}

function filterProviders(providers: Provider[], filters: ProviderFilters): Provider[] {
  let result = [...providers];

  if (filters.query) {
    const q = filters.query.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q) ||
        p.bio.toLowerCase().includes(q) ||
        p.services.some((s) => s.name.toLowerCase().includes(q))
    );
  }

  if (filters.categoryId) {
    result = result.filter((p) => p.categoryId === filters.categoryId);
  }

  if (filters.minRating) {
    result = result.filter((p) => p.rating >= filters.minRating!);
  }

  if (filters.maxPrice) {
    result = result.filter((p) => p.startingPrice <= filters.maxPrice!);
  }

  if (filters.verified) {
    result = result.filter((p) => p.verified);
  }

  if (filters.availableToday) {
    result = result.filter((p) => p.availableToday);
  }

  if (filters.maxDistanceKm) {
    result = result.filter((p) => (p.distanceKm ?? 999) <= filters.maxDistanceKm!);
  }

  if (filters.sortBy) {
    result = sortProviders(result, filters.sortBy);
  }

  return result;
}

export async function getProviders(filters?: ProviderFilters) {
  const filtered = filterProviders(mockProviders, filters ?? {});
  return simulateApiCall(filtered);
}

export async function getNearbyProviders(
  params: LocationSearchParams & ProviderFilters
) {
  const { radiusKm, ...filters } = params;
  void params.latitude;
  void params.longitude;
  const combinedFilters = {
    ...filters,
    maxDistanceKm: radiusKm ?? filters.maxDistanceKm,
    sortBy: filters.sortBy ?? ("recommended" as ProviderSortOption),
  };
  const filtered = filterProviders(mockProviders, combinedFilters);
  return simulateApiCall(filtered);
}

export async function getProviderById(id: string) {
  const provider = mockProviders.find((p) => p.id === id);
  if (!provider) {
    return { success: false as const, error: { code: "NOT_FOUND", message: "Provider not found" } };
  }
  return simulateApiCall(provider);
}

export async function getServiceCategories() {
  return simulateApiCall(serviceCategories);
}

export async function getServiceCategoryBySlug(slug: string) {
  const category = serviceCategories.find((c) => c.slug === slug);
  if (!category) {
    return { success: false as const, error: { code: "NOT_FOUND", message: "Category not found" } };
  }
  return simulateApiCall(category);
}

export type { ServiceCategory };
