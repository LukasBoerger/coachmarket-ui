export interface CoachFilters {
  sportSlug: string | null;
  remote: boolean;
  inPerson: boolean;
  city: string;
  maxPrice: number | null;
  distanceKm: number | null;
  sort: 'relevance' | 'priceAsc' | 'priceDesc' | 'nameAsc';
}
