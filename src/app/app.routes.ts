import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PlayVideoComponent } from './play-video/play-video.component';

export const routes: Routes = [

  { path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'watch',
    component: PlayVideoComponent,
  },
];
