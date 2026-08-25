export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Location {
  coordinates: Coordinates;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
}

export interface LocationSearchParams {
  latitude: number;
  longitude: number;
  radiusKm?: number;
}
