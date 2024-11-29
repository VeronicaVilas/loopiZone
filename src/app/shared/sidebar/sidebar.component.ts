import { Component, inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AutoCollapseSidebarDirective } from '../directive/auto-collapse-sidebar.directive';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { SubscriptionService } from '../services/subscription/subscription.service';
import { Subscription } from '../interfaces/subscription';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    CommonModule,
    RouterModule,
    AutoCollapseSidebarDirective
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @Input() sidebarCollapsed: boolean = true;
  @Input() sidebarHidden: boolean = false;

  matSnackBar = inject(MatSnackBar)

  user$;
  isAuthenticated$: Observable<boolean>;
  userId$: Observable<string | null>;
  subscriptions$: Observable<Subscription[]> = of([]);

  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthenticationService,
    private subscriptionService: SubscriptionService
  ) {
    this.user$ = this.authService.getUser$();
    this.isAuthenticated$ = this.authService.isAuthenticated$();
    this.userId$ = this.authService.userId$;
  }

  ngOnInit() {
    this.user$.pipe(takeUntil(this.destroy$)).subscribe(user => {
      if (user) {
        const userData = {
          name: user.name || '',
          email: user.email || '',
          socialLoginProvider: user.sub?.split('|')[0] || 'Unknown',
        };
        this.authService.registerUserIfNeeded(userData);
      }
    });
    this.loadSubscriptions();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadSubscriptions(): void {
    this.subscriptions$ = this.subscriptionService.get().pipe(
      catchError(error=> {
        this.matSnackBar.open('Opa! Algo deu errado... Não foi possível carregar os canais inscritos! 😅 Tente recarregar a página ou tente novamente mais tarde.', '', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        return of([]);
      })
    );
  }

  toggleVisibility() {
    this.sidebarHidden = !this.sidebarHidden;
  }

  login() {
    this.authService.login();
  }

  logout() {
    this.authService.logout();
    this.authService.clearUserId();
  }
}
