import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// Importaciones para Reactive Forms
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
// Importar tu AuthService (o el servicio que maneja la lógica de login)
import { AuthService, AuthResponse } from '../../services/auth.service';

// Si necesitas SweetAlert2
import Swal from 'sweetalert2';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  // El FormGroup principal del login
  formLogin!: FormGroup;

  // Bandera para controlar la visualización de errores
  submite: boolean = false;

  // Mensaje de error general
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Definir el formLogin con sus validaciones
    this.formLogin = this.fb.group({
      usernameOrEmail: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  // Getter para acceder fácilmente a los controles del formulario en la plantilla
  get f() {
    return this.formLogin.controls;
  }

  /**
   * onLogin()
   * Llamado cuando se hace "submit" en el formulario
   */
  onLogin(): void {
    // Si el form es inválido, mostrar errores
    if (this.formLogin.invalid) {
      this.submite = true;
      // Se puede quitar la clase de error tras unos segundos si se quiere
      setTimeout(() => (this.submite = false), 5000);
      return;
    }

    // Extraer valores del formulario
    const { usernameOrEmail, password } = this.formLogin.value;

    // Lógica de login: llamar al servicio con estos datos
    this.authService.login(usernameOrEmail, password).subscribe({
      next: (res: AuthResponse) => {
        // Guardar token usando el método del servicio (usa localStorage).
        this.authService.setToken(res.token);

        Swal.fire({
          icon: 'success',
          title: 'Bienvenido',
          text: 'Inicio de sesión exitoso',
          timer: 2000
        }).then(() => {
          // Redirigir donde quieras
          this.router.navigate(['/dashboard']);
        });
      },
      error: (err) => {
        console.error(err);

        // Verificar si el mensaje de error contiene "Full authentication is required"
        if (err.error?.message && err.error.message.includes("Full authentication is required")) {
          this.errorMessage = "Debes iniciar sesión con credenciales válidas.";
        } else {
          this.errorMessage = err.error?.message || 'Credenciales inválidas. Inténtalo nuevamente.';
        }

        // Hacer que desaparezca después de 3 segundos
        setTimeout(() => {
          this.errorMessage = '';
        }, 3000);

        // Mostrar alerta con SweetAlert2
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
   * goToRegister()
   * Método para navegar a la vista de registro
   */
  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}
