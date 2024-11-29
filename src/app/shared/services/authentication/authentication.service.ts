import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { BehaviorSubject, firstValueFrom } from 'rxjs';

import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private userID = new BehaviorSubject<string | null>(null);
  userId$ = this.userID.asObservable();

  constructor(
    private auth: AuthService,
    private userService: UserService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.restoreUserId();
  }

  login() {
    this.auth.loginWithRedirect();
  }

  logout() {
    this.auth.logout({
      logoutParams: {returnTo: this.document.location.origin,},
    });
  }

  getUser$() {
    return this.auth.user$;
  }

  isAuthenticated$() {
    return this.auth.isAuthenticated$;
  }

  setUserId(id: string): void {
    this.userID.next(id);
    localStorage.setItem('userId', id);
  }

  clearUserId(): void {
    this.userID.next(null);
    localStorage.removeItem('userId');
  }

  restoreUserId(): void {
    const storedId = localStorage.getItem('userId');
    if (storedId) {
      this.userID.next(storedId);
    }
  }

  async registerUserIfNeeded(user: { name: string; email: string; socialLoginProvider: string }) {
    try {
      const { exists, id } = await firstValueFrom(this.userService.userExists(user.email));
      if (!exists) {
        const newUser = await firstValueFrom(this.userService.post(user));
        this.setUserId(newUser.id);
      } else {
        this.setUserId(id!);
      }
    } catch (error) {
      console.error('Erro ao verificar ou cadastrar usuário:', error);
    }
  }
}
