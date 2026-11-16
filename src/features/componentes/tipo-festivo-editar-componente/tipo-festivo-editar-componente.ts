import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReferenciasMaterialModule } from '../../../shared/modulos/referencias-material.module';
import { TipoFestivo } from '../../../shared/entidades/TipoFestivo';

export interface DatosEdicionTipoFestivo {
  encabezado: string;
  tipo: TipoFestivo;
}

@Component({
  selector: 'app-tipo-festivo-editar-componente',
  imports: [ReferenciasMaterialModule, FormsModule],
  templateUrl: './tipo-festivo-editar-componente.html',
})
export class TipoFestivoEditarComponente {
  constructor(@Inject(MAT_DIALOG_DATA) public datos: DatosEdicionTipoFestivo) { }
}
