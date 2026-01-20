import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachDetailPageComponent } from './coach-detail-page.component';

describe('CoachDetailPageComponent', () => {
  let component: CoachDetailPageComponent;
  let fixture: ComponentFixture<CoachDetailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoachDetailPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoachDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
