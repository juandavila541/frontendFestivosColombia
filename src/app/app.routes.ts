import { Routes } from '@angular/router';
import { InicioComponente } from '../features/componentes/inicio-componente/inicio-componente';
import { ValidacionComponente } from '../features/componentes/validacion-componente/validacion-componente';
import { FestivoComponente } from '../features/componentes/festivo-componente/festivo-componente';
import { PaisComponente } from '../features/componentes/pais-componente/pais-componente';
import { TipoFestivoComponente } from '../features/componentes/tipo-festivo-componente/tipo-festivo-componente';

export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', component: InicioComponente },
  { path: 'validacion', component: ValidacionComponente },
  { path: 'festivos', component: FestivoComponente },
  { path: 'paises', component: PaisComponente },
  { path: 'tipos', component: TipoFestivoComponente },
  { path: '**', redirectTo: 'inicio' },
];
