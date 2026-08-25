"use client";

import Link from "next/link";
import {
  Wrench, Zap, Car, GraduationCap, Code, Wind, Hammer, Paintbrush, Sparkles, Palette,
  Search, Calendar, Star,
} from "lucide-react";
import { getGreeting } from "@/lib/utils";
import { useCustomerProfile } from "@/hooks/use-misc";
import { useBookings } from "@/hooks/use-bookings";
import { useProviders } from "@/hooks/use-providers";
import { SearchBar } from "@/components/shared/search-bar";
import { ProviderCard } from "@/components/providers/provider-card";
import { BookingCard } from "@/components/bookings/booking-card";
import { ProviderCardSkeleton, BookingCardSkeleton } from "@/components/shared/loading-skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getDefaultUserId } from "@/lib/session";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Wrench, Zap, Car, GraduationCap, Code, Wind, Hammer, Paintbrush, Sparkles, Palette,
};

const quickServices = [
  { name: "Plumber", icon: "Wrench", slug: "plumber" },
  { name: "Electrician", icon: "Zap", slug: "electrician" },
  { name: "AC Repair", icon: "Wind", slug: "ac-repair" },
  { name: "Cleaner", icon: "Sparkles", slug: "cleaner" },
];

export default function CustomerHomePage() {
  const { data: profile } = useCustomerProfile();
  const { data: providers, isLoading: providersLoading } = useProviders({ sortBy: "recommended" });
  const { data: bookings, isLoading: bookingsLoading } = useBookings(getDefaultUserId("customer"));

  const recentBookings = bookings?.slice(0, 2) ?? [];
  const recommended = providers?.slice(0, 3) ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">
          {getGreeting()}, {profile?.name?.split(" ")[0] ?? "there"}
        </h1>
        <p className="text-muted-foreground mt-1">What service do you need today?</p>
      </div>

      <SearchBar placeholder="Search for a service..." />

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {quickServices.map((s) => {
          const Icon = iconMap[s.icon];
          return (
            <Link key={s.slug} href={`/customer/search?q=${s.name}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <Icon className="h-6 w-6 text-primary mb-2" />
                  <span className="text-sm font-medium">{s.name}</span>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Recommended */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Star className="h-5 w-5 text-warning" />
            Recommended Professionals
          </h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/customer/providers">View all</Link>
          </Button>
        </div>
        {providersLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => <ProviderCardSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recommended.map((p) => <ProviderCard key={p.id} provider={p} />)}
          </div>
        )}
      </section>

      {/* Recent bookings */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Recent Bookings
          </h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/customer/bookings">View all</Link>
          </Button>
        </div>
        {bookingsLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => <BookingCardSkeleton key={i} />)}
          </div>
        ) : recentBookings.length > 0 ? (
          <div className="space-y-4">
            {recentBookings.map((b) => <BookingCard key={b.id} booking={b} />)}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground mb-4">No bookings yet</p>
              <Button asChild>
                <Link href="/customer/search">
                  <Search className="h-4 w-4 mr-2" />
                  Find a Service
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
