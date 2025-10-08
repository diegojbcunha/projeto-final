import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  currentUser: any = null;
  dashboardData = {
    totalVeiculos: 4,
    veiculosConectados: 3,
    veiculosAtualizados: 2,
    modelos: [
      { nome: 'Bronco Sport', vendas: 150, conectados: 120, atualizados: 100 },
      { nome: 'Mustang', vendas: 89, conectados: 75, atualizados: 65 },
      { nome: 'Ranger', vendas: 200, conectados: 180, atualizados: 160 },
      { nome: 'Territory', vendas: 95, conectados: 85, atualizados: 70 }
    ]
  };

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    // Verificar se usuário está logado
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    // Obter dados do usuário atual
    this.currentUser = this.authService.getCurrentUser();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
