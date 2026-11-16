import { HttpErrorResponse } from '@angular/common/http';

export function obtenerMensajeError(error: HttpErrorResponse): string {
  if (error.status === 0) {
    return 'No se pudo conectar con la API. Verifique que esté en ejecución.';
  }
  return error.error?.mensaje ?? error.message;
}
