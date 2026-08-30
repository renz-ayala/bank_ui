import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth-service';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  if (req.url.includes('v1/banca/dashboard/base64')) {
    return next(req);
  }

  if (req.url.includes('v1/login')) {
    const credentials = authService.credentialState();
    req = req.clone({
      setHeaders: {
        Authorization: `Basic ${credentials}`,
      }
    });
    return next(req);
  }

  const token = authService.tokenState();
  req = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    }
  })

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.logout();
      }
      return throwError(() => error);
    })
  );
};
