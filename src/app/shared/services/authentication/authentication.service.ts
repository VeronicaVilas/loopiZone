import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { UserService } from '../user/user.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

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

  async registerUserIfNeeded(user: { name: string; email: string; socialLoginProvider: string }) {
    try {
      const exists = await firstValueFrom(this.userService.userExists(user.email));
      if (!exists) {
        const newUser = await firstValueFrom(this.userService.post(user));
        console.log('Usuário cadastrado com sucesso:', newUser);
      } else {
        console.log('Usuário já existe no sistema.');
      }
    } catch (error) {
      console.error('Erro ao verificar ou cadastrar usuário:', error);
    }
  }
}
