import { Component, inject, Input, OnInit, SimpleChanges } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { catchError, combineLatest, empty, Observable, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, startWith } from 'rxjs/operators';

import { VideoService } from '../../shared/services/video/video.service';
import { Video } from '../../shared/interfaces/video';
import { ShortNumberPipe } from '../../shared/pipes/shortNumber/short-number.pipe';
import { TimeAgoPipe } from '../../shared/pipes/timeAgo/time-ago.pipe';
import { SearchService } from '../../shared/services/search/search.service';

@Component({
  selector: 'app-video',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, CommonModule, ShortNumberPipe, TimeAgoPipe],
  templateUrl: './video.component.html',
  styleUrl: './video.component.css'
})
export class VideoComponent implements OnInit {

  @Input() filter: string = 'Todos';
  @Input() category: string = 'todos';

  matSnackBar = inject(MatSnackBar)
  videos$: Observable<Video[]> = of([]);
  filteredVideos$: Observable<Video[]> = of([]);
  noVideosFound: boolean = false;

  constructor(
    private videoService: VideoService,
    private searchService: SearchService
  ) {}

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
}
