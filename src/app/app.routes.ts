import { Routes } from '@angular/router';
import {CoachesListPageComponent} from './pages/coaches-list-page/coaches-list-page.component';
import {CoachDetailPageComponent} from './pages/coach-detail-page/coach-detail-page.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'coaches' },
  { path: 'coaches', component: CoachesListPageComponent },
  { path: 'coaches/:slug', component: CoachDetailPageComponent },
  { path: '**', redirectTo: 'coaches' },
];
