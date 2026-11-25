
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import {
  IonContent,
  IonIcon,
  IonButton,
  IonCard,
  IonCardContent,
  IonToggle,
  ToastController
} from '@ionic/angular';

import { addIcons } from 'ionicons';

import {
  arrowBackOutline,
  heartOutline,
  personOutline,
  settingsOutline,
  restaurantOutline,
  notificationsOutline,
  checkmarkCircleOutline,
  locationOutline
} from 'ionicons/icons';

type TipoSeccion = 'favoritos' | 'perfil' | 'configuracion';

@Component({
  selector: 'app-seccion',
  standalone: true,
  templateUrl: './seccion.page.html',
  styleUrls: ['./seccion.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonIcon,
    IonButton,
    IonCard,
    IonCardContent,
    IonToggle
  ]
})
export class SeccionPage implements OnInit, OnDestroy {

  tipo: TipoSeccion = 'favoritos';

  notificaciones = false;

  private suscripcion?: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastController: ToastController
  ) {
    addIcons({
      arrowBackOutline,
      heartOutline,
      personOutline,
      settingsOutline,
      restaurantOutline,
      notificationsOutline,
      checkmarkCircleOutline,
      locationOutline
    });
  }

  ngOnInit() {
    this.suscripcion = this.route.url.subscribe(segmentos => {
      const ruta = segmentos[0]?.path;

      if (
        ruta === 'perfil' ||
        ruta === 'configuracion' ||
        ruta === 'favoritos'
      ) {
        this.tipo = ruta;
      } else {
        this.tipo = 'favoritos';
      }
    });

    try {
      this.notificaciones =
        localStorage.getItem('pidelocal-notificaciones') === 'true';
    } catch {
      this.notificaciones = false;
    }
  }

  ngOnDestroy() {
    this.suscripcion?.unsubscribe();
  }

  get titulo(): string {
    switch (this.tipo) {
      case 'perfil':
        return 'Mi perfil';

      case 'configuracion':
        return 'Configuración';

      default:
        return 'Mis favoritos';
    }
  }

  volver() {
    void this.router.navigateByUrl('/home');
  }

  abrirRestaurante() {
    void this.router.navigateByUrl('/restaurante');
  }

  abrirPedidos() {
    void this.router.navigateByUrl('/seguimiento');
  }

  guardarNotificaciones() {
    try {
      localStorage.setItem(
        'pidelocal-notificaciones',
        String(this.notificaciones)
      );
    } catch {
      void this.mostrarMensaje(
        'No se pudo guardar la preferencia.'
      );
    }
  }

  async mostrarMensaje(texto: string) {
    const toast = await this.toastController.create({
      message: texto,
      duration: 1800,
      color: 'dark',
      position: 'bottom'
    });

    await toast.present();
  }
}