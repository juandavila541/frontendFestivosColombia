# Festivos Colombia - Frontend

Aplicativo en Angular CLI que consume la API de festivos
(https://github.com/juandavila541/apiFestivosColombia).

Incluye:
- CRUD de Festivos, Países y Tipos de festivo
- Página de validación de festivos: verifica si una fecha es festivo y lista los festivos de un año

## Ejecutar

1. Ejecutar la API (perfil `https`, puerto 7085) con la base de datos `Festivos` creada.
2. Instalar dependencias (solo la primera vez):
   ```
   npm install
   ```
3. Iniciar el frontend:
   ```
   ng serve
   ```
4. Abrir http://localhost:4200

La URL de la API se configura en `src/environments/environment.ts`.
