import { Component, signal, HostListener } from '@angular/core';
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

  paths: LearningPath[] = [];
  allCourses: Course[] = [];
  currentPath!: LearningPath;

  constructor(private service: TrainingService, private authService: AuthService) {
    this.paths = service.getPaths();
    this.allCourses = service.getCourses();
    this.isAdmin = authService.isAdmin();
    this.currentPath = this.createEmptyPath();
  }

  createEmptyPath(): LearningPath {
    return { id: Date.now(), title: '', description: '', courses: [], progress: 0, status: 'Not Started' };
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
    this.service.deletePath(id);
    this.paths = this.service.getPaths();
  }

  savePath(form: NgForm) {
    if (!form.valid) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      if (this.editMode()) {
        this.service.updatePath(this.currentPath);
      } else {
        this.service.addPath(this.currentPath);
      }
      this.paths = this.service.getPaths();
      alert('Path saved successfully!');
      this.cancel();
    } catch (error) {
      alert('Error saving path. Please try again.');
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
      const course = this.allCourses.find(c => c.id === id);
      if (course) this.currentPath.courses.push(course);
    }
  }

  isCourseSelected(id: number): boolean {
    return this.currentPath.courses.some(c => c.id === id);
  }

  trackById(index: number, item: any): number {
    return item.id;
  }

  scrollCarousel(event: Event, direction: 'left' | 'right') {
    const button = event.target as HTMLElement;
    const carousel = button.closest('.courses-carousel')?.querySelector('.carousel-container') as HTMLElement;
    if (carousel) {
      const scrollAmount = carousel.clientWidth * 0.8;
      carousel.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
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
