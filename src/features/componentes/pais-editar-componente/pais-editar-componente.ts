import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReferenciasMaterialModule } from '../../../shared/modulos/referencias-material.module';
import { Pais } from '../../../shared/entidades/Pais';

export interface DatosEdicionPais {
  encabezado: string;
  pais: Pais;
}

@Component({
  selector: 'app-pais-editar-componente',
  imports: [ReferenciasMaterialModule, FormsModule],
  templateUrl: './pais-editar-componente.html',
})
export class PaisEditarComponente {
  constructor(@Inject(MAT_DIALOG_DATA) public datos: DatosEdicionPais) { }
}
