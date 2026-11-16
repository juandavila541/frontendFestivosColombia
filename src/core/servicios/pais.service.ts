import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Pais } from '../../shared/entidades/Pais';

@Injectable({
  providedIn: 'root',
})
export class PaisService {
  private url: string;

  constructor(private http: HttpClient) {
    this.url = `${environment.urlBase}paises`;
  }

  public listar(): Observable<Pais[]> {
    return this.http.get<Pais[]>(this.url);
  }

  public agregar(pais: Pais): Observable<Pais> {
    return this.http.post<Pais>(this.url, pais);
  }

  public modificar(pais: Pais): Observable<Pais> {
    return this.http.put<Pais>(this.url, pais);
  }

  public eliminar(idPais: number): Observable<any> {
    return this.http.delete(`${this.url}/${idPais}`);
  }
}
