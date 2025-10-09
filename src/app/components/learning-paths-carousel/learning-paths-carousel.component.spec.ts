import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearningPathsCarouselComponent } from './learning-paths-carousel.component';

describe('LearningPathsCarouselComponent', () => {
  let component: LearningPathsCarouselComponent;
  let fixture: ComponentFixture<LearningPathsCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LearningPathsCarouselComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LearningPathsCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
