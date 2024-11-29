import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';

import { Video } from '../../interfaces/video';

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  private readonly apiUrl = 'http://localhost:3000/videos';

  private videosSubject = new BehaviorSubject<Video[]>([]);
  public videos$ = this.videosSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadVideos();
  }

  private loadVideos() {
    this.http.get<Video[]>(this.apiUrl).subscribe((videos) => {
      this.videosSubject.next(videos);
    });
  }

  get() {
    return this.videos$;
  }

  getVideoById(id: string): Observable<Video | undefined> {
    return this.videos$.pipe(
      map((videos) => videos.find((video) => video.id === id))
    );
  }

  updateViews(videoId: string, newViews: number): Observable<Video> {
    const url = `${this.apiUrl}/${videoId}`;
    return this.http.patch<Video>(url, { views: newViews }).pipe(
      map((updatedVideo) => {
        const currentVideos = this.videosSubject.value;
        const index = currentVideos.findIndex((video) => video.id === videoId);
        if (index !== -1) {
          currentVideos[index] = updatedVideo;
          this.videosSubject.next([...currentVideos]);
        }
        return updatedVideo;
      })
    );
  }
}
