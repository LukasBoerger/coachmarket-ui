import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { SportDto } from './models';

@Injectable({ providedIn: 'root' })
export class SportsService {
  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<SportDto[]>(`${environment.apiBaseUrl}/api/sports`);
  }
}
