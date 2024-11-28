import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationService } from '../authentication/authentication.service';
import { catchError, filter, Observable, of, switchMap, throwError } from 'rxjs';
import { Like } from '../../interfaces/like';

@Injectable({
  providedIn: 'root'
})
export class LikeService {
  private readonly baseUrl = 'http://localhost:3000/likes';

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) {}

  private getUserId(): Observable<string> {
    return this.authService.userId$.pipe(
      filter((userId): userId is string => userId !== null)
    );
  }

  getLikes(): Observable<Like[]> {
    return this.getUserId().pipe(
      switchMap((userId) =>
        this.http.get<Like[]>(`${this.baseUrl}?userId=${userId}`)
      ),
      catchError((error) => {
        console.error('Erro ao obter likes:', error);
        return of([]); 
      })
    );
  }

  getLikeByVideo(videoId: string): Observable<Like | null> {
    return this.getUserId().pipe(
      switchMap((userId) =>
        this.http
          .get<Like[]>(`${this.baseUrl}?userId=${userId}&videoId=${videoId}`)
          .pipe(
            switchMap((likes) => of(likes[0] || null)), 
            catchError((error) => {
              console.error('Erro ao buscar like/dislike:', error);
              return of(null);
            })
          )
      )
    );
  }

  saveLike(videoId: string, like: boolean): Observable<Like> {
    return this.getUserId().pipe(
      switchMap((userId) => {
        const newLike = { userId, videoId, like };
        return this.http.post<Like>(this.baseUrl, newLike);
      }),
      catchError((error) => {
        console.error('Erro ao salvar like/dislike:', error);
        return throwError(() => new Error('Erro ao salvar like/dislike.'));
      })
    );
  }

  removeLike(videoId: string): Observable<void> {
    return this.getLikeByVideo(videoId).pipe(
      switchMap((existingLike) => {
        if (existingLike) {
          return this.http.delete<void>(`${this.baseUrl}/${existingLike.id}`);
        }
        return of(); 
      }),
      catchError((error) => {
        console.error('Erro ao remover like/dislike:', error);
        return throwError(() => new Error('Erro ao remover like/dislike.'));
      })
    );
  }
}
