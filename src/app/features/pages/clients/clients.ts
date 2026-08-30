import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ClientServices } from '../../../core/services/client-services';
import { AuthService } from '../../../core/services/auth-service';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { LoadingDirective } from '../../../shared/directives/loading-directive';
import { finalize, switchMap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { ClientDashboardDto } from '../../../core/models/client-dashboard-dto.model';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, LoadingDirective],
  providers: [JsonPipe],
  templateUrl: './clients.html',
  styleUrl: './clients.scss',
})
export class Clients implements OnInit {
  clientServices = inject(ClientServices);
  authServices = inject(AuthService);
  fb = inject(FormBuilder);
  jsonPipe = inject(JsonPipe);

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });
  showPassword = signal(false);
  typePassoword = computed(() => (this.showPassword() ? 'text' : 'password'));
  isLoginLoading = signal(false);

  clientForm = this.fb.group({
    clientId: ['', Validators.required],
  });
  isClientLoading = signal(false);
  dashboardData = signal<ClientDashboardDto | null>(null);
  presentation = computed(() =>
    this.dashboardData() ? this.jsonPipe.transform(this.dashboardData()) : 'Sin datos',
  );

  base64Form = this.fb.group({
    base64Input: ['', Validators.required],
  });
  isBase64Loading = signal(false);
  base64Result = signal('');

  cryptoForm = this.fb.group({
    cryptoInput: ['', Validators.required],
  });
  isCryptoLoading = signal(false);
  cryptoResult = signal('');

  ngOnInit() {
    this.clientServices.getCryptData('me', 'encryption').subscribe({
      next: () => {},
      error: () => this.authServices.logout()
      }
    )
  }

  togglePassword() {
    this.showPassword.update((password) => !password);
  }

  onLogin() {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoginLoading.set(true);

    const { username, password } = this.loginForm.value;
    const credentials = `${username}:${password}`;

    this.clientServices
      .processBase64(credentials, 'encode')
      .pipe(
        switchMap((res) => this.authServices.login(res.text)),
        finalize(() => this.isLoginLoading.set(false)),
      )
      .subscribe({
        next: () => {
          this.loginForm.reset();
          this.showPassword.set(false);
        },
        error: (err: HttpErrorResponse) => {
          const errorMessage = this.getMessageFromError(err);
          this.showNotification(errorMessage, true);
        },
      });
  }

  onLogout() {
    this.authServices.logout();
    this.dashboardData.set(null);
    this.cryptoResult.set('');
    this.cryptoForm.reset();
  }

  onGetDashboard() {
    if (this.clientForm.invalid) {
      return;
    }

    this.isClientLoading.set(true);

    const clientId = this.clientForm.controls.clientId.value ?? '';

    this.clientServices
      .getCryptData(clientId, 'encryption')
      .pipe(
        switchMap((res) => this.clientServices.getDashboard(res)),
        finalize(() => this.isClientLoading.set(false)),
      )
      .subscribe({
        next: (res) => {
          this.loginForm.reset();
          this.dashboardData.set(res);
        },
        error: (err: HttpErrorResponse) => {
          const errorMessage = this.getMessageFromError(err);
          this.showNotification(errorMessage, true);
        },
      });
  }

  onEncrypt() {
    if (this.cryptoForm.invalid) {
      return;
    }

    this.isCryptoLoading.set(true);

    const cryptoInput = this.cryptoForm.controls.cryptoInput.value ?? '';

    this.clientServices
      .getCryptData(cryptoInput, 'encryption')
      .pipe(finalize(() => this.isCryptoLoading.set(false)))
      .subscribe({
        next: (res) => this.cryptoResult.set(res),
        error: (error: HttpErrorResponse) => {
          const errorMessage = this.getMessageFromError(error);
          this.showNotification(errorMessage, true);
        },
      });
  }

  onDecrypt() {
    if (this.cryptoForm.invalid) {
      return;
    }

    this.isCryptoLoading.set(true);

    const cryptoInput = this.cryptoForm.controls.cryptoInput.value ?? '';

    this.clientServices
      .getCryptData(cryptoInput, 'decryption')
      .pipe(finalize(() => this.isCryptoLoading.set(false)))
      .subscribe({
        next: (res) => this.cryptoResult.set(res),
        error: (err) => {
          const errorMessage = this.getMessageFromError(err);
          this.showNotification(errorMessage, true);
        },
      });
  }

  onBase64(action: 'encode' | 'decode') {
    if (this.base64Form.invalid) {
      return;
    }

    this.isBase64Loading.set(true);

    const base64Request = this.base64Form.controls.base64Input.value ?? '';

    this.clientServices
      .processBase64(base64Request, action)
      .pipe(finalize(() => this.isBase64Loading.set(false)))
      .subscribe({
        next: (res) => this.base64Result.set(res.text),
        error: (err) => {
          const errorMessage = this.getMessageFromError(err);
          this.showNotification(errorMessage, true);
        },
      });
  }

  copyToClipboard(text: string) {
    if (!text) {
      return;
    }

    navigator.clipboard.writeText(text).then(() => this.showNotification('copiado'));
  }

  showNotification(message: string, isError = false) {
    Swal.fire({
      toast: true, // Activa modo notificación pequeña
      position: 'top-end', // Posición: 'top-end', 'top-start', 'bottom-end', 'bottom-start', 'center'
      icon: isError ? 'error' : 'success', // Icono: 'success', 'error', 'warning', 'info', 'question'
      title: message,
      showConfirmButton: false, // Esconde el botón de OK
      timer: 3000, // Tiempo en milisegundos (3 segundos)
      timerProgressBar: true, // Muestra barra de progreso de tiempo
      background: '#1e293b', // Color de fondo
      color: '#ffffff', // Color del texto
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer); // Pausa el tiempo al pasar el mouse
        toast.addEventListener('mouseleave', Swal.resumeTimer); // Reanuda el tiempo al quitar el mouse
      },
    }).then(() => {});
  }

  getMessageFromError(err: HttpErrorResponse) {
    let msg = 'Error de servidor';
    if (err.error) {
      const errorBody = typeof err.error === 'string' ? JSON.parse(err.error) : err.error;
      msg = errorBody.message || msg;
    }
    return msg;
  }
}
