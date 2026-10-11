# Documentación grupal — Entregable 3: Functional Proof

**Proyecto:** Tracium — Trazabilidad de registros de mantenimiento aeronáutico
**Repositorio:** [tracium_blockchain](https://github.com/darienabdul/tracium_blockchain)
**Semana:** Entregable 3 (Front + decisión técnica de contratos)

---

## 1. Front construido

### 1.1 Enfoque general

El front de Tracium se construyó con **Astro** como framework y **TypeScript** en todo el código, tal como lo define la línea base de desarrollo del proyecto (`frontend/AGENTS.md`). La interfaz está orientada a un uso operativo: clara, orientada a roles y centrada en la validación documental, con una identidad visual técnica y sobria acorde con la naturaleza aeronáutica y regulatoria del producto.

La paleta de color y los logotipos oficiales del proyecto (`frontend/assets/colors`, `frontend/assets/logos`) se aplicaron de forma consistente en componentes, estados, botones, tarjetas, paneles, alertas y navegación. La aplicación distingue explícitamente entre la información operativa que vive en la interfaz y las referencias verificables que, en una fase posterior, se registrarán en la red Stellar.

El front se organizó **fuera de la carpeta de documentos** (`frontend/`), en cumplimiento del árbol de estructura exigido por el entregable.

### 1.2 Pantallas implementadas

En esta entrega el front cubre **once rutas** organizadas en cinco bloques funcionales:

**Acceso**

| Ruta | Pantalla | Qué permite hacer |
| :---: | :--- | :--- |
| `/` | **Inicio de sesión** | Acceso al sistema. Presenta el panel de marca con el posicionamiento del producto ("Confianza en cada registro") y un formulario con validación de campos, manejo de sesión de demostración y redirección al dashboard. |
| `/forgot-password/` | **Recuperar acceso** | Solicita el correo de la cuenta para recuperar la contraseña. Registra la solicitud en el navegador y aclara que, en una integración real, se enviaría un enlace por correo. |

**Espacio de trabajo**

| Ruta | Pantalla | Qué permite hacer |
| :---: | :--- | :--- |
| `/dashboard/` | **Dashboard** | Punto de entrada tras el login. Muestra la navegación lateral (Dashboard, Intervenciones, Inspecciones, Auditoría), los accesos a Perfil y Usuarios, el estado del entorno de demostración y el cierre de sesión. |

**Intervenciones**

| Ruta | Pantalla | Qué permite hacer |
| :---: | :--- | :--- |
| `/interventions/` | **Lista de intervenciones** | Consulta de registros con contador, búsqueda rápida por aeronave u orden de trabajo y estado vacío con llamado a la acción. |
| `/interventions/form/` | **Nueva intervención** | Alta de una intervención con validación campo a campo y mensajes de error: aeronave, componente, orden de trabajo, fecha y hora del trabajo y descripción del trabajo realizado. |
| `/interventions/detail/` | **Detalle de intervención** | Resumen completo (aeronave, componente, orden, fecha, responsable, descripción), badge de estado, carga y consulta de **evidencias** (imágenes o PDF, hasta 1.5 MB por archivo), actualización del avance, notas de revisión y el panel **Referencia verificable**, que muestra el estado de integración con Stellar. |

**Validación**

| Ruta | Pantalla | Qué permite hacer |
| :---: | :--- | :--- |
| `/inspections/` | **Revisión de inspección** | Cola de inspección con contadores de pendientes, aprobadas y observadas; panel de revisión con checklist de cumplimiento, decisión explícita (aprobado, rechazado o con observaciones) y registro de observaciones. |
| `/return-to-service/` | **Aprobación de retorno al servicio** | Lista de intervenciones elegibles, validación previa de que la ejecución, la evidencia y la inspección estén completas, y decisión de liberación con notas. |

**Auditoría**

| Ruta | Pantalla | Qué permite hacer |
| :---: | :--- | :--- |
| `/audit/` | **Historial de auditoría** | Línea de tiempo de eventos con búsqueda, filtro por tipo (intervenciones, inspecciones, aprobaciones), responsables y fechas. Incluye el distintivo **"Stellar pendiente de integración"**. |

**Cuenta y administración**

| Ruta | Pantalla | Qué permite hacer |
| :---: | :--- | :--- |
| `/profile/` | **Perfil y configuración** | Edición de datos personales, preferencias de uso y estado de la cuenta. |
| `/admin/users/` | **Usuarios y permisos** | Lista de usuarios registrados con contador y alta de usuarios con rol. |

**Elementos transversales:** las pantallas autenticadas comparten el mismo layout —sidebar con las cuatro secciones del flujo, breadcrumb, avatar y correo de la cuenta activa, accesos a Perfil y Usuarios, y cierre de sesión—. La sesión de demostración se maneja con `sessionStorage` y los registros se conservan en `localStorage` como simulación de persistencia.

### 1.3 Mapeo con el MVP del Product Blueprint

| Pantalla implementada | Historia / paso del Blueprint |
| :--- | :--- |
| Inicio de sesión · Recuperar acceso | Paso 1 del flujo: autenticación y control de acceso (pantalla de autenticación y manejo de sesión). |
| Dashboard | Paso 3: acceso rápido a intervenciones, inspecciones y aprobaciones (objetivo 6.2 del AGENTS.md). |
| Nueva intervención | Historia 1: registrar una intervención asociada a identidad, fecha, aeronave, componente, orden de trabajo y trabajo ejecutado. |
| Lista de intervenciones | Historia 2: consultar en un solo lugar el historial de intervenciones. |
| Detalle de intervención y evidencia | Historias 1 y 2: consultar la intervención con su evidencia, responsable y resultado registrado (objetivo 6.5). |
| Revisión de inspección | Historia 4: revisar la evidencia y registrar el resultado de la inspección. |
| Aprobación de retorno al servicio | Historia 6: verificar que ejecución, evidencia e inspecciones estén completas antes de aprobar la liberación. |
| Historial de auditoría | Historias 3 y 5: quién realizó cada actividad, cuándo se registró, integridad y secuencia de los registros. |
| Perfil · Usuarios y permisos | Administración de usuarios, roles y accesos (objetivo 6.9). |

### 1.4 Recorrido del flujo en el front

El flujo principal del MVP se puede recorrer completo en la interfaz: la persona inicia sesión (`/`), llega al dashboard (`/dashboard/`), entra a Intervenciones (`/interventions/`), registra una nueva intervención con su orden de trabajo y fecha (`/interventions/form/`) y abre el detalle para adjuntar la evidencia del trabajo y consultar su estado (`/interventions/detail/`). Desde ahí, el inspector selecciona la intervención en la cola de inspección, completa el checklist y registra su decisión (`/inspections/`); si el resultado lo permite, el personal autorizado verifica que la documentación esté completa y aprueba el retorno al servicio (`/return-to-service/`). Finalmente, Calidad y Auditoría consultan la línea de tiempo con todos los eventos, responsables y fechas (`/audit/`), donde queda explícito que la referencia verificable de Stellar aún está pendiente de integración.

### 1.5 Capturas y enlace al front

> **Front hosteado:** _[PENDIENTE — pegar enlace de Vercel]_
>
> ⚠️ Si el proyecto está hospedado, este enlace debe colocarse en el campo **Website** de Apex dentro del proyecto creado.

<!-- PENDIENTE: captura tomada por el equipo -->
![Captura — Inicio de sesión](../../frontend/assets/capturas/login.png)

<!-- PENDIENTE: captura tomada por el equipo -->
![Captura — Lista de intervenciones](../../frontend/assets/capturas/intervenciones.png)

<!-- PENDIENTE: captura tomada por el equipo -->
![Captura — Detalle de intervención con evidencia](../../frontend/assets/capturas/detalle-evidencia.png)

<!-- PENDIENTE: captura tomada por el equipo -->
![Captura — Revisión de inspección](../../frontend/assets/capturas/inspecciones.png)

<!-- PENDIENTE: captura tomada por el equipo -->
![Captura — Aprobación de retorno al servicio](../../frontend/assets/capturas/retorno-al-servicio.png)

<!-- PENDIENTE: captura tomada por el equipo -->
![Captura — Historial de auditoría](../../frontend/assets/capturas/auditoria.png)

### 1.6 Qué no está conectado todavía

El front es la capa visual del MVP y ya cubre el flujo completo de pantallas, pero **no** están implementados en esta entrega: backend y API, autenticación real (la sesión es de demostración), roles y permisos validados en servidor, persistencia en servidor y verificación sobre la red Stellar. La evidencia se adjunta y se guarda **localmente en el navegador** (`localStorage`), no en un almacenamiento de archivos; y la referencia verificable aparece en la interfaz con el estado "pendiente de integración", a la espera del contrato propio de la sección 2.

---

## 2. Decisión técnica: contratos

**Opción elegida: A — Contrato propio.**

### Qué haría el contrato

El equipo creará su propio contrato en Soroban, que se encargaría de:

1. **Registrar la referencia verificable** de cada evento clave —intervención, inspección, aprobación de retorno al servicio y corrección— con su hash, identificador, cuenta responsable y metadatos mínimos (tipo de evento, fecha y referencia al registro anterior).
2. **Validar la autorización** de quien registra: solo la cuenta asociada al rol correspondiente (técnico, inspector, personal autorizado para el retorno al servicio) puede escribir su evento.
3. **Vincular las correcciones con el registro original**, para que una modificación posterior quede referenciada sin reemplazar el hecho original.
4. **Exponer la verificación de integridad y secuencia**, para comprobar que el historial no fue alterado y que los eventos están en el orden esperado.

Los detalles de la intervención, la evidencia y los archivos permanecen **fuera de la cadena**, en la base de datos: en Stellar solo se registra la referencia.

### Por qué hace falta uno propio

La decisión se apoya en el uso de Stellar del Product Blueprint (sección 8): el criterio de pertinencia exige que varias organizaciones independientes —operadores, organizaciones de mantenimiento y centros de servicio— compartan y validen un mismo historial sin depender de un custodio central, y que se conserve la secuencia de intervenciones, inspecciones, aprobaciones y correcciones para identificar modificaciones posteriores.

El Blueprint además establece que los contratos inteligentes permiten *"aplicar reglas para registrar eventos, validar autorizaciones y relacionar correcciones con registros anteriores"*, ejecutando las reglas compartidas de forma consistente en lugar de depender de la lógica interna de un solo participante. Esa responsabilidad no puede depender solo del backend.

### Trabajo previo: qué existe en la red

Antes de decidir, el equipo buscó proyectos existentes en el ecosistema Stellar sobre trazabilidad aeronáutica y de cadenas de suministro. Solo uno resultó muy acorde: **AeroChain**, que registra piezas de aeronaves sobre Stellar con identidades digitales a prueba de manipulación. Sin embargo, no cubre los criterios de Tracium: su objeto es la pieza y su ciclo de vida físico (fabricación → reciclaje), no el registro de mantenimiento; no modela la cadena de responsabilidad (ejecución → inspección → aprobación → auditoría) ni ofrece verificación de integridad y secuencia de los registros. Al no existir una herramienta que cubriera ese flujo, se optó por el contrato propio.

### Qué se descartó (Opción B)

La opción B —usar una herramienta ya disponible del ecosistema sin contrato propio— se descartó porque las transacciones del SDK permiten publicar un hash en la red, pero no validan quién tiene permiso para escribir cada tipo de evento ni la relación entre una corrección y su registro original: esa lógica quedaría solo en el backend, que es justo lo que el criterio de pertinencia busca evitar.

Las piezas complementarias del ecosistema (Stellar SDK y RPC, cuentas y firmas) **sí** se usarán para construir, enviar y consultar las transacciones. El contrato se implementará y desplegará sobre **testnet**, según la restricción del entregable.

---

## 3. Participación del equipo

| Integrante | Usuario de GitHub | Aporte en esta entrega |
| :--- | :--- | :--- |
| Abdul Ruiz Saldaña | [`darienabdul`](https://github.com/darienabdul) | Construcción de las pantallas restantes del flujo (detalle de intervención y evidencia, inspección, aprobación del retorno al servicio e historial de auditoría) y avance de la documentación. |
| Diego Rubio | [`drubio35`](https://github.com/drubio35) | README del repositorio, línea base del frontend en `frontend/AGENTS.md` y las tres pantallas iniciales (inicio de sesión, dashboard e intervenciones). |

---

## 4. Bloqueos y siguiente paso

**Bloqueos:** ninguno. El equipo no tiene impedimentos pendientes para continuar.

**Siguiente paso hacia el MVP:**

1. Conectar el front con un backend y una base de datos para reemplazar la persistencia local y la sesión de demostración.
2. Implementar autenticación real y validación de roles en servidor, de modo que los permisos no dependan de ocultar controles en la interfaz.
3. En la semana siguiente, implementar el contrato propio definido en la sección 2 sobre la red de testnet y mostrar la referencia verificable en el detalle de la intervención y en el historial de auditoría.
4. Publicar el front en Vercel y registrar el enlace en Apex.
