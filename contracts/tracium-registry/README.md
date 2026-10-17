# Tracium Soroban Registry

Contrato Soroban para anclar hashes de eventos de mantenimiento y verificar su
secuencia en Stellar. Los archivos, los datos personales y el contenido técnico
deben permanecer fuera de la cadena.

## Reglas del contrato

- El administrador inicial es quien despliega el contrato y llama a
  `initialize`; la inicialización solo puede completarse una vez.
- El administrador asigna y revoca roles: `Technician`, `Inspector`,
  `ReturnToService`, `Quality` y `Auditor`. Auditor es un rol de consulta; no
  puede escribir eventos.
- Cada escritura requiere la firma de la cuenta autora y el rol correspondiente:
  `Intervention` requiere `Technician`, `Inspection` requiere `Inspector`,
  `ReturnToService` requiere `ReturnToService` y `Correction` requiere `Quality`.
- Cada evento nuevo debe apuntar al último evento de la misma intervención.
  Los IDs de evento son únicos dentro de esa intervención.
- Una corrección crea un evento nuevo y debe referenciar un evento existente de
  esa intervención. No reemplaza ni elimina el original.
- `content_hash` es un hash SHA-256 calculado fuera del contrato sobre una
  representación canónica y versionada del contenido. El contrato comprueba su
  secuencia y atribución, pero no puede certificar que el contenido externo sea
  veraz.
- El contrato emite el evento Soroban `recorded` con el registro para que un
  servicio indexador reconstruya el historial.

## Requisitos

- Rust y Cargo, con el target `wasm32v1-none`.
- Stellar CLI instalado y configurado.
- Una identidad de Stellar con XLM de testnet para pagar las operaciones.

Comprueba la instalación y prepara el target:

```powershell
rustc --version
cargo --version
rustup target add wasm32v1-none
stellar --version
stellar keys generate tracium-admin --network testnet
stellar keys address tracium-admin
```

Guarda la dirección que devuelve el último comando; será el administrador
inicial. No compartas ni subas la frase semilla de esa identidad.

## Pruebas y compilación

Desde esta carpeta:

```powershell
cargo test
stellar contract build
```

El artefacto WebAssembly optimizado se genera normalmente en
`target/wasm32v1-none/release/tracium_registry.wasm`.

## Despliegue en testnet

Desde esta carpeta, despliega el contrato con la identidad administradora:

```powershell
stellar contract deploy `
  --wasm target/wasm32v1-none/release/tracium_registry.wasm `
  --source-account tracium-admin `
  --network testnet
```

Guarda la dirección del contrato que devuelve el comando y asígnala a
`<CONTRACT_ID>`. Inicialízalo inmediatamente:

```powershell
stellar contract invoke `
  --id <CONTRACT_ID> `
  --source-account tracium-admin `
  --network testnet `
  -- initialize `
  --admin <ADMIN_PUBLIC_KEY>
```

La sintaxis para pasar los valores de `Role`, `EventType` y `Option` con
`stellar contract invoke` puede variar según la versión del CLI. Consulta
`stellar contract invoke --help` y los tipos del contrato antes de asignar
roles o enviar registros. La identidad administradora debe asignar los roles
antes de que esas cuentas puedan registrar eventos.

## Retención del estado

El contrato usa almacenamiento persistente con extensión de TTL por acceso y
renovación en lotes de hasta 50 IDs mediante `renew_event_ttl`. Los roles también
expiran si no se usan; renúevalos con `renew_role_ttl` pasando sus direcciones.
Las entradas persistentes de Soroban no son almacenamiento permanente: un
servicio administrativo debe mantener índices de los IDs y direcciones y
renovar todos los eventos y roles con regularidad, antes de que expiren. Estas
llamadas administrativas también mantienen viva la instancia del contrato. El
índice externo debe conservar los eventos Soroban para reconstruir y auditar el
historial. No dependas de una entrada expirada como único respaldo.

Este proyecto contiene el código y las instrucciones de despliegue; no implica
que el contrato ya haya sido desplegado ni auditado.
