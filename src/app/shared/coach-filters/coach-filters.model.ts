export interface CoachFilters {
  sportSlug: string | null;
  specializationSlug: string | null;

  remote: boolean;
  inPerson: boolean;

  city: string;

  maxPrice: number | null;

  // Optional: später mit Geo
  distanceKm: number | null;

  // Optional: Sort
  sort: 'relevance' | 'priceAsc' | 'priceDesc' | 'nameAsc';
}
