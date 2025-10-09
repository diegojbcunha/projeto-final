import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { UserHomeComponent } from './user-home/user-home.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, UserHomeComponent, AdminHomeComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private authService = inject(AuthService);
  isAdmin = false;

  ngOnInit() {
    // Detect user type from AuthService
    this.isAdmin = this.authService.isAdmin();
  }
}
