"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, MapPin } from "lucide-react";
import { useSearchStore } from "@/stores/search-store";
import { useNearbyProviders, useServiceCategories } from "@/hooks/use-providers";
import { SearchBar } from "@/components/shared/search-bar";
import { ProviderGrid } from "@/components/providers/provider-card";
import { ProviderCardSkeleton } from "@/components/shared/loading-skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { ProviderSortOption } from "@/types/provider";

export default function CustomerSearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const { query, setQuery, filters, setFilters, location, recentSearches } = useSearchStore();
  const [filterOpen, setFilterOpen] = useState(false);
  const { data: categories } = useServiceCategories();

  useEffect(() => {
    if (initialQuery) setQuery(initialQuery);
  }, [initialQuery, setQuery]);

  const searchQuery = query || initialQuery;

  const { data: providers, isLoading, error, refetch } = useNearbyProviders({
    latitude: location.coordinates.latitude,
    longitude: location.coordinates.longitude,
    radiusKm: filters.maxDistanceKm ?? 15,
    query: searchQuery || undefined,
    categoryId: filters.categoryId,
    minRating: filters.minRating,
    maxPrice: filters.maxPrice,
    verified: filters.verified,
    availableToday: filters.availableToday,
    sortBy: filters.sortBy ?? "recommended",
  });

  const handleSearch = useCallback((q: string) => {
    setQuery(q);
  }, [setQuery]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-4">Find Professionals</h1>
        <SearchBar
          defaultValue={searchQuery}
          onSearch={handleSearch}
          showLocation
        />
      </div>

      {/* Location bar */}
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{location.city}, {location.state}</span>
        </div>
        <Button variant="outline" size="sm">Use My Location</Button>
        <Button variant="ghost" size="sm">Change Location</Button>
      </div>

      {/* Filters & Sort */}
      <div className="flex flex-wrap items-center gap-3">
        <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Filter Results</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>Category</Label>
                <Select
                  value={filters.categoryId ?? "all"}
                  onValueChange={(v) => setFilters({ categoryId: v === "all" ? undefined : v })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {categories?.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Max Distance (km)</Label>
                <Input
                  type="number"
                  className="mt-1"
                  value={filters.maxDistanceKm ?? 15}
                  onChange={(e) => setFilters({ maxDistanceKm: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label>Min Rating</Label>
                <Select
                  value={String(filters.minRating ?? 0)}
                  onValueChange={(v) => setFilters({ minRating: Number(v) || undefined })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Any rating</SelectItem>
                    <SelectItem value="4">4+ stars</SelectItem>
                    <SelectItem value="4.5">4.5+ stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Max Price (₹)</Label>
                <Input
                  type="number"
                  className="mt-1"
                  placeholder="e.g. 1000"
                  value={filters.maxPrice ?? ""}
                  onChange={(e) => setFilters({ maxPrice: Number(e.target.value) || undefined })}
                />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="verified"
                  checked={filters.verified ?? false}
                  onCheckedChange={(c) => setFilters({ verified: c === true ? true : undefined })}
                />
                <Label htmlFor="verified">Verified only</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="available"
                  checked={filters.availableToday ?? false}
                  onCheckedChange={(c) => setFilters({ availableToday: c === true ? true : undefined })}
                />
                <Label htmlFor="available">Available today</Label>
              </div>
              <Button className="w-full" onClick={() => setFilterOpen(false)}>Apply Filters</Button>
            </div>
          </DialogContent>
        </Dialog>

        <Select
          value={filters.sortBy ?? "recommended"}
          onValueChange={(v) => setFilters({ sortBy: v as ProviderSortOption })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recommended">Recommended</SelectItem>
            <SelectItem value="nearest">Nearest</SelectItem>
            <SelectItem value="highest_rated">Highest Rated</SelectItem>
            <SelectItem value="lowest_price">Lowest Price</SelectItem>
            <SelectItem value="most_booked">Most Booked</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Recent searches */}
      {recentSearches.length > 0 && !searchQuery && (
        <div>
          <p className="text-sm text-muted-foreground mb-2">Recent searches</p>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((s) => (
              <Button key={s} variant="secondary" size="sm" onClick={() => handleSearch(s)}>
                {s}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => <ProviderCardSkeleton key={i} />)}
        </div>
      ) : error ? (
        <ErrorState message="We couldn't load the providers." onRetry={() => refetch()} />
      ) : providers && providers.length > 0 ? (
        <>
          <p className="text-sm text-muted-foreground">{providers.length} professionals found</p>
          <ProviderGrid providers={providers} />
        </>
      ) : (
        <EmptyState
          title="No professionals found"
          description="Try adjusting your search or filters to find more results."
          actionLabel="Clear filters"
          onAction={() => setFilters({ sortBy: "recommended" })}
        />
      )}
    </div>
  );
}
