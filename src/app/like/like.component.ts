import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ShortNumberPipe } from '../shared/pipes/shortNumber/short-number.pipe';
import { TimeAgoPipe } from '../shared/pipes/timeAgo/time-ago.pipe';
import { Like } from '../shared/interfaces/like';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { Video } from '../shared/interfaces/video';
import { LikeService } from '../shared/services/like/like.service';
import { VideoService } from '../shared/services/video/video.service';

@Component({
  selector: 'app-like',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, CommonModule, RouterModule, ShortNumberPipe, TimeAgoPipe],
  templateUrl: './like.component.html',
  styleUrl: './like.component.css'
})
export class LikeComponent {
  favoriteVideos$: Observable<Video[]> = of([]);
  loading = true;

  constructor(
    private likeService: LikeService,
    private videoService: VideoService
  ) {}

  ngOnInit() {
    this.loadLikedVideos();
  }

  private loadLikedVideos() {
    this.likeService.getLikes()
      .pipe(
        catchError((error) => {
          console.error('Erro ao carregar likes:', error);
          this.loading = false;
          return of([]); // Retorna uma lista vazia em caso de erro
        }),
        map((likes: Like[]) => {
          // Filtra apenas os vídeos com like: true
          const likedVideoIds = likes
            .filter((like) => like.like === true)
            .map((like) => like.videoId);
          return likedVideoIds;
        }),
        switchMap((likedVideoIds) =>
          this.videoService.get().pipe(
            // Filtra os vídeos que correspondem aos IDs curtidos
            map((videos) => videos.filter((video) => likedVideoIds.includes(video.id)))
          )
        )
      )
      .subscribe((likedVideos) => {
        this.favoriteVideos$ = of(likedVideos); // Atualiza o Observable com os vídeos curtidos
        this.loading = false; // Marca o carregamento como concluído
      });
  }
}
