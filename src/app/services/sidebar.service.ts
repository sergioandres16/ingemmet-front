import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  toggled = false;

  constructor() { }



  toggle() {
    this.toggled = ! this.toggled;
  }

  getSidebarState() {
    return this.toggled;
  }

  setSidebarState(state: boolean) {
    this.toggled = state;
  }

  getMenuList(rol: any) {
    let array = [];
    if (rol == 'administrador') {
      array = [null, null, null];
      return this.getRoles(array);
    } else if (rol == 'superadministrador') {
      array = [
        'Administrado',
        'assets/img/icon_usuarios.gif',
        'administracion/registrar-Usuario',
        'Auditoria',
        'assets/img/icon-auditoria.png',
        'administracion/auditoria',
      ];
      return this.getRoles(array);
    }
    return []; // Retornamos un array vacío en caso de no coincidir con ningún rol
  }

  getRoles(title: (string | null)[]){
    return  [
      {
        title: 'LUZ DEL SUR MENU',
        type: 'header'
      },
      {
        title: 'Principal',
        icon: 'assets/img/sistema.gif',
        active: false,
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
            icon:'assets/img/icon_home.gif',
            url: 'home'
          }
        ]
      },
      {
        title: 'Administración',
        icon: 'assets/img/administracion.gif',
        active: false,
        type: 'dropdown',
        badge: {
          class: 'badge-danger'
        },
        submenus: [
          {
            title: 'Notificaciones',
            icon:'assets/img/icon_firmadig.gif',
            url: 'administracion/listar-notificaciones'
          },
          {
            title: 'Prueba',
            icon:'assets/img/icon_firmadig.gif',
            url: 'administracion/prueba'
          },
          {
            title: 'Correo Libre',
            icon:'assets/img/icon_firmadig.gif',
            url: 'administracion/correolibre'
          },
          {
            title: title[0],
            icon:title[1],
            url: title[2]
          },
          {
            title: title[3],
            icon:title[4],
            url: title[5]
          }
        ]
      },
      {
        title:'Cerrar',
        icon:'fa-solid fa-right-from-bracket',
        active:false,
        codigo:'tcSalir',
        type:'dropdown',
        badge:{
          class: 'badge-success'
        },
        submenus:[
          {
            title:'Cerrar Sesión',
            icon2:'fa-solid fa-power-off',
            codigo: 'csSalir'
          }
        ]
      }
    ]
  }


}
