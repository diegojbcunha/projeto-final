import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseModuleViewerComponent } from './course-module-viewer.component';

describe('CourseModuleViewerComponent', () => {
  let component: CourseModuleViewerComponent;
  let fixture: ComponentFixture<CourseModuleViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseModuleViewerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseModuleViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
