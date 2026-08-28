import { Component, inject } from '@angular/core';
import { ClientServices } from '../../../core/services/client-services';
import { AuthService } from '../../../core/services/auth-service';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [FormsModule, JsonPipe],
  templateUrl: './clients.html',
  styleUrl: './clients.scss',
})
export class Clients {
  private clientServices = inject(ClientServices);
  public authServices = inject(AuthService);

  base64Auth = '';

  clientId = '';
  sendEncrypted = false;
  dashboardData: any = null;

  cryptoInput = '';
  cryptoResult = '';

  base64Input = '';
  base64Result = '';

  onLogin() {
    if (!this.base64Auth) return;

    this.authServices.login(this.base64Auth).subscribe({
      next: () => {
        this.base64Auth = '';
      },
      error: () => alert('Error en autenticación'),
    });
  }

  onLogout() {
    this.authServices.logout();
    this.dashboardData = null;
  }

  onGetDashboard() {
    if (!this.clientId) return;

    const request$ = this.sendEncrypted
      ? this.clientServices.getDashboardEncrypted(this.clientId)
      : this.clientServices.getDashboard(this.clientId);

    request$.subscribe({
      next: (res) => (this.dashboardData = res),
      error: (err) =>
        alert('Error al consultar dashboard: ' + (err.error?.message || err.statusText)),
    });
  }

  onEncrypt() {
    if (!this.cryptoInput) return;
    this.clientServices.encryptData(this.cryptoInput).subscribe({
      next: (res) => (this.cryptoResult = res),
      error: () => alert('Error al encriptar'),
    });
  }

  onDecrypt() {
    if (!this.cryptoInput) return;
    this.clientServices.decryptData(this.cryptoInput).subscribe({
      next: (res) => (this.cryptoResult = res),
      error: () => alert('Error al desencriptar'),
    });
  }

  onBase64(action: 'encode' | 'decode') {
    if (!this.base64Input) return;
    this.clientServices.processBase64(this.base64Input, action).subscribe({
      next: (res) => (this.base64Result = res.text),
      error: () => alert('Error al procesar Base64'),
    });
  }

  copyToClipboard(text: string) {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      alert('Copiado al portapapeles');
    });
  }
}
