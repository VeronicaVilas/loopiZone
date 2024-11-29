import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';

import { User } from '../../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  userExists(email: string): Observable<{ exists: boolean; id: string | null }> {
    return this.http.get<User[]>(`${this.apiUrl}?email=${email}`).pipe(
      map(users => {
        const userExists = users.length > 0;
        const userId = userExists ? users[0].id : null;
        return { exists: userExists, id: userId };
      }),
      catchError(error => {
        return of({ exists: false, id: null });
      })
    );
  }

  post(user: Omit<User, 'id'>): Observable<User> {
    return this.http.post<User>(this.apiUrl, user).pipe(
      catchError(error => {
        throw error;
      })
    );
  }
}
