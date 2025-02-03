import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, map } from 'rxjs';

export interface AuthResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiBaseUrl; // Asegúrate de que esta URL sea la correcta

  constructor(private http: HttpClient) { }

  // Llamada al endpoint de login
  login(usernameOrEmail: string, password: string): Observable<AuthResponse> {
    const url = `${this.apiUrl}/auth/login`;
    return this.http.post<AuthResponse>(url, { usernameOrEmail, password });
  }

  // Llamada al endpoint de registro
  register(username: string, email: string, password: string): Observable<AuthResponse> {
    const url = `${this.apiUrl}/auth/register`;
    return this.http.post<AuthResponse>(url, { username, email, password });
  }

  // Llamada al endpoint que valida el token
  validateToken(token: string): Observable<boolean> {
    const url = `${this.apiUrl}/auth/validate`;
    // GET con header Authorization: Bearer <token>
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.get(url, { headers, responseType: 'text' }).pipe(
      // Si no hay error, la respuesta es "Token válido" (200).
      map(() => true)
    );
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
  }
}
