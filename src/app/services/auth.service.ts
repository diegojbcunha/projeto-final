import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private mockUsers = [
    { nome: 'admin', senha: '123456', email: 'admin@sistema.com', perfil: 'admin' },
    { nome: 'usuario', senha: '123456', email: 'usuario@sistema.com', perfil: 'user' }
  ];

  constructor() { }

  //metodo que simula login sem API externa
  login(usuario: Pick<Usuario, 'nome' | 'senha'>): Observable<Usuario> {
    return new Observable<Usuario>(observer => {
      // Simular delay de rede
      setTimeout(() => {
        const user = this.mockUsers.find(u =>
          u.nome === usuario.nome && u.senha === usuario.senha
        );

        if (user) {
          const usuarioLogado: Usuario = {
            nome: user.nome,
            senha: '', // Não armazenar senha
            email: user.email,
            perfil: user.perfil
          };

          // Store authentication token/user data on successful login
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('usuario', JSON.stringify(usuarioLogado));

          observer.next(usuarioLogado);
          observer.complete();
        } else {
          observer.error({ status: 401, message: 'Credenciais inválidas' });
        }
      }, 1000); // 1 segundo de delay para simular rede
    }).pipe(
      tap((response) => {
        console.log("Login simulado efetuado com sucesso!", response);
      })
    );
  }

  //metodo para verificar se o usuario esta logado
  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  //metodo para obter dados do usuario logado
  getCurrentUser(): Usuario | null {
    const userData = localStorage.getItem('usuario');
    return userData ? JSON.parse(userData) : null;
  }

  //metodo para logout
  logout(): void {
    // Limpar dados de sessão/autenticação
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  }
}
