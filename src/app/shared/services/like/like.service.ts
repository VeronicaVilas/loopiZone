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

  /** Obtém todos os likes e dislikes do usuário autenticado */
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

  /** Verifica se o usuário já deu like/dislike em um vídeo */
  getLikeByVideo(videoId: string): Observable<Like | null> {
    return this.getUserId().pipe(
      switchMap((userId) =>
        this.http
          .get<Like[]>(`${this.baseUrl}?userId=${userId}&videoId=${videoId}`)
          .pipe(
            switchMap((likes) => of(likes[0] || null)), // Retorna o primeiro resultado ou null
            catchError((error) => {
              console.error('Erro ao buscar like/dislike:', error);
              return of(null);
            })
          )
      )
    );
  }

  /** Adiciona ou atualiza um like/dislike */
  saveLike(videoId: string, like: boolean): Observable<Like> {
    return this.getLikeByVideo(videoId).pipe(
      switchMap((existingLike) =>
        this.getUserId().pipe(
          switchMap((userId) => {
            if (existingLike) {
              // Atualiza like/dislike existente
              return this.http.patch<Like>(`${this.baseUrl}/${existingLike.id}`, {
                like,
              });
            } else {
              // Cria novo like/dislike
              return this.http.post<Like>(this.baseUrl, {
                userId,
                videoId,
                like,
              });
            }
          })
        )
      ),
      catchError((error) => {
        console.error('Erro ao salvar like/dislike:', error);
        return throwError(() => new Error('Erro ao salvar like/dislike.'));
      })
    );
  }

  /** Remove um like/dislike */
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
