import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const LoginGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    // Se já estiver logado, redirecionar para home
    router.navigate(['/home']);
    return false;
  } else {
    // Se não estiver logado, permitir acesso à página de login
    return true;
  }
};