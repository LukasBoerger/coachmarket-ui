import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {CoachesService} from '../../api/coaches.service';
import {CoachCardVm} from '../../shared/coach-card/coach-card.model';
import {formatPricingModel} from '../../shared/utils/pricing.utils';
import {CoachCardComponent} from '../../shared/coach-card/coach-card.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, CoachCardComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent implements OnInit {
  private coachesApi = inject(CoachesService);
  private router = inject(Router);

  searchQuery = '';
  featuredCoaches: CoachCardVm[] = [];

  sports = [
    {label: 'Laufen', slug: 'laufen', icon: '🏃'},
    {label: 'Fitness', slug: 'fitness', icon: '💪'},
    {label: 'Hyrox', slug: 'crossfit', icon: '⚡'},
    {label: 'Bodybuilding', slug: 'bodybuilding', icon: '🏋️'},
    {label: 'Yoga', slug: 'yoga', icon: '🧘'},
    {label: 'Radsport', slug: 'radsport', icon: '🚴'},
    {label: 'Schwimmen', slug: 'schwimmen', icon: '🏊'},
    {label: 'Kampfsport', slug: 'kampfsport', icon: '🥊'},
  ];

  steps = [
    {num: '1', title: 'Coach finden', desc: 'Durchsuche unsere Coaches nach Sportart, Ziel oder Standort.'},
    {num: '2', title: 'Profil ansehen', desc: 'Lerne den Coach kennen – Erfahrung, Spezialisierung und Preise.'},
    {num: '3', title: 'Kontakt aufnehmen', desc: 'Schreib direkt an den Coach und starte deine Zusammenarbeit.'},
  ];

  ngOnInit() {
    this.coachesApi.search({}).subscribe(coaches => {
      this.featuredCoaches = coaches.slice(0, 3).map(dto => ({
        slug: dto.slug,
        name: dto.displayName,
        avatarUrl: dto.avatarUrl ?? undefined,
        city: dto.city ?? '',
        remoteAvailable: dto.remoteAvailable,
        inPersonAvailable: dto.inPersonAvailable,
        tagline: dto.bio ?? undefined,
        priceFrom: dto.priceMin ? Number(dto.priceMin) : undefined,
        priceUnit: formatPricingModel(dto.pricingModel) ?? undefined,
        sports: (dto.sports ?? []).slice(0, 1).map(s => s.name),
        specializations: (dto.specializations ?? []).slice(0, 2).map(s => s.name),
      }));
    });
  }

  search() {
    this.router.navigate(['/coaches'], {
      queryParams: this.searchQuery ? {city: this.searchQuery} : {}
    });
  }

  goToSport(slug: string) {
    this.router.navigate(['/coaches'], {queryParams: {sportSlug: slug}});
  }
}
