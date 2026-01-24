import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { combineLatest, startWith, switchMap } from 'rxjs';

import { CoachesService } from '../../api/coaches.service';
import { SportsService } from '../../api/sports.service';
import { SpecializationsService } from '../../api/specializations.service';

@Component({
  standalone: true,
  selector: 'app-coaches-list-page',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './coaches-list-page.component.html',
  styleUrl: './coaches-list-page.component.scss',
})
export class CoachesListPageComponent {
  private fb = inject(FormBuilder);
  private coachesApi = inject(CoachesService);
  private sportsApi = inject(SportsService);
  private specsApi = inject(SpecializationsService);

  sports$ = this.sportsApi.list();
  specializations$ = this.specsApi.list();

  form = this.fb.group({
    sportSlug: [''],
    specializationSlug: [''],
    remote: [false],
    inPerson: [false],
    city: [''],
    priceMax: [null as number | null],
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
      })
    )
  );

  search() {
    this.refreshTick.setValue((this.refreshTick.value ?? 0) + 1);
  }

  reset() {
    this.form.reset({
      sportSlug: '',
      specializationSlug: '',
      remote: false,
      inPerson: false,
      city: '',
      priceMax: null,
    });
    this.search();
  }
}
