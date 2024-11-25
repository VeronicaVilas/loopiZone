import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BannerComponent } from './banner/banner.component';
import { VideoComponent } from './video/video.component';
import { SearchComponent } from './search/search.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [BannerComponent, VideoComponent, SearchComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  @Input() sidebarCollapsed: boolean = true;

  currentFilter: string = 'Todos';
  currentCategory: string = 'todos';

  onFilterChange(newFilter: string) {
    this.currentFilter = newFilter;
  }

  onCategoryChange(newCategory: string) {
    this.currentCategory = newCategory;
  }
}
