export interface MyCoachProfileDto {
  displayName: string;
  bio?: string | null;
  websiteUrl?: string | null;
  city?: string | null;
  region?: string | null;
  country?: string | null;
  remoteAvailable: boolean;
  inPersonAvailable: boolean;
  priceMin?: number | null;
  priceMax?: number | null;
  pricingModel?: string | null;
  currency: string;
  sportSlugs: string[];
  specializationSlugs: string[];
  socialLinks?: { platform: string; url: string }[];
  status?: string;
  slug?: string;
  avatarUrl?: string | null;
}
