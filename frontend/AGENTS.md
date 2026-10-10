# AGENTS.md

## 1. Propósito
Este documento define la línea base de desarrollo del frontend de Tracium. Su objetivo es establecer el enfoque técnico, los requisitos de experiencia de usuario y la estructura funcional esperada para el proyecto, asegurando coherencia entre diseño, arquitectura y flujo de negocio.

## 2. Contexto del proyecto
Tracium es una solución para la trazabilidad de registros de mantenimiento aeronáutico. El sistema debe permitir registrar intervenciones, asociarlas con evidencia digital, verificar la ejecución y la inspección, aprobar el retorno al servicio y consultar la historia completa de cada evento con niveles adecuados de seguridad y trazabilidad.

La capa de presentación deberá apoyar este flujo operativo y considerar la integración con la red Stellar como mecanismo para verificar la integridad y secuencia de los registros.

## 3. Stack tecnológico
El frontend del proyecto debe desarrollarse bajo los siguientes estándares:

- Lenguaje: TypeScript
- Framework: Astro
- Red de trazabilidad: Stellar Network
- Enfoque de UX: operativa, clara, orientada a roles y validación documental
- Integración: consumo de APIs del backend y uso de referencias verificables generadas en Stellar

## 4. Identidad visual y activos del producto
La identidad visual del proyecto es un recurso prioritario para el desarrollo del frontend y debe mantenerse consistente en toda la aplicación.

### 4.1 Assets obligatorios
- El conjunto de colores del proyecto debe utilizarse como base para el sistema visual del frontend.
- Los logotipos definidos en la carpeta assets deben respetarse en sus versiones oficiales, con prioridad en la marca institucional del proyecto.
- La paleta visual debe aplicarse en componentes, estados, botones, tarjetas, paneles, alertas y navegación, manteniendo coherencia con la experiencia operativa.

### 4.2 Principios de uso
1. Los colores de la marca deben usarse de manera consistente y no deben reemplazarse por tonos arbitrarios sin justificarse.
2. Los logotipos deben conservar su identidad visual original y no deben rediseñarse, deformarse ni modificar sus proporciones.
3. Las pantallas deben mantener una apariencia profesional, técnica y confiable, alineada con la naturaleza aeronáutica y regulatoria del producto.
4. La identidad visual debe reforzar la percepción de seguridad, control, trazabilidad y rigor operativo.

### 4.3 Ubicación de recursos
Los activos visuales se encuentran en la carpeta:
- frontend/assets/colors
- frontend/assets/logos

Estos elementos deben considerarse priorizados y no opcionales durante el diseño y desarrollo de la interfaz.

### 4.4 Manual de marca: paleta de colores
La paleta se transcribe de la referencia oficial `frontend/assets/colors/colores.png`. Los códigos HEX siguientes son los colores identificados en dicha referencia; deben reutilizarse sin sustituciones arbitrarias.

#### 4.4.1 Colores de marca
- `#FF4949`
- `#B249F1`
- `#7902FF`
- `#2E2D4F`
- `#FB811E`
- `#FACF1E`
- `#05B179`
- `#23103E`
- `#351070`

La imagen también contiene una muestra visual cian rotulada como `#B249F1`, código que aparece asociado a otras muestras de color. Debido a esta discrepancia entre la muestra y su etiqueta, confirmar el valor cian con el equipo de marca antes de incorporarlo como un token independiente.

#### 4.4.2 Aplicación
- Usar los colores de marca como base de la identidad visual y los colores complementarios como acentos.
- Mantener contraste suficiente entre texto y fondo para garantizar legibilidad y accesibilidad.
- Usar los tonos oscuros para superficies oscuras solo cuando el contraste del contenido sea adecuado.
- La referencia incluye muestras en gradiente. Como no especifica sus paradas ni valores HEX intermedios, no se deben inferir ni presentar gradientes como valores oficiales; consultar el asset original antes de definirlos.

