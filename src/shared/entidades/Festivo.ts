import { Pais } from './Pais';
import { TipoFestivo } from './TipoFestivo';

export interface Festivo {
  id: number;
  idPais: number;
  nombre: string;
  dia: number;
  mes: number;
  diasPascua: number;
  idTipo: number;
  pais?: Pais | null;
  tipoFestivo?: TipoFestivo | null;
}
