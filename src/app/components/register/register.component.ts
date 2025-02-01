import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onRegister() {
    if (!this.username || !this.email || !this.password) {
      this.errorMessage = 'Todos los campos son requeridos';
      return;
    }
    this.authService.register(this.username, this.email, this.password).subscribe({
      next: (res: { token: string }) => {
        // Guardar token
        this.authService.setToken(res.token);
        // Navegar a /dashboard
        this.router.navigate(['/dashboard']);
      },
      error: (err: any) => {
        console.error(err);
        this.errorMessage = err.error?.message || 'Error al registrar';
      }
    });
  }
}
