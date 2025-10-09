import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private mockUsers: Usuario[] = [
    { nome: 'admin', senha: '123456', email: 'admin@sistema.com', perfil: 'admin' },
    { nome: 'usuario', senha: '123456', email: 'usuario@sistema.com', perfil: 'user' }
  ];

  constructor() {
    // 🔹 Carrega usuários do localStorage e mescla com os mockados
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      const parsed = JSON.parse(storedUsers);
      this.mockUsers = [...this.mockUsers, ...parsed.filter((u: any) => !this.mockUsers.some(m => m.email === u.email))];
    } else {
      localStorage.setItem('users', JSON.stringify(this.mockUsers));
    }
  }

  // 🔹 LOGIN – agora verifica mock + usuários salvos no localStorage
  login(usuario: Pick<Usuario, 'nome' | 'senha'>): Observable<Usuario> {
    return new Observable<Usuario>(observer => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');

        // Verifica em todos os usuários (mock + local)
        const allUsers = [...this.mockUsers, ...users];
        const user = allUsers.find(u =>
          (u.nome === usuario.nome || u.email === usuario.nome) &&
          u.senha === usuario.senha
        );

        if (user) {
          const usuarioLogado: Usuario = {
            nome: user.nome,
            senha: '',
            email: user.email,
            perfil: user.perfil,
            department: user.department
          };

          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('usuario', JSON.stringify(usuarioLogado));

          observer.next(usuarioLogado);
          observer.complete();
        } else {
          observer.error({ status: 401, message: 'Credenciais inválidas. Verifique o nome e senha.' });
        }
      }, 500);
    }).pipe(
      tap((response) => console.log("✅ Login efetuado com sucesso!", response))
    );
  }

  // 🔹 REGISTER – cria usuário e salva corretamente no localStorage
  register(userData: { nome: string, email: string, senha: string, department?: string }): Observable<Usuario> {
    return new Observable<Usuario>(observer => {
      setTimeout(() => {
        const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');

        const existingUser = storedUsers.find((u: Usuario) =>
          u.email === userData.email || u.nome === userData.nome
        );

        if (existingUser) {
          observer.error({ status: 409, message: 'Usuário já existe.' });
          return;
        }

        const newUser: Usuario = {
          nome: userData.nome,
          senha: userData.senha,
          email: userData.email,
          perfil: 'user',
          department: userData.department
        };

        storedUsers.push(newUser);
        localStorage.setItem('users', JSON.stringify(storedUsers));

        const usuarioLogado: Usuario = {
          nome: newUser.nome,
          senha: '',
          email: newUser.email,
          perfil: newUser.perfil,
          department: newUser.department
        };

        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('usuario', JSON.stringify(usuarioLogado));

        observer.next(usuarioLogado);
        observer.complete();
      }, 500);
    }).pipe(
      tap((response) => console.log("✅ Registro e login automático concluídos!", response))
    );
  }

  // 🔹 Verifica se o usuário está logado
  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  // 🔹 Retorna dados do usuário logado
  getCurrentUser(): Usuario | null {
    const userData = localStorage.getItem('usuario');
    return userData ? JSON.parse(userData) : null;
  }

  // 🔹 Verifica se é admin
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user ? user.perfil === 'admin' : false;
  }

  // 🔹 Logout
  logout(): void {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('usuario');
  }
}
