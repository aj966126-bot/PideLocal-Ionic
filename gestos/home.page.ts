
import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import {
  IonContent,
  IonSearchbar,
  IonCard,
  IonCardContent,
  IonChip,
  IonIcon,
  IonButton,
  IonList,
  IonRefresher,
  IonRefresherContent,
  IonFab,
  IonFabButton,
  IonBadge,
  AlertController
} from '@ionic/angular';

import { addIcons } from 'ionicons';
import {
  locationOutline,
  chevronForwardOutline,
  searchOutline,
  personOutline,
  heartOutline,
  heart,
  timeOutline,
  homeOutline,
  bagHandleOutline,
  restaurantOutline,
  refreshOutline,
  menuOutline,
  pizzaOutline
} from 'ionicons/icons';

interface Restaurante {
  id: number;
  nombre: string;
  categoria: string;
  tiempo: string;
  envio: number;
  popular: boolean;
  favorito: boolean;
  icono: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonSearchbar,
    IonCard,
    IonCardContent,
    IonChip,
    IonIcon,
    IonButton,
    IonList,
    IonRefresher,
    IonRefresherContent,
    IonFab,
    IonFabButton,
    IonBadge
  ]
})
export class HomePage {

  @ViewChild(IonContent) contenido!: IonContent;

  busqueda = '';
  categoriaSeleccionada = 'Todas';

  categorias = [
    { nombre: 'Hamburguesas', emoji: '🍔' },
    { nombre: 'Pizza', emoji: '🍕' },
    { nombre: 'Pollo', emoji: '🍗' },
    { nombre: 'Criolla', emoji: '🍛' },
    { nombre: 'Postres', emoji: '🍰' },
    { nombre: 'Bebidas', emoji: '🥤' }
  ];

  restaurantes: Restaurante[] = [
    {
      id: 1,
      nombre: 'Burger Patio',
      categoria: 'Hamburguesas · Papas',
      tiempo: '20–30 min',
      envio: 60,
      popular: true,
      favorito: false,
      icono: '🍔'
    },
    {
      id: 2,
      nombre: 'La Esquina Criolla',
      categoria: 'Comida criolla · Pollo',
      tiempo: '30–40 min',
      envio: 80,
      popular: false,
      favorito: false,
      icono: '🍛'
    }
  ];

  constructor(
    private router: Router,
    private alertController: AlertController
  ) {
    addIcons({
      locationOutline,
      chevronForwardOutline,
      searchOutline,
      personOutline,
      heartOutline,
      heart,
      timeOutline,
      homeOutline,
      bagHandleOutline,
      restaurantOutline,
      refreshOutline,
      menuOutline,
      pizzaOutline
    });
  }

  get restaurantesFiltrados(): Restaurante[] {
    const texto = this.busqueda.toLowerCase().trim();

    return this.restaurantes.filter(restaurante => {
      const coincideBusqueda =
        restaurante.nombre.toLowerCase().includes(texto) ||
        restaurante.categoria.toLowerCase().includes(texto);

      const coincideCategoria =
        this.categoriaSeleccionada === 'Todas' ||
        restaurante.categoria.toLowerCase().includes(
          this.categoriaSeleccionada.toLowerCase()
        ) ||
        (this.categoriaSeleccionada === 'Pollo' &&
          restaurante.categoria.toLowerCase().includes('pollo'));

      return coincideBusqueda && coincideCategoria;
    });
  }

  buscar(evento: CustomEvent) {
    this.busqueda = String(evento.detail.value || '');
  }

  seleccionarCategoria(categoria: string) {
    if (this.categoriaSeleccionada === categoria) {
      this.categoriaSeleccionada = 'Todas';
    } else {
      this.categoriaSeleccionada = categoria;
    }
  }

  mostrarTodos() {
    this.categoriaSeleccionada = 'Todas';
    this.busqueda = '';
  }

  actualizar(evento: CustomEvent) {
    // Actualización local para la demostración académica.
    this.mostrarTodos();

    const refresher = evento.target as HTMLIonRefresherElement;
    refresher.complete();
  }

  abrirRestaurante(restaurante: Restaurante) {
    if (restaurante.id === 1) {
      this.router.navigateByUrl('/restaurante');
    } else {
      this.mostrarAviso(
        'La Esquina Criolla',
        'El menú de este restaurante se incorporará próximamente.'
      );
    }
  }

  cambiarFavorito(restaurante: Restaurante, evento: Event) {
    evento.stopPropagation();
    restaurante.favorito = !restaurante.favorito;
  }

  irAlCarrito() {
    this.router.navigateByUrl('/carrito');
  }

  irAlPerfil() {
    this.mostrarAviso(
      'Mi perfil',
      'El perfil estará disponible en una próxima versión.'
    );
  }

  async mostrarAviso(titulo: string, mensaje: string) {
    const alerta = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['Entendido']
    });

    await alerta.present();
  }

  subir() {
    this.contenido.scrollToTop(400);
  }
}