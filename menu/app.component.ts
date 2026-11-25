
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import {
  IonApp,
  IonRouterOutlet,
  IonSplitPane,
  IonMenu,
  IonHeader,
  IonToolbar,
  IonContent,
  IonList,
  IonItem,
  IonIcon,
  MenuController
} from '@ionic/angular';

import { addIcons } from 'ionicons';

import {
  menuOutline,
  closeOutline,
  locationOutline,
  homeOutline,
  restaurantOutline,
  receiptOutline,
  heartOutline,
  personOutline,
  settingsOutline,
  logOutOutline,
  chevronForwardOutline
} from 'ionicons/icons';

interface OpcionMenu {
  titulo: string;
  ruta: string;
  icono: string;
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonApp,
    IonRouterOutlet,
    IonSplitPane,
    IonMenu,
    IonHeader,
    IonToolbar,
    IonContent,
    IonList,
    IonItem,
    IonIcon
  ]
})
export class AppComponent {

  opciones: OpcionMenu[] = [
    {
      titulo: 'Inicio',
      ruta: '/home',
      icono: 'home-outline'
    },
    {
      titulo: 'Restaurantes',
      ruta: '/restaurante',
      icono: 'restaurant-outline'
    },
    {
      titulo: 'Mis pedidos',
      ruta: '/seguimiento',
      icono: 'receipt-outline'
    },
    {
      titulo: 'Favoritos',
      ruta: '/favoritos',
      icono: 'heart-outline'
    },
    {
      titulo: 'Mi perfil',
      ruta: '/perfil',
      icono: 'person-outline'
    },
    {
      titulo: 'Configuración',
      ruta: '/configuracion',
      icono: 'settings-outline'
    }
  ];

  constructor(
    public router: Router,
    private menuController: MenuController
  ) {
    addIcons({
      menuOutline,
      closeOutline,
      locationOutline,
      homeOutline,
      restaurantOutline,
      receiptOutline,
      heartOutline,
      personOutline,
      settingsOutline,
      logOutOutline,
      chevronForwardOutline
    });
  }

  get esLogin(): boolean {
    return this.router.url.split('?')[0] === '/login' ||
      this.router.url === '/';
  }

  get rutaActual(): string {
    return this.router.url.split('?')[0];
  }

  estaSeleccionada(opcion: OpcionMenu): boolean {
    return this.rutaActual === opcion.ruta;
  }

  async abrirMenu() {
    if (this.esLogin) {
      return;
    }

    await this.menuController.open('principal');
  }

  async cerrarMenu() {
    await this.menuController.close('principal');
  }

  async navegar(ruta: string) {
    await this.cerrarMenu();

    if (this.rutaActual !== ruta) {
      await this.router.navigateByUrl(ruta);
    }
  }

  async cerrarSesion() {
    await this.cerrarMenu();

    // Acceso simulado: no existe una sesión
    // real en esta versión académica.
    await this.router.navigateByUrl('/login');
  }
}