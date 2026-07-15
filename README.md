# SwimApp MVP

Primera versión visual e interactiva de una aplicación universal para entrenadores de natación y nadadores.

## Enfoque técnico

La aplicación está construida con **Expo + React Native + React Native Web**. No es un sitio HTML que después deba reescribirse: la misma base de código puede ejecutarse en navegador, iPhone y Android.

## Funcionalidades incluidas

### Entrenador

- Cambio de rol dentro de la misma aplicación.
- Dashboard del equipo.
- Alta rápida de nadadores.
- Registro de asistencia.
- Planificación y liberación de entrenamientos.
- Entrenamientos divididos en entrada en calor, trabajo principal y vuelta a la calma.
- Cronómetro interactivo por serie.
- Registro de tiempos por nadador y carril.
- Chat grupal.
- Simulación de plan gratuito y Premium.

### Nadador

- Próximos entrenamientos liberados por el entrenador.
- Resumen de carga, volumen, asistencia y mejores marcas.
- Evolución visual del rendimiento.
- Objetivos por prueba.
- Comparaciones Premium simuladas.
- Chat del equipo.

## Ejecutar localmente

Requiere Node.js LTS.

```bash
npm install
npm run web
```

Para probar en un teléfono:

```bash
npm start
```

Luego se puede abrir el proyecto con Expo Go mediante el código QR.

## Publicación futura

La configuración inicial de iOS y Android ya está incluida. Para generar builds instalables o publicar más adelante:

```bash
npm install --global eas-cli
eas login
eas build --platform ios --profile production
eas submit --platform ios
```

## Alcance actual

Este MVP usa datos de demostración y estado local. Todavía no incluye:

- Registro e inicio de sesión reales.
- Base de datos compartida.
- Sincronización entre entrenador y nadadores.
- Notificaciones push.
- Pagos y suscripciones reales.
- Integraciones con Apple Health, Garmin, relojes o el hardware Liebre.

La siguiente etapa recomendada es agregar Supabase para autenticación, equipos, planificación, resultados, mensajes y permisos por rol.
