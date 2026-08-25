export interface Review {
  id: string;
  providerId: string;
  customerId: string;
  customerName: string;
  customerImage?: string;
  bookingId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CreateReviewInput {
  bookingId: string;
  providerId: string;
  rating: number;
  comment: string;
}

export interface RatingDistribution {
  stars: number;
  count: number;
  percentage: number;
}
