import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

import { ShortNumberPipe } from '../shared/pipes/shortNumber/short-number.pipe';
import { TimeAgoPipe } from '../shared/pipes/timeAgo/time-ago.pipe';
import { FavoriteService } from '../shared/services/favorite/favorite.service';
import { VideoService } from '../shared/services/video/video.service';
import { catchError, map, Observable, of } from 'rxjs';
import { Favorite } from '../shared/interfaces/favorite';
import { Video } from '../shared/interfaces/video';

@Component({
  selector: 'app-favorite',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, CommonModule, RouterModule, ShortNumberPipe, TimeAgoPipe],
  templateUrl: './favorite.component.html',
  styleUrl: './favorite.component.css'
})
export class FavoriteComponent implements OnInit {

  favorites: Favorite[] = [];
  favoriteVideos$: Observable<Video[]> = of([]);
  loading = true;

  constructor(
    private favoriteService: FavoriteService,
    private videoService: VideoService
  ) {}

  ngOnInit() {
    this.loadFavoriteVideos();
  }

  private loadFavoriteVideos() {
    this.favoriteService.getFavorites()
      .pipe(
        catchError((error) => {
          console.error('Erro ao carregar favoritos:', error);
          this.loading = false;
          return of([]);
        }),
        map((favorites: Favorite[]) => {
          this.favorites = favorites;
          const videoIds = favorites.map((fav) => fav.videoId);
          return videoIds;
        }),
        map((videoIds) =>
          this.videoService.get().pipe(
            map((videos) => videos.filter((video) => videoIds.includes(video.id)))
          )
        )
      )
      .subscribe((favoriteVideos$) => {
        this.favoriteVideos$ = favoriteVideos$ ?? of([]);
        this.loading = false;
      });
  }
}
