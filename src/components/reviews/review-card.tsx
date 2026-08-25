import Image from "next/image";
import { RatingStars } from "@/components/reviews/rating-stars";
import { formatDate } from "@/lib/utils";
import type { Review } from "@/types/review";

export function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="border-b pb-4 last:border-0">
      <div className="flex items-start gap-3">
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted">
          {review.customerImage ? (
            <Image src={review.customerImage} alt={review.customerName} fill className="object-cover" sizes="40px" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm font-medium">
              {review.customerName.charAt(0)}
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p className="font-medium text-sm">{review.customerName}</p>
            <span className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</span>
          </div>
          <RatingStars rating={review.rating} className="mt-1" />
          <p className="text-sm text-muted-foreground mt-2">{review.comment}</p>
        </div>
      </div>
    </div>
  );
}

export function RatingSummary({
  rating,
  reviewCount,
  distribution,
}: {
  rating: number;
  reviewCount: number;
  distribution: { stars: number; count: number; percentage: number }[];
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-6">
      <div className="text-center sm:text-left">
        <p className="text-4xl font-bold">{rating.toFixed(1)}</p>
        <RatingStars rating={rating} size="md" className="justify-center sm:justify-start mt-1" />
        <p className="text-sm text-muted-foreground mt-1">{reviewCount} reviews</p>
      </div>
      <div className="flex-1 space-y-2">
        {distribution.map((d) => (
          <div key={d.stars} className="flex items-center gap-2 text-sm">
            <span className="w-3">{d.stars}</span>
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-warning rounded-full"
                style={{ width: `${d.percentage}%` }}
              />
            </div>
            <span className="w-8 text-muted-foreground text-xs">{d.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
