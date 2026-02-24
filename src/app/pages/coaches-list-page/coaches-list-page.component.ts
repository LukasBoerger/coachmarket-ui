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
import {CoachDto} from '../../api/models';
import {formatPricingModel} from '../../shared/utils/pricing.utils';

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
  private sportsApi = inject(SportsService);
  private coachesApi = inject(CoachesService);
  private specsApi = inject(SpecializationsService);
  private refreshTick = this.fb.control(0);

  sports$ = this.sportsApi.list().pipe(shareReplay(1));
  specializations$ = this.specsApi.list().pipe(shareReplay(1));

  sportOptions$ = this.sports$.pipe(
    map((sports) => sports.map((s: any) => ({label: s.name, value: s.slug}) as Option))
  );
  specializationOptions$ = this.specializations$.pipe(
    map((specs) => specs.map((sp: any) => ({label: sp.name, value: sp.slug}) as Option))
  );
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
      })
    ),
    map((dtos: CoachDto[]) => dtos.map((dto) => this.mapToCoachCardVm(dto)))
  );

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

  private mapToCoachCardVm(dto: CoachDto): CoachCardVm {
    return {
      slug: dto.slug,
      name: dto.displayName,
      city: dto.city ?? '',
      tagline: dto.bio?.substring(0, 100) ?? '',
      avatarUrl: dto.avatarUrl ?? undefined,
      sports: dto.sports?.map(s => s.name) ?? [],
      specializations: dto.specializations?.map(s => s.name) ?? [],
      remoteAvailable: dto.remoteAvailable,
      inPersonAvailable: dto.inPersonAvailable,
      priceFrom: dto.priceMin ?? undefined,
      priceUnit: formatPricingModel(dto.pricingModel) ?? undefined,

    };
  }
}
