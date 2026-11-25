
import {
  Component,
  OnDestroy,
  HostListener
} from '@angular/core';

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
  IonModal,
  AlertController,
  ToastController
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
  removeOutline,
  closeOutline,
  expandOutline,
  informationCircleOutline
} from 'ionicons/icons';

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  foto: string;
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
  standalone: true,
  templateUrl: './restaurante.page.html',
  styleUrls: ['./restaurante.page.scss'],
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
    IonFooter,
    IonModal
  ]
})
export class RestaurantePage implements OnDestroy {

  readonly claveCarrito = 'pidelocal-carrito-v1';

  favorito = false;
  categoriaSeleccionada = 'Todos';

  productos: Producto[] = [
    {
      id: 1,
      nombre: 'Patio Clásica',
      descripcion: 'Carne, queso, lechuga y salsa de la casa',
      precio: 395,
      categoria: 'Hamburguesas',
      foto:
        'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1000&q=85'
    },
    {
      id: 2,
      nombre: 'Pollo Crunch',
      descripcion: 'Pollo crujiente, repollo y mayonesa picante',
      precio: 350,
      categoria: 'Hamburguesas',
      foto:
        'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=1000&q=85'
    },
    {
      id: 3,
      nombre: 'Papas Patio',
      descripcion: 'Papas sazonadas con salsa especial',
      precio: 175,
      categoria: 'Complementos',
      foto:
        'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=1000&q=85'
    }
  ];

  carrito: ArticuloCarrito[] = [];

  // Visor de imágenes
  productoAmpliado: Producto | null = null;

  zoom = 1;
  readonly zoomMax = 4;

  // Seguimiento de los dedos para pinch-to-zoom
  private dedos = new Map<
    number,
    { x: number; y: number }
  >();

  private distanciaBase = 0;
  private zoomBase = 1;

  // Control de la pulsación prolongada
  private pulsacion:
    ReturnType<typeof setTimeout> | null = null;

  private inicioPulsacion:
    { x: number; y: number } | null = null;

  private suprimirClick = false;
  private indicePulsacion: number | null = null;

  constructor(
    private router: Router,
    private alerts: AlertController,
    private toasts: ToastController
  ) {
    addIcons({
      arrowBackOutline,
      heartOutline,
      heart,
      timeOutline,
      star,
      bagHandleOutline,
      addOutline,
      removeOutline,
      closeOutline,
      expandOutline,
      informationCircleOutline
    });

    this.cargarCarrito();
  }

  ionViewWillEnter() {
    this.cargarCarrito();
  }

  ngOnDestroy() {
    this.cancelarPulsacion();
    this.dedos.clear();
  }

  get productosFiltrados(): Producto[] {
    if (this.categoriaSeleccionada === 'Todos') {
      return this.productos;
    }

    return this.productos.filter(
      producto =>
        producto.categoria === this.categoriaSeleccionada
    );
  }

  get cantidadCarrito(): number {
    return this.carrito.reduce(
      (total, producto) => total + producto.cantidad,
      0
    );
  }

  get subtotal(): number {
    return this.carrito.reduce(
      (total, producto) =>
        total + producto.precio * producto.cantidad,
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
      void this.mensaje(
        'No se pudo guardar el carrito.'
      );
    }
  }

  seleccionarCategoria(categoria: string) {
    this.categoriaSeleccionada = categoria;
  }

  async mensaje(texto: string) {
    const toast = await this.toasts.create({
      message: texto,
      duration: 1400,
      position: 'bottom',
      color: 'dark'
    });

    await toast.present();
  }

