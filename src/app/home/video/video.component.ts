import { Component, inject, Input, OnInit, SimpleChanges } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { catchError, combineLatest, empty, Observable, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, startWith } from 'rxjs/operators';

import { VideoService } from '../../shared/services/video/video.service';
import { Video } from '../../shared/interfaces/video';
import { ShortNumberPipe } from '../../shared/pipes/shortNumber/short-number.pipe';
import { TimeAgoPipe } from '../../shared/pipes/timeAgo/time-ago.pipe';
import { SearchService } from '../../shared/services/search/search.service';
import { RouterModule } from '@angular/router';
import { FavoriteService } from '../../shared/services/favorite/favorite.service';
import { Favorite } from '../../shared/interfaces/favorite';
import { AuthenticationService } from '../../shared/services/authentication/authentication.service';

@Component({
  selector: 'app-video',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, CommonModule, RouterModule, ShortNumberPipe, TimeAgoPipe],
  templateUrl: './video.component.html',
  styleUrl: './video.component.css'
})
export class VideoComponent implements OnInit {

  @Input() filter: string = 'Todos';
  @Input() category: string = 'todos';
  @Input() userId: string = '';

  matSnackBar = inject(MatSnackBar)
  videos$: Observable<Video[]> = of([]);
  filteredVideos$: Observable<Video[]> = of([]);
  noVideosFound: boolean = false;
  favorites: Favorite[] = [];

  isAuthenticated$;

  constructor(
    private videoService: VideoService,
    private searchService: SearchService,
    private favoriteService: FavoriteService,
    private authService: AuthenticationService
  ) {
    this.isAuthenticated$ = this.authService.isAuthenticated$();
  }

  ngOnInit() {
    this.videos$ = this.videoService.get().pipe(
      catchError(error => {
        this.matSnackBar.open('Opa! Algo deu errado... Nossos vídeos fugiram por um momento! 😅 Tente recarregar a página ou tente novamente mais tarde.', '', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        return empty();
      })
    );
    this.applyFilters();
    this.loadFavorites();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['filter'] || changes['category']) {
      this.applyFilters();
    }
  }

  private applyFilters() {
    this.filteredVideos$ = combineLatest([
      this.videos$,
      this.searchService.searchTerm$.pipe(startWith('')),
      of(this.filter),
      of(this.category)
    ]).pipe(
      map(([videos, searchTerm, filter, category]) => {
        let filtered = videos;
        if (filter !== 'Todos') {
          filtered = filtered.filter(video => video.type === filter);
        }
        if (category !== 'todos') {
          filtered = filtered.filter(video => video.category.toLowerCase() === category.toLowerCase());
        }
        if (searchTerm) {
          filtered = filtered.filter(video =>
            video.title.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        this.noVideosFound = filtered.length === 0;
        return filtered;
      })
    );
  }

  incrementViews(video: Video) {
    console.log('ID do vídeo:', video.id);
    const newViews = video.views + 1;
    this.videoService.updateViews(video.id, newViews).subscribe(
      (updatedVideo) => {
        console.log('Visualizações atualizadas:', updatedVideo.views);
        video.views = updatedVideo.views;
      },
      (error) => {
        console.error('Erro ao atualizar visualizações:', error);
      }
    );
  }

  loadFavorites() {
    this.favoriteService.getFavorites().subscribe(
      (favorites) => {
        this.favorites = favorites;
      },
      (error) => {
        console.error('Erro ao carregar favoritos:', error);
      }
    );
  }

  toggleFavorite(videoId: string) {
    const favorite = this.favorites.find((fav) => fav.videoId === videoId);
    if (favorite) {
      this.favoriteService.removeFavorite(favorite.id).subscribe(() => {
        this.favorites = this.favorites.filter((fav) => fav.videoId !== videoId);
      });
    } else {
      this.favoriteService.addFavorite(videoId).subscribe((newFavorite) => {
        this.favorites.push(newFavorite);
      });
    }
  }

  isFavorite(videoId: string): boolean {
    return this.favorites.some((fav) => fav.videoId === videoId);
  }
}
