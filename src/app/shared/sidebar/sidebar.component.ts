import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AutoCollapseSidebarDirective } from '../directive/auto-collapse-sidebar.directive';

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

  toggleVisibility() {
    this.sidebarHidden = !this.sidebarHidden;
  }
}
