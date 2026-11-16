import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReferenciasMaterialModule } from '../../../shared/modulos/referencias-material.module';
import { Festivo } from '../../../shared/entidades/Festivo';
import { Pais } from '../../../shared/entidades/Pais';
import { TipoFestivo } from '../../../shared/entidades/TipoFestivo';

export interface DatosEdicionFestivo {
  encabezado: string;
  festivo: Festivo;
  paises: Pais[];
  tipos: TipoFestivo[];
}

// Tipos 1 (Fijo), 2 (Ley Puente) y 5 (Ley Puente Viernes) usan día y mes;
// los tipos 3 y 4 se calculan con los días desde el domingo de Pascua
export function usaDiaMes(idTipo: number): boolean {
  return idTipo == 1 || idTipo == 2 || idTipo == 5;
}

@Component({
  selector: 'app-festivo-editar-componente',
  imports: [ReferenciasMaterialModule, FormsModule],
  templateUrl: './festivo-editar-componente.html',
})
export class FestivoEditarComponente {
  public meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
                  'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  public usaDiaMes = usaDiaMes;

  constructor(@Inject(MAT_DIALOG_DATA) public datos: DatosEdicionFestivo) { }

  public esValido(): boolean {
    const festivo = this.datos.festivo;
    if (!festivo.nombre.trim() || !festivo.idPais || !festivo.idTipo) {
      return false;
    }
    if (usaDiaMes(festivo.idTipo)) {
      const diasDelMes = new Date(2023, festivo.mes, 0).getDate();
      return festivo.mes >= 1 && festivo.mes <= 12 && festivo.dia >= 1 && festivo.dia <= diasDelMes;
    }
    return Number.isInteger(festivo.diasPascua);
  }
}
