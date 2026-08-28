import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.token();

  // Excluir endpoints públicos que no deben llevar el Bearer JWT
  const isExcluded =
    req.url.includes('/v1/login') || req.url.includes('/v1/banca/dashboard/base64');

  if (token && !isExcluded) {
    const authReq = req.clone({
      headers: req.headers.set(
        'Authorization',
        token.startsWith('Bearer ') ? token : `Bearer ${token}`,
      ),
    });
    return next(authReq);
  }

  return next(req);
};
