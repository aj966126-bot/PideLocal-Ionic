
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  IonContent,
  IonIcon,
  IonInput,
  IonButton,
  AlertController
} from '@ionic/angular';

import { addIcons } from 'ionicons';

import {
  locationOutline,
  eyeOutline,
  eyeOffOutline,
  arrowForwardOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    FormsModule,
    IonContent,
    IonIcon,
    IonInput,
    IonButton
  ]
})
export class LoginPage {
  correo = '';
  contrasena = '';
  mostrarContrasena = false;

  constructor(
    private router: Router,
    private alertController: AlertController
  ) {
    addIcons({
      locationOutline,
      eyeOutline,
      eyeOffOutline,
      arrowForwardOutline
    });
  }

  iniciarSesion() {
    // Navegación simulada para la actividad académica.
    // No se realiza autenticación real.
    this.router.navigateByUrl('/home');
  }

  alternarContrasena() {
    this.mostrarContrasena = !this.mostrarContrasena;
  }

  async mostrarAviso(titulo: string, mensaje: string) {
    const alerta = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['Entendido']
    });

    await alerta.present();
  }

  recuperarContrasena() {
    this.mostrarAviso(
      'Recuperar contraseña',
      'Esta función estará disponible en una futura versión.'
    );
  }

  crearCuenta() {
    this.mostrarAviso(
      'Crear cuenta',
      'El registro de usuarios estará disponible próximamente.'
    );
  }
}