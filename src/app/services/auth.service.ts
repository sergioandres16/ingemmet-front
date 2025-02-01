import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, map } from 'rxjs';

interface AuthResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  register(username: string, email: string, password: string): Observable<AuthResponse> {
    const url = `${this.apiUrl}/auth/register`;
    return this.http.post<AuthResponse>(url, { username, email, password });
  }

  login(usernameOrEmail: string, password: string): Observable<AuthResponse> {
    const url = `${this.apiUrl}/auth/login`;
    return this.http.post<AuthResponse>(url, { usernameOrEmail, password });
  }

  validateToken(token: string): Observable<boolean> {
    const url = `${this.apiUrl}/auth/validate`;
    // GET con header Authorization: Bearer <token>
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.get(url, { headers, responseType: 'text' }).pipe(
      // Si no hay error, la respuesta del backend es "Token válido"
      map(() => true)
    );
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
