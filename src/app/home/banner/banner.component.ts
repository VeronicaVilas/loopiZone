import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

import { AuthenticationService } from '../../shared/services/authentication/authentication.service';

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [MatButtonModule, CommonModule],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.css'
})
export class BannerComponent {

  isAuthenticated$;

  constructor(private authService: AuthenticationService) {
    this.isAuthenticated$ = this.authService.isAuthenticated$();
  }

  login() {
    this.authService.login();
  }
}
