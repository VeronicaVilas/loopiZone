import { Component, OnInit } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';

import { VideoService } from '../../shared/services/video/video.service';
import { Video } from '../../shared/interfaces/video';
import { CommonModule } from '@angular/common';
import { catchError, empty, Observable, of } from 'rxjs';

import { ShortNumberPipe } from '../../shared/pipes/shortNumber/short-number.pipe';
import { TimeAgoPipe } from '../../shared/pipes/timeAgo/time-ago.pipe';

@Component({
  selector: 'app-video',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, CommonModule, ShortNumberPipe, TimeAgoPipe],
  templateUrl: './video.component.html',
  styleUrl: './video.component.css'
})
export class VideoComponent implements OnInit {

  videos$: Observable<Video[]> = of([]);

  constructor(private videoService: VideoService) {
  }

  ngOnInit() {
    this.videos$ = this.videoService.get()
    .pipe(
      catchError(error => {
        console.log(error);
        return empty();
      })
    );
  }
}
