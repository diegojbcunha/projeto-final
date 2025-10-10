import { Component, signal, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { LearningPath, Course, Training, TrainingService } from '../../services/training.service';
import { LearningPathsCarouselComponent } from '../learning-paths-carousel/learning-paths-carousel.component';

@Component({
  selector: 'app-learning-paths',
  standalone: true,
  imports: [CommonModule, FormsModule, LearningPathsCarouselComponent],
  templateUrl: './learning-paths.component.html',
  styleUrls: ['./learning-paths.component.css']
})
export class LearningPathsComponent {
  isAdmin = false;
  showForm = signal(false);
  editMode = signal(false);
  isSaving = signal(false);
  toastMessage = signal('');

  paths = signal<LearningPath[]>([]);
  allCourses = signal<Course[]>([]);
  currentPath!: LearningPath;

  constructor(private service: TrainingService, private authService: AuthService) {
    this.paths.set(this.service.getPaths());
    this.allCourses.set(this.service.getCourses());
    this.isAdmin = authService.isAdmin();
    this.currentPath = this.createEmptyPath();
  }

  createEmptyPath(): LearningPath {
    return { 
      id: Date.now(), 
      title: '', 
      description: '', 
      courses: [], 
      progress: 0, 
      status: 'Not Started',
      estimatedHours: '',
      image: ''
    };
  }

  addNew() {
    if (!this.isAdmin) return; // Only admin can add new paths
    this.showForm.set(true);
    this.editMode.set(false);
    this.currentPath = this.createEmptyPath();
  }

  editPath(path: LearningPath) {
    if (!this.isAdmin) return; // Only admin can edit
    this.showForm.set(true);
    this.editMode.set(true);
    this.currentPath = structuredClone(path);
  }

  deletePath(id: number) {
    if (!this.isAdmin) return; // Only admin can delete
    if (!confirm('Are you sure you want to delete this path?')) {
      return;
    }
    this.service.deletePath(id);
    this.paths.set(this.service.getPaths());
  }

  private showToast(message: string) {
    this.toastMessage.set(message);
    setTimeout(() => this.toastMessage.set(''), 3000);
  }

  savePath(form: NgForm) {
    // Validate required fields
    if (!this.currentPath.title) {
      this.showToast('Title is required.');
      return;
    }

    this.isSaving.set(true);
    try {
      console.log('Saving path:', this.currentPath);
      // Set the selected courses before saving
      this.currentPath.courses = this.allCourses().filter(course =>
        this.currentPath.courses.some(selected => selected.id === course.id)
      );

      if (this.editMode()) {
        this.service.updatePath(this.currentPath);
      } else {
        // Add new path with a unique ID
        const newPath = { ...this.currentPath, id: Date.now() };
        this.service.addPath(newPath);
      }
      this.showToast('Path saved successfully!');
      this.cancel();
    } catch (error) {
      console.error('Error saving path:', error);
      this.showToast('Error saving path. Please try again.');
    } finally {
      this.isSaving.set(false);
    }
  }

  cancel() {
    this.showForm.set(false);
    this.currentPath = this.createEmptyPath();
  }

  toggleCourseSelection(id: number) {
    const selected = this.currentPath.courses.map(c => c.id);
    if (selected.includes(id)) {
      this.currentPath.courses = this.currentPath.courses.filter(c => c.id !== id);
    } else {
      const course = this.allCourses().find(c => c.id === id);
      if (course) this.currentPath.courses.push(course);
    }
  }

  isCourseSelected(id: number): boolean {
    return this.currentPath.courses.some(c => c.id === id);
  }

  trackById(index: number, item: any): number {
    return item.id;
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
