import { Injectable, signal } from '@angular/core';

export interface Training {
  id: number;
  title: string;
  description?: string;
  duration?: string;
  image?: string;
  status: 'In Progress' | 'Completed' | 'Not Started';
}

export interface LearningPath {
  id: number;
  title: string;
  description?: string;
  estimatedHours?: string;
  image?: string;
  trainings: Training[];
  progress: number;
  status: 'In Progress' | 'Completed' | 'Not Started';
}

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  trainings = signal<Training[]>([
    { id: 1, title: 'Workplace Safety', description: 'Basic safety procedures.', duration: '2h', image: 'https://placehold.co/400x150/blue/white?text=Safety', status: 'Completed' },
    { id: 2, title: 'Corporate Compliance', description: 'Company rules.', duration: '1.5h', status: 'In Progress' },
    { id: 3, title: 'Leadership Essentials', description: 'Team motivation.', duration: '3h', status: 'Not Started' }
  ]);

  paths = signal<LearningPath[]>([
    {
      id: 1,
      title: 'Onboarding Path',
      description: 'Introduction for new employees.',
      estimatedHours: '3.5h',
      image: 'https://placehold.co/400x150/blue/white?text=Onboarding',
      trainings: [this.trainings()[0], this.trainings()[1]],
      progress: 50,
      status: 'In Progress'
    }
  ]);

  getTrainings(): Training[] { return this.trainings(); }
  getPaths(): LearningPath[] { return this.paths(); }

  // Métodos para Trainings
  addTraining(training: Training) {
    this.trainings.update(t => [...t, { ...training, id: Date.now() }]);
  }

  updateTraining(updated: Training) {
    this.trainings.update(t => t.map(tr => tr.id === updated.id ? updated : tr));
  }

  deleteTraining(id: number) {
    this.trainings.update(t => t.filter(tr => tr.id !== id));
    // Remove de paths se vinculado
    this.paths.update(p => p.map(path => ({
      ...path,
      trainings: path.trainings.filter(tr => tr.id !== id)
    })));
  }

  // Métodos para Learning Paths (novos!)
  addPath(path: LearningPath) {
    this.paths.update(p => [...p, { ...path, id: Date.now() }]);
  }

  updatePath(updated: LearningPath) {
    this.paths.update(p => p.map(pth => pth.id === updated.id ? updated : pth));
  }

  deletePath(id: number) {
    this.paths.update(p => p.filter(pth => pth.id !== id));
  }
}