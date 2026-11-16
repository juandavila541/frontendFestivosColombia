import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Festivo } from '../../shared/entidades/Festivo';
import { FechaFestivo } from '../../shared/entidades/FechaFestivo';

@Injectable({
  providedIn: 'root',
})
export class FestivoService {
  private url: string;

  constructor(private http: HttpClient) {
    this.url = `${environment.urlBase}festivos`;
  }

  public listar(): Observable<Festivo[]> {
    return this.http.get<Festivo[]>(this.url);
  }

  // indice: 1 = nombre del festivo, 2 = nombre del país
  public buscar(indice: number, dato: string): Observable<Festivo[]> {
    return this.http.get<Festivo[]>(`${this.url}/${indice}/${encodeURIComponent(dato)}`);
  }

  public agregar(festivo: Festivo): Observable<Festivo> {
    return this.http.post<Festivo>(this.url, festivo);
  }

  public modificar(festivo: Festivo): Observable<Festivo> {
    return this.http.put<Festivo>(this.url, festivo);
  }

  public eliminar(idFestivo: number): Observable<any> {
    return this.http.delete(`${this.url}/${idFestivo}`);
  }

  public verificar(idPais: number, fecha: Date): Observable<string> {
    const año = fecha.getFullYear();
    const mes = fecha.getMonth() + 1;
    const dia = fecha.getDate();
    return this.http.get(`${this.url}/verificar/${idPais}/${año}/${mes}/${dia}`, { responseType: 'text' });
  }

  public obtenerFestivosAño(idPais: number, año: number): Observable<FechaFestivo[]> {
    return this.http.get<FechaFestivo[]>(`${this.url}/obtener/${idPais}/${año}`);
  }
}
