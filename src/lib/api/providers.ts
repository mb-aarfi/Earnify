import { simulateApiCall } from "@/lib/api/client";
import { mockProviders } from "@/mocks/providers";
import { serviceCategories } from "@/mocks/categories";
import type {
  Provider,
  ProviderFilters,
  ProviderSortOption,
  ServiceCategory,
} from "@/types/provider";
import type { LocationSearchParams } from "@/types/location";

function sortProviders(
  providers: Provider[],
  sortBy: ProviderSortOption
): Provider[] {
  const sorted = [...providers];

  switch (sortBy) {
    case "nearest":
      return sorted.sort(
        (a, b) =>
          (a.distanceKm ?? 999) - (b.distanceKm ?? 999)
      );

    case "highest_rated":
      return sorted.sort((a, b) => b.rating - a.rating);

    case "lowest_price":
      return sorted.sort(
        (a, b) => a.startingPrice - b.startingPrice
      );

    case "most_booked":
      return sorted.sort(
        (a, b) => b.totalBookings - a.totalBookings
      );

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

function filterProviders(
  providers: Provider[],
  filters: ProviderFilters
): Provider[] {
  let result = [...providers];

  if (filters.query) {
    const q = filters.query.toLowerCase();

    result = result.filter(
      (provider) =>
        provider.name.toLowerCase().includes(q) ||
        provider.categoryName.toLowerCase().includes(q) ||
        provider.bio.toLowerCase().includes(q) ||
        provider.services.some((service) =>
          service.name.toLowerCase().includes(q)
        )
    );
  }

  if (filters.categoryId) {
    result = result.filter(
      (provider) => provider.categoryId === filters.categoryId
    );
  }

  if (filters.minRating !== undefined) {
    const minRating = filters.minRating;

    result = result.filter(
      (provider) => provider.rating >= minRating
    );
  }

  if (filters.maxPrice !== undefined) {
    const maxPrice = filters.maxPrice;

    result = result.filter(
      (provider) => provider.startingPrice <= maxPrice
    );
  }

  if (filters.verified) {
    result = result.filter((provider) => provider.verified);
  }

  if (filters.availableToday) {
    result = result.filter(
      (provider) => provider.availableToday
    );
  }

  if (filters.maxDistanceKm !== undefined) {
    const maxDistanceKm = filters.maxDistanceKm;

    result = result.filter(
      (provider) =>
        (provider.distanceKm ?? 999) <= maxDistanceKm
    );
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
    sortBy: filters.sortBy ?? "recommended",
  };

  const filtered = filterProviders(
    mockProviders,
    combinedFilters
  );

  return simulateApiCall(filtered);
}

export async function getProviderById(id: string) {
  const provider = mockProviders.find(
    (provider) => provider.id === id
  );

  if (!provider) {
    return {
      success: false as const,
      error: {
        code: "NOT_FOUND",
        message: "Provider not found",
      },
    };
  }

  return simulateApiCall(provider);
}

export async function getServiceCategories() {
  return simulateApiCall(serviceCategories);
}

export async function getServiceCategoryBySlug(slug: string) {
  const category = serviceCategories.find(
    (category) => category.slug === slug
  );

  if (!category) {
    return {
      success: false as const,
      error: {
        code: "NOT_FOUND",
        message: "Category not found",
      },
    };
  }

  return simulateApiCall(category);
}

export type { ServiceCategory };