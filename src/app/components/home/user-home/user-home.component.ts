import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TrainingService } from '../../../services/training.service';
import { Course, LearningPath } from '../../../services/training.service';
import { AuthService } from '../../../services/auth.service';
import { RecommendedCoursesCarouselComponent } from '../../recommended-courses-carousel/recommended-courses-carousel.component';
import { LearningPathCardComponent } from '../../learning-path-card/learning-path-card.component';

export interface CategorizedCourses {
  category: string;
  courses: Course[];
}

@Component({
  selector: 'app-user-home',
  standalone: true,
  imports: [CommonModule, RecommendedCoursesCarouselComponent, LearningPathCardComponent],
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent implements OnInit {
  continueCourses: Course[] = [];
  recommendedCourses: Course[] = [];
  categorizedCourses: CategorizedCourses[] = [];
  hasStartedCourses: boolean = false;
  onboardingPath: LearningPath | undefined;

  categories = ['Soft Skills', 'Leadership', 'Safety', 'Compliance', 'Technical'];

  constructor(
    private trainingService: TrainingService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadCourses();
    this.loadOnboardingPath();
  }

  /**
   * Load courses for user view
   */
  loadCourses() {
    const allCourses = this.trainingService.courses();
    
    // Verificar se o usuário tem algum progresso registrado
    this.hasStartedCourses = allCourses.some((course: Course) => course.completionRate > 0);
    
    // Filter courses with progress for "Continue Learning" and limit to 3
    // Apenas mostrar se o usuário já iniciou algum curso
    if (this.hasStartedCourses) {
      this.continueCourses = allCourses
        .filter((course: Course) => course.completionRate > 0 && course.completionRate < 100)
        .slice(0, 3); // Limit to 3 courses
    } else {
      this.continueCourses = [];
    }
    
    // Get recommended courses (not started yet)
    this.recommendedCourses = allCourses.filter((course: Course) => course.completionRate === 0);
    
    // Group courses by category
    this.categorizedCourses = this.categories.map(category => ({
      category,
      courses: this.recommendedCourses.filter((course: Course) => course.theme === category)
    }));
  }

  /**
   * Load onboarding path for new users
   */
  loadOnboardingPath() {
    const allPaths = this.trainingService.paths();
    this.onboardingPath = allPaths.find(path => path.title === 'Onboarding Path');
  }

  /**
   * Navigate to learning path viewer with selected path
   */
  onPathClick(path: LearningPath) {
    // Navigate to learning paths page
    this.router.navigate(['/learning-paths']);
  }

  /**
   * Navigate to course viewer with selected course
   * Updates course status to started if it's a new course
   */
  onCourseClick(course: Course) {
    // If this is a new course (0% completion), mark it as started (1% completion)
    if (course.completionRate === 0) {
      course.completionRate = 1;
      this.trainingService.courses.update(courses => 
        courses.map(c => c.id === course.id ? course : c)
      );
      
      // Reload courses to update the UI
      this.loadCourses();
    }
    
    this.router.navigate(['/course-viewer'], { queryParams: { courseId: course.id } });
  }

  /**
   * Scroll carousel left
   */
  scrollLeft(categoryIndex: number): void {
    const carousel = this.getCarouselContainer(categoryIndex);
    if (carousel) {
      carousel.scrollBy({ left: -320, behavior: 'smooth' });
    }
  }

  /**
   * Scroll carousel right
   */
  scrollRight(categoryIndex: number): void {
    const carousel = this.getCarouselContainer(categoryIndex);
    if (carousel) {
      carousel.scrollBy({ left: 320, behavior: 'smooth' });
    }
  }

  /**
   * Check if carousel can scroll left
   */
  canScrollLeft(categoryIndex: number): boolean {
    const carousel = this.getCarouselContainer(categoryIndex);
    return carousel ? carousel.scrollLeft > 0 : false;
  }

  /**
   * Check if carousel can scroll right
   */
  canScrollRight(categoryIndex: number): boolean {
    const carousel = this.getCarouselContainer(categoryIndex);
    if (!carousel) return false;
    return carousel.scrollLeft < (carousel.scrollWidth - carousel.clientWidth);
  }

  /**
   * Get carousel container element
   */
  private getCarouselContainer(categoryIndex: number): HTMLElement | null {
    const section = document.querySelectorAll('.carousel-section')[categoryIndex];
    return section?.querySelector('.carousel-container') as HTMLElement;
  }

  /**
   * Check if a course is new (created within last 7 days)
   */
  isNewCourse(course: Course): boolean {
    // In a real app, this would check the course creation date
    // For now, we'll simulate with a simple condition
    return course.id > 20; // Simulate new courses
  }

  /**
   * Check if a course is popular (high enrollment or completion)
   */
  isPopularCourse(course: Course): boolean {
    // In a real app, this would check enrollment or completion data
    // For now, we'll simulate with a simple condition
    return course.completionRate > 70; // Simulate popular courses
  }
}