import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Signature {
  id: number;
  dni: string;
  rutafir: string;
  nombre: string;
  fechahora: string;
}

/**
 * Tipo inline para los filtros de exportación.
 * Si no quieres un archivo aparte, puedes definirlo aquí mismo.
 */
export interface SignatureExportFilter {
  selectedColumn: string;   // 'dni' | 'nombre' ...
  searchTerm: string;       // Cadena de búsqueda
  dateFilter: string;       // Fecha exacta (YYYY-MM-DD)
  startDateFilter: string;  // Rango Desde (YYYY-MM-DD)
  endDateFilter: string;    // Rango Hasta (YYYY-MM-DD)
}

@Injectable({
  providedIn: 'root'
})
export class SignatureService {

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todas las firmas
   */
  getAllSignatures(): Observable<Signature[]> {
    return this.http.get<Signature[]>(`${environment.apiBaseUrl}/signatures`);
  }

  /**
   * Nuevo método para exportar firmas a Excel (o CSV).
   * El backend debe retornar un archivo binario (Blob).
   */
  exportSignaturesToExcel(filtros: SignatureExportFilter): Observable<Blob> {
    // POST a /signatures/export con el body de filtros
    return this.http.post(`${environment.apiBaseUrl}/signatures/export`, filtros, {
      responseType: 'blob'  // Importante para recibir el archivo
    });
  }
}
