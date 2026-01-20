export type SportDto = {
  id: string;
  name: string;
  slug: string;
};

export type SpecializationDto = {
  id: string;
  name: string;
  slug: string;
};

export type CoachDto = {
  id: string;
  displayName: string;
  slug: string;
  bio: string | null;
  websiteUrl: string | null;
  city: string | null;
  remoteAvailable: boolean;
  inPersonAvailable: boolean;
  priceMin: number | null;
  priceMax: number | null;
  currency: string;
  status: string;
};
