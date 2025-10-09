import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit {
  // Admin home data (mock data for now)
  totalCourses = 25;
  totalUsers = 124;
  activeLearningPaths = 8;
  completionRate = 76;

  constructor(private router: Router) {}

  ngOnInit() {
    // In a real app, this data would be fetched from a service
    // this.loadAdminHomeData();
  }

  /**
   * Navigate to specified path
   */
  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}