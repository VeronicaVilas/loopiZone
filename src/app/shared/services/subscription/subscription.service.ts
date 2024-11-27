import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationService } from '../authentication/authentication.service';
import { catchError, filter, Observable, of, switchMap, throwError } from 'rxjs';
import { Subscription } from '../../interfaces/subscription';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  private readonly baseUrl = 'http://localhost:3000/subscription';

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) {}

  private getUserId(): Observable<string> {
    return this.authService.userId$.pipe(
      filter((userId): userId is string => userId !== null)
    );
  }

  get(): Observable<Subscription[]> {
    return this.getUserId().pipe(
      switchMap((userId) => {
        if (!userId) {
          return throwError(() => new Error('Usuário não autenticado'));
        }
        return this.http.get<Subscription[]>(`${this.baseUrl}?userId=${userId}`);
      }),
      catchError((error) => {
        console.error('Erro ao obter favoritos:', error);
        return of([]);
      })
    );
  }

  getByChannelName(channelName: string): Observable<Subscription[]> {
    return this.http.get<Subscription[]>(`${this.baseUrl}?channelName=${channelName}`);
  }

  post(channelIcon: string, channelName: string): Observable<Subscription> {
    return this.getUserId().pipe(
      switchMap((userId) => {
        if (!userId) {
          return throwError(() => new Error('Usuário não autenticado'));
        }
        const favorite: Partial<Subscription> = { userId, channelIcon, channelName };
        return this.http.post<Subscription>(this.baseUrl, favorite).pipe(
          switchMap((newSubscription) => {
            localStorage.setItem('isSubscribed', 'true');
            localStorage.setItem('subscriptionId', newSubscription.id);
            return of(newSubscription);
          })
        );
      })
    );
  }

  delete(subscriptionId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${subscriptionId}`).pipe(
      switchMap(() => {
        localStorage.removeItem('isSubscribed');
        localStorage.removeItem('subscriptionId');
        return of(void 0);
      })
    );
  }
}
