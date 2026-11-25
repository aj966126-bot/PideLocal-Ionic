
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.page')
        .then(m => m.LoginPage)
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./home/home.page')
        .then(m => m.HomePage)
  },
  {
    path: 'restaurante',
    loadComponent: () =>
      import('./restaurante/restaurante.page')
        .then(m => m.RestaurantePage)
  },
  {
    path: 'carrito',
    loadComponent: () =>
      import('./carrito/carrito.page')
        .then(m => m.CarritoPage)
  },
  {
    path: 'seguimiento',
    loadComponent: () =>
      import('./seguimiento/seguimiento.page')
        .then(m => m.SeguimientoPage)
  },
  {
    path: 'favoritos',
    loadComponent: () =>
      import('./seccion/seccion.page')
        .then(m => m.SeccionPage)
  },
  {
    path: 'perfil',
    loadComponent: () =>
      import('./seccion/seccion.page')
        .then(m => m.SeccionPage)
  },
  {
    path: 'configuracion',
    loadComponent: () =>
      import('./seccion/seccion.page')
        .then(m => m.SeccionPage)
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];