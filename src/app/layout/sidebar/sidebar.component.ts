import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import Swal from 'sweetalert2';
import { SidebarService } from '../../services/sidebar.service';
import { AuthService } from '../../services/auth.service';
import { NgScrollbarModule } from 'ngx-scrollbar';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, NgScrollbarModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [
    trigger('slide', [
      state('up', style({ height: 0 })),
      state('down', style({ height: '*' })),
      transition('up <=> down', animate(200))
    ])
  ]
})
export class SidebarComponent implements OnInit {
  // Menús de navegación
  menus: any[] = [
    { title: 'Principal', icon: 'fa-solid fa-home', url: '/inicio/home', type: 'link' },
    {
      title: 'Administración',
      icon: 'fa-solid fa-gear',
      type: 'dropdown',
      active: false,
      submenus: [
        { title: 'Usuarios', url: '/inicio/usuarios', icon: 'fa-solid fa-users' },
        { title: 'Configuración', url: '/inicio/configuracion', icon: 'fa-solid fa-sliders' }
      ]
    },
    { title: 'Dashboard', icon: 'fa-solid fa-chart-line', url: '/inicio/dashboard', type: 'link' }
  ];

  // Variables para almacenar la información del usuario
  nombres: string | null = '';
  correo: string | null = '';

  constructor(
    private router: Router,
    private sidebarService: SidebarService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Recupera los datos del usuario del sessionStorage
    this.nombres = sessionStorage.getItem('nombre');
    this.correo = sessionStorage.getItem('correo');
  }

  /** Retorna el estado del sidebar (para mostrar/ocultar en el layout) */
  getSideBarState(): boolean {
    return this.sidebarService.getSidebarState();
  }

  /**
   * Cambia el estado de un menú tipo dropdown.
   * Activa o desactiva el menú y cierra los demás.
   */
  toggle(currentMenu: any): void {
    if (currentMenu.type === 'dropdown') {
      this.menus.forEach(element => {
        if (element === currentMenu) {
          currentMenu.active = !currentMenu.active;
        } else {
          element.active = false;
        }
      });
    }
  }

  /** Retorna 'down' o 'up' según el estado del menú (para la animación) */
  getState(currentMenu: any): string {
    return currentMenu.active ? 'down' : 'up';
  }

  /** Cambia el estado del sidebar (por ejemplo, para ocultarlo o mostrarlo) */
  toggleSidebar(): void {
    this.sidebarService.setSidebarState(!this.sidebarService.getSidebarState());
  }

  /** Cierra el sidebar (útil en dispositivos móviles) */
  cerrarSidebar(): void {
    this.sidebarService.toggle();
  }

  /**
   * Ejecuta el cierre de sesión mostrando un SweetAlert de confirmación.
   * Al confirmar, se eliminan los datos de sesión y se redirige a la ruta raíz.
   */
  cerrarSession(e: any): void {
    Swal.fire({
      title: 'Desea cerrar sesión?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, cerrar sesión!'
    }).then((result) => {
      if (result.isConfirmed) {
        // Elimina la información del usuario
        sessionStorage.removeItem('nombre');
        sessionStorage.removeItem('correo');
        sessionStorage.removeItem('token');
        sessionStorage.clear();
        this.mensaje();
      }
    });
  }

  /** Muestra un mensaje de sesión cerrada y redirige a la ruta raíz */
  mensaje(): void {
    Swal.fire({
      icon: 'success',
      title: 'Sesión Cerrada',
      text: 'Vuelva pronto'
    }).then(() => {
      this.router.navigate(['/']);
    });
  }
}
