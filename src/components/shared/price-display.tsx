import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface PriceDisplayProps {
  amount: number;
  currency?: string;
  prefix?: string;
  className?: string;
}

export function PriceDisplay({ amount, currency = "INR", prefix = "From", className }: PriceDisplayProps) {
  return (
    <span className={cn("font-semibold text-foreground", className)}>
      {prefix && <span className="text-muted-foreground font-normal text-sm mr-1">{prefix}</span>}
      {formatCurrency(amount, currency)}
    </span>
  );
}
