# Prueba funcional — MVP para entrenadores

## Objetivo

Validar el recorrido principal de un entrenador durante una práctica:

1. Organizar el equipo.
2. Crear un entrenamiento.
3. Pasar asistencia.
4. Ejecutar las series desde el borde de la pileta.
5. Registrar tiempos por nadador.
6. Guardar y revisar el resumen.

## Recorrido recomendado

### 1. Equipo

- Abrir `Equipo`.
- Elegir o crear un grupo.
- Agregar nadadores.
- Asignar un carril a cada nadador.

### 2. Plan

- Abrir `Plan`.
- Crear una sesión.
- Definir nombre, fecha, grupo y largo de pileta.
- Agregar series dentro de:
  - Entrada en calor.
  - Principal.
  - Vuelta a la calma.
- Activar `Registrar tiempos individuales` únicamente en las series que se cronometrarán.
- Guardar la sesión como lista para usar.

### 3. Pileta

- Abrir `Pileta`.
- Elegir el entrenamiento.
- Preparar asistencia.
- Marcar los nadadores presentes.
- Iniciar el entrenamiento.

### 4. Toma de tiempos

- Iniciar el cronómetro en una serie cronometrada.
- Tocar el nombre de cada nadador cuando llegue.
- Avanzar a la siguiente repetición.
- En bloques no cronometrados, marcar el bloque como completado.
- Continuar hasta terminar la sesión.

### 5. Resultados

Al finalizar se genera un resumen con:

- Nadadores presentes.
- Cantidad de tiempos registrados.
- Mejor tiempo por nadador.
- Tiempo promedio por nadador.

Las sesiones terminadas quedan disponibles en `Historial`.

## Datos de prueba

La aplicación incluye:

- Grupo Competición.
- Grupo Masters.
- Cinco nadadores.
- Un entrenamiento de velocidad aeróbica.

## Persistencia actual

En la versión web, los cambios se guardan en el almacenamiento local del navegador. No existe todavía sincronización entre dispositivos ni cuentas reales.

## Qué evaluar durante la prueba

- Si el entrenador entiende el flujo sin explicación.
- Cuántos toques requiere pasar asistencia.
- Si los botones de llegada son suficientemente grandes.
- Si se puede seguir la serie sin perder de vista el cronómetro.
- Si es cómodo registrar varios nadadores seguidos.
- Qué información falta en el resumen.
- Qué acciones generan confusión o demoras.

## Fuera de alcance por ahora

- Usuarios y contraseñas.
- Backend compartido.
- Vista completa del nadador.
- Salidas escalonadas.
- Parciales intermedios.
- Edición de un tiempo ya registrado.
- Sincronización con relojes.
- Suscripciones y pagos.
