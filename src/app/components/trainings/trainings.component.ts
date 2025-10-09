import { Component, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule, NgForm } from '@angular/forms';
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
    if (!this.isAdmin) return; // Only admin can add new courses
    this.showForm.set(true);
    this.editMode.set(false);
    this.currentCourse = this.createEmptyCourse();
  }

  editCourse(course: Course) {
    if (!this.isAdmin) return; // Only admin can edit
    this.showForm.set(true);
    this.editMode.set(true);
    this.currentCourse = structuredClone(course);
  }

  deleteCourse(id: number) {
    if (!this.isAdmin) return; // Only admin can delete
    if (!confirm('Are you sure you want to delete this course?')) {
      return;
    }
    this.service.deleteCourse(id);
    this.updateCourses();
    // Show success message if needed
  }

  saveCourse(form: any) {
    // Validate required fields
    if (!this.currentCourse.title || !this.currentCourse.description ||
        !this.currentCourse.image || !this.currentCourse.targetAudience) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      if (this.editMode()) {
        this.service.updateCourse(this.currentCourse);
      } else {
        this.service.addCourse(this.currentCourse);
      }
      this.updateCourses();
      alert('Course saved successfully!');
      this.cancel();
    } catch (error) {
      alert('Error saving course. Please try again.');
    }
  }

  cancel() {
    this.showForm.set(false);
    this.currentCourse = this.createEmptyCourse();
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent) {
    if (this.showForm()) {
      this.cancel();
    }
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      // Allow default form submission behavior
    } else if (event.key === 'Escape') {
      this.cancel();
    }
    // Other keys can bubble up for normal behavior
  }

  onModalClick(event: Event) {
    // Close modal if clicked outside the form content
    if (event.target === event.currentTarget) {
      this.cancel();
    }
  }
}
