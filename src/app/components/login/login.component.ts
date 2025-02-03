import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService, AuthResponse } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  formLogin!: FormGroup;
  submite: boolean = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.formLogin = this.fb.group({
      usernameOrEmail: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  // Getter para facilitar el acceso a los controles del formulario
  get f() {
    return this.formLogin.controls;
  }

  /**
   * onLogin()
   * Se ejecuta al enviar el formulario de login
   */
  onLogin() {
    if (this.formLogin.invalid) {
      this.submite = true;
      setTimeout(() => (this.submite = false), 5000);
      return;
    }

    const { usernameOrEmail, password } = this.formLogin.value;

    this.authService.login(usernameOrEmail, password).subscribe({
      next: (res: AuthResponse) => {
        // Almacenar en sessionStorage el token, correo, usuario y contraseña
        sessionStorage.setItem('token', res.token);
        sessionStorage.setItem('correo', res.correo);
        sessionStorage.setItem('usuario', res.nombre);

        Swal.fire({
          icon: 'success',
          title: 'Bienvenido',
          text: 'Inicio de sesión exitoso',
          timer: 2000
        }).then(() => {
          this.router.navigate(['/inicio']);
        });
      },
      error: (err) => {
        console.error(err);

        if (err.error?.message && err.error.message.includes("Full authentication is required")) {
          this.errorMessage = "Debes iniciar sesión con credenciales válidas.";
        } else {
          this.errorMessage = err.error?.message || 'Credenciales inválidas. Inténtalo nuevamente.';
        }

        setTimeout(() => {
          this.errorMessage = '';
        }, 3000);

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: this.errorMessage,
          timer: 2000
        });
      }
    });
  }

  /**
   * Método para navegar a la vista de registro
   */
  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}
