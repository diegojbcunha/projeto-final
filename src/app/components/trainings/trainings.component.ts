import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { Training, TrainingService } from '../../services/training.service';

@Component({
  selector: 'app-trainings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trainings.component.html',
  styleUrls: ['./trainings.component.css']
})
export class TrainingsComponent {
  currentUser: any = null;
  isAdmin = true;
  filter = signal<'All' | 'In Progress' | 'Completed' | 'Not Started'>('All');
  showForm = signal(false);
  editMode = signal(false);

  trainings: Training[] = [];
  currentTraining!: Training;

  constructor(private router: Router, private authService: AuthService, private service: TrainingService) {
    // Verificar se usuário está logado
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    // Obter dados do usuário atual
    this.currentUser = this.authService.getCurrentUser();
    this.trainings = service.getTrainings();
    this.currentTraining = this.createEmptyTraining();
  }

  createEmptyTraining(): Training {
    return { id: Date.now(), title: '', description: '', duration: '', status: 'Not Started' };
  }

  setFilter(f: 'All' | 'In Progress' | 'Completed' | 'Not Started') {
    this.filter.set(f);
  }

  addNew() {
    this.showForm.set(true);
    this.editMode.set(false);
    this.currentTraining = this.createEmptyTraining();
  }

  editTraining(training: Training) {
    this.showForm.set(true);
    this.editMode.set(true);
    this.currentTraining = structuredClone(training);
  }

  deleteTraining(id: number) {
    this.service.deleteTraining(id);
    this.trainings = this.service.getTrainings();
  }

  saveTraining() {
    if (this.editMode()) {
      this.service.updateTraining(this.currentTraining);
    } else {
      this.service.addTraining(this.currentTraining);
    }
    this.trainings = this.service.getTrainings();
    this.cancel();
  }

  cancel() {
    this.showForm.set(false);
    this.currentTraining = this.createEmptyTraining();
  }

  get filteredTrainings(): Training[] {
    const f = this.filter();
    return f === 'All' ? this.trainings : this.trainings.filter(t => t.status === f);
  }

  trackById(index: number, item: Training): number {
    return item.id;
  }
}
