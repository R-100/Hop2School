import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../backend/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  async canActivate(): Promise<boolean> {
    const token = localStorage.getItem('authToken');

    if (token) {
      try {
        const isValid = await this.authService.validateToken();
        if (isValid) {
          return true;
        }
      } catch (error) {
        console.error('Token validation failed:', error);
      }
    }

    this.router.navigate(['/login']);
    return false;
  }
}
