
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  IonContent,
  IonCard,
  IonCardContent,
  IonIcon,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonTextarea,
  IonFooter,
  AlertController,
  ToastController
} from '@ionic/angular';

import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  addOutline,
  removeOutline,
  trashOutline,
  locationOutline,
  bagHandleOutline,
  cashOutline,
  checkmarkCircleOutline,
  receiptOutline
} from 'ionicons/icons';

interface ArticuloCarrito {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  restaurante: string;
  emoji: string;
}

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonCard,
    IonCardContent,
    IonIcon,
    IonButton,
    IonList,
    IonItem,
    IonLabel,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonTextarea,
    IonFooter
  ]
})
export class CarritoPage {

  readonly claveCarrito = 'pidelocal-carrito-v1';
  readonly clavePedido = 'pidelocal-pedido-v1';

  carrito: ArticuloCarrito[] = [];

  instrucciones = '';
  modalidad: 'entrega' | 'recogida' = 'entrega';

  direccion = 'Av. Las Carreras #24, Santiago';
  restaurante = 'Burger Patio';

  confirmando = false;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController
  ) {
    addIcons({
      arrowBackOutline,
      addOutline,
      removeOutline,
      trashOutline,
      locationOutline,
      bagHandleOutline,
      cashOutline,
      checkmarkCircleOutline,
      receiptOutline
    });

    this.cargarCarrito();
  }

  ionViewWillEnter() {
    this.cargarCarrito();
  }

  get cantidadArticulos(): number {
    return this.carrito.reduce(
      (total, articulo) => total + articulo.cantidad,
      0
    );
  }

  get subtotal(): number {
    return this.carrito.reduce(
      (total, articulo) =>
        total + articulo.precio * articulo.cantidad,
      0
    );
  }

  get costoEnvio(): number {
    if (this.carrito.length === 0) {
      return 0;
    }

    return this.modalidad === 'entrega' ? 60 : 0;
  }

  get total(): number {
    return this.subtotal + this.costoEnvio;
  }

  cargarCarrito() {
    try {
      const guardado = localStorage.getItem(this.claveCarrito);
      const datos = guardado ? JSON.parse(guardado) : [];

      this.carrito = Array.isArray(datos)
        ? datos.filter(
            (articulo: ArticuloCarrito) =>
              articulo &&
              Number.isFinite(articulo.precio) &&
              articulo.precio >= 0 &&
              Number.isInteger(articulo.cantidad) &&
              articulo.cantidad > 0
          )
        : [];
    } catch {
      this.carrito = [];
    }
  }

  guardarCarrito(): boolean {
    try {
      localStorage.setItem(
        this.claveCarrito,
        JSON.stringify(this.carrito)
      );

      return true;
    } catch {
      this.mostrarMensaje('No se pudo guardar el carrito.');
      return false;
    }
  }

  aumentar(articulo: ArticuloCarrito) {
    articulo.cantidad++;
    this.guardarCarrito();
  }

  disminuir(articulo: ArticuloCarrito) {
    if (articulo.cantidad > 1) {
      articulo.cantidad--;
      this.guardarCarrito();
    } else {
      this.eliminar(articulo);
    }
  }

  async eliminar(
    articulo: ArticuloCarrito,
    deslizable?: IonItemSliding
  ) {
    this.carrito = this.carrito.filter(
      item => item.id !== articulo.id
    );

    this.guardarCarrito();

    if (deslizable) {
      await deslizable.close();
    }

    await this.mostrarMensaje(
      articulo.nombre + ' eliminado del carrito'
    );
  }

  seleccionarModalidad(
    nuevaModalidad: 'entrega' | 'recogida'
  ) {
    this.modalidad = nuevaModalidad;
  }

  async cambiarDireccion() {
    const alerta = await this.alertController.create({
      header: 'Dirección de entrega',
      message: 'Indica una dirección para la demostración.',
      inputs: [
        {
          name: 'direccion',
          type: 'text',
          value: this.direccion,
          placeholder: 'Escribe tu dirección'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Guardar',
          handler: datos => {
            const nueva = String(datos.direccion || '').trim();

            if (!nueva) {
              return false;
            }

            this.direccion = nueva;
            return true;
          }
        }
      ]
    });

    await alerta.present();
  }

  async mostrarMensaje(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 1500,
      position: 'bottom',
      color: 'dark'
    });

    await toast.present();
  }

  volver() {
    this.router.navigateByUrl('/restaurante');
  }

  async confirmarPedido() {
    if (this.confirmando || this.carrito.length === 0) {
      return;
    }

    if (this.modalidad === 'entrega' &&
        !this.direccion.trim()) {
      await this.mostrarMensaje(
        'Debes indicar una dirección de entrega.'
      );
      return;
    }

    const alerta = await this.alertController.create({
      header: 'Confirmar pedido',
      message:
        'Total: RD$' + this.total +
        '. Este pedido es una simulación académica y ' +
        'no se enviará a ningún restaurante.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Confirmar',
          handler: () => {
            this.registrarPedido();
          }
        }
      ]
    });

    await alerta.present();
  }

  async registrarPedido() {
    if (this.confirmando || this.carrito.length === 0) {
      return;
    }

    this.confirmando = true;

    const pedido = {
      numero: 'PL-' + Date.now().toString().slice(-6),
      restaurante: this.restaurante,
      productos: this.carrito.map(articulo => ({
        ...articulo
      })),
      subtotal: this.subtotal,
      envio: this.costoEnvio,
      total: this.total,
      modalidad: this.modalidad,
      direccion:
        this.modalidad === 'entrega'
          ? this.direccion
          : 'Recogida en el restaurante',
      instrucciones: this.instrucciones,
      pago: 'Efectivo al recibir',
      fecha: new Date().toISOString(),
      estado: 'Pedido recibido'
    };

    try {
      localStorage.setItem(
        this.clavePedido,
        JSON.stringify(pedido)
      );

      localStorage.removeItem(this.claveCarrito);

      this.carrito = [];
      this.instrucciones = '';

      await this.router.navigateByUrl('/seguimiento');

    } catch {
      await this.mostrarMensaje(
        'No se pudo guardar el pedido de demostración.'
      );
    } finally {
      this.confirmando = false;
    }
  }
}