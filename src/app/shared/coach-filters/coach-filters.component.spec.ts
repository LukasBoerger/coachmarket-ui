import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachFiltersComponent } from './coach-filters.component';

describe('CoachFiltersComponent', () => {
  let component: CoachFiltersComponent;
  let fixture: ComponentFixture<CoachFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoachFiltersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoachFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
