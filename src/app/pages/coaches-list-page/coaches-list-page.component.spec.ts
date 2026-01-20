import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachesListPageComponent } from './coaches-list-page.component';

describe('CoachesListPageComponent', () => {
  let component: CoachesListPageComponent;
  let fixture: ComponentFixture<CoachesListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoachesListPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoachesListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
