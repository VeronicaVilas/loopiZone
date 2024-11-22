import { Component, HostListener, Input } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { AutoCollapseSidebarDirective } from '../directive/auto-collapse-sidebar.directive';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MatButtonModule, MatDividerModule, MatIconModule, CommonModule, AutoCollapseSidebarDirective],
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
