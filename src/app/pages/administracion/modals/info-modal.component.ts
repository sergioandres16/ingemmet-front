import { Component, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef} from '@angular/material/dialog';

/**
 * Estructura de datos que recibe el modal:
 * - totalAllowed: Número de firmas permitidas
 * - totalUsed: Cantidad de firmas realizadas
 */
export interface InfoModalData {
  totalAllowed: number;
  totalUsed: number;
}

@Component({
  selector: 'app-info-modal',
  templateUrl: './info-modal.component.html',
  imports: [
    MatDialogActions,
    MatDialogContent
  ],
  styleUrls: ['./info-modal.component.scss'],
  standalone: true
})
export class InfoModalComponent {

  constructor(
    public dialogRef: MatDialogRef<InfoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: InfoModalData
  ) {}

  /**
   * Calcula cuántas firmas faltan (por ejemplo 1000 - 130).
   */
  get totalRemaining(): number {
    return this.data.totalAllowed - this.data.totalUsed;
  }

  /**
   * Cierra el modal al hacer clic en "Cerrar".
   */
  closeModal(): void {
    this.dialogRef.close();
  }
}
