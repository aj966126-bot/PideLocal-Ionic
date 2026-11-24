
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import {
  IonContent,
  IonButton,
  IonIcon,
  ToastController
} from '@ionic/angular';

import { addIcons } from 'ionicons';
import {
  checkmarkOutline,
  checkmarkCircleOutline,
  timeOutline,
  bagHandleOutline,
  homeOutline,
  restaurantOutline,
  arrowForwardOutline,
  receiptOutline
} from 'ionicons/icons';

interface ProductoPedido {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  restaurante: string;
  emoji: string;
}

interface Pedido {
  numero: string;
  restaurante: string;
  productos: ProductoPedido[];
  subtotal: number;
  envio: number;
  total: number;
  modalidad: 'entrega' | 'recogida';
  direccion: string;
  instrucciones: string;
  pago: string;
  fecha: string;
  estado: string;
}

@Component({
  selector: 'app-seguimiento',
  templateUrl: './seguimiento.page.html',
  styleUrls: ['./seguimiento.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonButton,
    IonIcon
  ]
})
export class SeguimientoPage {

  readonly clavePedido = 'pidelocal-pedido-v1';

  pedido: Pedido | null = null;

  etapaActual = 0;

  etapas = [
    {
      titulo: 'Pedido recibido',
      descripcion: 'Tu solicitud fue registrada correctamente.'
    },
    {
      titulo: 'Restaurante preparando',
      descripcion: 'Tu orden está en la cocina.'
    },
    {
      titulo: 'Pedido listo',
      descripcion: 'Tu pedido está listo para salir o recoger.'
    },
    {
      titulo: 'Pedido entregado',
      descripcion: '¡Disfruta tu comida!'
    }
  ];

  constructor(
    private router: Router,
    private toastController: ToastController
  ) {
    addIcons({
      checkmarkOutline,
      checkmarkCircleOutline,
      timeOutline,
      bagHandleOutline,
      homeOutline,
      restaurantOutline,
      arrowForwardOutline,
      receiptOutline
    });

    this.cargarPedido();
  }

  ionViewWillEnter() {
    this.cargarPedido();
  }

  cargarPedido() {
    try {
      const guardado = localStorage.getItem(this.clavePedido);

      if (!guardado) {
        this.pedido = null;
        this.etapaActual = 0;
        return;
      }

      const datos = JSON.parse(guardado);

      if (
        !datos ||
        typeof datos.numero !== 'string' ||
        !Array.isArray(datos.productos) ||
        typeof datos.total !== 'number'
      ) {
        this.pedido = null;
        return;
      }

      this.pedido = datos;

      const indice = this.etapas.findIndex(
        etapa => etapa.titulo === datos.estado
      );

      this.etapaActual = indice >= 0 ? indice : 0;

    } catch {
      this.pedido = null;
      this.etapaActual = 0;
    }
  }

  get tituloEstado(): string {
    if (this.etapaActual === 3) {
      return '¡Tu pedido ha sido entregado!';
    }

    if (this.etapaActual === 2) {
      return '¡Tu pedido está listo!';
    }

    if (this.etapaActual === 1) {
      return '¡Estamos preparando tu pedido!';
    }

    return '¡Tu pedido ha sido recibido!';
  }

  get cantidadProductos(): number {
    if (!this.pedido) {
      return 0;
    }

    return this.pedido.productos.reduce(
      (total, producto) => total + producto.cantidad,
      0
    );
  }

  async avanzarEstado() {
    if (!this.pedido || this.etapaActual >= 3) {
      return;
    }

    const siguiente = this.etapaActual + 1;

    const actualizado: Pedido = {
      ...this.pedido,
      estado: this.etapas[siguiente].titulo
    };

    try {
      localStorage.setItem(
        this.clavePedido,
        JSON.stringify(actualizado)
      );

      this.pedido = actualizado;
      this.etapaActual = siguiente;

      const toast = await this.toastController.create({
        message: 'Estado de demostración actualizado.',
        duration: 1600,
        position: 'bottom',
        color: 'dark'
      });

      await toast.present();

    } catch {
      const toast = await this.toastController.create({
        message: 'No se pudo guardar el nuevo estado.',
        duration: 2000,
        color: 'danger'
      });

      await toast.present();
    }
  }

  volverInicio() {
    this.router.navigateByUrl('/home');
  }

  explorarMenu() {
    this.router.navigateByUrl('/restaurante');
  }
}