import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ClientDashboardDto } from '../models/client-dashboard-dto.model';

@Injectable({
  providedIn: 'root',
})
export class ClientServices {
  http = inject(HttpClient);

  getDashboard(clientId: string): Observable<ClientDashboardDto> {
    return this.http.get<ClientDashboardDto>(
      `${environment.apiUrl}/banca/dashboard/get-data/${clientId}`
    );
  }

  getCryptData(data: string, action: 'encryption' | 'decryption'): Observable<string> {
    return this.http.get(
      `${environment.apiUrl}/banca/dashboard/${action}/${encodeURIComponent(data)}`,
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
