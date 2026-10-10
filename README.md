# Tracium

Tracium es una plataforma web para la trazabilidad de registros de mantenimiento aeronáutico. Su propósito es reunir en un historial estructurado la información de una intervención, quién la realizó y cuándo, la evidencia asociada, las inspecciones y la aprobación del retorno al servicio.

El proyecto explora el uso de la red Stellar para registrar referencias verificables que ayuden a comprobar la integridad y secuencia de eventos. Los registros operativos y los archivos de evidencia deben permanecer fuera de la cadena; Stellar se considera para almacenar referencias o hashes, no documentos técnicos ni información sensible.

> **Estado actual:** el repositorio incluye un frontend inicial en Astro con páginas de acceso, dashboard e intervenciones. La integración con backend, autenticación real y Stellar aún no debe considerarse implementada salvo que se agregue explícitamente en el código.

## Objetivos del producto

- Registrar intervenciones de mantenimiento asociadas a una aeronave, componente, orden de trabajo, fecha y responsable.
- Adjuntar y consultar evidencia digital relacionada con el trabajo realizado.
- Permitir que inspectores autorizados revisen la evidencia y registren el resultado de inspección.
- Facilitar la aprobación del retorno al servicio una vez completados los requisitos.
- Consultar la historia de eventos, responsables y fechas en un mismo lugar.
- Preparar la verificación de integridad y secuencia mediante referencias asociadas a Stellar.

Los principales perfiles contemplados son técnicos de mantenimiento, inspectores autorizados, personal de Calidad, personal autorizado para retorno al servicio, auditores y administradores.

## Tecnologías

- [Astro](https://astro.build/) como framework web.
- [TypeScript](https://www.typescriptlang.org/) para el desarrollo del frontend.
- [Stellar](https://stellar.org/) como red considerada para referencias verificables de eventos.
- npm y `package-lock.json` para la instalación reproducible de dependencias.

## Estructura del repositorio

```text
.
├── docs/                 # Documentación del proyecto por semana
├── frontend/
│   ├── assets/           # Activos públicos, logos y referencia de colores
│   ├── src/
│   │   └── pages/        # Rutas Astro del frontend
│   ├── astro.config.ts
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

El frontend configura `frontend/assets` como directorio público de Astro. Por ejemplo, los logos ubicados en `frontend/assets/logos` se sirven desde rutas como `/logos/logo-background-black-tracium.png`. Consulta [frontend/AGENTS.md](frontend/AGENTS.md) para las directrices de desarrollo, identidad visual, paleta de marca y objetivos de las pantallas.

## Requisitos previos

- Node.js en una versión LTS compatible con la versión de Astro declarada en `frontend/package.json`.
- npm, incluido con Node.js.
- Git para clonar el repositorio.

Comprueba las herramientas instaladas:

```bash
node --version
npm --version
```

## Instalación y ejecución local

Desde la raíz del repositorio, entra al directorio del frontend e instala las dependencias:

```bash
cd frontend
npm ci
```

Inicia el servidor local de desarrollo:

```bash
npm run dev
```

Astro mostrará en la terminal la dirección local (normalmente `http://localhost:4321`). Abre esa dirección en el navegador. Para detener el servidor, usa `Ctrl+C` en la terminal donde se está ejecutando.

### Comandos disponibles

Ejecuta estos comandos desde `frontend/`:

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Inicia el servidor de desarrollo con recarga automática. |
| `npm run check` | Ejecuta las comprobaciones de Astro y TypeScript. |
| `npm run build` | Genera la versión de producción en `frontend/dist/`. |
| `npm run preview` | Sirve localmente el resultado de producción después de compilar. |

Para validar una compilación:

```bash
npm run check
npm run build
npm run preview
```

## Rutas actuales del frontend

Las páginas implementadas actualmente incluyen:

- `/` — pantalla de inicio de sesión de demostración.
- `/dashboard/` — resumen inicial del espacio de trabajo.
- `/interventions/` — consulta inicial de intervenciones.

Estas páginas constituyen la base visual del producto; no implican por sí solas que la autenticación, persistencia de datos, inspecciones, auditoría o registro en Stellar ya estén conectados a servicios reales.

## Flujo funcional objetivo

El MVP está orientado al siguiente proceso:

1. El técnico registra una intervención e identifica la aeronave, el componente, la orden de trabajo y la fecha.
2. El técnico agrega evidencia del trabajo y confirma los datos registrados.
3. Un inspector autorizado revisa la intervención y documenta el resultado.
4. El personal autorizado verifica que el trabajo y las inspecciones estén completos antes de aprobar el retorno al servicio.
5. Calidad y auditoría consultan el historial, sus responsables, marcas de tiempo, evidencias y referencias de verificación.

## Consideraciones de Stellar y seguridad

- La conexión con Stellar debe realizarse mediante una arquitectura aprobada para el proyecto y coordinada con el backend.
- No se deben incluir claves secretas, frases semilla ni credenciales privadas en el frontend, en el repositorio o en variables expuestas al navegador.
- No se deben publicar en cadena archivos de evidencia ni datos operativos sensibles. El diseño contempla mantenerlos fuera de Stellar y utilizar referencias verificables cuando corresponda.
- La interfaz debe distinguir entre un evento registrado en la aplicación y un evento cuya referencia haya sido verificada en Stellar.
- Los datos y permisos deben ser validados por servicios confiables; ocultar controles en la interfaz no sustituye la autorización del backend.

## Documentación del producto

El blueprint, las historias priorizadas, el flujo de usuario, el alcance del MVP y la arquitectura inicial están documentados en [docs/semana2/ProductBlueprint.md](docs/semana2/ProductBlueprint.md). Los demás entregables del curso se encuentran organizados por semana bajo `docs/`.

## Repositorio

[tracium_blockchain en GitHub](https://github.com/darienabdul/tracium_blockchain)
