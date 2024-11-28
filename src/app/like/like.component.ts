import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ShortNumberPipe } from '../shared/pipes/shortNumber/short-number.pipe';
import { TimeAgoPipe } from '../shared/pipes/timeAgo/time-ago.pipe';
import { Like } from '../shared/interfaces/like';
import { catchError, combineLatest, map, Observable, of, startWith, switchMap } from 'rxjs';
import { Video } from '../shared/interfaces/video';
import { LikeService } from '../shared/services/like/like.service';
import { VideoService } from '../shared/services/video/video.service';
import { SearchService } from '../shared/services/search/search.service';

@Component({
  selector: 'app-like',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, CommonModule, RouterModule, ShortNumberPipe, TimeAgoPipe],
  templateUrl: './like.component.html',
  styleUrl: './like.component.css'
})
export class LikeComponent {
  favoriteLikes$: Observable<Video[]> = of([]);
  loading = true;

  constructor(
    private likeService: LikeService,
    private videoService: VideoService,
    private searchService: SearchService
  ) {}

  ngOnInit() {
    this.loadLikedVideos();
  }

  private loadLikedVideos() {
    const likedVideos$ = this.likeService.getLikes().pipe(
      catchError((error) => {
        console.error('Erro ao carregar likes:', error);
        this.loading = false;
        return of([]);
      }),
      map((likes: Like[]) => {
        const likedVideoIds = likes
          .filter((like) => like.like === true)
          .map((like) => like.videoId);
        return likedVideoIds;
      }),
      switchMap((likedVideoIds) =>
        this.videoService.get().pipe(
          map((videos) => videos.filter((video) => likedVideoIds.includes(video.id)))
        )
      )
    );

    this.favoriteLikes$ = combineLatest([
      likedVideos$,
      this.searchService.searchTerm$.pipe(startWith(''))
    ]).pipe(
      map(([videos, searchTerm]) => {
        return videos.filter((video) =>
          searchTerm ? video.title.toLowerCase().includes(searchTerm.toLowerCase()) : true
        );
      })
    );

    likedVideos$.subscribe(() => (this.loading = false));
  }
}
