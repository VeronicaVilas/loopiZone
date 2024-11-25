import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Video } from '../../interfaces/video';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  private readonly apiUrl = 'http://localhost:3000/videos';

  constructor(private http: HttpClient) { }

  get() {
    return this.http.get<Video[]>(this.apiUrl);
  }

  getVideoById(id: number): Observable<Video | undefined> {
    return this.http.get<Video[]>(this.apiUrl).pipe(
      map((videos) => videos.find((video) => video.id === id))
    );
  }
}
