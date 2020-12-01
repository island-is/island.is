import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    }

    this.authService.startAuthentication();
    return false;
  }
}
