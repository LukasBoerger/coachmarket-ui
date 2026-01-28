import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForCoachesPageComponent } from './for-coaches-page.component';

describe('ForCoachesPageComponent', () => {
  let component: ForCoachesPageComponent;
  let fixture: ComponentFixture<ForCoachesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForCoachesPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForCoachesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
