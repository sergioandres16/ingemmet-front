import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  toggled = false;

  constructor() {}

  toggle() {
    this.toggled = !this.toggled;
  }

  getSidebarState() {
    return this.toggled;
  }

  setSidebarState(state: boolean) {
    this.toggled = state;
  }

  getMenuList() {
    return [
      {
        title: 'INGEMMET MENU',
        type: 'header'
      },
      {
        title: 'Principal',
        icon: 'assets/img/sistema.gif',
        active: false,  // Asegurar que inicia en falso
        type: 'dropdown',
        badge: {
          class: 'badge-warning',
        },
        submenus: [
          {
            title: 'Inicio',
            badge: {
              class: 'badge-success'
            },
            icon: 'assets/img/icon_home.gif',
            url: 'home'
          }
        ]
      },
      {
        title: 'Administración',
        icon: 'assets/img/administracion.gif',
        active: false, // Asegurar que inicia en falso
        type: 'dropdown',
        badge: {
          class: 'badge-danger'
        },
        submenus: [
          {
            title: 'Listado de Firmas',
            icon: 'assets/img/icon_firmadig.gif',
            url: 'administracion'
          }
        ]
      },
      {
        title: 'Cerrar',
        icon: 'fa-solid fa-right-from-bracket',
        active: false, // Asegurar que inicia en falso
        codigo: 'tcSalir',
        type: 'dropdown',
        badge: {
          class: 'badge-success'
        },
        submenus: [
          {
            title: 'Cerrar Sesión',
            icon2: 'fa-solid fa-power-off',
            codigo: 'csSalir'
          }
        ]
      }
    ];
  }
}
