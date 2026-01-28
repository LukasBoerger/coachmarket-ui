import {CommonModule} from '@angular/common';
import {Component, inject} from '@angular/core';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {combineLatest, map, shareReplay, startWith, switchMap} from 'rxjs';

import {CoachesService} from '../../api/coaches.service';
import {SportsService} from '../../api/sports.service';
import {SpecializationsService} from '../../api/specializations.service';
import {CoachFiltersComponent} from '../../shared/coach-filters/coach-filters.component';

import {CoachCardComponent} from '../../shared/coach-card/coach-card.component';
import {CoachCardVm} from '../../shared/coach-card/coach-card.model';

type Option = { label: string; value: string };

@Component({
  standalone: true,
  selector: 'app-coaches-list-page',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    CoachFiltersComponent,
    CoachCardComponent,
  ],
  templateUrl: './coaches-list-page.component.html',
  styleUrl: './coaches-list-page.component.scss',
})
export class CoachesListPageComponent {
  private fb = inject(FormBuilder);
  private coachesApi = inject(CoachesService);
  private sportsApi = inject(SportsService);
  private specsApi = inject(SpecializationsService);

  // Rohdaten
  sports$ = this.sportsApi.list().pipe(shareReplay(1));
  specializations$ = this.specsApi.list().pipe(shareReplay(1));

  // Optionen für Filter-Component
  sportOptions$ = this.sports$.pipe(
    map((sports) => sports.map((s: any) => ({label: s.name, value: s.slug}) as Option))
  );

  specializationOptions$ = this.specializations$.pipe(
    map((specs) => specs.map((sp: any) => ({label: sp.name, value: sp.slug}) as Option))
  );

  // Page-Form bleibt Single Source of Truth
  form = this.fb.group({
    sportSlug: [''],
    specializationSlug: [''],
    remote: [false],
    inPerson: [false],
    city: [''],
    priceMax: [null as number | null],
    distanceKm: [null as number | null],
    sort: ['relevance' as 'relevance' | 'priceAsc' | 'priceDesc' | 'nameAsc'],
  });

  private refreshTick = this.fb.control(0);

  // 👉 jetzt Observable von CoachCardVm[]
  coaches$ = combineLatest([
    this.form.valueChanges.pipe(startWith(this.form.getRawValue())),
    this.refreshTick.valueChanges.pipe(startWith(0)),
  ]).pipe(
    switchMap(([value]) =>
      this.coachesApi.search({
        sportSlug: value.sportSlug || null,
        specializationSlug: value.specializationSlug || null,
        remote: value.remote ? true : null,
        inPerson: value.inPerson ? true : null,
        city: value.city?.trim() || null,
        priceMax: value.priceMax ?? null,
        // distanceKm / sort kannst du ans Backend hängen, sobald es unterstützt wird
      })
    ),
    map((dtos: any[]) => dtos.map((dto) => this.mapToCoachCardVm(dto)))
  );

  // ✅ Wird von der Filter-Component aufgerufen
  onSearch(filters: {
    sportSlug: string | null;
    specializationSlug: string | null;
    remote: boolean;
    inPerson: boolean;
    city: string;
    maxPrice: number | null;
    distanceKm: number | null;
    sort: 'relevance' | 'priceAsc' | 'priceDesc' | 'nameAsc';
  }) {
    this.form.patchValue({
      sportSlug: filters.sportSlug ?? '',
      specializationSlug: filters.specializationSlug ?? '',
      remote: filters.remote,
      inPerson: filters.inPerson,
      city: filters.city ?? '',
      priceMax: filters.maxPrice ?? null,
      distanceKm: filters.distanceKm ?? null,
      sort: filters.sort,
    });

    this.search();
  }

  // ✅ Reset aus Filter-Component
  onReset() {
    this.form.reset({
      sportSlug: '',
      specializationSlug: '',
      remote: false,
      inPerson: false,
      city: '',
      priceMax: null,
      distanceKm: null,
      sort: 'relevance',
    });
    this.search();
  }

  search() {
    this.refreshTick.setValue((this.refreshTick.value ?? 0) + 1);
  }

  // 🔁 Mapping Backend → Card-ViewModel
  private mapToCoachCardVm(dto: any): CoachCardVm {
    return {
      slug: dto.slug,

      name: dto.displayName ?? dto.name ?? '',
      city: dto.city ?? '',
      tagline: dto.tagline ?? dto.shortDescription ?? '',

      avatarUrl: dto.avatarUrl ?? null,

      sports: dto.sports ?? [],
      specializations: dto.specializations ?? [],

      remoteAvailable: !!dto.remoteAvailable,
      inPersonAvailable: !!dto.inPersonAvailable,

      priceFrom:
        dto.priceMin !== null && dto.priceMin !== undefined
          ? dto.priceMin
          : undefined,
      priceUnit: dto.currency ?? undefined,
    };
  }
}
