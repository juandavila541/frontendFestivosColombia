import { Component, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ColumnMode, NgxDatatableModule, SelectionType } from '@swimlane/ngx-datatable';
import { ReferenciasMaterialModule } from '../../../shared/modulos/referencias-material.module';
import { TipoFestivo } from '../../../shared/entidades/TipoFestivo';
import { TipoFestivoService } from '../../../core/servicios/tipo-festivo.service';
import { TipoFestivoEditarComponente } from '../tipo-festivo-editar-componente/tipo-festivo-editar-componente';
import { DecidirComponente } from '../decidir-componente/decidir-componente';
import { obtenerMensajeError } from '../../../shared/utilidades/mensaje-error';

@Component({
  selector: 'app-tipo-festivo-componente',
  imports: [
    ReferenciasMaterialModule,
    NgxDatatableModule
  ],
  templateUrl: './tipo-festivo-componente.html',
})
export class TipoFestivoComponente implements OnInit {

  public tipos = signal<TipoFestivo[]>([]);
  public seleccion: TipoFestivo[] = [];
  public tipoEscogido: TipoFestivo | undefined;

  public columnas = [
    { name: 'Id', prop: 'id', width: 80 },
    { name: 'Tipo', prop: 'tipo' }
  ];
  public modoColumna = ColumnMode;
  public tipoSeleccion = SelectionType;

  constructor(private tipoServicio: TipoFestivoService,
              private dialogoServicio: MatDialog,
              private mensajes: MatSnackBar) {
  }

  ngOnInit() {
    this.listar();
  }

  public listar() {
    this.tipoServicio.listar().subscribe({
      next: respuesta => {
        this.tipos.set([...respuesta].sort((a, b) => a.id - b.id));
        this.seleccion = [];
        this.tipoEscogido = undefined;
      },
      error: error => this.mostrarMensaje(obtenerMensajeError(error))
    });
  }

  public escoger(filas: TipoFestivo[]) {
    this.seleccion = filas;
    this.tipoEscogido = filas[0];
  }

  public agregar() {
    const dialogoAgregar = this.dialogoServicio.open(TipoFestivoEditarComponente, {
      width: '450px',
      data: {
        encabezado: 'Agregando nuevo tipo de festivo',
        tipo: { id: 0, tipo: '' }
      },
      disableClose: true
    });
    dialogoAgregar.afterClosed().subscribe(datos => {
      if (datos) {
        this.tipoServicio.agregar(datos.tipo).subscribe({
          next: respuesta => {
            this.mostrarMensaje(`Tipo [${respuesta.tipo}] agregado`);
            this.listar();
          },
          error: error => this.mostrarMensaje(obtenerMensajeError(error))
        });
      }
    });
  }

  public modificar() {
    if (!this.tipoEscogido) {
      this.mostrarMensaje('Debe escoger un tipo de festivo');
      return;
    }
    const dialogoModificar = this.dialogoServicio.open(TipoFestivoEditarComponente, {
      width: '450px',
      data: {
        encabezado: `Editando el tipo [${this.tipoEscogido.tipo}]`,
        tipo: { ...this.tipoEscogido }
      },
      disableClose: true
    });
    dialogoModificar.afterClosed().subscribe(datos => {
      if (datos) {
        this.tipoServicio.modificar(datos.tipo).subscribe({
          next: respuesta => {
            this.mostrarMensaje(`Tipo [${respuesta.tipo}] modificado`);
            this.listar();
          },
          error: error => this.mostrarMensaje(obtenerMensajeError(error))
        });
      }
    });
  }

  public eliminar() {
    if (!this.tipoEscogido) {
      this.mostrarMensaje('Debe escoger un tipo de festivo');
      return;
    }
    const tipo = this.tipoEscogido;
    const dialogoEliminar = this.dialogoServicio.open(DecidirComponente, {
      width: '400px',
      data: {
        encabezado: 'Eliminar tipo de festivo',
        mensaje: `¿Está seguro de eliminar el tipo [${tipo.tipo}]?`
      }
    });
    dialogoEliminar.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        this.tipoServicio.eliminar(tipo.id).subscribe({
          next: () => {
            this.mostrarMensaje(`Tipo [${tipo.tipo}] eliminado`);
            this.listar();
          },
          error: error => this.mostrarMensaje(obtenerMensajeError(error))
        });
      }
    });
  }

  private mostrarMensaje(mensaje: string) {
    this.mensajes.open(mensaje, 'Cerrar', { duration: 4000 });
  }
}
