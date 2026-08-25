import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BookingTimelineEvent } from "@/types/booking";

interface BookingTimelineProps {
  events: BookingTimelineEvent[];
  className?: string;
}

export function BookingTimeline({ events, className }: BookingTimelineProps) {
  return (
    <div className={cn("space-y-0", className)}>
      {events.map((event, index) => (
        <div key={event.status} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border-2",
                event.completed
                  ? "border-primary bg-accent text-primary"
                  : "border-muted bg-muted text-muted-foreground"
              )}
            >
              {event.completed ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <span className="text-xs font-medium">{index + 1}</span>
              )}
            </div>
            {index < events.length - 1 && (
              <div
                className={cn(
                  "w-0.5 h-10",
                  event.completed ? "bg-primary" : "bg-muted"
                )}
              />
            )}
          </div>
          <div className="pb-8 pt-1">
            <p className={cn("font-medium text-sm", !event.completed && "text-muted-foreground")}>
              {event.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
