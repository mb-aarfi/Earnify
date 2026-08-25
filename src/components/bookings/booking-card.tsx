"use client";

import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookingStatusBadge } from "@/components/bookings/booking-status-badge";
import { PriceDisplay } from "@/components/shared/price-display";
import { formatDate, formatTime } from "@/lib/utils";
import type { Booking } from "@/types/booking";

interface BookingCardProps {
  booking: Booking;
  href?: string;
  showProvider?: boolean;
  showCustomer?: boolean;
}

export function BookingCard({
  booking,
  href,
  showProvider = true,
  showCustomer = false,
}: BookingCardProps) {
  const detailHref = href ?? `/customer/bookings/${booking.id}`;
  const name = showCustomer ? booking.customerName : booking.providerName;
  const image = showCustomer ? undefined : booking.providerImage;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-3 min-w-0">
            {showProvider && image && (
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-muted">
                <Image src={image} alt={name} fill className="object-cover" sizes="48px" />
              </div>
            )}
            <div className="min-w-0">
              <p className="font-semibold truncate">{name}</p>
              <p className="text-sm text-muted-foreground">{booking.serviceName}</p>
            </div>
          </div>
          <BookingStatusBadge status={booking.status} />
        </div>

        <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
          <p className="flex items-center gap-2">
            <Calendar className="h-4 w-4 shrink-0" />
            {formatDate(booking.date)} at {formatTime(booking.time)}
          </p>
          <p className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="truncate">
              {booking.address.line1}, {booking.address.city}
            </span>
          </p>
        </div>

        <div className="flex items-center justify-between mt-4">
          <PriceDisplay amount={booking.estimatedPrice} prefix="" />
          <Button variant="outline" size="sm" asChild>
            <Link href={detailHref}>View Details</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
