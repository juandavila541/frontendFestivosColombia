import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReferenciasMaterialModule } from '../../../shared/modulos/referencias-material.module';

export interface DatosDecision {
  encabezado: string;
  mensaje: string;
}

@Component({
  selector: 'app-decidir-componente',
  imports: [ReferenciasMaterialModule],
  templateUrl: './decidir-componente.html',
})
export class DecidirComponente {
  constructor(@Inject(MAT_DIALOG_DATA) public datos: DatosDecision) { }
}
