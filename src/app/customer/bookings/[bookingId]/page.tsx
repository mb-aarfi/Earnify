"use client";

import { use, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Star } from "lucide-react";
import { useBooking, useCancelBooking } from "@/hooks/use-bookings";
import { useCreateReview } from "@/hooks/use-misc";
import { getBookingTimeline } from "@/lib/api/bookings";
import { BookingStatusBadge } from "@/components/bookings/booking-status-badge";
import { BookingTimeline } from "@/components/bookings/booking-timeline";
import { PriceDisplay } from "@/components/shared/price-display";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/shared/loading-skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { handleCallProvider } from "@/lib/contact";
import { formatDate, formatTime } from "@/lib/utils";

export default function BookingDetailPage({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const { bookingId } = use(params);
  const { data: booking, isLoading, error, refetch } = useBooking(bookingId);
  const cancelBooking = useCancelBooking();
  const createReview = useCreateReview();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewOpen, setReviewOpen] = useState(false);

  if (isLoading) return <Skeleton className="h-96 w-full" />;
  if (error || !booking) return <ErrorState onRetry={() => refetch()} />;

  const timeline = getBookingTimeline(booking.status);
  const canCancel = ["pending", "accepted", "confirmed"].includes(booking.status);
  const canReview = booking.status === "completed";

  const handleReview = async () => {
    await createReview.mutateAsync({
      bookingId: booking.id,
      providerId: booking.providerId,
      rating,
      comment,
    });
    setReviewOpen(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link href="/customer/bookings" className="text-sm text-primary hover:underline">
        ← Back to bookings
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Booking ID: {booking.id}</p>
          <h1 className="text-2xl font-bold mt-1">{booking.serviceName}</h1>
        </div>
        <BookingStatusBadge status={booking.status} />
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            {booking.providerImage && (
              <div className="relative h-14 w-14 rounded-full overflow-hidden bg-muted">
                <Image src={booking.providerImage} alt={booking.providerName} fill className="object-cover" sizes="56px" />
              </div>
            )}
            <div>
              <p className="font-semibold">{booking.providerName}</p>
              <Link href={`/customer/providers/${booking.providerId}`} className="text-sm text-primary hover:underline">
                View profile
              </Link>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mt-6 text-sm">
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
                {booking.address.line1}
                {booking.address.line2 && `, ${booking.address.line2}`}
                , {booking.address.city}, {booking.address.state} — {booking.address.postalCode}
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
        <Button variant="outline" onClick={() => handleCallProvider(booking.providerId)}>
          <Phone className="h-4 w-4 mr-2" />
          Call Provider
        </Button>

        {canCancel && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Cancel Booking</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. The provider will be notified.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep Booking</AlertDialogCancel>
                <AlertDialogAction onClick={() => cancelBooking.mutate(booking.id)}>
                  Cancel Booking
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        {canReview && (
          <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
            <DialogTrigger asChild>
              <Button>
                <Star className="h-4 w-4 mr-2" />
                Leave Review
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>How was your experience?</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex gap-1 justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1"
                      aria-label={`Rate ${star} stars`}
                    >
                      <Star
                        className={`h-8 w-8 ${star <= rating ? "fill-warning text-warning" : "text-muted"}`}
                      />
                    </button>
                  ))}
                </div>
                <Textarea
                  placeholder="Write a review..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                />
                <Button className="w-full" onClick={handleReview} loading={createReview.isPending}>
                  Submit Review
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
