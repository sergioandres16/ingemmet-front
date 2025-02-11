// signature.service.ts
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

@Injectable({
  providedIn: 'root'
})
export class SignatureService {
  constructor(private http: HttpClient) {}

  getAllSignatures(): Observable<Signature[]> {
    return this.http.get<Signature[]>(`${environment.apiBaseUrl}/signatures`);
  }
}
