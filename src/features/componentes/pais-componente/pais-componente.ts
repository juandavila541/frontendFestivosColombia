import { Component, OnInit, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ColumnMode, NgxDatatableModule, SelectionType } from '@swimlane/ngx-datatable';
import { ReferenciasMaterialModule } from '../../../shared/modulos/referencias-material.module';
import { Pais } from '../../../shared/entidades/Pais';
import { PaisService } from '../../../core/servicios/pais.service';
import { PaisEditarComponente } from '../pais-editar-componente/pais-editar-componente';
import { DecidirComponente } from '../decidir-componente/decidir-componente';
import { obtenerMensajeError } from '../../../shared/utilidades/mensaje-error';

@Component({
  selector: 'app-pais-componente',
  imports: [
    ReferenciasMaterialModule,
    FormsModule,
    NgxDatatableModule
  ],
  templateUrl: './pais-componente.html',
})
export class PaisComponente implements OnInit {

  public paises = signal<Pais[]>([]);
  public textoBusqueda = signal('');
  public paisesFiltrados = computed(() => {
    const texto = this.textoBusqueda().trim().toLowerCase();
    return this.paises().filter(pais => pais.nombre.toLowerCase().includes(texto));
  });

  public seleccion: Pais[] = [];
  public paisEscogido: Pais | undefined;

  public columnas = [
    { name: 'Id', prop: 'id', width: 80 },
    { name: 'Nombre', prop: 'nombre' }
  ];
  public modoColumna = ColumnMode;
  public tipoSeleccion = SelectionType;

  constructor(private paisServicio: PaisService,
              private dialogoServicio: MatDialog,
              private mensajes: MatSnackBar) {
  }

  ngOnInit() {
    this.listar();
  }

  public listar() {
    this.paisServicio.listar().subscribe({
      next: respuesta => {
        this.paises.set(respuesta);
        this.seleccion = [];
        this.paisEscogido = undefined;
      },
      error: error => this.mostrarMensaje(obtenerMensajeError(error))
    });
  }

  public escoger(filas: Pais[]) {
    this.seleccion = filas;
    this.paisEscogido = filas[0];
  }

  public agregar() {
    const dialogoAgregar = this.dialogoServicio.open(PaisEditarComponente, {
      width: '450px',
      data: {
        encabezado: 'Agregando nuevo país',
        pais: { id: 0, nombre: '' }
      },
      disableClose: true
    });
    dialogoAgregar.afterClosed().subscribe(datos => {
      if (datos) {
        this.paisServicio.agregar(datos.pais).subscribe({
          next: respuesta => {
            this.mostrarMensaje(`País [${respuesta.nombre}] agregado`);
            this.listar();
          },
          error: error => this.mostrarMensaje(obtenerMensajeError(error))
        });
      }
    });
  }

  public modificar() {
    if (!this.paisEscogido) {
      this.mostrarMensaje('Debe escoger un país');
      return;
    }
    const dialogoModificar = this.dialogoServicio.open(PaisEditarComponente, {
      width: '450px',
      data: {
        encabezado: `Editando el país [${this.paisEscogido.nombre}]`,
        pais: { ...this.paisEscogido }
      },
      disableClose: true
    });
    dialogoModificar.afterClosed().subscribe(datos => {
      if (datos) {
        this.paisServicio.modificar(datos.pais).subscribe({
          next: respuesta => {
            this.mostrarMensaje(`País [${respuesta.nombre}] modificado`);
            this.listar();
          },
          error: error => this.mostrarMensaje(obtenerMensajeError(error))
        });
      }
    });
  }

  public eliminar() {
    if (!this.paisEscogido) {
      this.mostrarMensaje('Debe escoger un país');
      return;
    }
    const pais = this.paisEscogido;
    const dialogoEliminar = this.dialogoServicio.open(DecidirComponente, {
      width: '400px',
      data: {
        encabezado: 'Eliminar país',
        mensaje: `¿Está seguro de eliminar el país [${pais.nombre}]?`
      }
    });
    dialogoEliminar.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        this.paisServicio.eliminar(pais.id).subscribe({
          next: () => {
            this.mostrarMensaje(`País [${pais.nombre}] eliminado`);
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
