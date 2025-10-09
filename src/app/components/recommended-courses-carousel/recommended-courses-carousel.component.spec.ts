import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendedCoursesCarouselComponent } from './recommended-courses-carousel.component';

describe('RecommendedCoursesCarouselComponent', () => {
  let component: RecommendedCoursesCarouselComponent;
  let fixture: ComponentFixture<RecommendedCoursesCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecommendedCoursesCarouselComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecommendedCoursesCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
