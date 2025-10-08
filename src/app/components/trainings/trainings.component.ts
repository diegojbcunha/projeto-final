import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { Course, Training, TrainingService } from '../../services/training.service';

@Component({
  selector: 'app-trainings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trainings.component.html',
  styleUrls: ['./trainings.component.css']
})
export class TrainingsComponent {
  currentUser: any = null;
  isAdmin = false;
  themes: string[] = [];
  courses: { [theme: string]: Course[] } = {};
  showForm = signal(false);
  editMode = signal(false);
  currentCourse!: Course;

  constructor(private router: Router, private authService: AuthService, private service: TrainingService) {
    // Verificar se usuário está logado
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    // Obter dados do usuário atual
    this.currentUser = this.authService.getCurrentUser();
    this.isAdmin = this.authService.isAdmin();
    this.themes = this.service.themes;
    this.updateCourses();
    this.currentCourse = this.createEmptyCourse();
  }

  getCoursesForTheme(theme: string): Course[] {
    return this.courses[theme] || [];
  }

  scrollLeft(theme: string) {
    const container = document.querySelector(`.carousel-container.${theme.replace(' ', '-')}`) as HTMLElement;
    if (container) {
      container.scrollBy({ left: -300, behavior: 'smooth' });
    }
  }

  scrollRight(theme: string) {
    const container = document.querySelector(`.carousel-container.${theme.replace(' ', '-')}`) as HTMLElement;
    if (container) {
      container.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }

  trackById(index: number, item: Course): number {
    return item.id;
  }

  updateCourses() {
    this.themes.forEach(theme => {
      this.courses[theme] = this.service.getCoursesByTheme(theme);
    });
  }

  createEmptyCourse(): Course {
    return {
      id: Date.now(),
      title: '',
      description: '',
      duration: 1,
      modules: 1,
      image: '',
      status: 'Active',
      completionRate: 0,
      targetAudience: '',
      theme: 'Safety'
    };
  }

  addNew() {
    this.showForm.set(true);
    this.editMode.set(false);
    this.currentCourse = this.createEmptyCourse();
  }

  editCourse(course: Course) {
    this.showForm.set(true);
    this.editMode.set(true);
    this.currentCourse = structuredClone(course);
  }

  deleteCourse(id: number) {
    this.service.deleteCourse(id);
    this.updateCourses();
  }

  saveCourse() {
    if (this.editMode()) {
      this.service.updateCourse(this.currentCourse);
    } else {
      this.service.addCourse(this.currentCourse);
    }
    this.updateCourses();
    this.cancel();
  }

  cancel() {
    this.showForm.set(false);
    this.currentCourse = this.createEmptyCourse();
  }
}
