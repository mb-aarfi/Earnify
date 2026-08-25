"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, MessageCircle, Calendar, Award } from "lucide-react";
import { useProvider } from "@/hooks/use-providers";
import { useReviews, useRatingDistribution } from "@/hooks/use-misc";
import { RatingStars } from "@/components/reviews/rating-stars";
import { ReviewCard, RatingSummary } from "@/components/reviews/review-card";
import { VerificationBadge } from "@/components/providers/verification-badge";
import { PriceDisplay } from "@/components/shared/price-display";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProviderCardSkeleton, Skeleton } from "@/components/shared/loading-skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { handleCallProvider, handleMessageProvider } from "@/lib/contact";
import { formatDate } from "@/lib/utils";

export default function ProviderProfilePage({
  params,
}: {
  params: Promise<{ providerId: string }>;
}) {
  const { providerId } = use(params);
  const { data: provider, isLoading, error, refetch } = useProvider(providerId);
  const { data: reviews } = useReviews(providerId);
  const { data: distribution } = useRatingDistribution(providerId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <ProviderCardSkeleton />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (error || !provider) {
    return <ErrorState message="Provider not found." onRetry={() => refetch()} />;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full bg-muted mx-auto sm:mx-0">
              {provider.profileImage && (
                <Image src={provider.profileImage} alt={provider.name} fill className="object-cover" sizes="96px" />
              )}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl font-bold">{provider.name}</h1>
                <VerificationBadge verified={provider.verified} />
              </div>
              <p className="text-muted-foreground">{provider.categoryName}</p>
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                <RatingStars rating={provider.rating} showValue size="md" />
                <span className="text-sm text-muted-foreground">({provider.reviewCount} reviews)</span>
              </div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-3 text-sm text-muted-foreground">
                {provider.distanceKm !== undefined && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {provider.distanceKm} km away
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Award className="h-4 w-4" />
                  {provider.experienceYears} years experience
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{provider.location.address}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-6">
            <Button className="flex-1 sm:flex-none" asChild>
              <Link href={`/customer/providers/${providerId}/book`}>Book Now</Link>
            </Button>
            <Button variant="outline" onClick={() => handleCallProvider(providerId)}>
              <Phone className="h-4 w-4 mr-2" />
              Call
            </Button>
            <Button variant="outline" onClick={() => handleMessageProvider(providerId)}>
              <MessageCircle className="h-4 w-4 mr-2" />
              Message
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="about">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
        </TabsList>

        <TabsContent value="about" className="mt-4">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="font-semibold mb-2">About</h3>
                <p className="text-muted-foreground text-sm">{provider.bio}</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Experience</p>
                  <p className="font-medium">{provider.experienceYears} years</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Languages</p>
                  <p className="font-medium">{provider.languages.join(", ")}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Service area</p>
                  <p className="font-medium">{provider.serviceRadiusKm} km radius</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Member since</p>
                  <p className="font-medium">{formatDate(provider.memberSince)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="mt-4 space-y-3">
          {provider.services.map((service) => (
            <Card key={service.id}>
              <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold">{service.name}</h3>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Estimated duration: {service.durationLabel}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <PriceDisplay amount={service.price} prefix="From" />
                  <Button size="sm" asChild>
                    <Link href={`/customer/providers/${providerId}/book?service=${service.id}`}>Book</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="reviews" className="mt-4">
          <Card>
            <CardContent className="p-6">
              {distribution && (
                <RatingSummary
                  rating={provider.rating}
                  reviewCount={provider.reviewCount}
                  distribution={distribution}
                />
              )}
              <div className="mt-8 space-y-4">
                {reviews?.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="portfolio" className="mt-4">
          {provider.portfolioImages.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {provider.portfolioImages.map((img, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                  <Image src={img} alt={`Portfolio ${i + 1}`} fill className="object-cover" sizes="(max-width:768px) 50vw, 33vw" />
                </div>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                No portfolio images yet
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
