import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <h1>Training Dashboard</h1>
      <div class="stats-grid">
        <div class="stat-card">
          <h3>Total Courses</h3>
          <span class="stat-number">{{ totalCourses }}</span>
        </div>
        <div class="stat-card">
          <h3>Learning Paths</h3>
          <span class="stat-number">{{ totalPaths }}</span>
        </div>
        <div class="stat-card">
          <h3>Active Users</h3>
          <span class="stat-number">{{ activeUsers }}</span>
        </div>
        <div class="stat-card">
          <h3>Completion Rate</h3>
          <span class="stat-number">{{ completionRate }}%</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 2rem;
    }

    h1 {
      color: var(--primary-dark);
      margin-bottom: 2rem;
      text-align: center;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-top: 2rem;
    }

    .stat-card {
      background: var(--white);
      border: 1px solid var(--light-gray);
      border-radius: 12px;
      padding: 2rem;
      text-align: center;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      transition: transform 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    }

    .stat-card h3 {
      margin: 0 0 1rem 0;
      color: var(--secondary-dark);
      font-size: 1.1rem;
      font-weight: 600;
    }

    .stat-number {
      font-size: 2.5rem;
      font-weight: bold;
      color: var(--primary-dark);
      display: block;
    }
  `]
})
export class DashboardComponent {
  totalCourses = 25;
  totalPaths = 7;
  activeUsers = 156;
  completionRate = 78;
}
