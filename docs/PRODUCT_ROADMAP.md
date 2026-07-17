# SwimApp — Estructura de producto y roadmap

## 1. Propósito del documento

Este documento define la estructura funcional, el alcance general y las etapas de desarrollo de SwimApp.

La aplicación toma como referencia conceptual plataformas integrales de gestión de natación, pero su implementación, diseño, textos, marca, experiencia de uso y código serán propios.

La estrategia será construir el producto por módulos, validando cada etapa antes de avanzar. El objetivo no es desarrollar desde el inicio una plataforma completa, sino crear primero un recorrido funcional y útil para entrenadores y nadadores.

---

## 2. Visión del producto

SwimApp será una plataforma para entrenadores, nadadores, familias y clubes de natación.

Permitirá:

- Crear y administrar equipos.
- Agregar nadadores y entrenadores.
- Organizar grupos y carriles.
- Planificar entrenamientos.
- Liberar entrenamientos a los nadadores.
- Registrar asistencia.
- Ejecutar entrenamientos desde el borde de la pileta.
- Tomar tiempos individuales y grupales.
- Registrar series, parciales y fases de entrenamiento.
- Analizar el progreso de cada nadador.
- Gestionar competencias.
- Mantener la comunicación dentro del equipo.
- Ofrecer planes gratuitos y pagos.

La propuesta central será conectar tres momentos:

1. Antes del entrenamiento: planificación y asignación.
2. Durante el entrenamiento: asistencia, ejecución y toma de tiempos.
3. Después del entrenamiento: resultados, análisis y seguimiento.

---

## 3. Posicionamiento inicial

SwimApp se posicionará como:

> La aplicación para planificar, ejecutar y medir entrenamientos de natación en equipo.

También puede resumirse como:

> Del cronómetro del entrenador al progreso de cada nadador.

El principal diferencial deberá ser el uso en vivo al costado de la pileta, con una interfaz simple, rápida y adaptada al trabajo con varios nadadores y carriles.

---

## 4. Principios del producto

### 4.1. Construcción modular

Cada módulo debe poder desarrollarse, probarse y mejorarse de forma independiente.

### 4.2. Una sola aplicación, diferentes roles

La aplicación tendrá una misma base, pero mostrará distintas funciones según el rol del usuario.

Roles previstos:

- Entrenador.
- Nadador.
- Padre o tutor.
- Administrador del club.
- Entrenador asistente.

### 4.3. Mobile first

La experiencia principal debe estar diseñada para celulares, especialmente para el entrenador que utiliza la aplicación durante la práctica.

También deberá funcionar en web para tareas administrativas, planificación y análisis.

### 4.4. Simplicidad operativa

Las funciones más frecuentes deben requerir pocos pasos.

Ejemplos:

- Pasar asistencia con un toque.
- Registrar una llegada tocando el nombre del nadador.
- Cambiar de serie sin salir de la pantalla.
- Asignar un entrenamiento a un grupo completo.

### 4.5. Validación progresiva

Cada módulo seguirá este ciclo:

1. Diseñar.
2. Probar con entrenadores y nadadores.
3. Construir una versión mínima.
4. Medir su uso.
5. Adaptar.
6. Incorporar funciones avanzadas o Premium.

---

## 5. Arquitectura funcional completa

