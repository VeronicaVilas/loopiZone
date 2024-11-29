import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, filter, Observable, of, switchMap, throwError } from 'rxjs';

import { AuthenticationService } from '../authentication/authentication.service';
import { Subscription } from '../../interfaces/subscription';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  private readonly apiUrl = 'http://localhost:3000/subscription';

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) {}

  private getUserId(): Observable<string> {
    return this.authService.userId$.pipe(
      filter((userId): userId is string => userId !== null)
    );
  }

  getSubscription(): Observable<Subscription[]> {
    return this.getUserId().pipe(
      switchMap((userId) => {
        if (!userId) {
          return throwError(() => new Error('Usuário não autenticado'));
        }
        return this.http.get<Subscription[]>(`${this.apiUrl}?userId=${userId}`);
      }),
      catchError((error) => {
        return of([]);
      })
    );
  }

  getByChannelName(channelName: string): Observable<Subscription[]> {
    return this.http.get<Subscription[]>(`${this.apiUrl}?channelName=${channelName}`);
  }

  addSubscription(channelIcon: string, channelName: string): Observable<Subscription> {
    return this.getUserId().pipe(
      switchMap((userId) => {
        if (!userId) {
          return throwError(() => new Error('Usuário não autenticado'));
        }
        const favorite: Partial<Subscription> = { userId, channelIcon, channelName };
        return this.http.post<Subscription>(this.apiUrl, favorite).pipe(
          switchMap((newSubscription) => {
            localStorage.setItem('isSubscribed', 'true');
            localStorage.setItem('subscriptionId', newSubscription.id);
            return of(newSubscription);
          })
        );
      })
    );
  }

  removeSubscription(subscriptionId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${subscriptionId}`).pipe(
      switchMap(() => {
        localStorage.removeItem('isSubscribed');
        localStorage.removeItem('subscriptionId');
        return of(void 0);
      })
    );
  }
}
