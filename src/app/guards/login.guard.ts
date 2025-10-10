import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const LoginGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    // If already logged in, redirect to home
    router.navigate(['/home']);
    return false;
  } else {
    // If not logged in, allow access to login page
    return true;
  }
};