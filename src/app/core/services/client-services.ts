import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ClientServices {
  private http = inject(HttpClient);

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      Authorization: token,
    });
  }

  getDashboard(clientId: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/banca/dashboard/get-data/${clientId}`, {
      headers: this.getAuthHeaders(),
    });
  }

  getDashboardEncrypted(clientId: string): Observable<any> {
    return this.encryptData(clientId).pipe(
      switchMap((encryptedId) =>
        this.http.get(
          `${environment.apiUrl}/banca/dashboard/get-data/${encodeURIComponent(encryptedId)}`,
          { headers: this.getAuthHeaders() },
        ),
      ),
    );
  }

  encryptData(data: string): Observable<string> {
    return this.http.get(
      `${environment.apiUrl}/banca/dashboard/encryption/${encodeURIComponent(data)}`,
      {
        responseType: 'text',
      },
    );
  }

  decryptData(data: string): Observable<string> {
    return this.http.get(
      `${environment.apiUrl}/banca/dashboard/decryption/${encodeURIComponent(data)}`,
      {
        responseType: 'text',
      },
    );
  }

  processBase64(text: string, action: 'encode' | 'decode'): Observable<{ text: string }> {
    return this.http.post<{ text: string }>(
      `${environment.apiUrl}/banca/dashboard/base64/${action}`,
      { text },
    );
  }
}
