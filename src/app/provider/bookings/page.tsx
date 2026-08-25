"use client";

import { useState } from "react";
import { useProviderBookings, useUpdateBookingStatus } from "@/hooks/use-bookings";
import { BookingCard } from "@/components/bookings/booking-card";
import { BookingCardSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { formatDate, formatTime } from "@/lib/utils";
import type { BookingStatus } from "@/types/booking";

const PROVIDER_ID = "prov_1";

const tabs = [
  { value: "requests", label: "Requests", statuses: ["pending"] as BookingStatus[] },
  { value: "upcoming", label: "Upcoming", statuses: ["accepted", "confirmed"] as BookingStatus[] },
  { value: "in_progress", label: "In Progress", statuses: ["in_progress"] as BookingStatus[] },
  { value: "completed", label: "Completed", statuses: ["completed"] as BookingStatus[] },
  { value: "cancelled", label: "Cancelled", statuses: ["cancelled", "rejected"] as BookingStatus[] },
];

export default function ProviderBookingsPage() {
  const [activeTab, setActiveTab] = useState("requests");
  const { data: bookings, isLoading, error, refetch } = useProviderBookings(PROVIDER_ID);
  const updateStatus = useUpdateBookingStatus();

  const getFiltered = (statuses: BookingStatus[]) =>
    bookings?.filter((b) => statuses.includes(b.status)) ?? [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Bookings</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start overflow-x-auto">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => {
          const filtered = getFiltered(tab.statuses);
          return (
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
                    tab.value === "requests" ? (
                      <Card key={booking.id}>
                        <CardContent className="p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                              <p className="font-semibold">{booking.customerName}</p>
                              <p className="text-sm text-muted-foreground">{booking.serviceName}</p>
                              <p className="text-sm text-muted-foreground">
                                {formatDate(booking.date)} at {formatTime(booking.time)}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => updateStatus.mutate({ id: booking.id, status: "accepted" })}>
                                Accept
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => updateStatus.mutate({ id: booking.id, status: "rejected" })}>
                                Reject
                              </Button>
                              <Button size="sm" variant="ghost" asChild>
                                <Link href={`/provider/bookings/${booking.id}`}>View</Link>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <BookingCard
                        key={booking.id}
                        booking={booking}
                        href={`/provider/bookings/${booking.id}`}
                        showCustomer
                      />
                    )
                  ))}
                </div>
              ) : (
                <EmptyState
                  title={tab.value === "requests" ? "No booking requests" : "No bookings"}
                  description={
                    tab.value === "requests"
                      ? "New requests will appear here."
                      : "No bookings in this category."
                  }
                />
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
