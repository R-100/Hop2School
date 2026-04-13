import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Role } from '../../types';
import { AuthService } from '../backend/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {

  constructor(private router: Router,private service: AuthService) { }

  async canActivate(): Promise<boolean> {
    const user = await this.service.getAuthUser();

    if (user.role === Role.ROLE_ADMIN) {
      return true;
    }

    this.router.navigate(['/']);
    return false;
  }
}
