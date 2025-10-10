import { Component, signal, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { Course, Training, TrainingService, CourseModule } from '../../services/training.service';

@Component({
  selector: 'app-trainings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trainings.component.html',
  styleUrls: ['./trainings.component.css']
})
export class TrainingsComponent implements OnInit {
  currentUser: any = null;
  isAdmin = false;
  themes: string[] = [];
  courses: { [theme: string]: Course[] } = {};
  showForm = signal(false);
  editMode = signal(false);
  currentCourse!: Course;
  
  // New property for modules modal control
  showModulesModal = signal(false);
  selectedCourse: Course | null = null;
  selectedCourseModules: CourseModule[] = [];

  constructor(private router: Router, private authService: AuthService, private service: TrainingService) {
    // Check if user is logged in
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    // Get current user data
    this.currentUser = this.authService.getCurrentUser();
    this.isAdmin = this.authService.isAdmin();
    this.themes = this.service.themes;
  }

  ngOnInit() {
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
    const course: Course = {
      id: Date.now(),
      title: '',
      description: '',
      duration: 1,
      modules: 1,
      image: '',
      status: 'Active',
      completionRate: 0,
      targetAudience: '',
      theme: 'Safety',
      courseModules: []
    };
    return course;
  }

  addNew() {
    if (!this.isAdmin) return; // Only admin can add new courses
    this.showForm.set(true);
    this.editMode.set(false); // Corrigido: deve ser false para adicionar novo
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
  }

  saveCourse() {
    try {
      console.log('Attempting to save course:', this.currentCourse);

      // Comprehensive validation of required fields
      if (!this.currentCourse.title?.trim()) {
        alert('Course title is required.');
        return;
      }

      if (!this.currentCourse.description?.trim()) {
        alert('Course description is required.');
        return;
      }

      if (!this.currentCourse.image?.trim()) {
        alert('Course image URL is required.');
        return;
      }

      if (!this.currentCourse.targetAudience?.trim()) {
        alert('Target audience is required.');
        return;
      }

      if (!this.currentCourse.theme) {
        alert('Please select a course theme.');
        return;
      }

      // Validate duration and modules
      if (!this.currentCourse.duration || this.currentCourse.duration <= 0) {
        alert('Valid course duration is required.');
        return;
      }

      if (!this.currentCourse.modules || this.currentCourse.modules <= 0) {
        alert('Valid number of modules is required.');
        return;
      }

      console.log('Validation passed, proceeding with save...');

      let savedCourse: any;

      if (this.editMode()) {
        // Update existing course
        console.log('Updating existing course with ID:', this.currentCourse.id);
        this.service.updateCourse(this.currentCourse);
        savedCourse = this.currentCourse;
        console.log('Course updated successfully');
      } else {
        // Add new course with unique ID
        const newCourse = {
          ...this.currentCourse,
          id: Date.now(),
          completionRate: 0,
          courseModules: this.currentCourse.courseModules || []
        };
        console.log('Adding new course:', newCourse);
        this.service.addCourse(newCourse);
        savedCourse = newCourse;
        console.log('New course added successfully with ID:', savedCourse.id);
      }

      // Update the UI to reflect changes
      console.log('Updating courses list...');
      this.updateCourses();

      // Success feedback
      alert(`${this.editMode() ? 'Course updated' : 'New course added'} successfully!`);

      // Reset form and close modal
      console.log('Closing form and resetting state...');
      this.cancel();

    } catch (error: any) {
      console.error('Error saving course:', error);

      // More detailed error message
      const errorMessage = error?.message ? `Error: ${error.message}` : 'An unexpected error occurred while saving the course.';
      alert(`Save failed. ${errorMessage} Please try again.`);

      // Don't close the form on error so user can fix issues
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
    // Close modules modal with ESC too
    if (this.showModulesModal()) {
      this.closeModulesModal();
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

  // New methods for managing modules modal
  openModulesModal(course: Course) {
    this.selectedCourse = course;
    this.selectedCourseModules = [...course.courseModules].sort((a, b) => a.order - b.order);
    this.showModulesModal.set(true);
  }
  
  closeModulesModal() {
    this.showModulesModal.set(false);
    this.selectedCourse = null;
    this.selectedCourseModules = [];
  }
  
  getModuleStatus(module: CourseModule): string {
    if (module.isCompleted) {
      return 'Completed';
    }
    
    // Check if module is locked (if previous modules are not completed)
    const moduleIndex = this.selectedCourseModules.findIndex(m => m.id === module.id);
    for (let i = 0; i < moduleIndex; i++) {
      if (!this.selectedCourseModules[i].isCompleted) {
        return 'Locked';
      }
    }
    
    return 'Not Started';
  }
  
  getTotalDuration(courseModules: CourseModule[]): number {
    const totalMinutes = courseModules.reduce((sum, module) => sum + module.duration, 0);
    return +(totalMinutes / 60).toFixed(1); // Convert to hours and round to 1 decimal
  }
  
  getTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'video': 'Video',
      'quiz': 'Quiz',
      'reading': 'Reading',
      'assignment': 'Assignment',
      'presentation': 'Presentation'
    };
    return labels[type] || 'Content';
  }



  addNewModule() {
    const newModule: CourseModule = {
      id: Date.now(),
      title: '',
      type: 'video',
      duration: 30,
      isCompleted: false,
      order: this.currentCourse.courseModules.length + 1
    };
    this.currentCourse.courseModules.push(newModule);
  }

  removeModule(index: number) {
    if (confirm('Are you sure you want to remove this module?')) {
      this.currentCourse.courseModules.splice(index, 1);
      // Re-order remaining modules
      this.currentCourse.courseModules.forEach((module, i) => {
        module.order = i + 1;
      });
    }
  }

  startModule(module: CourseModule) {
    // Navigate to course modules viewer
    this.closeModulesModal();
    this.router.navigate(['/course-viewer'], { queryParams: { courseId: this.selectedCourse?.id } });
  }

  // New method to close modules modal when clicking outside
  onModulesModalClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.closeModulesModal();
    }
  }
}
