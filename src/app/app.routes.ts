import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./page/home/home').then((m) => m.Home),
  },
  {
    path: 'users',
    loadComponent: () => import('./page/users/users').then((m) => m.Users),
  },
];
