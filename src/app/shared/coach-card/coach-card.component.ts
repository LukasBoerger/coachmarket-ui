import {CommonModule} from '@angular/common';
import {Component, Input} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CoachCardVm} from './coach-card.model';

@Component({
  selector: 'app-coach-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './coach-card.component.html',
  styleUrls: ['./coach-card.component.scss'],
})
export class CoachCardComponent {
  @Input({required: true}) coach!: CoachCardVm;

  onCardClick(): void {
    // nur Navigation via RouterLink im Template, hier optional
  }
}
