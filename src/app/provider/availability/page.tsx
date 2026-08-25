"use client";

import { useProviderAvailability, useUpdateProviderAvailability } from "@/hooks/use-misc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/shared/loading-skeleton";
import { formatTime } from "@/lib/utils";
import type { ProviderAvailability } from "@/types/api";

export default function ProviderAvailabilityPage() {
  const { data: availability, isLoading } = useProviderAvailability();
  const updateAvailability = useUpdateProviderAvailability();

  if (isLoading || !availability) return <Skeleton className="h-96 w-full max-w-2xl" />;

  const toggleDay = (dayIndex: number) => {
    const updated: ProviderAvailability = {
      ...availability,
      schedule: availability.schedule.map((day) =>
        day.dayIndex === dayIndex
          ? {
              ...day,
              available: !day.available,
              slots: !day.available
                ? [{ id: `${day.dayIndex}_1`, startTime: "09:00", endTime: "18:00", available: true }]
                : [],
            }
          : day
      ),
    };
    updateAvailability.mutate(updated);
  };

  const toggleVacation = () => {
    updateAvailability.mutate({ ...availability, vacationMode: !availability.vacationMode });
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Availability</h1>

      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="font-medium">Vacation Mode</p>
            <p className="text-sm text-muted-foreground">Temporarily unavailable for bookings</p>
          </div>
          <Switch checked={availability.vacationMode} onCheckedChange={toggleVacation} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Weekly Schedule</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {availability.schedule.map((day) => (
            <div key={day.dayIndex} className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <p className="font-medium">{day.day}</p>
                {day.available && day.slots.length > 0 ? (
                  <p className="text-sm text-muted-foreground">
                    {formatTime(day.slots[0].startTime)} — {formatTime(day.slots[0].endTime)}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">Unavailable</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor={`day-${day.dayIndex}`} className="sr-only">{day.day}</Label>
                <Switch
                  id={`day-${day.dayIndex}`}
                  checked={day.available}
                  onCheckedChange={() => toggleDay(day.dayIndex)}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
