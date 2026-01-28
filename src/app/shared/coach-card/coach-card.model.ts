export interface CoachCardVm {
  slug: string;

  name: string;
  city: string;
  tagline?: string;

  avatarUrl?: string;

  sports: string[];          // z.B. ["Hyrox", "Functional Fitness"]
  specializations: string[]; // z.B. ["Fettabbau", "Hyrox Pro"]

  remoteAvailable: boolean;
  inPersonAvailable: boolean;

  priceFrom?: number;        // z.B. 149
  priceUnit?: string;        // z.B. "pro Monat"
}
