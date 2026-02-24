import {CommonModule} from '@angular/common';
import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {CoachFilters} from './coach-filters.model';

type Option = { label: string; value: string };

type CoachFiltersForm = FormGroup<{
  sportSlug: FormControl<string | null>;
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
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './coach-filters.component.html',
  styleUrls: ['./coach-filters.component.scss'],
})
export class CoachFiltersComponent implements OnInit {
  private fb = inject(FormBuilder);

  @Input() sports: Option[] = [];
  @Input() initial: CoachFilters | null = null;

  @Output() search = new EventEmitter<CoachFilters>();
  @Output() reset = new EventEmitter<void>();

  readonly priceMaxLimit = 300;
  readonly distanceMaxLimit = 100;

  form: CoachFiltersForm = this.fb.group({
    sportSlug: new FormControl<string | null>(null),
    remote: new FormControl<boolean>(false, {nonNullable: true}),
    inPerson: new FormControl<boolean>(false, {nonNullable: true}),
    city: new FormControl<string>('', {nonNullable: true}),
    maxPrice: new FormControl<number | null>(null),
    distanceKm: new FormControl<number | null>(null),
    sort: new FormControl<CoachFilters['sort']>('relevance', {nonNullable: true}),
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
