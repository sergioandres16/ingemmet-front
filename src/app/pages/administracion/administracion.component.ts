// administracion.component.ts
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

/** Importamos MatDialog para el modal. */
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

// Modal que creamos
import { InfoModalComponent } from './modals/info-modal.component';
import { InfoModalData } from './modals/info-modal.component';

// Tu servicio de firmas
import { SignatureService, Signature } from '../../services/signature.service';
import { AuthService } from '../../services/auth.service';

// Para guardar el archivo descargado (Excel)
import { saveAs } from 'file-saver';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-administracion',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,

    // Material
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,  // <- IMPORTANTE para usar el modal

    // Si tu InfoModal es standalone, no hace falta importarlo aquí
    // a menos que quieras usarlo como child component en la plantilla
    // InfoModalComponent
  ],
  templateUrl: './administracion.component.html',
  styleUrls: ['./administracion.component.scss']
})
export class AdministracionComponent implements OnInit, AfterViewInit {
  // Columnas
  displayedColumns: string[] = ['id','dni','rutafir','nombre','fechahora'];
  dataSource: MatTableDataSource<Signature> = new MatTableDataSource<Signature>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Filtros
  selectedColumn: 'dni' | 'nombre' = 'nombre';
  searchTerm: string = '';
  dateFilter: string = '';
  startDateFilter: string = '';
  endDateFilter: string = '';

  constructor(
    private signatureService: SignatureService,
    private authService: AuthService,
    private dialog: MatDialog  // Inyectamos MatDialog
  ) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
    if (!token) {
      Swal.fire('Sesión Expirada', 'Por favor, inicia sesión nuevamente.', 'info');
      return;
    }
    this.cargarFirmas();
  }

  ngAfterViewInit(): void {
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
        Swal.fire('Error','No se pudieron cargar las firmas.','error');
      }
    });
  }

  /**
   * Filtro global (material) que se aplica en memoria.
   */
  applyFilterGeneral(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const valor = input.value ?? '';
    this.dataSource.filter = valor.trim().toLowerCase();
  }

  /**
   * Aplica el filtro (columna + fecha exacta + rango) en memoria.
   */
  applyFilter(): void {
    this.signatureService.getAllSignatures().subscribe({
      next: (data) => {
        const col = this.selectedColumn as keyof Signature;

        this.dataSource.data = data.filter((sig) => {
          const sigDateOnly = sig.fechahora
            ? sig.fechahora.substring(0, 10)
            : '';

          // Filtra por columna
          if (this.searchTerm) {
            if (!String(sig[col]).toLowerCase().includes(this.searchTerm.toLowerCase())) {
              return false;
            }
          }
          // Filtra fecha exacta
          if (this.dateFilter) {
            if (!sigDateOnly.startsWith(this.dateFilter)) {
              return false;
            }
          }
          // Filtra rango
          if (this.startDateFilter && sigDateOnly < this.startDateFilter) {
            return false;
          }
          if (this.endDateFilter && sigDateOnly > this.endDateFilter) {
            return false;
          }
          return true;
        });
      },
      error: (err) => {
        console.error('Error al filtrar firmas:', err);
      }
    });
  }

  refrescar(): void {
    this.cargarFirmas();
  }

  /**
   * Llama al backend para descargar un Excel con los datos filtrados.
   */
  exportTableToExcel(): void {
    const filtros = {
      selectedColumn: this.selectedColumn,
      searchTerm: this.searchTerm,
      dateFilter: this.dateFilter,
      startDateFilter: this.startDateFilter,
      endDateFilter: this.endDateFilter
    };

    this.signatureService.exportSignaturesToExcel(filtros).subscribe({
      next: (blob) => {
        saveAs(blob, 'FirmasFiltradas.xlsx');
      },
      error: (err) => {
        console.error('Error descargando Excel:', err);
      }
    });
  }

  /**
   * ABRIR EL MODAL DE INFORMACIÓN
   * - totalAllowed: 1000 (hardcode)
   * - totalUsed: cantidad de filas en la tabla (this.dataSource.data.length)
   */
  openInfoModal(): void {
    const totalAllowed = 1000;  // Cantidad total de firmas permitidas
    const totalUsed = this.dataSource.data.length; // Cantidad de filas en la tabla

    // Abrimos el modal
    this.dialog.open<InfoModalComponent, InfoModalData>(InfoModalComponent, {
      width: '500px',
      data: {
        totalAllowed: totalAllowed,
        totalUsed: totalUsed
      }
    });
  }
}
