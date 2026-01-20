import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { SpecializationDto } from './models';

@Injectable({ providedIn: 'root' })
export class SpecializationsService {
  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<SpecializationDto[]>(`${environment.apiBaseUrl}/api/specializations`);
  }
}