```text
SwimApp
│
├── Acceso y perfiles
│   ├── Registro
│   ├── Inicio de sesión
│   ├── Recuperación de contraseña
│   ├── Selección de rol
│   ├── Entrenador
│   ├── Nadador
│   ├── Padre o tutor
│   └── Administrador del club
│
├── Club y equipos
│   ├── Datos del club
│   ├── Equipos
│   ├── Entrenadores
│   ├── Entrenadores asistentes
│   ├── Nadadores
│   ├── Padres o tutores
│   ├── Grupos
│   ├── Carriles
│   ├── Invitaciones
│   └── Documentación
│
├── Entrenamientos
│   ├── Crear entrenamiento
│   ├── Biblioteca de ejercicios
│   ├── Plantillas
│   ├── Plan semanal
│   ├── Plan mensual
│   ├── Plan anual
│   ├── Asignación por equipo
│   ├── Asignación por grupo
│   ├── Asignación por carril
│   ├── Asignación individual
│   └── Liberación al nadador
│
├── Entrenamiento en vivo
│   ├── Asistencia
│   ├── Modo pileta
│   ├── Cronómetro general
│   ├── Cronómetro por carril
│   ├── Cronómetro por nadador
│   ├── Salidas escalonadas
│   ├── Series y repeticiones
│   ├── Parciales
│   ├── Descansos
│   ├── Fases del entrenamiento
│   ├── Observaciones
│   └── Resumen automático
│
├── Rendimiento
│   ├── Historial de tiempos
│   ├── Mejores marcas
│   ├── Evolución
│   ├── Comparaciones
│   ├── Volumen acumulado
│   ├── Asistencia histórica
│   ├── Regularidad
│   ├── RPE
│   ├── Objetivos
│   ├── Recuperación
│   └── Comentarios del entrenador
│
├── Competencias
│   ├── Calendario
│   ├── Convocatorias
│   ├── Inscripciones
│   ├── Pruebas
│   ├── Relevos
│   ├── Series
│   ├── Heat sheets
│   ├── Resultados
│   └── Comparación con marcas personales
│
├── Comunidad y comunicación
│   ├── Mensajes directos
│   ├── Chat de equipo
│   ├── Anuncios
│   ├── Feed del equipo
│   ├── Logros
│   ├── Reacciones
│   ├── Desafíos
│   └── Confirmación de asistencia
│
├── Integraciones
│   ├── Apple Health
│   ├── Garmin
│   ├── Wearables
│   ├── Calendarios
│   ├── Exportación CSV
│   ├── Exportación PDF
│   └── API externa
│
├── Administración
│   ├── Usuarios
│   ├── Equipos
│   ├── Roles y permisos
│   ├── Suscripciones
│   ├── Métricas de uso
│   ├── Soporte
│   └── Configuración
│
└── Monetización
    ├── Plan gratuito
    ├── Entrenador Premium
    ├── Nadador Premium
    ├── Plan club
    ├── Suscripción mensual
    ├── Suscripción anual
    └── Pruebas y promociones
```

---

## 6. Navegación por rol

### 6.1. Entrenador

```text
Inicio
Equipo
Entrenamientos
Pileta
Progreso
Competencias
Mensajes
Perfil
```

Funciones principales:

- Crear equipos.
- Agregar personas.
- Organizar grupos y carriles.
- Crear y asignar entrenamientos.
- Pasar asistencia.
- Ejecutar sesiones en vivo.
- Registrar tiempos.
- Analizar rendimiento.
- Enviar mensajes y observaciones.

### 6.2. Nadador

```text
Inicio
Calendario
Entrenamientos
Progreso
Equipo
Competencias
Mensajes
Perfil
```

Funciones principales:

- Ver entrenamientos liberados.
- Consultar próximas sesiones.
- Revisar resultados y tiempos.
- Ver evolución y mejores marcas.
- Registrar esfuerzo percibido.
- Recibir comentarios.
- Participar en la comunidad del equipo.

### 6.3. Padre o tutor

```text
Inicio
Calendario
Asistencia
Competencias
Mensajes
Pagos
Perfil
```

Funciones principales:

- Ver información del nadador asociado.
- Confirmar asistencia.
- Consultar calendario.
- Recibir mensajes del club.
- Revisar competencias.
- Gestionar pagos y documentación.

### 6.4. Administrador del club

```text
Inicio
Club
Personas
Equipos
Grupos
Competencias
Pagos
Reportes
Configuración
```

Funciones principales:

- Administrar la estructura del club.
- Gestionar entrenadores y nadadores.
- Definir roles y permisos.
- Administrar grupos y equipos.
- Supervisar competencias.
- Gestionar suscripciones y pagos.

---

## 7. Recorrido principal del MVP

El primer recorrido completo que debe funcionar será:

```text
Entrenador crea una cuenta
        ↓
Crea su equipo
        ↓
Agrega nadadores
        ↓
Organiza grupos o carriles
        ↓
Crea un entrenamiento
        ↓
Lo asigna y lo libera
        ↓
Pasa asistencia
        ↓
Ejecuta la sesión
        ↓
Registra tiempos
        ↓
Finaliza el entrenamiento
        ↓
Cada nadador recibe su resultado
```

