import { Component, signal, HostListener } from '@angular/core';
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
export class TrainingsComponent {
  currentUser: any = null;
  isAdmin = false;
  themes: string[] = [];
  courses: { [theme: string]: Course[] } = {};
  showForm = signal(false);
  editMode = signal(false);
  currentCourse!: Course;
  
  // Nova propriedade para controle do modal de módulos
  showModulesModal = signal(false);
  selectedCourse: Course | null = null;
  selectedCourseModules: CourseModule[] = [];

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
      theme: 'Safety',
      courseModules: []
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

  saveCourse() {
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
    // Fechar modal de módulos com ESC também
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

  // Novo método para fechar o modal de módulos ao clicar fora
  onModulesModalClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.closeModulesModal();
    }
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
  
  // Novos métodos para gerenciar o modal de módulos
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
    
    // Verificar se o módulo está bloqueado (se módulos anteriores não foram concluídos)
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
  
  startModule(module: CourseModule) {
    // Navegar para o visualizador de módulos do curso
    this.closeModulesModal();
    this.router.navigate(['/course-viewer'], { queryParams: { courseId: this.selectedCourse?.id } });
  }
}