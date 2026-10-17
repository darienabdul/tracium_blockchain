# Semana 4 — Avance del contrato Soroban

## Objetivo

Iniciar la implementación del contrato propio de Tracium en Soroban para
registrar referencias verificables de eventos de mantenimiento aeronáutico en
Stellar. El objetivo es conservar hashes y relaciones entre eventos en cadena,
sin publicar archivos, datos personales ni el contenido técnico de los
registros.

## Cambios en desarrollo

Se creó `contracts/tracium-registry/` como proyecto Rust independiente para el
contrato. La implementación inicial contempla:

- Inicialización con una cuenta administradora y transferencia posterior de
  esa administración.
- Asignación y revocación de roles de técnico, inspector, retorno al servicio,
  Calidad y auditoría.
- Registro de intervenciones, inspecciones, aprobaciones de retorno al servicio
  y correcciones.
- Autenticación de la cuenta autora y comprobación del rol requerido para cada
  tipo de evento.
- Secuencia append-only por intervención: cada evento nuevo referencia el
  evento anterior, y las correcciones agregan un evento sin reemplazar el
  original.
- Hash SHA-256 de 32 bytes y consulta del evento o del último evento.
- Eventos Soroban para que un servicio indexador pueda recopilar los registros.
- Funciones de renovación del TTL de eventos y roles; el almacenamiento
  persistente de Soroban requiere mantenimiento periódico.

La carpeta incluye pruebas unitarias iniciales y una guía de requisitos,
compilación y despliegue en testnet. También se documentó la nueva carpeta en el
README principal del repositorio.

## Estado

El código fuente está preparado, pero todavía no se ha verificado mediante
compilación ni pruebas, ni se ha desplegado en Stellar. En el entorno de
desarrollo actual no están disponibles Cargo ni Stellar CLI. Por lo tanto, no
hay aún una dirección de contrato ni una integración funcional con el
frontend.

## Próximos pasos

1. Instalar y configurar Rust/Cargo, el target WebAssembly de Soroban y Stellar
   CLI.
2. Ejecutar `cargo test` y corregir cualquier error de compilación o prueba.
3. Construir el contrato con `stellar contract build`.
4. Crear o seleccionar una identidad segura para testnet, financiarla y
   desplegar el WASM.
5. Inicializar el contrato y asignar los roles de las cuentas autorizadas.
6. Diseñar el servicio backend e indexador que calcule hashes canónicos,
   firme las transacciones, almacene los IDs emitidos y renueve los TTL.
7. Integrar la consulta de la referencia verificable en el detalle de
   intervención y en el historial de auditoría.

## Consideraciones

- No usar claves secretas en el frontend ni guardarlas en el repositorio.
- Mantener los documentos y datos sensibles fuera de la cadena.
- Definir una serialización canónica y versionada antes de calcular los hashes.
- Mantener fuera de cadena una copia consultable del historial y renovar las
  entradas persistentes antes de que expiren.
- El contrato verifica autorización y secuencia, pero no certifica que el
  contenido externo sea verdadero ni sustituye la revisión de expertos.
