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
  themes: string[] = [];
  courses: { [theme: string]: Course[] } = {};

  constructor(private router: Router, private authService: AuthService, private service: TrainingService) {
    // Verificar se usuário está logado
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    // Obter dados do usuário atual
    this.currentUser = this.authService.getCurrentUser();
    this.themes = this.service.themes;
    this.themes.forEach(theme => {
      this.courses[theme] = this.service.getCoursesByTheme(theme);
    });
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
}
