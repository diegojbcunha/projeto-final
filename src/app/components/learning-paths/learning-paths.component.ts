import { Component, signal, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { LearningPath, Course, Training, TrainingService } from '../../services/training.service';
import { LearningPathCardComponent } from '../learning-path-card/learning-path-card.component';

@Component({
  selector: 'app-learning-paths',
  standalone: true,
  imports: [CommonModule, FormsModule, LearningPathCardComponent],
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
    try {
      console.log('Attempting to save path:', this.currentPath);

      // Comprehensive validation
      if (!this.currentPath.title?.trim()) {
        this.showToast('Learning path title is required.');
        return;
      }

      if (!this.currentPath.description?.trim()) {
        this.showToast('Learning path description is required.');
        return;
      }

      if (!this.currentPath.image?.trim()) {
        this.showToast('Learning path image URL is required.');
        return;
      }

      // Check if at least one course is selected
      if (!this.currentPath.courses || this.currentPath.courses.length === 0) {
        this.showToast('Please select at least one course for this learning path.');
        return;
      }

      // Validate estimated hours
      if (!this.currentPath.estimatedHours || parseFloat(this.currentPath.estimatedHours) <= 0) {
        this.showToast('Valid estimated hours are required.');
        return;
      }

      console.log('Validation passed, proceeding with save...');

      this.isSaving.set(true);

      // Ensure the selected courses are full objects, not just IDs
      const selectedCourseIds = this.currentPath.courses.map(c => c.id);
      const fullCourses = this.allCourses().filter(course => selectedCourseIds.includes(course.id));

      // Create path data with validated courses
      const pathData = {
        ...this.currentPath,
        courses: fullCourses
      };

      let savedPath: any;

      if (this.editMode()) {
        // Update existing path
        console.log('Updating existing path with ID:', this.currentPath.id);
        this.service.updatePath(pathData);
        savedPath = pathData;
        console.log('Path updated successfully');
      } else {
        // Add new path with unique ID
        const newPath = {
          ...pathData,
          id: Date.now(),
          progress: 0,
          status: 'Not Started' as const
        };
        console.log('Adding new learning path:', newPath);
        this.service.addPath(newPath);
        savedPath = newPath;
        console.log('New path added successfully with ID:', savedPath.id);
      }

      // Update UI with latest paths
      console.log('Updating paths list...');
      this.paths.set(this.service.getPaths());

      // Success feedback
      const operation = this.editMode() ? 'updated' : 'created';
      this.showToast(`Learning path ${operation} successfully!`);

      // Reset form and close modal
      console.log('Closing form and resetting state...');
      this.cancel();

    } catch (error: any) {
      console.error('Error saving learning path:', error);

      // More detailed error message
      const errorMessage = error?.message ? `Error: ${error.message}` : 'An unexpected error occurred.';
      this.showToast(`Save failed. ${errorMessage} Please try again.`);

      // Don't close the form on error
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
