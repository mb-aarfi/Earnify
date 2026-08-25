"use client";

import { useState } from "react";
import { useBookings } from "@/hooks/use-bookings";
import { getDefaultUserId } from "@/lib/session";
import { BookingCard } from "@/components/bookings/booking-card";
import { BookingCardSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { BookingStatus } from "@/types/booking";

const tabs: { value: string; label: string; filter?: BookingStatus | "upcoming" }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending", filter: "pending" },
  { value: "upcoming", label: "Upcoming", filter: "upcoming" },
  { value: "completed", label: "Completed", filter: "completed" },
  { value: "cancelled", label: "Cancelled", filter: "cancelled" },
];

function filterBookings(bookings: ReturnType<typeof useBookings>["data"], tab: string) {
  if (!bookings) return [];
  if (tab === "all") return bookings;
  if (tab === "upcoming") {
    return bookings.filter((b) =>
      ["accepted", "confirmed", "in_progress"].includes(b.status)
    );
  }
  return bookings.filter((b) => b.status === tab);
}

export default function CustomerBookingsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const { data: bookings, isLoading, error, refetch } = useBookings(getDefaultUserId("customer"));
  const filtered = filterBookings(bookings, activeTab);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Bookings</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start overflow-x-auto">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="mt-4">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => <BookingCardSkeleton key={i} />)}
              </div>
            ) : error ? (
              <ErrorState onRetry={() => refetch()} />
            ) : filtered.length > 0 ? (
              <div className="space-y-4">
                {filtered.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No bookings yet"
                description="Find a professional and book your first service."
                actionLabel="Find a Service"
                actionHref="/customer/search"
              />
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
