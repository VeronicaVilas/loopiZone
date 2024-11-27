import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AutoCollapseSidebarDirective } from '../directive/auto-collapse-sidebar.directive';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { Observable, of } from 'rxjs';
import { SubscriptionService } from '../services/subscription/subscription.service';
import { Subscription } from '../interfaces/subscription';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MatButtonModule, MatDividerModule, MatIconModule, CommonModule, RouterModule, AutoCollapseSidebarDirective],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @Input() sidebarCollapsed: boolean = true;
  @Input() sidebarHidden: boolean = false;

  user$;
  isAuthenticated$;
  userId$: Observable<string | null>;
  subscriptions$: Observable<Subscription[]> = of([]);

  constructor(private authService: AuthenticationService, private subscriptionService: SubscriptionService) {
    this.user$ = this.authService.getUser$();
    this.isAuthenticated$ = this.authService.isAuthenticated$();
    this.userId$ = this.authService.userId$;
  }

  ngOnInit() {
    this.user$.subscribe(user => {
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

  loadSubscriptions(): void {
    this.subscriptions$ = this.subscriptionService.get();
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
