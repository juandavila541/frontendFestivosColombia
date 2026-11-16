import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ColumnMode, NgxDatatableModule, SelectionType } from '@swimlane/ngx-datatable';
import { ReferenciasMaterialModule } from '../../../shared/modulos/referencias-material.module';
import { Festivo } from '../../../shared/entidades/Festivo';
import { Pais } from '../../../shared/entidades/Pais';
import { TipoFestivo } from '../../../shared/entidades/TipoFestivo';
import { FestivoService } from '../../../core/servicios/festivo.service';
import { PaisService } from '../../../core/servicios/pais.service';
import { TipoFestivoService } from '../../../core/servicios/tipo-festivo.service';
import { FestivoEditarComponente, usaDiaMes } from '../festivo-editar-componente/festivo-editar-componente';
import { DecidirComponente } from '../decidir-componente/decidir-componente';
import { obtenerMensajeError } from '../../../shared/utilidades/mensaje-error';

@Component({
  selector: 'app-festivo-componente',
  imports: [
    ReferenciasMaterialModule,
    FormsModule,
    NgxDatatableModule
  ],
  templateUrl: './festivo-componente.html',
})
export class FestivoComponente implements OnInit {

  public festivos = signal<Festivo[]>([]);
  public seleccion: Festivo[] = [];
  public festivoEscogido: Festivo | undefined;

  private paises: Pais[] = [];
  private tipos: TipoFestivo[] = [];

  public textoBusqueda: string = '';
  public indiceBusqueda: number = 0;
  public opcionesBusqueda: string[] = ['--Elija Dato de Búsqueda--', 'Nombre del festivo', 'País'];

  public columnas = [
    { name: 'Nombre', prop: 'nombre' },
    { name: 'País', prop: 'pais.nombre' },
    { name: 'Tipo', prop: 'tipoFestivo.tipo' },
    { name: 'Día', prop: 'dia', width: 70 },
    { name: 'Mes', prop: 'mes', width: 70 },
    { name: 'Días Pascua', prop: 'diasPascua', width: 110 }
  ];
  public modoColumna = ColumnMode;
  public tipoSeleccion = SelectionType;

  constructor(private festivoServicio: FestivoService,
              private paisServicio: PaisService,
              private tipoServicio: TipoFestivoService,
              private dialogoServicio: MatDialog,
              private mensajes: MatSnackBar) {
  }

  ngOnInit() {
    this.listar();
    this.paisServicio.listar().subscribe({
      next: respuesta => this.paises = respuesta,
      error: error => this.mostrarMensaje(obtenerMensajeError(error))
    });
    this.tipoServicio.listar().subscribe({
      next: respuesta => this.tipos = [...respuesta].sort((a, b) => a.id - b.id),
      error: error => this.mostrarMensaje(obtenerMensajeError(error))
    });
  }

  public listar() {
    this.festivoServicio.listar().subscribe({
      next: respuesta => this.mostrarFestivos(respuesta),
      error: error => this.mostrarMensaje(obtenerMensajeError(error))
    });
  }

  public buscar() {
    if (this.textoBusqueda.trim().length == 0) {
      this.listar();
    } else if (this.indiceBusqueda == 0) {
      this.mostrarMensaje('Elija el dato de búsqueda');
    } else {
      this.festivoServicio.buscar(this.indiceBusqueda, this.textoBusqueda.trim()).subscribe({
        next: respuesta => this.mostrarFestivos(respuesta),
        error: error => this.mostrarMensaje(obtenerMensajeError(error))
      });
    }
  }

  // vuelve a cargar la tabla respetando la búsqueda activa
  private refrescar() {
    if (this.textoBusqueda.trim().length > 0 && this.indiceBusqueda > 0) {
      this.buscar();
    } else {
      this.listar();
    }
  }

  public escoger(filas: Festivo[]) {
    this.seleccion = filas;
    this.festivoEscogido = filas[0];
  }

  public agregar() {
    const dialogoAgregar = this.dialogoServicio.open(FestivoEditarComponente, {
      width: '500px',
      data: {
        encabezado: 'Agregando nuevo festivo',
        festivo: { id: 0, idPais: 0, nombre: '', dia: 1, mes: 1, diasPascua: 0, idTipo: 0 },
        paises: this.paises,
        tipos: this.tipos
      },
      disableClose: true
    });
    dialogoAgregar.afterClosed().subscribe(datos => {
      if (datos) {
        this.festivoServicio.agregar(this.limpiar(datos.festivo)).subscribe({
          next: respuesta => {
            this.mostrarMensaje(`Festivo [${respuesta.nombre}] agregado`);
            this.refrescar();
          },
          error: error => this.mostrarMensaje(obtenerMensajeError(error))
        });
      }
    });
  }

  public modificar() {
    if (!this.festivoEscogido) {
      this.mostrarMensaje('Debe escoger un festivo');
      return;
    }
    const dialogoModificar = this.dialogoServicio.open(FestivoEditarComponente, {
      width: '500px',
      data: {
        encabezado: `Editando el festivo [${this.festivoEscogido.nombre}]`,
        festivo: { ...this.festivoEscogido },
        paises: this.paises,
        tipos: this.tipos
      },
      disableClose: true
    });
    dialogoModificar.afterClosed().subscribe(datos => {
      if (datos) {
        this.festivoServicio.modificar(this.limpiar(datos.festivo)).subscribe({
          next: respuesta => {
            this.mostrarMensaje(`Festivo [${respuesta.nombre}] modificado`);
            this.refrescar();
          },
          error: error => this.mostrarMensaje(obtenerMensajeError(error))
        });
      }
    });
  }

  public eliminar() {
    if (!this.festivoEscogido) {
      this.mostrarMensaje('Debe escoger un festivo');
      return;
    }
    const festivo = this.festivoEscogido;
    const dialogoEliminar = this.dialogoServicio.open(DecidirComponente, {
      width: '400px',
      data: {
        encabezado: 'Eliminar festivo',
        mensaje: `¿Está seguro de eliminar el festivo [${festivo.nombre}]?`
      }
    });
    dialogoEliminar.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        this.festivoServicio.eliminar(festivo.id).subscribe({
          next: () => {
            this.mostrarMensaje(`Festivo [${festivo.nombre}] eliminado`);
            this.refrescar();
          },
          error: error => this.mostrarMensaje(obtenerMensajeError(error))
        });
      }
    });
  }

  private mostrarFestivos(festivos: Festivo[]) {
    this.festivos.set(festivos);
    this.seleccion = [];
    this.festivoEscogido = undefined;
  }

  // la API asigna las relaciones por IdPais / IdTipo; los campos que no aplican al tipo van en 0
  private limpiar(festivo: Festivo): Festivo {
    const conDiaMes = usaDiaMes(festivo.idTipo);
    return {
      id: festivo.id,
      idPais: festivo.idPais,
      nombre: festivo.nombre.trim(),
      idTipo: festivo.idTipo,
      dia: conDiaMes ? festivo.dia : 0,
      mes: conDiaMes ? festivo.mes : 0,
      diasPascua: conDiaMes ? 0 : festivo.diasPascua
    };
  }

  private mostrarMensaje(mensaje: string) {
    this.mensajes.open(mensaje, 'Cerrar', { duration: 4000 });
  }
}
