import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {

    const token = this.authService.getToken();
    if (!token) {
      // No hay token
      this.router.navigate(['/login']);
      return of(false);
    }

    // Validar token con el backend:
    return this.authService.validateToken(token).pipe(
      map(isValid => {
        if (isValid) {
          return true;
        } else {
          this.router.navigate(['/login']);
          return false;
        }
      }),
      catchError((err) => {
        // Token inválido o expirado
        this.router.navigate(['/login']);
        return of(false);
      })
    );
  }
}
