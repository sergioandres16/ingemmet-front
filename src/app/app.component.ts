import {Component, OnInit} from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {AuthService} from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,  // ✅ Agregar esto
  imports: [RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']  // Agrega los estilos si existen
})
export class AppComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/login']);
    }
  }
}
