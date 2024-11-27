import { Injectable } from '@angular/core';
import { User } from '../../interfaces/user';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';

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
        const userId = userExists ? users[0].id : null; // Pega o ID se existir
        console.log('Verificação de usuário:', { exists: userExists, id: userId });
        return { exists: userExists, id: userId };
      }),
      catchError(error => {
        console.error('Erro ao verificar usuário:', error);
        return of({ exists: false, id: null });
      })
    );
  }


  post(user: Omit<User, 'id'>): Observable<User> {
    return this.http.post<User>(this.apiUrl, user).pipe(
      catchError(error => {
        console.error('Erro ao cadastrar usuário:', error);
        throw error;
      })
    );
  }
}
