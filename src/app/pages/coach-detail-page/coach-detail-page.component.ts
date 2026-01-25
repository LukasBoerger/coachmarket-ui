import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

export interface CoachDetailVm {
  name: string;
  city: string;
  heroImageUrl?: string;
  avatarUrl?: string;
  tagline?: string;

  sports: string[];
  specializations: string[];

  remoteAvailable: boolean;
  inPersonAvailable: boolean;

  priceFrom?: number;
  priceUnit?: string;
  freeIntro?: boolean;

  description?: string;
  focusAreas?: string[];
  methods?: string[];

  experienceYears?: number;
  certifications?: string[];

  // 🔽 neu:
  primaryContactLabel?: string; // z.B. "Coach per E-Mail kontaktieren"
  primaryContactUrl?: string;   // mailto:, Website, Calendly, …
  otherContacts?: { label: string; url: string }[];

  pricingNote?: string;         // Hinweis: Zahlung direkt beim Coach
  supportNote?: string;         // Hinweis: Plattform über Spenden o.ä.
  supportUrl?: string;
}


@Component({
  selector: 'app-coach-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './coach-detail-page.component.html',
  styleUrls: ['./coach-detail-page.component.scss'],
})
export class CoachDetailPageComponent implements OnInit {
  coach?: CoachDetailVm;
  isLoading = true;
  error?: string;

  constructor(
    private readonly route: ActivatedRoute,
    // TODO: hier später dein CoachService o.ä. injizieren
  ) {
  }

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (!slug) {
      this.error = 'Coach nicht gefunden.';
      this.isLoading = false;
      return;
    }

    // TODO: Hier echten Call einbauen
    // this.coachService.getBySlug(slug).subscribe(...)
    // 👉 Bis dahin: Dummy, damit du das Layout sehen kannst
    this.coach = {
      name: 'Max Performance',
      city: 'Münster',
      tagline: 'Hyrox & Functional Coaching für ambitionierte Athleten',
      sports: ['Hyrox', 'Functional Fitness'],
      specializations: ['Leistung steigern', 'Fettabbau', 'Wettkampfvorbereitung'],
      remoteAvailable: true,
      inPersonAvailable: true,
      priceFrom: 149,
      priceUnit: 'pro Monat',
      freeIntro: true,
      description: 'Ich helfe dir, deine Performance messbar zu steigern – ...',
      focusAreas: ['Hyrox Pro', 'Marathon Vorbereitungen', 'Strength & Conditioning'],
      methods: ['Individueller Trainingsplan', 'Wöchentliche Check-ins', 'Video-Feedback'],
      experienceYears: 6,
      certifications: ['A-Lizenz Fitnesstrainer', 'Functional Trainer', 'Hyrox Certified Coach'],

      // 🔽 neue Felder:
      primaryContactLabel: 'Coach per E-Mail kontaktieren',
      primaryContactUrl: 'mailto:max@example.com',
      otherContacts: [
        {label: 'Website', url: 'https://maxperformance-coaching.de'},
        {label: 'Instagram', url: 'https://instagram.com/maxperformance'},
      ],
      pricingNote: 'Vertrag & Bezahlung laufen direkt zwischen dir und dem Coach.',
      supportNote: 'Diese Plattform ist kostenlos & werbefrei. Du kannst das Projekt hier unterstützen.',
      supportUrl: '#', // später z.B. Ko-fi, Patreon, eigene Seite
    };

    this.isLoading = false;
  }

  onContact(): void {
    // TODO: später Modale / Kontaktformular / Link zu WhatsApp o.ä.
    console.log('Kontakt aufnehmen geklickt');
  }
}
