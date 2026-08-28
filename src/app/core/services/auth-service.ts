import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  token = signal<string | null>(localStorage.getItem('token'));

  login(user: string, pass: string): Observable<string> {
    const credentials = btoa(`${user}:${pass}`);
    const headers = new HttpHeaders({
      Authorization: `Basic ${credentials}`,
    });

    return this.http
      .get(`${environment.apiUrl}/login`, {
        headers,
        responseType: 'text',
      })
      .pipe(
        tap((jwt) => {
          const bearerToken = jwt.startsWith('Bearer ') ? jwt : `Bearer ${jwt}`;
          localStorage.setItem('token', bearerToken);
          this.token.set(bearerToken);
        }),
      );
  }

  logout() {
    localStorage.removeItem('token');
    this.token.set(null);
  }

  isAuthenticated(): boolean {
    return !!this.token();
  }
}