Este flujo constituye la primera versión verdaderamente útil del producto.

---

## 8. Etapas de desarrollo

## Etapa 0 — Base técnica y definición

### Objetivo

Preparar una arquitectura que pueda crecer sin rehacer la aplicación.

### Alcance

- Aplicación universal con Expo y React Native.
- Compatibilidad con iOS, Android y web.
- Definición de roles.
- Definición inicial de navegación.
- Sistema visual propio.
- Estructura modular de componentes.
- Definición del modelo de datos.
- Selección de backend.

### Tecnología prevista

- Expo.
- React Native.
- React Native Web.
- Supabase como alternativa inicial de backend.
- EAS Build para generar aplicaciones móviles.
- App Store Connect y Google Play Console para publicación.

### Resultado esperado

Una base estable para construir los módulos posteriores.

---

## Etapa 1 — Núcleo de usuarios y equipos

### Objetivo

Permitir que un entrenador configure su espacio de trabajo.

### Funcionalidades

- Registro.
- Inicio de sesión.
- Recuperación de contraseña.
- Selección de rol.
- Creación de equipo.
- Edición de datos del equipo.
- Alta de nadadores.
- Invitación mediante enlace o código.
- Creación de grupos.
- Asignación de nadadores a grupos.
- Creación de carriles.
- Perfil básico del nadador.

### Validación

El entrenador debe poder crear un equipo real y visualizar correctamente a sus integrantes.

---

## Etapa 2 — Planificación de entrenamientos

### Objetivo

Permitir que el entrenador prepare y distribuya sesiones.

### Funcionalidades

- Crear entrenamiento.
- Definir nombre, fecha y objetivo.
- Agregar fases.
- Agregar bloques.
- Agregar ejercicios.
- Definir distancia, repeticiones, ritmo y descanso.
- Guardar como borrador.
- Guardar como plantilla.
- Asignar a equipo, grupo, carril o nadador.
- Liberar el entrenamiento.
- Vista semanal.
- Vista mensual básica.

### Fases mínimas

- Entrada en calor.
- Trabajo principal.
- Vuelta a la calma.

### Validación

El entrenador debe poder crear un entrenamiento completo y el nadador debe poder verlo desde su perfil.

---

## Etapa 3 — Asistencia y modo pileta

### Objetivo

Convertir la aplicación en una herramienta práctica durante el entrenamiento.

### Funcionalidades

- Lista rápida de asistencia.
- Marcar presente, ausente o llegada tarde.
- Seleccionar grupo y carril.
- Iniciar entrenamiento.
- Ver la fase actual.
- Ver la serie actual.
- Ver la próxima serie.
- Cambiar de fase.
- Marcar bloques como completados.
- Agregar observaciones rápidas.
- Interfaz con botones grandes.
- Modo de alto contraste.

### Validación

El entrenador debe poder utilizar la aplicación al costado de la pileta sin interrumpir la dinámica del entrenamiento.

---

## Etapa 4 — Cronómetro grupal y toma de tiempos

### Objetivo

Desarrollar el principal diferencial de SwimApp.

### Funcionalidades

- Cronómetro general.
- Cronómetro por carril.
- Nadadores ordenados por salida.
- Salidas escalonadas.
- Registro de llegada tocando al nadador.
- Registro de parciales.
- Series sucesivas.
- Descanso automático.
- Próxima salida.
- Corrección manual de tiempos.
- Registro de nadador ausente en una repetición.
- Historial de la sesión.
- Resumen automático.

### Ejemplo de pantalla

```text
Serie 4 de 8 — 100 m libre

Carril 1
Sofía       1:09.42
Tomás       1:11.05
Malena      Nadando

Descanso restante: 00:18
Próxima salida: 00:00
```

### Validación

El entrenador debe poder registrar los tiempos de varios nadadores sin usar papel ni un cronómetro separado.

---

## Etapa 5 — Rendimiento y progreso

### Objetivo

Transformar los datos del entrenamiento en información útil.

### Funcionalidades

