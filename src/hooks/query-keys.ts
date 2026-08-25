import type { ProviderFilters } from "@/types/provider";
import type { LocationSearchParams } from "@/types/location";

export const queryKeys = {
  providers: (filters?: ProviderFilters) => ["providers", filters] as const,
  nearbyProviders: (params?: LocationSearchParams & ProviderFilters) => ["nearbyProviders", params] as const,
  provider: (id: string) => ["provider", id] as const,
  categories: ["categories"] as const,
  bookings: (customerId?: string, status?: string) => ["bookings", customerId, status] as const,
  booking: (id: string) => ["booking", id] as const,
  providerBookings: (providerId: string, status?: string) =>
    ["providerBookings", providerId, status] as const,
  providerServices: (providerId: string) => ["providerServices", providerId] as const,
  providerProfile: (providerId: string) => ["providerProfile", providerId] as const,
  customerProfile: ["customerProfile"] as const,
  reviews: (providerId: string) => ["reviews", providerId] as const,
  ratingDistribution: (providerId: string) => ["ratingDistribution", providerId] as const,
  notifications: (userId: string) => ["notifications", userId] as const,
  unreadCount: (userId: string) => ["unreadCount", userId] as const,
  availability: (providerId: string) => ["availability", providerId] as const,
  earnings: (providerId: string) => ["earnings", providerId] as const,
  location: ["location"] as const,
  timeSlots: (date: string, providerId?: string) => ["timeSlots", date, providerId] as const,
};
