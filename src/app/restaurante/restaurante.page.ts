
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import {
  IonContent,
  IonCard,
  IonCardContent,
  IonIcon,
  IonButton,
  IonChip,
  IonList,
  IonItem,
  IonLabel,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonFooter,
  ToastController,
  AlertController
} from '@ionic/angular';

import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  heartOutline,
  heart,
  timeOutline,
  star,
  bagHandleOutline,
  addOutline,
  informationCircleOutline
} from 'ionicons/icons';

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  emoji: string;
  categoria: string;
}

interface ArticuloCarrito {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  restaurante: string;
  emoji: string;
}

@Component({
  selector: 'app-restaurante',
  templateUrl: './restaurante.page.html',
  styleUrls: ['./restaurante.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonCard,
    IonCardContent,
    IonIcon,
    IonButton,
    IonChip,
    IonList,
    IonItem,
    IonLabel,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonFooter
  ]
})
export class RestaurantePage {

  favorito = false;
  categoriaSeleccionada = 'Todos';

  productos: Producto[] = [
    {
      id: 1,
      nombre: 'Patio Clásica',
      descripcion: 'Carne, queso, lechuga y salsa de la casa',
      precio: 395,
      emoji: '🍔',
      categoria: 'Hamburguesas'
    },
    {
      id: 2,
      nombre: 'Pollo Crunch',
      descripcion: 'Pollo crujiente, repollo y mayonesa picante',
      precio: 350,
      emoji: '🍔',
      categoria: 'Hamburguesas'
    },
    {
      id: 3,
      nombre: 'Papas Patio',
      descripcion: 'Papas sazonadas con salsa especial',
      precio: 175,
      emoji: '🍟',
      categoria: 'Complementos'
    }
  ];

  carrito: ArticuloCarrito[] = [];

  readonly claveCarrito = 'pidelocal-carrito-v1';

  constructor(
    private router: Router,
    private toastController: ToastController,
    private alertController: AlertController
  ) {
    addIcons({
      arrowBackOutline,
      heartOutline,
      heart,
      timeOutline,
      star,
      bagHandleOutline,
      addOutline,
      informationCircleOutline
    });

    this.cargarCarrito();
  }

  ionViewWillEnter() {
    this.cargarCarrito();
  }

  get productosFiltrados(): Producto[] {
    if (this.categoriaSeleccionada === 'Todos') {
      return this.productos;
    }

    return this.productos.filter(
      p => p.categoria === this.categoriaSeleccionada
    );
  }

  get cantidadCarrito(): number {
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

  cargarCarrito() {
    try {
      const datos = localStorage.getItem(this.claveCarrito);
      const articulos = datos ? JSON.parse(datos) : [];

      this.carrito = Array.isArray(articulos)
        ? articulos
        : [];
    } catch {
      this.carrito = [];
    }
  }

  guardarCarrito() {
    try {
      localStorage.setItem(
        this.claveCarrito,
        JSON.stringify(this.carrito)
      );
    } catch {
      this.mostrarMensaje(
        'No se pudo guardar el carrito en este navegador.'
      );
    }
  }

  seleccionarCategoria(categoria: string) {
    this.categoriaSeleccionada = categoria;
  }

  async agregarProducto(
    producto: Producto,
    deslizable?: IonItemSliding
  ) {
    const existente = this.carrito.find(
      articulo => articulo.id === producto.id
    );

    if (existente) {
      existente.cantidad++;
    } else {
      this.carrito.push({
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: 1,
        restaurante: 'Burger Patio',
        emoji: producto.emoji
      });
    }

    this.guardarCarrito();

    if (deslizable) {
      await deslizable.close();
    }

    await this.mostrarMensaje(
      producto.nombre + ' agregado al carrito'
    );
  }

  async mostrarMensaje(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 1600,
      position: 'bottom',
      color: 'dark'
    });

    await toast.present();
  }

  async verDetalle(producto: Producto) {
    const alerta = await this.alertController.create({
      header: producto.nombre,
      message:
        producto.descripcion +
        '\n\nPrecio: RD$' + producto.precio,
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel'
        },
        {
          text: 'Agregar',
          handler: () => {
            this.agregarProducto(producto);
          }
        }
      ]
    });

    await alerta.present();
  }

  alternarFavorito() {
    this.favorito = !this.favorito;
  }

  volver() {
    this.router.navigateByUrl('/home');
  }

  abrirCarrito() {
    this.router.navigateByUrl('/carrito');
  }
}