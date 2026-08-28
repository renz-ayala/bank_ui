import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ClientServices {
  private http = inject(HttpClient);

  getDashboard(clientId: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/banca/dashboard/get-data/${clientId}`);
  }

  processBase64(text: string, action: 'encode' | 'decode'): Observable<{ text: string }> {
    return this.http.post<{ text: string }>(
      `${environment.apiUrl}/banca/dashboard/base64/${action}`,
      {
        text,
      },
    );
  }
}
