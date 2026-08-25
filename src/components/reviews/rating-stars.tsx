import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  className?: string;
}

export function RatingStars({
  rating,
  max = 5,
  size = "sm",
  showValue = false,
  className,
}: RatingStarsProps) {
  const sizeClasses = { sm: "h-3.5 w-3.5", md: "h-4 w-4", lg: "h-5 w-5" };

  return (
    <div className={cn("flex items-center gap-1", className)} aria-label={`Rating: ${rating} out of ${max}`}>
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            sizeClasses[size],
            i < Math.floor(rating)
              ? "fill-warning text-warning"
              : i < rating
                ? "fill-warning/50 text-warning"
                : "fill-muted text-muted"
          )}
        />
      ))}
      {showValue && <span className="text-sm font-medium ml-1">{rating.toFixed(1)}</span>}
    </div>
  );
}
