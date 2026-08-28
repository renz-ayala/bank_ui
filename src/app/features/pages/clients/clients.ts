import { Component, inject } from '@angular/core';
import { ClientServices } from '../../../core/services/client-services';
import { AuthService } from '../../../core/services/auth-service';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-clients',
  imports: [FormsModule, JsonPipe],
  templateUrl: './clients.html',
  styleUrl: './clients.scss',
})
export class Clients {
  private clientServices = inject(ClientServices);
  public authServices = inject(AuthService);

  user = '';
  password = '';

  clientId = '';
  dashboardData: any = null;

  base64Input = '';
  base64Result = '';

  onLogin() {
    this.authServices.login(this.user, this.password).subscribe({
      next: () => {
        this.user = '';
        this.password = '';
      },
      error: () => alert('Error en autenticación'),
    });
  }

  onLogout() {
    this.authServices.logout();
    this.dashboardData = null;
  }

  onGetDashboard() {
    this.clientServices.getDashboard(this.clientId).subscribe({
      next: (res) => (this.dashboardData = res),
      error: () => alert('Error obteniendo el dashboard'),
    });
  }

  onBase64(action: 'encode' | 'decode') {
    this.clientServices.processBase64(this.base64Input, action).subscribe({
      next: (res) => (this.base64Result = res.text),
      error: () => alert('Error procesando Base64'),
    });
  }
}
