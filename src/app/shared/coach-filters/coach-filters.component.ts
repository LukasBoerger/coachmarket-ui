import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';

export interface CoachFilters {
  sportSlug: string | null;
  specializationSlug: string | null;
  remote: boolean;
  inPerson: boolean;
  city: string;
  maxPrice: number | null;
  distanceKm: number | null;
  sort: 'relevance' | 'priceAsc' | 'priceDesc' | 'nameAsc';
}

type Option = { label: string; value: string };

type CoachFiltersForm = FormGroup<{
  sportSlug: FormControl<string | null>;
  specializationSlug: FormControl<string | null>;
  remote: FormControl<boolean>;
  inPerson: FormControl<boolean>;
  city: FormControl<string>;
  maxPrice: FormControl<number | null>;
  distanceKm: FormControl<number | null>;
  sort: FormControl<CoachFilters['sort']>;
}>;

@Component({
  selector: 'app-coach-filters',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatSliderModule,
  ],
  templateUrl: './coach-filters.component.html',
  styleUrls: ['./coach-filters.component.scss'],
})
export class CoachFiltersComponent {
  private fb = inject(FormBuilder);

  @Input() sports: Option[] = [];
  @Input() specializations: Option[] = [];
  @Input() initial: CoachFilters | null = null;

  @Output() search = new EventEmitter<CoachFilters>();
  @Output() reset = new EventEmitter<void>();

  readonly priceMaxLimit = 300;
  readonly distanceMaxLimit = 100;

  // ✅ Explizit typisiert => KEIN boolean|null, city|null, sort|null mehr
  form: CoachFiltersForm = this.fb.group({
    sportSlug: new FormControl<string | null>(null),
    specializationSlug: new FormControl<string | null>(null),

    remote: new FormControl<boolean>(false, { nonNullable: true }),
    inPerson: new FormControl<boolean>(false, { nonNullable: true }),

    city: new FormControl<string>('', { nonNullable: true }),

    maxPrice: new FormControl<number | null>(null),
    distanceKm: new FormControl<number | null>(null),

    sort: new FormControl<CoachFilters['sort']>('relevance', { nonNullable: true }),
  });

  ngOnInit() {
    if (this.initial) {
      this.form.patchValue(this.initial);
    }
  }

  onSearch() {
    const v = this.form.getRawValue();

    this.search.emit({
      sportSlug: v.sportSlug,
      specializationSlug: v.specializationSlug,
      remote: v.remote,
      inPerson: v.inPerson,
      city: v.city.trim(),
      maxPrice: v.maxPrice,
      distanceKm: v.distanceKm,
      sort: v.sort,
    });
  }

  onReset() {
    this.form.reset({
      sportSlug: null,
      specializationSlug: null,
      remote: false,
      inPerson: false,
      city: '',
      maxPrice: null,
      distanceKm: null,
      sort: 'relevance',
    });

    this.reset.emit();
  }
}
