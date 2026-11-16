import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ReferenciasMaterialModule } from '../shared/modulos/referencias-material.module';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    ReferenciasMaterialModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  public opciones = [
    { ruta: 'inicio', titulo: 'Inicio', icono: 'home' },
    { ruta: 'validacion', titulo: 'Validar festivo', icono: 'event_available' },
    { ruta: 'festivos', titulo: 'Festivos', icono: 'celebration' },
    { ruta: 'paises', titulo: 'Países', icono: 'public' },
    { ruta: 'tipos', titulo: 'Tipos de festivo', icono: 'category' },
  ];
}
