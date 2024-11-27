import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, filter, Observable, of, switchMap, throwError } from 'rxjs';
import { Favorite } from '../../interfaces/favorite';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

  private readonly baseUrl = 'http://localhost:3000/favorites';

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) {}

  private getUserId(): Observable<string> {
    return this.authService.userId$.pipe(
      filter((userId): userId is string => userId !== null)
    );
  }

  getFavorites(): Observable<Favorite[]> {
    return this.getUserId().pipe(
      switchMap((userId) => {
        if (!userId) {
          return throwError(() => new Error('Usuário não autenticado'));
        }
        return this.http.get<Favorite[]>(`${this.baseUrl}?userId=${userId}`);
      }),
      catchError((error) => {
        console.error('Erro ao obter favoritos:', error);
        return of([]);
      })
    );
  }

  addFavorite(videoId: string): Observable<Favorite> {
    return this.getUserId().pipe(
      switchMap((userId) => {
        if (!userId) {
          return throwError(() => new Error('Usuário não autenticado'));
        }
        const favorite: Partial<Favorite> = { userId, videoId };
        return this.http.post<Favorite>(this.baseUrl, favorite);
      })
    );
  }

  removeFavorite(favoriteId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${favoriteId}`);
  }
}
