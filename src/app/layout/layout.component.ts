import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SidebarService } from '../services/sidebar.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    SidebarComponent
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  fecha: string = '';

  constructor(private sidebarService: SidebarService) {}

  ngOnInit(): void {
    this.updateFecha();
    // Actualizamos la fecha cada segundo
    setInterval(() => {
      this.updateFecha();
    }, 1000);
  }

  private updateFecha(): void {
    const ahora = new Date();
    const year = ahora.getFullYear();
    const month = String(ahora.getMonth() + 1).padStart(2, '0'); // Asegura dos dígitos
    const day = String(ahora.getDate()).padStart(2, '0'); // Asegura dos dígitos
    const hours = String(ahora.getHours()).padStart(2, '0'); // Asegura dos dígitos
    const minutes = String(ahora.getMinutes()).padStart(2, '0'); // Asegura dos dígitos
    const seconds = String(ahora.getSeconds()).padStart(2, '0'); // Asegura dos dígitos

    // Formato corregido: YYYY-MM-DD - HH:MM:SS
    this.fecha = `${year}-${month}-${day} - ${hours}:${minutes}:${seconds}`;
  }

  getClasses(): {} {
    // Aquí podrías agregar clases dinámicas si es necesario
    return {};
  }

  toggleSidebar(): void {
    // Cambia el estado del sidebar
    this.sidebarService.setSidebarState(!this.sidebarService.getSidebarState());
  }

  getSideBarState(): boolean {
    return this.sidebarService.getSidebarState();
  }
}
