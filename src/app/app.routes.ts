import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { map } from 'rxjs';
import { AuthService } from './core/services/auth.service';
import { Router } from '@angular/router';

const authGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.user$.pipe(map(u => {
    if (u) return true;
    return router.parseUrl('/login');
  }));
};

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent) },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'product/new',
    canActivate: [authGuard],
    loadComponent: () => import('./features/product-form/product-form.component').then(m => m.ProductFormComponent)
  },
  {
    path: 'product/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./features/product-form/product-form.component').then(m => m.ProductFormComponent)
  },
  { path: '**', redirectTo: '' }
];