## 5. Reglas de desarrollo
1. El proyecto debe implementarse íntegramente en TypeScript.
2. Astro será el framework principal del frontend y deberá ser la base para la estructura de componentes, rutas y renderizado.
3. El frontend debe estar alineado con la lógica de negocio del producto y no debe introducir decisiones operativas contradictorias.
4. Debe diseñarse desde una perspectiva de roles: técnico, inspector, personal de calidad, auditor y administrador.
5. La interfaz debe priorizar la claridad del flujo operativo y la trazabilidad de cada intervención.
6. La aplicación debe distinguir claramente entre información operativa, evidencia documental y referencias verificables emitidas por Stellar.
7. La gestión de variables de entorno, endpoints, configuración de red y credenciales públicas debe realizarse con criterios de seguridad.
8. No se debe exponer información sensible ni detalles críticos en la capa cliente que no correspondan a su nivel de acceso.

## 6. Objetivos funcionales del frontend
El frontend debe permitir cubrir de forma usable y completa el flujo principal de la solución.

### 6.1 Login y acceso
- Autenticación de usuarios del sistema.
- Control de acceso por rol y permisos.
- Recuperación de credenciales y manejo de sesión.

### 6.2 Dashboard principal
- Vista general del estado de intervenciones.
- Indicadores clave para seguimiento operativo y de calidad.
- Acceso rápido a trabajos pendientes, inspecciones y aprobaciones.

### 6.3 Lista de intervenciones
- Consulta de intervenciones registradas.
- Filtros por aeronave, componente, estado, fecha, responsable o orden de trabajo.
- Búsqueda rápida y visualización clara de información relevante.

### 6.4 Registro y edición de intervención
- Captura de datos básicos de la intervención.
- Asociación con aeronave, componente, orden de trabajo, fecha y responsable.
- Registro del trabajo realizado y de los datos necesarios para la trazabilidad.

### 6.5 Detalle de intervención y evidencia
- Visualización de toda la información asociada a una intervención.
- Carga y consulta de evidencia documental y gráfica.
- Relación entre trabajo ejecutado, responsable y resultado registrado.

### 6.6 Revisión de inspección
- Pantalla para validación técnica y documental por parte de un inspector autorizado.
- Registro de observaciones, decisiones y cumplimiento de procedimientos.
- Resultado de inspección con estados explícitos: aprobado, rechazado o con observaciones.

### 6.7 Aprobación de retorno al servicio
- Confirmación de que la intervención, la evidencia y la inspección cumplen los requisitos.
- Registro de aprobación o rechazo del retorno al servicio.
- Presentación resumida de la validación con contexto operativo.

### 6.8 Historial de trazabilidad y auditoría
- Línea de tiempo de eventos relevantes.
- Verificación de integridad, secuencia y responsabilidad de cada acción.
- Consulta de fechas, responsables, modificaciones y evidencia asociada.
- Visualización de referencias verificables generadas mediante Stellar.

### 6.9 Administración de usuarios y permisos
- Gestión de usuarios, roles y accesos.
- Supervisión de estados del usuario y permisos asignados.
- Control de administración básica del sistema.

### 6.10 Perfil del usuario y configuración
- Edición de información personal.
- Ajustes de cuenta y preferencias básicas.
- Configuración inicial del entorno de uso del producto.

## 7. Consideraciones de integración con Stellar
El frontend debe representar la trazabilidad en la red Stellar como parte del proceso de verificación y auditoría. Esto implica:

- Mostrar referencias verificables asociadas a eventos clave.
- Permitir que el usuario compruebe la integridad y secuencia de los registros.
- Diferenciar claramente entre el contenido operativo almacenado en la base de datos y las referencias verificables registradas en Stellar.
- Mantener una experiencia de usuario que comunique confianza, validación y trazabilidad sin exponer información sensible.

## 8. Criterios de aceptación del frontend
El proyecto será considerado satisfactorio cuando:

- El frontend esté completamente desarrollado con TypeScript y Astro.
- Las pantallas principales del flujo de mantenimiento estén implementadas y sean usables.
- El sistema respete los roles y permisos del producto.
- La trazabilidad de intervenciones y auditoría esté representada de forma clara en la interfaz.
- La solución esté preparada para integrarse con APIs y servicios de verificación basados en Stellar.

## 9. Resultado esperado
Se espera un frontend funcional, usable, seguro y coherente con la propuesta de valor de Tracium, orientado a la trazabilidad aeronáutica y preparado para operar como capa de interacción entre usuarios, procesos de validación y la red Stellar.
