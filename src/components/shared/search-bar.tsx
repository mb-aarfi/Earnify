"use client";

import { useRouter } from "next/navigation";
import { Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSearchStore } from "@/stores/search-store";

interface SearchBarProps {
  placeholder?: string;
  showLocation?: boolean;
  onSearch?: (query: string) => void;
  defaultValue?: string;
  className?: string;
}

export function SearchBar({
  placeholder = "Search plumbers, electricians, mechanics...",
  showLocation = false,
  onSearch,
  defaultValue = "",
  className,
}: SearchBarProps) {
  const router = useRouter();
  const { query, setQuery, location, addRecentSearch } = useSearchStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = (e.target as HTMLFormElement).search.value as string;
    setQuery(q);
    addRecentSearch(q);
    if (onSearch) {
      onSearch(q);
    } else {
      router.push(`/customer/search?q=${encodeURIComponent(q)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            name="search"
            placeholder={placeholder}
            defaultValue={defaultValue || query}
            className="pl-10 h-12"
            aria-label="Search services"
          />
        </div>
        {showLocation && location.city && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground px-3 py-2 bg-muted rounded-lg">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="truncate">{location.city}, {location.state}</span>
          </div>
        )}
        <Button type="submit" size="lg" className="shrink-0">
          Search
        </Button>
      </div>
    </form>
  );
}
