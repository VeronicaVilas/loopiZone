import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { catchError, combineLatest, map, Observable, of, startWith, switchMap } from 'rxjs';

import { ShortNumberPipe } from '../shared/pipes/shortNumber/short-number.pipe';
import { TimeAgoPipe } from '../shared/pipes/timeAgo/time-ago.pipe';
import { FavoriteService } from '../shared/services/favorite/favorite.service';
import { VideoService } from '../shared/services/video/video.service';
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
  loading$: Observable<boolean> = of(true);
  filteredVideos$: Observable<Video[]> = of([]);

  constructor(
    private favoriteService: FavoriteService,
    private videoService: VideoService,
    private searchService: SearchService
  ) {}

  ngOnInit() {
    const favoriteVideoIds$ = this.favoriteService.getFavorites().pipe(
      catchError((error) => {
        return of([]);
      }),
      map((favorites) => {
        this.favorites = favorites;
        return favorites.map((fav) => fav.videoId);
      })
    );

    this.favoriteVideos$ = combineLatest([
      favoriteVideoIds$.pipe(
        switchMap((videoIds) =>
          this.videoService.get().pipe(
            map((videos) =>
              videos.filter((video) => videoIds.includes(video.id))
            )
          )
        )
      ),
      this.searchService.searchTerm$.pipe(startWith(''))
    ]).pipe(
      map(([videos, searchTerm]) =>
        videos.filter((video) =>
          searchTerm
            ? video.title.toLowerCase().includes(searchTerm.toLowerCase())
            : true
        )
      )
    );

    this.loading$ = this.favoriteVideos$.pipe(
      map(() => false),
      startWith(true)
    );
  }
}
