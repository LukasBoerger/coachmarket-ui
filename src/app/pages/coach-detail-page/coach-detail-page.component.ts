import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { switchMap } from 'rxjs';

import { CoachesService } from '../../api/coaches.service';

@Component({
  standalone: true,
  selector: 'app-coach-detail-page',
  imports: [CommonModule, RouterModule],
  templateUrl: './coach-detail-page.component.html',
  styleUrl: './coach-detail-page.component.scss',
})
export class CoachDetailPageComponent {
  private route = inject(ActivatedRoute);
  private api = inject(CoachesService);

  coach$ = this.route.paramMap.pipe(
    switchMap((params) => this.api.bySlug(params.get('slug')!))
  );
}
