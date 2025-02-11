import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Signature {
  id: number;
  dni: string;
  rutafir: string;
  nombre: string;
  fechahora: string;
}

@Injectable({
  providedIn: 'root'
})
export class SignatureService {
  private apiUrl = `${environment.apiBaseUrl}/signatures`;

  constructor(private http: HttpClient) {}

  getAllSignatures(): Observable<Signature[]> {
    const token = sessionStorage.getItem('token');
    if (!token) {
      console.error('No hay token disponible en sessionStorage');
      return new Observable();
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get<Signature[]>(this.apiUrl, { headers });
  }
}
