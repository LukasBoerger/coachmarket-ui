import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCoachProfilePageComponent } from './my-coach-profile-page.component';

describe('MyCoachProfilePageComponent', () => {
  let component: MyCoachProfilePageComponent;
  let fixture: ComponentFixture<MyCoachProfilePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyCoachProfilePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyCoachProfilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
