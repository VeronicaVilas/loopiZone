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
  ) {}

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
  }

  clearUserId(): void {
    this.userID.next(null);
  }

  async registerUserIfNeeded(user: { name: string; email: string; socialLoginProvider: string }) {
    try {
      const { exists, id } = await firstValueFrom(this.userService.userExists(user.email));
      if (!exists) {
        const newUser = await firstValueFrom(this.userService.post(user));
        console.log('Usuário cadastrado com sucesso:', newUser);
        this.setUserId(newUser.id);
      } else {
        console.log('Usuário já existe no sistema. ID:', id); // Exibe o ID do usuário existente
        this.setUserId(id!); // Define o ID do usuário existente
      }
    } catch (error) {
      console.error('Erro ao verificar ou cadastrar usuário:', error);
    }
  }
}
