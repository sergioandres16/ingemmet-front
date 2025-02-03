import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, AuthResponse } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Opcional si quieres usar SweetAlert2
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class RegisterComponent implements OnInit {
  username: string = '';
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Si necesitas lógica extra al iniciar, agrégala aquí
  }

  /**
   * onRegister()
   * Se llama al hacer submit en el formulario
   */
  onRegister(): void {
    // Validar campos vacíos antes de llamar al back
    if (!this.username || !this.email || !this.password) {
      this.errorMessage = 'Todos los campos son requeridos';
      // Hacer que desaparezca después de 3 segundos
      setTimeout(() => {
        this.errorMessage = '';
      }, 3000);

      // Muestra un alert de error
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: this.errorMessage,
        timer: 2000
      });
      return;
    }

    // Llamar al endpoint de registro
    this.authService.register(this.username, this.email, this.password).subscribe({
      next: (res: AuthResponse) => {
        // Muestra un alert de éxito (usando SweetAlert2 como ejemplo)
        Swal.fire({
          icon: 'success',
          title: 'Registro exitoso',
          text: 'Ahora puedes iniciar sesión',
          timer: 2000
        }).then(() => {
          // Una vez cerrado el alert, redirigir al login
          this.router.navigate(['/login']);
        });
      },
      error: (err) => {
        console.error(err);
        // Verificar si el mensaje de error contiene "Full authentication is required"
        if (err.error?.message && err.error.message.includes("Full authentication is required")) {
          this.errorMessage = "El usuario o correo se encuentran registrados.";
        } else {
          this.errorMessage = err.error?.message || 'Error en el registro';
        }

        // Hacer que desaparezca después de 3 segundos
        setTimeout(() => {
          this.errorMessage = '';
        }, 3000);

        // Muestra un alert de error
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
   * goToLogin()
   * Redirige al login cuando se hace clic en el enlace.
   */
  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
