import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { Video } from '../shared/interfaces/video';
import { ActivatedRoute } from '@angular/router';
import { VideoService } from '../shared/services/video/video.service';
import { combineLatest, map, Observable, of, startWith } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { VideoHelperService } from '../shared/services/video/video-helper.service';
import { CustomNumberPipe } from '../shared/pipes/customNumber/custom-number.pipe';
import { CustomDatePipe } from '../shared/pipes/customDate/custom-date.pipe';
import { ShortNumberPipe } from '../shared/pipes/shortNumber/short-number.pipe';
import { TimeAgoPipe } from '../shared/pipes/timeAgo/time-ago.pipe';
import { SearchService } from '../shared/services/search/search.service';

@Component({
  selector: 'app-play-video',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatDividerModule, CommonModule, CustomNumberPipe, CustomDatePipe,  ShortNumberPipe, TimeAgoPipe],
  templateUrl: './play-video.component.html',
  styleUrl: './play-video.component.css'
})
export class PlayVideoComponent {
  video$!: Observable<Video | undefined>;
  videos$!: Observable<Video[]>;
  safeUrl: SafeResourceUrl | null = null;
  filteredVideos$: Observable<Video[]> = of([]);

  constructor(
    private route: ActivatedRoute,
    private videoService: VideoService,
    private videoHelper: VideoHelperService,
    private sanitizer: DomSanitizer,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.video$ = this.videoService.getVideoById(id);
    this.videos$ = this.videoService.get().pipe(
      map((videos) => videos.filter((video) => video.id !== id))
    );
    this.video$.subscribe((video) => {
      if (video) {
        const embedUrl = this.videoHelper.convertToEmbedUrl(video.url);
        this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
      }
    });

    this.filteredVideos$ = combineLatest([
      this.videos$,
      this.searchService.searchTerm$.pipe(startWith(''))
    ]).pipe(
      map(([videos, searchTerm]) => {
        if (searchTerm) {
          return videos.filter(video =>
            video.title.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        return videos;
      })
    );
  }
}
