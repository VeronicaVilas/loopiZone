import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PlayVideoComponent } from './play-video/play-video.component';
import { FavoriteComponent } from './favorite/favorite.component';
import { authGuard } from './shared/guards/auth.guard';

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
    path: 'watch/:id',
    component: PlayVideoComponent,
  },
  {
    path: 'favorite',
    component: FavoriteComponent,
    canActivate: [authGuard]
  },
];
