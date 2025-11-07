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
  {
    path: 'users/create',
    loadComponent: () =>
      import('./page/user-create/user-create').then((m) => m.UserCreateComponent),
  },
  {
    path: 'users/edit/:id',
    loadComponent: () =>
      import('./page/user-editor.component/user-editor.component').then(
        (m) => m.UserEditorComponent
      ),
  },
];
