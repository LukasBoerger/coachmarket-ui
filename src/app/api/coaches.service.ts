import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { CoachDto } from './models';

export type CoachSearch = {
  sportSlug?: string | null;
  specializationSlug?: string | null;
  remote?: boolean | null;
  inPerson?: boolean | null;
  city?: string | null;
  priceMax?: number | null;
};

@Injectable({ providedIn: 'root' })
export class CoachesService {
  constructor(private http: HttpClient) {}

  search(query: CoachSearch) {
    let params = new HttpParams();
    for (const [key, value] of Object.entries(query)) {
      if (value === null || value === undefined || value === '') continue;
      params = params.set(key, String(value));
    }
    return this.http.get<CoachDto[]>(`${environment.apiBaseUrl}/api/coaches`, { params });
  }

  bySlug(slug: string) {
    return this.http.get<CoachDto>(`${environment.apiBaseUrl}/api/coaches/${slug}`);
  }
}
