"use client";

import { use } from "react";
import Link from "next/link";
import { Phone } from "lucide-react";
import { useBooking, useUpdateBookingStatus } from "@/hooks/use-bookings";
import { getBookingTimeline } from "@/lib/api/bookings";
import { BookingStatusBadge } from "@/components/bookings/booking-status-badge";
import { BookingTimeline } from "@/components/bookings/booking-timeline";
import { PriceDisplay } from "@/components/shared/price-display";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/shared/loading-skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { formatDate, formatTime } from "@/lib/utils";

export default function ProviderBookingDetailPage({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const { bookingId } = use(params);
  const { data: booking, isLoading, error, refetch } = useBooking(bookingId);
  const updateStatus = useUpdateBookingStatus();

  if (isLoading) return <Skeleton className="h-96 w-full max-w-2xl" />;
  if (error || !booking) return <ErrorState onRetry={() => refetch()} />;

  const timeline = getBookingTimeline(booking.status);

  return (
    <div className="max-w-2xl space-y-6">
      <Link href="/provider/bookings" className="text-sm text-primary hover:underline">
        ← Back to bookings
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{booking.serviceName}</h1>
          <p className="text-muted-foreground">Customer: {booking.customerName}</p>
        </div>
        <BookingStatusBadge status={booking.status} />
      </div>

      <Card>
        <CardContent className="p-6 space-y-4 text-sm">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-muted-foreground">Date & Time</p>
              <p className="font-medium">{formatDate(booking.date)} at {formatTime(booking.time)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Price</p>
              <PriceDisplay amount={booking.estimatedPrice} prefix="" />
            </div>
            <div className="sm:col-span-2">
              <p className="text-muted-foreground">Address</p>
              <p className="font-medium">
                {booking.address.line1}, {booking.address.city}, {booking.address.state}
              </p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-muted-foreground">Description</p>
              <p>{booking.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <BookingTimeline events={timeline} />
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3">
        {booking.customerPhone && (
          <Button variant="outline" onClick={() => { window.location.href = `tel:${booking.customerPhone}`; }}>
            <Phone className="h-4 w-4 mr-2" />
            Call Customer
          </Button>
        )}
        {booking.status === "pending" && (
          <>
            <Button onClick={() => updateStatus.mutate({ id: booking.id, status: "accepted" })}>Accept</Button>
            <Button variant="outline" onClick={() => updateStatus.mutate({ id: booking.id, status: "rejected" })}>Reject</Button>
          </>
        )}
        {booking.status === "accepted" && (
          <Button onClick={() => updateStatus.mutate({ id: booking.id, status: "confirmed" })}>Confirm</Button>
        )}
        {booking.status === "confirmed" && (
          <Button onClick={() => updateStatus.mutate({ id: booking.id, status: "in_progress" })}>Start Job</Button>
        )}
        {booking.status === "in_progress" && (
          <Button onClick={() => updateStatus.mutate({ id: booking.id, status: "completed" })}>Complete Job</Button>
        )}
      </div>
    </div>
  );
}
