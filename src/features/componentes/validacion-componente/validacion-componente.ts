import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { formatDate } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReferenciasMaterialModule } from '../../../shared/modulos/referencias-material.module';
import { Pais } from '../../../shared/entidades/Pais';
import { FestivoService } from '../../../core/servicios/festivo.service';
import { PaisService } from '../../../core/servicios/pais.service';
import { obtenerMensajeError } from '../../../shared/utilidades/mensaje-error';

interface ResultadoValidacion {
  fecha: string;
  pais: string;
  esFestivo: boolean;
  nombreFestivo?: string;
}

@Component({
  selector: 'app-validacion-componente',
  imports: [
    ReferenciasMaterialModule,
    FormsModule
  ],
  templateUrl: './validacion-componente.html',
  styleUrl: './validacion-componente.css',
})
export class ValidacionComponente implements OnInit {

  public paises = signal<Pais[]>([]);
  public idPais: number = 1;
  public fecha: Date | null = new Date();
  public anio: number = new Date().getFullYear();

  public resultado = signal<ResultadoValidacion | null>(null);
  public festivosAnio = signal<{ festivo: string; fecha: string }[]>([]);
  public consultando = signal(false);

  constructor(private festivoServicio: FestivoService,
              private paisServicio: PaisService,
              private mensajes: MatSnackBar) {
  }

  ngOnInit() {
    this.paisServicio.listar().subscribe({
      next: respuesta => this.paises.set(respuesta),
      error: error => this.mostrarMensaje(obtenerMensajeError(error))
    });
  }

  public validar() {
    if (!this.fecha) {
      this.mostrarMensaje('Escoja una fecha válida');
      return;
    }
    const fecha = this.fecha;
    const año = fecha.getFullYear();
    const nombrePais = this.paises().find(pais => pais.id == this.idPais)?.nombre ?? '';
    this.consultando.set(true);

    this.festivoServicio.verificar(this.idPais, fecha).subscribe({
      next: respuesta => {
        const esFestivo = respuesta.trim().toLowerCase() === 'es festivo';
        this.resultado.set({
          fecha: formatDate(fecha, "EEEE d 'de' MMMM 'de' y", 'es'),
          pais: nombrePais,
          esFestivo
        });
        this.consultando.set(false);
        if (esFestivo) {
          this.buscarNombreFestivo(fecha, año);
        }
      },
      error: error => {
        this.consultando.set(false);
        this.mostrarMensaje(obtenerMensajeError(error));
      }
    });
  }

  public consultarAnio() {
    if (!Number.isInteger(this.anio) || this.anio < 1 || this.anio > 9999) {
      this.mostrarMensaje('Escriba un año válido');
      return;
    }
    this.festivoServicio.obtenerFestivosAño(this.idPais, this.anio).subscribe({
      next: respuesta => {
        this.festivosAnio.set(respuesta.map(item => ({
          festivo: item.festivo,
          fecha: formatDate(item.fecha, "EEEE d 'de' MMMM 'de' y", 'es')
        })));
        if (respuesta.length == 0) {
          this.mostrarMensaje('El país escogido no tiene festivos registrados');
        }
      },
      error: error => this.mostrarMensaje(obtenerMensajeError(error))
    });
  }

  private buscarNombreFestivo(fecha: Date, año: number) {
    this.festivoServicio.obtenerFestivosAño(this.idPais, año).subscribe({
      next: respuesta => {
        const dia = formatDate(fecha, 'yyyy-MM-dd', 'es');
        const nombres = respuesta
          .filter(item => item.fecha.substring(0, 10) == dia)
          .map(item => item.festivo);
        const actual = this.resultado();
        if (actual && nombres.length > 0) {
          this.resultado.set({ ...actual, nombreFestivo: nombres.join(', ') });
        }
      }
    });
  }

  private mostrarMensaje(mensaje: string) {
    this.mensajes.open(mensaje, 'Cerrar', { duration: 4000 });
  }
}
