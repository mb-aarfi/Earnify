"use client";

import { Calendar, Clock, CheckCircle, IndianRupee, Phone } from "lucide-react";
import { getGreeting, formatCurrency, formatDate, formatTime } from "@/lib/utils";
import { useProviderBookings, useUpdateBookingStatus } from "@/hooks/use-bookings";
import { useProviderEarnings } from "@/hooks/use-misc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

const PROVIDER_ID = "prov_1";

export default function ProviderDashboardPage() {
  const { data: allBookings } = useProviderBookings(PROVIDER_ID);
  const { data: pendingBookings } = useProviderBookings(PROVIDER_ID, "pending");
  const { data: earnings } = useProviderEarnings(PROVIDER_ID);
  const updateStatus = useUpdateBookingStatus();

  const todayBookings = allBookings?.filter((b) => b.date === new Date().toISOString().split("T")[0]) ?? [];
  const completedJobs = allBookings?.filter((b) => b.status === "completed").length ?? 0;
  const upcoming = allBookings?.filter((b) =>
    ["accepted", "confirmed", "in_progress"].includes(b.status)
  ).slice(0, 3) ?? [];

  const kpis = [
    { label: "Today's Bookings", value: todayBookings.length, icon: Calendar },
    { label: "Pending Requests", value: pendingBookings?.length ?? 0, icon: Clock },
    { label: "Completed Jobs", value: completedJobs, icon: CheckCircle },
    { label: "Total Earnings", value: formatCurrency(earnings?.summary.totalEarnings ?? 0), icon: IndianRupee },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">{getGreeting()}, Baqir</h1>
        <p className="text-muted-foreground mt-1">Here&apos;s your business overview.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent">
                  <kpi.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{kpi.label}</p>
                  <p className="text-xl font-bold">{kpi.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pending requests */}
      {pendingBookings && pendingBookings.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-4">New Booking Requests</h2>
          <div className="space-y-4">
            {pendingBookings.slice(0, 3).map((booking) => (
              <Card key={booking.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold">New Booking Request</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Customer: {booking.customerName} · {booking.serviceName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Date: {formatDate(booking.date)} at {formatTime(booking.time)}
                      </p>
                      {booking.distanceKm && (
                        <p className="text-sm text-muted-foreground">
                          Location: {booking.distanceKm} km away
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => updateStatus.mutate({ id: booking.id, status: "accepted" })}
                        loading={updateStatus.isPending}
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStatus.mutate({ id: booking.id, status: "rejected" })}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Upcoming */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Upcoming Bookings</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/provider/bookings">View all</Link>
          </Button>
        </div>
        {upcoming.length > 0 ? (
          <div className="space-y-4">
            {upcoming.map((booking) => (
              <Card key={booking.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold">{booking.customerName}</p>
                      <p className="text-sm text-muted-foreground">{booking.serviceName}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(booking.date)} at {formatTime(booking.time)}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {booking.address.line1}, {booking.address.city}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/provider/bookings/${booking.id}`}>View</Link>
                      </Button>
                      {booking.customerPhone && (
                        <Button size="sm" variant="outline" onClick={() => {
                          if (booking.customerPhone) window.location.href = `tel:${booking.customerPhone}`;
                        }}>
                          <Phone className="h-4 w-4" />
                        </Button>
                      )}
                      {booking.status === "confirmed" && (
                        <Button size="sm" onClick={() => updateStatus.mutate({ id: booking.id, status: "in_progress" })}>
                          Start Job
                        </Button>
                      )}
                      {booking.status === "in_progress" && (
                        <Button size="sm" onClick={() => updateStatus.mutate({ id: booking.id, status: "completed" })}>
                          Complete Job
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No upcoming bookings
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
