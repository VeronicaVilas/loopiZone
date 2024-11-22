import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NavbarComponent } from './shared/navbar/navbar.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { PlayVideoComponent } from './play-video/play-video.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, SidebarComponent, PlayVideoComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  sidebarVisible = false;
  sidebarHidden = false;

  toggleSidebar() {
    if (window.innerWidth <= 800) {
      this.sidebarHidden = !this.sidebarHidden;
    } else {
      this.sidebarVisible = !this.sidebarVisible;
    }
  }

}
