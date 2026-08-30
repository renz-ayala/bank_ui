import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);

  private token = signal<string | null>(localStorage.getItem('token'));
  tokenState = this.token.asReadonly();

  private credentials = signal<string | null>(null);
  credentialState = this.credentials.asReadonly();

  login(base64Credentials: string): Observable<string> {
    this.credentials.set(base64Credentials);

    const uri = `${environment.apiUrl}/login`;
    return this.http
      .get(uri, { responseType: 'text', })
      .pipe(
        tap((jwt) => {
          localStorage.setItem('token', jwt);
          this.token.set(jwt);
        }),
      );
  }

  logout() {
    localStorage.removeItem('token');
    this.credentials.set(null);
    this.token.set(null);
  }

  isAuthenticated(): boolean {
    return this.token() != null;
  }
}
