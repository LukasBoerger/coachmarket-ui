import {Routes} from '@angular/router';
import {CoachesListPageComponent} from './pages/coaches-list-page/coaches-list-page.component';
import {CoachDetailPageComponent} from './pages/coach-detail-page/coach-detail-page.component';
import {ImpressumPageComponent} from './legal/impressum-page/impressum-page.component';
import {DatenschutzPageComponent} from './legal/datenschutz-page/datenschutz-page.component';
import {LoginPageComponent} from './pages/login-page/login-page.component';
import {RegisterPageComponent} from './pages/register-page/register-page.component';

export const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'coaches'},
  {path: 'coaches', component: CoachesListPageComponent},
  {path: 'coaches/:slug', component: CoachDetailPageComponent},
  {
    path: 'for-coaches',
    loadComponent: () =>
      import('./pages/for-coaches-page/for-coaches-page.component').then(
        (m) => m.ForCoachesPageComponent
      ),
  },
  {path: 'login', component: LoginPageComponent},
  {path: 'register', component: RegisterPageComponent},
  {path: 'impressum', component: ImpressumPageComponent},
  {path: 'datenschutz', component: DatenschutzPageComponent},
  {path: '**', redirectTo: 'coaches'},
];
