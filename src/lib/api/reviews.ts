import { simulateApiCall } from "@/lib/api/client";
import { generateId } from "@/lib/utils";
import { mockReviews } from "@/mocks/reviews";
import type { CreateReviewInput, RatingDistribution } from "@/types/review";

export async function getReviews(providerId: string) {
  const reviews = mockReviews
    .filter((r) => r.providerId === providerId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return simulateApiCall(reviews);
}

export async function getRatingDistribution(providerId: string) {
  const reviews = mockReviews.filter((r) => r.providerId === providerId);
  const total = reviews.length || 1;
  const distribution: RatingDistribution[] = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => r.rating === stars).length;
    return {
      stars,
      count,
      percentage: Math.round((count / total) * 100),
    };
  });
  return simulateApiCall(distribution);
}

export async function createReview(input: CreateReviewInput) {
  const review = {
    id: generateId("rev"),
    providerId: input.providerId,
    customerId: "user_customer_1",
    customerName: "Ali Hassan",
    customerImage: "https://i.pravatar.cc/150?u=customer1",
    bookingId: input.bookingId,
    rating: input.rating,
    comment: input.comment,
    createdAt: new Date().toISOString(),
  };
  mockReviews.unshift(review);
  return simulateApiCall(review);
}
