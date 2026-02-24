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

export type SocialLinkDto = {
  platform: string;
  url: string;
};

export type SportRefDto = {
  slug: string;
  name: string;
};

export type SpecializationRefDto = {
  slug: string;
  name: string;
};

export type CoachDto = {
  id: string;
  displayName: string;
  slug: string;
  bio: string | null;
  websiteUrl: string | null;
  city: string | null;
  region: string | null;
  country: string | null;
  remoteAvailable: boolean;
  inPersonAvailable: boolean;
  priceMin: number | null;
  priceMax: number | null;
  pricingModel: string | null;
  currency: string;
  status: string;
  avatarUrl?: string | null;
  imageUrls?: string[];
  sports: SportRefDto[];
  specializations: SpecializationRefDto[];
  socialLinks: SocialLinkDto[];
};