- Historial de sesiones.
- Historial de tiempos.
- Mejores marcas.
- Promedio por serie.
- Mejor y peor repetición.
- Regularidad.
- Evolución por distancia.
- Evolución por estilo.
- Volumen semanal y mensual.
- Asistencia histórica.
- Objetivos personales.
- Comentarios del entrenador.
- Esfuerzo percibido.

### Validación

El nadador debe poder identificar claramente su evolución y el entrenador debe poder detectar tendencias.

---

## Etapa 6 — Comunicación y comunidad

### Objetivo

Centralizar la comunicación que actualmente ocurre por WhatsApp u otros canales.

### Funcionalidades

- Mensajes directos.
- Chat por equipo.
- Anuncios.
- Confirmación de lectura.
- Confirmación de asistencia.
- Feed del equipo.
- Publicación de logros.
- Reacciones.
- Desafíos internos.
- Notificaciones push.

### Validación

El equipo debe poder organizar su comunicación cotidiana sin depender de herramientas externas.

---

## Etapa 7 — Competencias

### Objetivo

Extender la plataforma al ciclo competitivo.

### Funcionalidades

- Calendario de competencias.
- Convocatorias.
- Confirmación de participación.
- Inscripción por prueba.
- Relevos.
- Series.
- Heat sheets.
- Resultados.
- Comparación con marcas personales.
- Historial competitivo.

### Validación

El club debe poder organizar y consultar la participación de sus nadadores en competencias.

---

## Etapa 8 — Administración del club

### Objetivo

Permitir la operación integral de clubes y academias.

### Funcionalidades

- Gestión de entrenadores.
- Gestión de nadadores.
- Padres o tutores.
- Documentación.
- Pagos.
- Estados de cuenta.
- Suscripciones.
- Reportes.
- Roles y permisos.
- Configuración institucional.

### Validación

Un administrador debe poder controlar las operaciones principales del club desde una sola plataforma.

---

## Etapa 9 — Premium, monetización e integraciones

### Objetivo

Convertir el producto en un negocio sostenible.

### Funcionalidades

- Plan gratuito.
- Plan Entrenador Premium.
- Plan Nadador Premium.
- Plan Club.
- Suscripciones mensuales y anuales.
- Prueba gratuita.
- Compras dentro de la aplicación.
- Gestión de acceso Premium.
- Historial ilimitado.
- Estadísticas avanzadas.
- Exportaciones.
- Entrenadores asistentes.
- Integración con Apple Health.
- Integración con Garmin y wearables.
- Planificación asistida por IA.

### Validación

Los usuarios deben comprender claramente qué valor adicional reciben al pagar.

---

## 9. Modelo freemium inicial

## Entrenador gratuito

- Un equipo.
- Hasta 10 nadadores.
- Creación básica de entrenamientos.
- Planificación semanal.
- Asistencia.
- Cronómetro básico.
- Historial limitado.

## Entrenador Premium

- Varios equipos.
- Más nadadores o nadadores ilimitados.
- Entrenadores asistentes.
- Planificación mensual y anual.
- Cronómetro avanzado.
- Estadísticas completas.
- Historial ilimitado.
- Competencias.
- Exportaciones.
- Comunicación avanzada.

## Nadador gratuito

- Ver entrenamientos liberados.
- Ver tiempos recientes.
- Ver asistencia.
- Recibir mensajes.
- Consultar próximos eventos.

## Nadador Premium

- Historial completo.
- Gráficos de evolución.
- Mejores marcas.
- Objetivos personales.
- Comparaciones avanzadas.
- Recuperación y esfuerzo.
- Integraciones con dispositivos.

## Plan Club

- Administradores.
- Varios equipos.
- Varios entrenadores.
- Gestión de padres o tutores.
- Competencias.
- Pagos.
- Documentación.
- Reportes institucionales.
- Soporte prioritario.

---

## 10. Modelo de datos inicial

Entidades previstas:

```text
User
Role
Club
Team
Group
Lane
AthleteProfile
CoachProfile
GuardianProfile
Membership
Invitation
Workout
WorkoutPhase
WorkoutBlock
Exercise
WorkoutAssignment
Attendance
LiveSession
Series
Repetition
Split
TimeRecord
PerformanceMetric
PersonalBest
Goal
Competition
CompetitionEvent
Entry
Relay
Result
Conversation
Message
Announcement
Subscription
Payment
Notification
```

