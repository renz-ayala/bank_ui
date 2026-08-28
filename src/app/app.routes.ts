import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'main',
    pathMatch: 'full',
  },
  {
    path: 'main',
    loadComponent: () => import('./features/pages/clients/clients').then(m => m.Clients),
  },
  {
    path: '**',
    redirectTo: '',
  }
];
