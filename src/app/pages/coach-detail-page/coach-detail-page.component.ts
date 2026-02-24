import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {CoachesService} from '../../api/coaches.service';
import {CoachDto} from '../../api/models';
import {formatPricingModel} from '../../shared/utils/pricing.utils';

@Component({
  selector: 'app-coach-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './coach-detail-page.component.html',
  styleUrls: ['./coach-detail-page.component.scss'],
})
export class CoachDetailPageComponent implements OnInit {
  coach?: CoachDto;
  isLoading = true;
  error?: string;
  readonly formatPricingModel = formatPricingModel;
  private route = inject(ActivatedRoute);
  private coachesApi = inject(CoachesService);

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (!slug) {
      this.error = 'Coach nicht gefunden.';
      this.isLoading = false;
      return;
    }

    this.coachesApi.bySlug(slug).subscribe({
      next: (dto) => {
        this.coach = dto;
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Coach konnte nicht geladen werden.';
        this.isLoading = false;
      },
    });
  }
}