Relaciones principales:

- Un usuario puede tener uno o más roles.
- Un club puede tener varios equipos.
- Un equipo puede tener varios grupos.
- Un entrenador puede administrar uno o más equipos.
- Un nadador puede pertenecer a uno o más equipos.
- Un entrenamiento puede asignarse a un equipo, grupo, carril o nadador.
- Una sesión en vivo se basa en un entrenamiento planificado.
- Cada tiempo registrado debe quedar asociado a un nadador, una serie y una sesión.

---

## 11. Reglas para el desarrollo

### 11.1. No construir módulos aislados sin recorrido

Cada entrega debe completar un flujo útil de principio a fin.

### 11.2. Priorizar la experiencia del entrenador

La primera validación depende de que el entrenador use la aplicación durante su trabajo cotidiano.

### 11.3. Evitar complejidad prematura

No incorporar pagos, IA, wearables o competencias completas antes de validar el uso básico.

### 11.4. Mantener datos preparados para crecer

Aunque una función no esté visible, la estructura de datos debe evitar bloqueos futuros.

### 11.5. Diferenciar inspiración de copia

Se puede tomar como referencia la arquitectura funcional de productos existentes, pero no deben copiarse literalmente:

- Diseño visual.
- Pantallas.
- Textos.
- Código.
- Marca.
- Iconografía propia.
- Recursos gráficos.

### 11.6. Cada etapa debe tener criterios de aceptación

Una etapa se considera completa cuando su flujo principal puede probarse sin simulaciones manuales externas.

---

## 12. Prioridad actual

La prioridad inmediata es construir correctamente las etapas 1 a 4:

1. Usuarios y equipos.
2. Planificación.
3. Asistencia y modo pileta.
4. Cronómetro grupal.

No se debe avanzar primero con competencias, pagos o integraciones.

El primer producto validable debe resolver:

> Entrenador crea equipo → agrega nadadores → planifica entrenamiento → pasa asistencia → ejecuta la sesión → registra tiempos → nadador ve el resultado.

---

## 13. Indicadores iniciales de validación

Indicadores de uso:

- Equipos creados.
- Nadadores agregados por equipo.
- Entrenamientos creados por semana.
- Entrenamientos ejecutados en modo pileta.
- Porcentaje de sesiones con asistencia registrada.
- Cantidad de tiempos cargados.
- Entrenadores activos semanalmente.
- Nadadores que consultan resultados.

Indicadores de valor:

- Tiempo ahorrado por entrenador.
- Reducción del uso de papel y planillas.
- Facilidad percibida de toma de tiempos.
- Porcentaje de entrenadores que vuelven a usar la app.
- Intención de pago.
- Funciones más solicitadas.

---

## 14. Estado actual

El repositorio contiene una primera demostración visual construida con Expo y React Native.

La versión actual sirve para visualizar la idea general, pero todavía no representa la arquitectura definitiva ni incluye:

- Autenticación real.
- Base de datos.
- Sincronización entre usuarios.
- Roles y permisos reales.
- Persistencia de equipos y entrenamientos.
- Suscripciones.
- Publicación en App Store o Google Play.

El próximo trabajo debe enfocarse en convertir la demostración en una aplicación modular, comenzando por usuarios, equipos y planificación.

---

## 15. Decisiones abiertas

Estas decisiones deberán documentarse a medida que avance el producto:

- Nombre comercial definitivo.
- Identidad visual.
- Backend definitivo.
- Modelo exacto de precios.
- Límite de nadadores del plan gratuito.
- Alcance del perfil padre o tutor.
- Forma de incorporación a los equipos.
- Privacidad de tiempos y rankings.
- Integraciones prioritarias.
- País inicial de lanzamiento.
- Requisitos legales y tratamiento de datos de menores.

---

## 16. Próximo paso recomendado

Crear la estructura técnica de la Etapa 1:

- Pantalla de registro.
- Pantalla de acceso.
- Selección de rol.
- Creación de equipo.
- Lista de nadadores.
- Alta e invitación de nadadores.
- Grupos y carriles.
- Modelo inicial de datos en Supabase.

Una vez establecida esta base, se continuará con la creación y asignación de entrenamientos.