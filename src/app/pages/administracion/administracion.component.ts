import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

// Angular Material
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { SignatureService, Signature } from '../../services/signature.service';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-administracion',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    // Material:
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './administracion.component.html',
  styleUrls: ['./administracion.component.scss']
})
export class AdministracionComponent implements OnInit, AfterViewInit {
  // Definimos las columnas que se mostrarán
  displayedColumns: string[] = ['id','dni','rutafir','nombre','fechahora'];

  // Angular Material DataSource
  dataSource: MatTableDataSource<Signature> = new MatTableDataSource<Signature>([]);

  // Decoradores con '!' para evitar el error de "no initializer..."
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Para filtros
  // Solo permitimos 'dni' o 'nombre' para que TS sepa que coincide con propiedades de Signature
  selectedColumn: 'dni' | 'nombre' = 'nombre';
  searchTerm: string = '';
  dateFilter: string = '';

  constructor(
    private signatureService: SignatureService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
    if (!token) {
      Swal.fire('Sesión Expirada', 'Por favor, inicia sesión nuevamente.', 'info');
      return;
    }

    // Cargar lista inicial
    this.cargarFirmas();
  }

  ngAfterViewInit(): void {
    // Una vez que el componente está renderizado, asociamos el paginador y el sort
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  cargarFirmas(): void {
    this.signatureService.getAllSignatures().subscribe({
      next: (data) => {
        this.dataSource.data = data;
      },
      error: (err) => {
        console.error('Error al cargar firmas:', err);
        Swal.fire('Error','No se pudieron cargar las firmas. Verifica tu sesión.','error');
      }
    });
  }

  /**
   * Filtro global con la funcionalidad nativa de MatTableDataSource
   */
  applyFilterGeneral(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const valor = input.value ?? '';
    // Aplicas tu filtro
    this.dataSource.filter = valor.trim().toLowerCase();
  }

  /**
   * Filtro específico por columna (selectedColumn) + fecha
   * Re-pide los datos al backend y filtra en memoria.
   */
  applyFilter(): void {
    this.signatureService.getAllSignatures().subscribe({
      next: (data) => {
        // Guardamos en una constante la clave (nombre o dni), para indexar Signature de forma segura
        const col = this.selectedColumn as keyof Signature;

        this.dataSource.data = data.filter(sig =>
          (!this.searchTerm ||
            // sig[col] se vuelve string
            String(sig[col]).toLowerCase()
              .includes(this.searchTerm.toLowerCase()))
          &&
          (!this.dateFilter || sig.fechahora.startsWith(this.dateFilter))
        );
      },
      error: (err) => {
        console.error('Error al filtrar firmas:', err);
      }
    });
  }

  refrescar(): void {
    this.cargarFirmas();
  }

  protected readonly HTMLInputElement = HTMLInputElement;
}
