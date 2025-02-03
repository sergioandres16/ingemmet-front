import { Component } from '@angular/core';
import {RouterModule} from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,  // ✅ Agregar esto
  imports: [RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']  // Agrega los estilos si existen
})
export class AppComponent {
  title = 'IngemmetFront';
}
