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
      import('./page/user-creator.component/user-creator.component').then(
        (m) => m.UserCreatorComponent
      ),
  },
  {
    path: 'users/edit/:id',
    loadComponent: () =>
      import('./page/user-editor.component/user-editor.component').then(
        (m) => m.UserEditorComponent
      ),
  },
];
