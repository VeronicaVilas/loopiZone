import { Component, inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { VideoService } from '../shared/services/video/video.service';
import { combineLatest, map, Observable, of, startWith } from 'rxjs';
import { CommonModule, ViewportScroller } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Video } from '../shared/interfaces/video';
import { VideoHelperService } from '../shared/services/video/video-helper.service';
import { CustomNumberPipe } from '../shared/pipes/customNumber/custom-number.pipe';
import { CustomDatePipe } from '../shared/pipes/customDate/custom-date.pipe';
import { ShortNumberPipe } from '../shared/pipes/shortNumber/short-number.pipe';
import { TimeAgoPipe } from '../shared/pipes/timeAgo/time-ago.pipe';
import { SearchService } from '../shared/services/search/search.service';
import { SubscriptionService } from '../shared/services/subscription/subscription.service';
import { AuthenticationService } from '../shared/services/authentication/authentication.service';
import { LikeService } from '../shared/services/like/like.service';

@Component({
  selector: 'app-play-video',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    CommonModule,
    CustomNumberPipe,
    CustomDatePipe,
    ShortNumberPipe,
    TimeAgoPipe,
    MatButtonToggleModule,
    RouterModule
  ],
  templateUrl: './play-video.component.html',
  styleUrl: './play-video.component.css'
})
export class PlayVideoComponent {
  @Input() channelName!: string;
  @Input() channelIcon!: string;
  @Input() videoId!: string;

  matSnackBar = inject(MatSnackBar)

  userId: string | null = null;
  video$!: Observable<Video | undefined>;
  videos$!: Observable<Video[]>;
  safeUrl: SafeResourceUrl | null = null;
  filteredVideos$: Observable<Video[]> = of([]);

  isSubscribed: boolean = false;
  subscriptionId: string | null = null;

  currentLike: boolean | null = null;
  likes: { [videoId: string]: boolean | null } = {};

  isAuthenticated$;

  constructor(
    private route: ActivatedRoute,
    private videoService: VideoService,
    private videoHelper: VideoHelperService,
    private sanitizer: DomSanitizer,
    private searchService: SearchService,
    private subscriptionService: SubscriptionService,
    private authService: AuthenticationService,
    private likeService: LikeService,
    private viewportScroller: ViewportScroller
  ) {
    this.isAuthenticated$ = this.authService.isAuthenticated$();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.video$ = this.videoService.getVideoById(id);

    this.videos$ = this.videoService.get().pipe(
      map((videos) => videos.filter((video) => video.id !== id))
    );

    this.video$.subscribe((video) => {
      if (video) {
        const embedUrl = this.videoHelper.convertToEmbedUrl(video.url);
        this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
        this.channelName = video.channelName;
        this.channelIcon = video.channelIcon;
      }
    });

    this.filteredVideos$ = combineLatest([
      this.videos$,
      this.searchService.searchTerm$.pipe(startWith(''))
    ]).pipe(
      map(([videos, searchTerm]) => {
        return videos.filter(video => {
          const matchesSearch = searchTerm ? video.title.toLowerCase().includes(searchTerm.toLowerCase()) : true;
          return matchesSearch && video.id !== this.videoId;
        });
      })
    );

    this.userId = localStorage.getItem('userId');
    const storedSubscriptionId = localStorage.getItem('subscriptionId');
    const storedIsSubscribed = localStorage.getItem('isSubscribed');
    if (storedSubscriptionId && storedIsSubscribed === 'true') {
      this.isSubscribed = true;
      this.subscriptionId = storedSubscriptionId;
    }
    if (this.userId) {
      this.checkSubscriptionStatus();
    }

    this.loadLikes();

    this.viewportScroller.scrollToPosition([0, 0]);
  }

  loadVideo(videoId: string): void {
    this.videoService.getVideoById(videoId).subscribe((video) => {
      if (video) {
        const embedUrl = this.videoHelper.convertToEmbedUrl(video.url);
        this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
        this.channelName = video.channelName;
        this.channelIcon = video.channelIcon;
        this.videoId = video.id;
        this.video$ = of(video);
        this.filteredVideos$ = this.videoService.get().pipe(
          map(videos => videos.filter(v => v.id !== videoId))
        );
      }
    });
  }

  checkSubscriptionStatus(): void {
    if (this.userId) {
      this.subscriptionService.getByChannelName(this.channelName).subscribe(
        (subscriptions) => {
          const userSubscription = subscriptions.find(
            (sub) => sub.userId === this.userId
          );
          if (userSubscription) {
            this.isSubscribed = true;
            this.subscriptionId = userSubscription.id;
          } else {
            this.isSubscribed = false;
          }
        },
        (error) => {
          this.matSnackBar.open(
            'Opa! Algo deu errado ao verificar sua inscrição. Por favor, tente novamente.', '', {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
            }
          );
        }
      );
    }
  }

  toggleSubscription(): void {
    if (this.isSubscribed) {
      this.unsubscribe();
    } else {
      this.subscribe();
    }
  }

  subscribe(): void {
    this.subscriptionService.addSubscription(this.channelIcon, this.channelName).subscribe(
      (newSubscription) => {
        this.isSubscribed = true;
        this.subscriptionId = newSubscription.id;
        localStorage.setItem('isSubscribed', 'true');
        localStorage.setItem('subscriptionId', newSubscription.id);
      },
      (error) => {
        this.matSnackBar.open(
          'Opa! Algo deu errado ao realizar sua inscrição no canal. Por favor, tente novamente.', '', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          }
        );
      }
    );
  }

  unsubscribe(): void {
    if (this.subscriptionId) {
      this.subscriptionService.removeSubscription(this.subscriptionId).subscribe(
        () => {
          this.isSubscribed = false;
          this.subscriptionId = null;
          localStorage.removeItem('isSubscribed');
          localStorage.removeItem('subscriptionId');
        },
        (error) => {
          this.matSnackBar.open(
            'Opa! Algo deu errado ao cancelar sua inscrição no canal. Por favor, tente novamente.', '', {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
            }
          );
        }
      );
    }
  }

  private loadLikes(): void {
    this.likeService.getLikes().subscribe((likes) => {
      this.likes = likes.reduce((acc, like) => {
        acc[like.videoId] = like.like;
        return acc;
      }, {} as { [key: string]: boolean | null });
    });
  }

  toggleLike(videoId: string, isLike: boolean): void {
    console.log(`Vídeo: ${videoId}, Like: ${isLike}`);
    if (this.likes[videoId] === isLike) {
      this.likeService.removeLike(videoId).subscribe(() => {
        this.likes[videoId] = null;
      });
    } else {
      this.likeService.saveLike(videoId, isLike).subscribe(() => {
        this.likes[videoId] = isLike;
      });
    }
  }
}
