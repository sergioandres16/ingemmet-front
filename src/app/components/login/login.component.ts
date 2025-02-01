import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  usernameOrEmail = '';
  password = '';
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onLogin() {
    if (!this.usernameOrEmail || !this.password) {
      this.errorMessage = 'Complete todos los campos';
      return;
    }
    this.authService.login(this.usernameOrEmail, this.password).subscribe({
      next: (res) => {
        this.authService.setToken(res.token);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = err.error?.message || 'Credenciales inválidas';
      }
    });
  }
}
