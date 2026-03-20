import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/last-man-standing/pages/game-host/game-host').then((m) => m.GameHost),
  },
  {
    path: 'results',
    loadComponent: () =>
      import('./features/last-man-standing/pages/result/result').then((m) => m.Result),
  },
];
