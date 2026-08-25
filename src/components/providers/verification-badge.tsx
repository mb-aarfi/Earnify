import { BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface VerificationBadgeProps {
  verified?: boolean;
  className?: string;
}

export function VerificationBadge({ verified, className }: VerificationBadgeProps) {
  if (!verified) return null;
  return (
    <span className={cn("inline-flex items-center gap-1 text-primary text-sm", className)}>
      <BadgeCheck className="h-4 w-4" aria-label="Verified professional" />
      <span className="sr-only">Verified</span>
    </span>
  );
}
