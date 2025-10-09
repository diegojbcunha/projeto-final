import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="home-container">
      <h1>Welcome to Ford Training Hub</h1>
      <p>Please select a menu option to get started.</p>
    </div>
  `,
  styles: [`
    .home-container {
      padding: 2rem;
      text-align: center;
      color: var(--primary-dark);
    }
    h1 {
      font-size: 2rem;
      margin-bottom: 1rem;
    }
    p {
      font-size: 1.1rem;
      color: var(--secondary-dark);
    }
  `]
})
export class HomeComponent {}
