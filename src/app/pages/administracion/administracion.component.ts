import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignatureService, Signature } from '../../services/signature.service';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-administracion',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './administracion.component.html',
  styleUrls: ['./administracion.component.scss']
})
export class AdministracionComponent implements OnInit {
  signatures: Signature[] = [];
  searchTerm: string = '';
  selectedColumn: string = 'nombre';
  dateFilter: string = '';

  constructor(private signatureService: SignatureService, private authService: AuthService) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
    if (token) {
      this.signatureService.getAllSignatures().subscribe({
        next: (data) => {
          this.signatures = data;
        },
        error: (err) => {
          console.error('Error al cargar firmas:', err);
          alert('Error al cargar las firmas. Verifica que tu sesión está activa.');
        }
      });
    } else {
      alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
    }
  }

  applyFilter(): void {
    this.signatureService.getAllSignatures().subscribe({
      next: (data) => {
        this.signatures = data.filter(sig =>
          (!this.searchTerm || (sig as any)[this.selectedColumn]?.toString().toLowerCase().includes(this.searchTerm.toLowerCase())) &&
          (!this.dateFilter || sig.fechahora.startsWith(this.dateFilter))
        );
      },
      error: (err) => console.error('Error al filtrar firmas:', err)
    });
  }
}
