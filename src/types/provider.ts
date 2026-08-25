import type { Location } from "./location";

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  price: number;
  currency: string;
  durationMinutes: number;
  durationLabel: string;
  active: boolean;
}

export interface Provider {
  id: string;
  userId: string;
  name: string;
  businessName?: string;
  profileImage?: string;
  categoryId: string;
  categoryName: string;
  bio: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  experienceYears: number;
  startingPrice: number;
  currency: string;
  location: Location;
  distanceKm?: number;
  serviceRadiusKm: number;
  services: Service[];
  languages: string[];
  memberSince: string;
  availableToday: boolean;
  phone: string;
  email: string;
  portfolioImages: string[];
  totalBookings: number;
}

export interface ProviderFilters {
  query?: string;
  categoryId?: string;
  minRating?: number;
  maxPrice?: number;
  verified?: boolean;
  availableToday?: boolean;
  maxDistanceKm?: number;
  sortBy?: ProviderSortOption;
}

export type ProviderSortOption =
  | "recommended"
  | "nearest"
  | "highest_rated"
  | "lowest_price"
  | "most_booked";

export interface ProviderProfileUpdate {
  name?: string;
  businessName?: string;
  bio?: string;
  phone?: string;
  email?: string;
  serviceRadiusKm?: number;
  languages?: string[];
  categoryId?: string;
}
