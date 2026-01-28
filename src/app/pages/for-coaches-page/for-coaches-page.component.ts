import {CommonModule} from '@angular/common';
import {Component, inject} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {map, shareReplay} from 'rxjs';

import {SportsService} from '../../api/sports.service';
import {SpecializationsService} from '../../api/specializations.service';

type Option = { label: string; value: string };

@Component({
  selector: 'app-for-coaches-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './for-coaches-page.component.html',
  styleUrls: ['./for-coaches-page.component.scss'],
})
export class ForCoachesPageComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private sportsApi = inject(SportsService);
  private specsApi = inject(SpecializationsService);

  // Optionen aus deinem Backend holen (gleiche wie bei der Suche)
  sportsOptions$ = this.sportsApi.list().pipe(
    map((sports: any[]) => sports.map(s => ({label: s.name, value: s.slug}) as Option)),
    shareReplay(1),
  );

  specializationOptions$ = this.specsApi.list().pipe(
    map((specs: any[]) => specs.map(sp => ({label: sp.name, value: sp.slug}) as Option)),
    shareReplay(1),
  );

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],

    sports: this.fb.control<string[]>([], {nonNullable: true}),
    specializations: this.fb.control<string[]>([], {nonNullable: true}),

    city: [''],
    remote: [false],
    inPerson: [false],
    remoteOnly: [false],

    priceFrom: [null as number | null],
    currency: ['EUR'],

    websiteUrl: [''],
    instagramUrl: [''],
    bookingUrl: [''],
    donationUrl: [''],

    tagline: [''],
    message: [''],
  });

  submitting = false;
  submitted = false;
  error: string | null = null;

  get nameCtrl() {
    return this.form.controls.name;
  }

  get emailCtrl() {
    return this.form.controls.email;
  }

  /** Checkbox für Mehrfachauswahl (Sport / Ziele) toggeln */
  onToggleMulti(
    controlName: 'sports' | 'specializations',
    value: string,
    checked: boolean,
  ) {
    const ctrl = this.form.controls[controlName];
    const current = ctrl.value ?? [];
    if (checked && !current.includes(value)) {
      ctrl.setValue([...current, value]);
    } else if (!checked) {
      ctrl.setValue(current.filter(v => v !== value));
    }
  }

  /** Remote-Only -> Remote true, Vor Ort optional false + City deaktivieren im Template */
  onRemoteOnlyChange(checked: boolean) {
    this.form.controls.remoteOnly.setValue(checked);
    if (checked) {
      this.form.controls.remote.setValue(true);
      this.form.controls.inPerson.setValue(false);
      this.form.controls.city.setValue('');
    }
  }

  onSubmit() {
    if (this.form.invalid || this.submitting) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.error = null;

    const raw = this.form.getRawValue();

    const payload = {
      name: raw.name,
      email: raw.email,
      sports: raw.sports,
      specializations: raw.specializations,
      city: raw.remoteOnly ? null : (raw.city || null),
      remote: raw.remote,
      inPerson: raw.inPerson,
      remoteOnly: raw.remoteOnly,
      priceFrom: raw.priceFrom,
      currency: raw.currency,
      links: {
        website: raw.websiteUrl || null,
        instagram: raw.instagramUrl || null,
        booking: raw.bookingUrl || null,
        donation: raw.donationUrl || null,
      },
      tagline: raw.tagline || null,
      message: raw.message || null,
    };

    // TODO: Backend-Endpoint anlegen (DTO anpassen, falls nötig)
    this.http.post('/api/coach-requests', payload).subscribe({
      next: () => {
        this.submitting = false;
        this.submitted = true;
        this.form.reset({
          sports: [],
          specializations: [],
          remote: false,
          inPerson: false,
          remoteOnly: false,
          priceFrom: null,
          currency: 'EUR',
        });
      },
      error: (err) => {
        console.error('Coach request failed', err);
        this.submitting = false;
        this.error = 'Etwas ist schiefgelaufen. Bitte versuch es später erneut.';
      },
    });
  }
}
