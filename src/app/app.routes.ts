import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/lobby/landing-page/landing-page').then((m) => m.LandingPage),
  },
  {
    path: 'lms/**',
    loadComponent: () => import('./features/last-man-standing/layout/layout').then((m) => m.Layout),
  },
  {
    path: 'results',
    loadComponent: () =>
      import('./features/last-man-standing/pages/result/result').then((m) => m.Result),
  },
];
