import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormArray, FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {MyCoachProfileDto} from '../../api/my-coach-profile.dto';
import {SportsService} from '../../api/sports.service';
import {SpecializationsService} from '../../api/specializations.service';
import {shareReplay} from 'rxjs';

@Component({
  selector: 'app-my-coach-profile-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule],
  templateUrl: './my-coach-profile-page.component.html',
  styleUrl: './my-coach-profile-page.component.scss',
})
export class MyCoachProfilePageComponent implements OnInit {
  isLoading = true;
  isSaving = false;
  isPublishing = false;
  successMsg = '';
  errorMsg = '';
  currentStatus = 'DRAFT';
  currentSlug = '';
  avatarUrl = '';
  avatarInput = '';

  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private sportsApi = inject(SportsService);
  private specsApi = inject(SpecializationsService);
  private apiUrl = `${environment.apiBaseUrl}/api/my/coach-profile`;

  sports$ = this.sportsApi.list().pipe(shareReplay(1));
  specializations$ = this.specsApi.list().pipe(shareReplay(1));

  readonly platforms = ['INSTAGRAM', 'FACEBOOK', 'TIKTOK', 'YOUTUBE', 'X', 'LINKEDIN', 'WEBSITE'];

  form = this.fb.group({
    displayName: ['', Validators.required],
    bio: [''],
    websiteUrl: [''],
    city: [''],
    region: [''],
    country: ['DE'],
    remoteAvailable: [true],
    inPersonAvailable: [false],
    priceMin: [null as number | null],
    priceMax: [null as number | null],
    pricingModel: ['MONTHLY'],
    currency: ['EUR'],
    sportSlugs: [[] as string[]],
    specializationSlugs: [[] as string[]],
    socialLinks: this.fb.array([]),
  });

  get socialLinks(): FormArray {
    return this.form.get('socialLinks') as FormArray;
  }

  addSocialLink() {
    this.socialLinks.push(this.fb.group({
      platform: ['INSTAGRAM'],
      url: ['', Validators.required],
    }));
  }

  removeSocialLink(index: number) {
    this.socialLinks.removeAt(index);
  }

  ngOnInit() {
    this.http.get<MyCoachProfileDto>(this.apiUrl).subscribe({
      next: (dto) => {
        if (dto) {
          this.form.patchValue({
            displayName: dto.displayName,
            bio: dto.bio ?? '',
            websiteUrl: dto.websiteUrl ?? '',
            city: dto.city ?? '',
            region: dto.region ?? '',
            country: dto.country ?? 'DE',
            remoteAvailable: dto.remoteAvailable,
            inPersonAvailable: dto.inPersonAvailable,
            priceMin: dto.priceMin ?? null,
            priceMax: dto.priceMax ?? null,
            pricingModel: dto.pricingModel ?? 'MONTHLY',
            currency: dto.currency ?? 'EUR',
            sportSlugs: dto.sportSlugs ?? [],
            specializationSlugs: dto.specializationSlugs ?? [],
          });
          this.currentStatus = dto.status ?? 'DRAFT';
          this.currentSlug = dto.slug ?? '';
          this.avatarUrl = dto.avatarUrl ?? '';


          // Social Links laden
          this.socialLinks.clear();
          (dto.socialLinks ?? []).forEach(link => {
            this.socialLinks.push(this.fb.group({
              platform: [link.platform],
              url: [link.url, Validators.required],
            }));
          });
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  toggleSport(slug: string) {
    const current = this.form.value.sportSlugs ?? [];
    const updated = current.includes(slug)
      ? current.filter(s => s !== slug)
      : [...current, slug];
    this.form.patchValue({sportSlugs: updated});
  }

  toggleSpec(slug: string) {
    const current = this.form.value.specializationSlugs ?? [];
    const updated = current.includes(slug)
      ? current.filter(s => s !== slug)
      : [...current, slug];
    this.form.patchValue({specializationSlugs: updated});
  }

  hasSport(slug: string): boolean {
    return (this.form.value.sportSlugs ?? []).includes(slug);
  }

  hasSpec(slug: string): boolean {
    return (this.form.value.specializationSlugs ?? []).includes(slug);
  }

  save() {
    if (this.form.invalid) return;
    this.isSaving = true;
    this.successMsg = '';
    this.errorMsg = '';

    this.http.put<MyCoachProfileDto>(this.apiUrl, this.form.value).subscribe({
      next: (dto) => {
        this.currentStatus = dto.status ?? 'DRAFT';
        this.isSaving = false;
        this.successMsg = 'Profil gespeichert!';
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: () => {
        this.isSaving = false;
        this.errorMsg = 'Speichern fehlgeschlagen.';
      }
    });
  }

  publish() {
    this.isPublishing = true;
    this.http.post<MyCoachProfileDto>(`${this.apiUrl}/publish`, {}).subscribe({
      next: (dto) => {
        this.currentStatus = dto.status ?? 'PUBLISHED';
        this.currentSlug = dto.slug ?? this.currentSlug;
        this.isPublishing = false;
        this.successMsg = 'Profil ist jetzt öffentlich sichtbar!';
        setTimeout(() => this.successMsg = '', 4000);
      },
      error: () => {
        this.isPublishing = false;
        this.errorMsg = 'Veröffentlichen fehlgeschlagen.';
      }
    });
  }

  setAvatar() {
    if (!this.avatarInput.trim()) return;
    this.http.post(`${this.apiUrl}/avatar`, {url: this.avatarInput}).subscribe({
      next: () => {
        this.avatarUrl = this.avatarInput;
        this.avatarInput = '';
        this.successMsg = 'Profilbild gespeichert!';
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: () => {
        this.errorMsg = 'Profilbild konnte nicht gespeichert werden.';
      }
    });
  }

  unpublish() {
    this.isPublishing = true;
    this.http.post<MyCoachProfileDto>(`${this.apiUrl}/unpublish`, {}).subscribe({
      next: (dto) => {
        this.currentStatus = dto.status ?? 'DRAFT';
        this.isPublishing = false;
        this.successMsg = 'Profil wurde auf Entwurf gesetzt.';
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: () => {
        this.isPublishing = false;
        this.errorMsg = 'Fehler beim Zurücksetzen.';
      }
    });
  }
}
