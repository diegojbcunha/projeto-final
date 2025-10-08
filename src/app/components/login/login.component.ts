import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  usuario = {
    nome: '',
    senha: ''
  };

  errorMessage: string | null = null;
  successMessage: string | null = null;
  isLoading = false;
  showPassword = false; // Add password visibility toggle

  //injetar a auth e as rotas para usar os metodos
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // Se já estiver logado, redirecionar para home
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);
      return;
    }
  }

  // Toggle password visibility
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  login(){
    if (!this.usuario.nome || !this.usuario.senha) {
      this.errorMessage = 'Por favor, preencha todos os campos.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.authService.login(this.usuario).subscribe({
      next:(response)=> {
        console.log("Login efetuado com sucesso!", response);
        this.isLoading = false;
        this.successMessage = 'Login efetuado com sucesso!';

        // Navigate immediately after successful login
        setTimeout(() => {
          this.router.navigate(["/home"]);
        }, 1500);
      },
      error:(err)=>{
        console.log("Erro ao efetuar o login", err);
        this.isLoading = false;
        if (err.status === 401) {
          this.errorMessage = 'Credenciais inválidas. Use admin/123456 para fazer login.';
        } else {
          this.errorMessage = 'Erro ao conectar com o servidor. Tente novamente.';
        }
      }
    })
  }
}
