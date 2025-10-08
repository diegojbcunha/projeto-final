import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LearningPath, Training, TrainingService } from '../../services/training.service';

@Component({
  selector: 'app-learning-paths',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './learning-paths.component.html',
  styleUrls: ['./learning-paths.component.css']
})
export class LearningPathsComponent {
  isAdmin = true;
  filter = signal<'All' | 'In Progress' | 'Completed' | 'Not Started'>('All');
  showForm = signal(false);
  editMode = signal(false);

  paths: LearningPath[] = [];
  allTrainings: Training[] = [];
  currentPath!: LearningPath;

  constructor(private service: TrainingService) {
    this.paths = service.getPaths();
    this.allTrainings = service.getTrainings();
    this.currentPath = this.createEmptyPath();
  }

  createEmptyPath(): LearningPath {
    return { id: Date.now(), title: '', description: '', trainings: [], progress: 0, status: 'Not Started' };
  }

  get filteredPaths(): LearningPath[] {
    const f = this.filter();
    return f === 'All' ? this.paths : this.paths.filter(p => p.status === f);
  }

  setFilter(f: 'All' | 'In Progress' | 'Completed' | 'Not Started') {
    this.filter.set(f);
  }

  addNew() {
    this.showForm.set(true);
    this.editMode.set(false);
    this.currentPath = this.createEmptyPath();
  }

  editPath(path: LearningPath) {
    this.showForm.set(true);
    this.editMode.set(true);
    this.currentPath = structuredClone(path);
  }

  deletePath(id: number) {
    this.service.deletePath(id);
    this.paths = this.service.getPaths();
  }

  savePath() {
    if (this.editMode()) {
      this.service.updatePath(this.currentPath);
    } else {
      this.service.addPath(this.currentPath);
    }
    this.paths = this.service.getPaths();
    this.cancel();
  }

  cancel() {
    this.showForm.set(false);
    this.currentPath = this.createEmptyPath();
  }

  toggleTrainingSelection(id: number) {
    const selected = this.currentPath.trainings.map(t => t.id);
    if (selected.includes(id)) {
      this.currentPath.trainings = this.currentPath.trainings.filter(t => t.id !== id);
    } else {
      const training = this.allTrainings.find(t => t.id === id);
      if (training) this.currentPath.trainings.push(training);
    }
  }

  isTrainingSelected(id: number): boolean {
    return this.currentPath.trainings.some(t => t.id === id);
  }

  trackById(index: number, item: any): number {
    return item.id;
  }
}
