import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { TipoFestivo } from '../../shared/entidades/TipoFestivo';

@Injectable({
  providedIn: 'root',
})
export class TipoFestivoService {
  private url: string;

  constructor(private http: HttpClient) {
    this.url = `${environment.urlBase}tipos`;
  }

  public listar(): Observable<TipoFestivo[]> {
    return this.http.get<TipoFestivo[]>(this.url);
  }

  public agregar(tipo: TipoFestivo): Observable<TipoFestivo> {
    return this.http.post<TipoFestivo>(this.url, tipo);
  }

  public modificar(tipo: TipoFestivo): Observable<TipoFestivo> {
    return this.http.put<TipoFestivo>(this.url, tipo);
  }

  public eliminar(idTipo: number): Observable<any> {
    return this.http.delete(`${this.url}/${idTipo}`);
  }
}