  async agregarProducto(
    producto: Producto,
    deslizable?: IonItemSliding
  ) {
    const existente = this.carrito.find(
      item => item.id === producto.id
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
        emoji: producto.id === 3 ? '🍟' : '🍔'
      });
    }

    this.guardarCarrito();

    if (deslizable) {
      await deslizable.close();
    }

    await this.mensaje(
      producto.nombre + ' agregado al carrito'
    );
  }

  // Mostrar información del producto
  async verDetalle(producto: Producto) {
    const alerta = await this.alerts.create({
      header: producto.nombre,
      message:
        producto.descripcion +
        ' · RD$' + producto.precio,
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel'
        },
        {
          text: 'Ver fotografía',
          handler: () => {
            this.abrirFoto(producto);
          }
        },
        {
          text: 'Agregar',
          handler: () => {
            void this.agregarProducto(producto);
          }
        }
      ]
    });

    await alerta.present();
  }

  // LONG-PRESS
  // Mantener presionada la fotografía durante 750 ms.

  comenzarPulsacion(
    evento: PointerEvent,
    producto: Producto
  ) {
    if (
      evento.pointerType === 'mouse' &&
      evento.button !== 0
    ) {
      return;
    }

    this.cancelarPulsacion();

    this.suprimirClick = false;
    this.indicePulsacion = evento.pointerId;

    this.inicioPulsacion = {
      x: evento.clientX,
      y: evento.clientY
    };

    this.pulsacion = setTimeout(() => {
      this.pulsacion = null;
      this.suprimirClick = true;
      this.inicioPulsacion = null;

      void this.opcionesPulsacion(producto);
    }, 750);
  }

  moverPulsacion(evento: PointerEvent) {
    if (
      this.indicePulsacion !== evento.pointerId ||
      !this.inicioPulsacion
    ) {
      return;
    }

    const distancia = Math.hypot(
      evento.clientX - this.inicioPulsacion.x,
      evento.clientY - this.inicioPulsacion.y
    );

    if (distancia > 12) {
      this.cancelarPulsacion();
    }
  }

  terminarPulsacion() {
    if (this.pulsacion) {
      clearTimeout(this.pulsacion);
    }

    this.pulsacion = null;
    this.inicioPulsacion = null;
    this.indicePulsacion = null;
  }

  cancelarPulsacion() {
    this.terminarPulsacion();
  }

  // Un clic corto abre la fotografía.
  // Un clic prolongado abre las opciones.

  tocarFoto(producto: Producto) {
    if (this.suprimirClick) {
      this.suprimirClick = false;
      return;
    }

    this.abrirFoto(producto);
  }

  async opcionesPulsacion(producto: Producto) {
    const alerta = await this.alerts.create({
      header: 'Opciones del producto',
      subHeader: producto.nombre,
      message: 'Pulsación prolongada detectada.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Ver fotografía',
          handler: () => {
            this.abrirFoto(producto);
          }
        },
        {
          text: 'Ver detalles',
          handler: () => {
            void this.verDetalle(producto);
          }
        },
        {
          text: 'Agregar al carrito',
          handler: () => {
            void this.agregarProducto(producto);
          }
        }
      ]
    });

    await alerta.present();
  }

  // VISOR DE FOTOGRAFÍAS

  abrirFoto(producto: Producto) {
    this.cancelarPulsacion();

    this.productoAmpliado = producto;
    this.zoom = 1;

    this.dedos.clear();
    this.distanciaBase = 0;
    this.zoomBase = 1;
  }

  cerrarFoto() {
    this.productoAmpliado = null;
    this.zoom = 1;

    this.dedos.clear();
    this.distanciaBase = 0;
    this.zoomBase = 1;
  }

  @HostListener('document:keydown.escape')
  cerrarConEscape() {
    if (this.productoAmpliado) {
      this.cerrarFoto();
    }
  }

  // PINCH-TO-ZOOM

  private distancia(): number {
    const puntos = Array.from(this.dedos.values());

    if (puntos.length !== 2) {
      return 0;
    }

    return Math.hypot(
      puntos[0].x - puntos[1].x,
      puntos[0].y - puntos[1].y
    );
  }

  zoomInicio(evento: PointerEvent) {
    if (
      evento.pointerType === 'mouse' &&
      evento.button !== 0
    ) {
      return;
    }

    this.dedos.set(evento.pointerId, {
      x: evento.clientX,
      y: evento.clientY
    });

    if (this.dedos.size === 2) {
      this.distanciaBase = this.distancia();
      this.zoomBase = this.zoom;
    }
  }

  zoomMover(evento: PointerEvent) {
    if (!this.dedos.has(evento.pointerId)) {
      return;
    }

    this.dedos.set(evento.pointerId, {
      x: evento.clientX,
      y: evento.clientY
    });

    if (
      this.dedos.size === 2 &&
      this.distanciaBase > 0
    ) {
      const nuevaEscala =
        this.zoomBase *
        this.distancia() /
        this.distanciaBase;

      this.zoom = Math.min(
        this.zoomMax,
        Math.max(1, nuevaEscala)
      );
    }
  }

  zoomFin(evento: PointerEvent) {
    this.dedos.delete(evento.pointerId);

    this.distanciaBase = 0;
    this.zoomBase = this.zoom;
  }

  // Controles para probar desde la laptop.

  aumentarZoom() {
    this.zoom = Math.min(4, this.zoom + 0.5);
  }

  reducirZoom() {
    this.zoom = Math.max(1, this.zoom - 0.5);
  }

  resetZoom() {
    this.zoom = 1;
  }

  alternarFavorito() {
    this.favorito = !this.favorito;
  }

  volver() {
    void this.router.navigateByUrl('/home');
  }

  abrirCarrito() {
    void this.router.navigateByUrl('/carrito');
  }
}