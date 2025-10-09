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
  courses: Course[];
  progress: number;
  status: 'In Progress' | 'Completed' | 'Not Started';
}

export interface Course {
  id: number;
  title: string;
  description: string;
  duration: number; // in hours
  modules: number;
  image: string;
  status: 'Active' | 'Upcoming';
  completionRate: number; // percentage, 0-100
  targetAudience: string;
  theme: string;
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
      courses: [], // Will be populated after courses are loaded
      progress: 50,
      status: 'In Progress'
    },
    {
      id: 2,
      title: 'Sales Training',
      description: 'Master the art of sales.',
      estimatedHours: '4.0h',
      image: 'https://placehold.co/400x150/green/white?text=Sales',
      courses: [],
      progress: 30,
      status: 'In Progress'
    },
    {
      id: 3,
      title: 'Leadership Development',
      description: 'Become a better leader.',
      estimatedHours: '6.0h',
      image: 'https://placehold.co/400x150/red/white?text=Leadership',
      courses: [],
      progress: 75,
      status: 'In Progress'
    },
    {
      id: 4,
      title: 'Technical Skills',
      description: 'Learn essential technical skills.',
      estimatedHours: '5.5h',
      image: 'https://placehold.co/400x150/purple/white?text=Tech+Skills',
      courses: [],
      progress: 90,
      status: 'Completed'
    },
    {
      id: 5,
      title: 'Compliance and Ethics',
      description: 'Understand company policies.',
      estimatedHours: '2.0h',
      image: 'https://placehold.co/400x150/orange/white?text=Compliance',
      courses: [],
      progress: 100,
      status: 'Completed'
    },
    {
      id: 6,
      title: 'Project Management',
      description: 'Manage projects effectively.',
      estimatedHours: '5.0h',
      image: 'https://placehold.co/400x150/teal/white?text=PM',
      courses: [],
      progress: 20,
      status: 'Not Started'
    },
    {
      id: 7,
      title: 'Customer Service Excellence',
      description: 'Provide outstanding customer service.',
      estimatedHours: '3.0h',
      image: 'https://placehold.co/400x150/pink/white?text=Customer+Service',
      courses: [],
      progress: 60,
      status: 'In Progress'
    }
  ]);

  themes: string[] = ['Safety', 'Leadership', 'Compliance', 'Soft Skills', 'Technical'];

  courses = signal<Course[]>([
    // Safety
    { id: 1, title: 'Workplace Hazard Recognition', description: 'Identify and mitigate workplace hazards.', duration: 2, modules: 4, image: 'https://placehold.co/300x200/133A7C/FFFFFF?text=Safety+1', status: 'Active', completionRate: 85, targetAudience: 'All employees', theme: 'Safety' },
    { id: 2, title: 'Emergency Response Procedures', description: 'Procedures for emergency situations.', duration: 1.5, modules: 3, image: 'https://placehold.co/300x200/2A6BAC/FFFFFF?text=Safety+2', status: 'Active', completionRate: 92, targetAudience: 'All employees', theme: 'Safety' },
    { id: 3, title: 'Safety Equipment Training', description: 'Proper use of safety gear.', duration: 3, modules: 5, image: 'https://placehold.co/300x200/47A8E5/FFFFFF?text=Safety+3', status: 'Active', completionRate: 78, targetAudience: 'Production staff', theme: 'Safety' },
    { id: 4, title: 'Fire Safety and Prevention', description: 'Fire prevention and response.', duration: 2.5, modules: 4, image: 'https://placehold.co/300x200/2A6BAC/FFFFFF?text=Safety+4', status: 'Upcoming', completionRate: 0, targetAudience: 'All employees', theme: 'Safety' },
    { id: 5, title: 'Ergonomics in the Workplace', description: 'Prevent injuries with proper ergonomics.', duration: 1, modules: 2, image: 'https://placehold.co/300x200/47A8E5/FFFFFF?text=Safety+5', status: 'Active', completionRate: 60, targetAudience: 'Office employees', theme: 'Safety' },
    // Semester review and planning session (removed from Safety)
    // Leadership
    { id: 6, title: 'Effective Communication Skills', description: 'Improve team communication.', duration: 4, modules: 6, image: 'https://placehold.co/300x200/133A7C/FFFFFF?text=Leadership+1', status: 'Active', completionRate: 71, targetAudience: 'Managers and supervisors', theme: 'Leadership' },
    { id: 7, title: 'Conflict Resolution', description: 'Strategies for resolving workplace conflicts.', duration: 3, modules: 4, image: 'https://placehold.co/300x200/2A6BAC/FFFFFF?text=Leadership+2', status: 'Active', completionRate: 88, targetAudience: 'Managers and supervisors', theme: 'Leadership' },
    { id: 8, title: 'Team Building and Motivation', description: 'Build and motivate high-performing teams.', duration: 5, modules: 7, image: 'https://placehold.co/300x200/47A8E5/FFFFFF?text=Leadership+3', status: 'Upcoming', completionRate: 0, targetAudience: 'Leaders and team leads', theme: 'Leadership' },
    { id: 9, title: 'Change Management', description: 'Lead through organizational change.', duration: 4.5, modules: 6, image: 'https://placehold.co/300x200/133A7C/FFFFFF?text=Leadership+4', status: 'Active', completionRate: 55, targetAudience: 'Senior leaders', theme: 'Leadership' },
    { id: 10, title: 'Decision Making Processes', description: 'Enhance decision-making skills.', duration: 3.5, modules: 5, image: 'https://placehold.co/300x200/47A8E5/FFFFFF?text=Leadership+5', status: 'Active', completionRate: 67, targetAudience: 'Managers', theme: 'Leadership' },
    // Semester review and planning session (removed from Leadership)
    // Compliance
    { id: 11, title: 'Anti-Harassment Training', description: 'Understand and prevent harassment.', duration: 2, modules: 3, image: 'https://placehold.co/300x200/133A7C/FFFFFF?text=Compliance+1', status: 'Active', completionRate: 94, targetAudience: 'All employees', theme: 'Compliance' },
    { id: 12, title: 'Data Privacy and Protection', description: 'GDPR and data protection rules.', duration: 3.5, modules: 5, image: 'https://placehold.co/300x200/2A6BAC/FFFFFF?text=Compliance+2', status: 'Active', completionRate: 79, targetAudience: 'All employees', theme: 'Compliance' },
    { id: 13, title: 'Ethical Business Practices', description: 'Maintain ethical standards.', duration: 4, modules: 6, image: 'https://placehold.co/300x200/47A8E5/FFFFFF?text=Compliance+3', status: 'Upcoming', completionRate: 0, targetAudience: 'Managers and executives', theme: 'Compliance' },
    { id: 14, title: 'Intellectual Property Rights', description: 'Protect company IP.', duration: 2.5, modules: 4, image: 'https://placehold.co/300x200/133A7C/FFFFFF?text=Compliance+4', status: 'Active', completionRate: 63, targetAudience: 'Research and development', theme: 'Compliance' },
    { id: 15, title: 'Regulatory Compliance Update', description: 'Latest industry regulations.', duration: 3, modules: 4, image: 'https://placehold.co/300x200/47A8E5/FFFFFF?text=Compliance+5', status: 'Active', completionRate: 41, targetAudience: 'Compliance officers', theme: 'Compliance' },
    // Semester review and planning session (removed from Compliance)
    // Soft Skills
    { id: 16, title: 'Time Management', description: 'Effectively manage time and tasks.', duration: 1.5, modules: 3, image: 'https://placehold.co/300x200/133A7C/FFFFFF?text=Soft+Skills+1', status: 'Active', completionRate: 89, targetAudience: 'All employees', theme: 'Soft Skills' },
    { id: 17, title: 'Emotional Intelligence', description: 'Develop emotional awareness.', duration: 4, modules: 5, image: 'https://placehold.co/300x200/2A6BAC/FFFFFF?text=Soft+Skills+2', status: 'Active', completionRate: 76, targetAudience: 'All employees', theme: 'Soft Skills' },
    { id: 18, title: 'Stress Management', description: 'Handle workplace stress.', duration: 2, modules: 3, image: 'https://placehold.co/300x200/47A8E5/FFFFFF?text=Soft+Skills+3', status: 'Upcoming', completionRate: 0, targetAudience: 'All employees', theme: 'Soft Skills' },
    { id: 19, title: 'Creativity and Innovation', description: 'Foster creative thinking.', duration: 3, modules: 4, image: 'https://placehold.co/300x200/133A7C/FFFFFF?text=Soft+Skills+4', status: 'Active', completionRate: 52, targetAudience: 'All employees', theme: 'Soft Skills' },
    { id: 20, title: 'Networking Skills', description: 'Build professional networks.', duration: 2.5, modules: 4, image: 'https://placehold.co/300x200/47A8E5/FFFFFF?text=Soft+Skills+5', status: 'Active', completionRate: 58, targetAudience: 'Mid-level and above', theme: 'Soft Skills' },
    // Semester review and planning session (removed from Soft Skills)
    // Technical - Added one new course to make 6 per topic
    { id: 21, title: 'Cybersecurity Basics', description: 'Protect against cyber threats.', duration: 3, modules: 5, image: 'https://placehold.co/300x200/133A7C/FFFFFF?text=Technical+1', status: 'Active', completionRate: 81, targetAudience: 'All employees', theme: 'Technical' },
    { id: 22, title: 'Advanced Excel for Analysts', description: 'Master advanced Excel features.', duration: 5, modules: 8, image: 'https://placehold.co/300x200/2A6BAC/FFFFFF?text=Technical+2', status: 'Active', completionRate: 49, targetAudience: 'Analysts and data roles', theme: 'Technical' },
    { id: 23, title: 'Project Management Tools', description: 'Using PM software effectively.', duration: 4, modules: 6, image: 'https://placehold.co/300x200/47A8E5/FFFFFF?text=Technical+3', status: 'Upcoming', completionRate: 0, targetAudience: 'Project managers', theme: 'Technical' },
    { id: 24, title: 'Cloud Computing Fundamentals', description: 'Introduction to cloud technologies.', duration: 6, modules: 9, image: 'https://placehold.co/300x200/133A7C/FFFFFF?text=Technical+4', status: 'Active', completionRate: 35, targetAudience: 'IT and technical staff', theme: 'Technical' },
    { id: 25, title: 'Automation and Robotics', description: 'How AI and robotics impact work.', duration: 4.5, modules: 7, image: 'https://placehold.co/300x200/47A8E5/FFFFFF?text=Technical+5', status: 'Active', completionRate: 23, targetAudience: 'Manufacturing and operations', theme: 'Technical' },
    // Semester review and planning session (removed from Technical)
  ]);

  getTrainings(): Training[] { return this.trainings(); }
  getPaths(): LearningPath[] { return this.paths(); }
  getCourses(): Course[] { return this.courses(); }
  getCoursesByTheme(theme: string): Course[] {
    return this.courses().filter(course => course.theme === theme);
  }

  // Métodos para Trainings
  addTraining(training: Training) {
    this.trainings.update(t => [...t, { ...training, id: Date.now() }]);
  }

  updateTraining(updated: Training) {
    this.trainings.update(t => t.map(tr => tr.id === updated.id ? updated : tr));
  }

  deleteTraining(id: number) {
    this.trainings.update(t => t.filter(tr => tr.id !== id));
    // Remove de paths se vinculado (noting that learning paths now use courses)
    // Keeping for legacy compatibility, but learning paths should use courses now
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

  // Métodos para Courses
  addCourse(course: Course) {
    this.courses.update(c => [...c, { ...course, id: Date.now() }]);
  }

  updateCourse(updated: Course) {
    this.courses.update(c => c.map(course => course.id === updated.id ? updated : course));
  }

  deleteCourse(id: number) {
    this.courses.update(c => c.filter(course => course.id !== id));
  }
}
