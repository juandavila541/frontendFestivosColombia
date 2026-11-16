import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReferenciasMaterialModule } from '../../../shared/modulos/referencias-material.module';

@Component({
  selector: 'app-inicio-componente',
  imports: [ReferenciasMaterialModule, RouterLink],
  templateUrl: './inicio-componente.html',
  styleUrl: './inicio-componente.css',
})
export class InicioComponente {
  public secciones = [
    { ruta: '/validacion', titulo: 'Validar festivo', icono: 'event_available',
      descripcion: 'Consulte si una fecha es festivo y vea el calendario de festivos de un año.' },
    { ruta: '/festivos', titulo: 'Festivos', icono: 'celebration',
      descripcion: 'Administre los festivos de cada país.' },
    { ruta: '/paises', titulo: 'Países', icono: 'public',
      descripcion: 'Administre los países registrados.' },
    { ruta: '/tipos', titulo: 'Tipos de festivo', icono: 'category',
      descripcion: 'Administre los tipos de festivo (fijo, ley puente, basado en Pascua...).' },
  ];
}
