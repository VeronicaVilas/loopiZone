import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BannerComponent } from './banner/banner.component';
import { VideoComponent } from './video/video.component';
import { AutoCollapseSidebarDirective } from '../shared/directive/auto-collapse-sidebar.directive';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [BannerComponent, VideoComponent, CommonModule, AutoCollapseSidebarDirective],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  @Input() sidebarCollapsed: boolean = true;
}
