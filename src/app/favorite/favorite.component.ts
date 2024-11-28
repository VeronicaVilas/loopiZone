import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

import { ShortNumberPipe } from '../shared/pipes/shortNumber/short-number.pipe';
import { TimeAgoPipe } from '../shared/pipes/timeAgo/time-ago.pipe';
import { FavoriteService } from '../shared/services/favorite/favorite.service';
import { VideoService } from '../shared/services/video/video.service';
import { catchError, combineLatest, map, Observable, of, startWith, switchMap } from 'rxjs';
import { Favorite } from '../shared/interfaces/favorite';
import { Video } from '../shared/interfaces/video';
import { SearchService } from '../shared/services/search/search.service';

@Component({
  selector: 'app-favorite',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, CommonModule, RouterModule, ShortNumberPipe, TimeAgoPipe],
  templateUrl: './favorite.component.html',
  styleUrl: './favorite.component.css'
})
export class FavoriteComponent implements OnInit {
  @Input() videoId!: string;

  favorites: Favorite[] = [];
  favoriteVideos$: Observable<Video[]> = of([]);
  loading = true;

  video$!: Observable<Video | undefined>;
  videos$!: Observable<Video[]>;
  filteredVideos$: Observable<Video[]> = of([]);

  constructor(
    private favoriteService: FavoriteService,
    private videoService: VideoService,
    private searchService: SearchService
  ) {}

  ngOnInit() {
    this.favoriteVideos$ = combineLatest([
      this.favoriteService.getFavorites().pipe(
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
        switchMap((videoIds) =>
          this.videoService.get().pipe(
            map((videos) => videos.filter((video) => videoIds.includes(video.id)))
          )
        )
      ),
      this.searchService.searchTerm$.pipe(startWith(''))
    ]).pipe(
      map(([videos, searchTerm]) => {
        return videos.filter((video) =>
          searchTerm ? video.title.toLowerCase().includes(searchTerm.toLowerCase()) : true
        );
      })
    );

    this.loading = false;
  }
}
