"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RatingStars } from "@/components/reviews/rating-stars";
import { VerificationBadge } from "@/components/providers/verification-badge";
import { PriceDisplay } from "@/components/shared/price-display";
import { handleCallProvider } from "@/lib/contact";
import type { Provider } from "@/types/provider";

interface ProviderCardProps {
  provider: Provider;
  showActions?: boolean;
}

export function ProviderCard({ provider, showActions = true }: ProviderCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-muted">
            {provider.profileImage ? (
              <Image
                src={provider.profileImage}
                alt={provider.name}
                fill
                className="object-cover"
                sizes="64px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-muted-foreground">
                {provider.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-semibold truncate">{provider.name}</h3>
              <VerificationBadge verified={provider.verified} />
            </div>
            <p className="text-sm text-muted-foreground">{provider.categoryName}</p>
            <div className="flex items-center gap-2 mt-1">
              <RatingStars rating={provider.rating} showValue />
              <span className="text-xs text-muted-foreground">({provider.reviewCount} reviews)</span>
            </div>
            {provider.distanceKm !== undefined && (
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <MapPin className="h-3 w-3" />
                {provider.distanceKm} km away
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <PriceDisplay amount={provider.startingPrice} currency={provider.currency} />
          {provider.availableToday && (
            <span className="text-xs text-primary font-medium bg-accent px-2 py-1 rounded-full">
              Available today
            </span>
          )}
        </div>

        {showActions && (
          <div className="flex gap-2 mt-4">
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <Link href={`/customer/providers/${provider.id}`}>View Profile</Link>
            </Button>
            <Button size="sm" className="flex-1" asChild>
              <Link href={`/customer/providers/${provider.id}/book`}>Book Now</Link>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0"
              onClick={() => handleCallProvider(provider.id)}
              aria-label={`Call ${provider.name}`}
            >
              <Phone className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function ProviderGrid({ providers }: { providers: Provider[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {providers.map((provider) => (
        <ProviderCard key={provider.id} provider={provider} />
      ))}
    </div>
  );
}
