import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { UserService } from '../user/user.service';
import { BehaviorSubject, firstValueFrom } from 'rxjs';

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
    this.restoreUserId(); // Restaura o ID do usuário ao iniciar
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
    localStorage.setItem('userId', id); // Salva no LocalStorage
  }

  clearUserId(): void {
    this.userID.next(null);
    localStorage.removeItem('userId'); // Remove do LocalStorage
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
        console.log('Usuário cadastrado com sucesso:', newUser);
        this.setUserId(newUser.id);
      } else {
        console.log('Usuário já existe no sistema. ID:', id);
        this.setUserId(id!);
      }
    } catch (error) {
      console.error('Erro ao verificar ou cadastrar usuário:', error);
    }
  }
}
