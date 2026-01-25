import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { combineLatest, map, startWith, switchMap, shareReplay } from 'rxjs';

import { CoachesService } from '../../api/coaches.service';
import { SportsService } from '../../api/sports.service';
import { SpecializationsService } from '../../api/specializations.service';
import { CoachFiltersComponent } from '../../shared/coach-filters/coach-filters.component';

// Falls du das Model nutzt (empfohlen):
// import { CoachFilters } from '../../shared/coach-filters/coach-filters.model';

type Option = { label: string; value: string };

@Component({
  standalone: true,
  selector: 'app-coaches-list-page',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, CoachFiltersComponent],
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
    map((sports) => sports.map((s: any) => ({ label: s.name, value: s.slug }) as Option))
  );

  specializationOptions$ = this.specializations$.pipe(
    map((specs) => specs.map((sp: any) => ({ label: sp.name, value: sp.slug }) as Option))
  );

  // Page-Form bleibt als "Single Source of Truth"
  form = this.fb.group({
    sportSlug: [''],
    specializationSlug: [''],
    remote: [false],
    inPerson: [false],
    city: [''],
    priceMax: [null as number | null],

    // Optional schon vorbereiten, falls du es im Filter-UI einbaust:
    distanceKm: [null as number | null],
    sort: ['relevance' as 'relevance' | 'priceAsc' | 'priceDesc' | 'nameAsc'],
  });

  private refreshTick = this.fb.control(0);

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
        // distanceKm: value.distanceKm ?? null,
        // sort: value.sort ?? null,
      })
    )
  );

  // ✅ Wird von der Filter-Component aufgerufen
  onSearch(filters: {
    sportSlug: string | null;
    specializationSlug: string | null;
    remote: boolean;
    inPerson: boolean;
    city: string;
    maxPrice: number | null;     // aus Filter-Component
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
}
