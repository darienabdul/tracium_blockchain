# Investigación: proyectos existentes en Stellar sobre trazabilidad aeronáutica

> **Fecha de consulta de fuentes:** 2026-10-08
> **Fuentes:** directorio de proyectos Lumenloop, Scout Projects, SCF Submissions (Stellar Community Fund) y repositorios públicos.
> **Pregunta de investigación:** ¿ya existe en el ecosistema Stellar un proyecto sobre trazabilidad de piezas aeronáuticas? ¿Cuáles son los proyectos adyacentes más similares a Tracium?

---

## Contenido

1. Resultado principal
2. Proyecto encontrado: AeroChain
3. Historial SCF de AeroChain
4. Proyectos adyacentes
5. Proyectos más similares a Tracium
6. Diferenciador de Tracium
7. Tabla resumen

---

## 1. Resultado principal

**Sí existe.** El proyecto es **AeroChain**, el único en el ecosistema Stellar que trabaja específicamente trazabilidad de piezas aeronáuticas. No se encontraron otros proyectos aeronáuticos en las fuentes consultadas.

Además, hay varios proyectos adyacentes de trazabilidad de cadenas de suministro que conviene conocer por su similitud con Tracium.

---

## 2. Proyecto encontrado: AeroChain

| Campo | Detalle |
| :--- | :--- |
| Nombre | **Aerochain** |
| Slug | `aerochain` |
| Categoría | Infrastructure & Services |
| Tags | `Supply-Chain`, `Infrastructure` |
| Base | Francia |
| Región operativa | Global |
| Web | [aerochain.wingleet.com/redoc](https://aerochain.wingleet.com/redoc) (documentación API de Testnet) |
| GitHub | [github.com/sebwingleet/aerochain-stellar](https://github.com/sebwingleet/aerochain-stellar) |
| Demo | [DEMO.aero-chain.com](https://demo.aero-chain.com) (demo interactiva en Testnet) |

**Descripción:**

> Blockchain infrastructure on Stellar providing end-to-end traceability for aircraft parts, with tamper-proof digital identities tracking lifecycle events from manufacturing to recycling.

**Qué propone (según sus propias postulaciones a SCF):**

- Protocolo descentralizado y suite de infraestructura que permite a fabricantes (OEM), aerolíneas y talleres de mantenimiento (MRO) rastrear el ciclo de vida completo de las piezas de aeronaves con blockchain.
- Cada pieza se registra on-chain con una identidad digital a prueba de manipulación que sigue los eventos del ciclo de vida, desde la fabricación hasta el reciclaje.
- Despliegue de contratos inteligentes Soroban para la trazabilidad de piezas y su cumplimiento normativo (*compliance*).

---

## 3. Historial SCF de AeroChain

Dos postulaciones, ambas de tipo **Build**:

| Ronda | Título | Enlace |
| :---: | :--- | :--- |
| SCF #37 | AeroChain: On-Chain Aviation Parts | [communityfund.stellar.org/submissions/recKjIMN7PPwmh0Eo](https://communityfund.stellar.org/submissions/recKjIMN7PPwmh0Eo) |
| SCF #38 | AeroChain: On-Chain Aerospace Components | [communityfund.stellar.org/submissions/recoPlhQ5fvz3OggB](https://communityfund.stellar.org/submissions/recoPlhQ5fvz3OggB) |

> **Nota:** los montos y el estatus exacto de los premios no estaban disponibles en los datos consultados; deben verificarse en las páginas enlazadas de la SCF.

**Alcance declarado en SCF #38:**

1. Finalizar y desplegar contratos inteligentes Soroban para trazabilidad de piezas: cada pieza de aeronave se registra on-chain.
2. API pública de Testnet y demo interactiva ya publicadas como evidencia de tracción.

---

## 4. Proyectos adyacentes

Proyectos del directorio Stellar con trazabilidad de cadenas de suministro (no aeronáuticos):

### Autify (`autify`)

| Campo | Detalle |
| :--- | :--- |
| Categoría | Applications |
| Tags | `Supply-Chain`, `AI` |
| Región | India |
| Web | [autifynetwork.com](https://autifynetwork.com) |
| SCF | #14 — *Legacy v4.0 Award* |

Plataforma de gestión de cadena de suministro que combina blockchain y AI para mejorar la transparencia, trazabilidad y confianza en cadenas de suministro globales. Su postulación a SCF #14 también menciona infraestructura de pagos cross-border.

### TRAK (`trak`)

| Campo | Detalle |
| :--- | :--- |
| Categoría | Applications |
| Tags | `Supply-Chain` |
| Región | Global / África subsahariana |
| Web | [trak.id](https://trak.id) |
| SCF | #6 — *Legacy v2.0 Award* |

Registro del recorrido de un producto en cada paso, de la fábrica a la compra final. Enfocado en entornos con conectividad e internet limitados y bajo costo de uso.

### DeFarm (`defarm`)

| Campo | Detalle |
| :--- | :--- |
| Categoría | Developer Tooling |
| Tags | `Supply-Chain` |
| Región | Latinoamérica, MENA, Europa Central y Asia |
| Web | [defarm.net](https://defarm.net) · [GitHub](https://github.com/defarm-repo) |
| SCF | #40 — *Build* |

Plataforma de trazabilidad agrícola con soberanía de datos: productores, certificadores y autoridades comparten datos de forma selectiva mediante mecanismos de divulgación que preservan la privacidad, asegurando cumplimiento y transparencia sin exponer información sensible. Su postulación a SCF #40 transforma datos agrícolas verificados en activos digitales anclados en Stellar.

### AgTrail (`agtrail`)

| Campo | Detalle |
| :--- | :--- |
| Categoría | Applications |
| Tags | `Supply-Chain`, `Mobile` |
| Región | África subsahariana (Nigeria) |
| Web | [agtrail.agrolinking.com](https://agtrail.agrolinking.com) |
| SCF | #38 — *Build* |

Plataforma de trazabilidad alimentaria para agricultores nigerianos: seguimiento de extremo a extremo mediante IoT y códigos QR, con pagos blockchain asegurados para acceder a mercados de exportación.

### TrustedPlastic (`trustedplastic`)

| Campo | Detalle |
| :--- | :--- |
| Categoría | Applications |
| Tags | `Eco-Friendly`, `Supply-Chain` |
| Región | Global |
| Web | [recyclable.credit](https://recyclable.credit) |
| SCF | — |

Transparencia en la recolección de residuos de plástico reciclable.

### ACTA (`acta`)

| Campo | Detalle |
| :--- | :--- |
| Categoría | Applications |
| Tags | `Identity`, `No-Code`, `B2B` |
| Región | LATAM |
| Web | [acta.build](https://acta.build) · [dapp.acta.build](https://dapp.acta.build) |
| GitHub | [github.com/acta-team](https://github.com/acta-team) |
| SCF | — |

Plataforma de identidad descentralizada y credenciales verificables construida sobre Stellar. Emite, comparte y verifica credenciales compatibles con W3C on-chain mediante contratos Soroban, sin necesidad de programación. Implementa el método DID `did:stellar` para identidad portable y resoluble en todo el ecosistema.

> No es un competidor directo: es una **pieza utilizable** dentro de Tracium.

---

## 5. Proyectos más similares a Tracium

Ordenados por similitud con el blueprint de Tracium (`docs/semana2/ProductBlueprint.md`):

### 1. AeroChain — alta similitud, misma industria

Comparte el dominio aeronáutico. **Diferencia clave:** AeroChain traza la *pieza* (identidad y ciclo de vida físico, fabricación → reciclaje); Tracium traza el *registro de mantenimiento* (intervención → evidencia → inspección → aprobación → auditoría). Existe un riesgo parcial de solapamiento si AeroChain amplía su alcance a registros de MRO.

### 2. Autify y TRAK — patrón genérico de trazabilidad

Trazabilidad de cadena de suministro por eventos encadenados, similar a la secuencia verificable de Tracium, pero **sin el flujo regulatorio**: no manejan roles de atribución, validación de evidencia ni verificación de integridad/secuencia de registros.

### 3. DeFarm — el más parecido en gobernanza

Validación multi-organizacional con los datos fuera de la cadena, que es exactamente la arquitectura de Tracium (detalle en base de datos, hash de verificación en Stellar). Su mecanismo de divulgación selectiva entre organizaciones independientes se alinea con el criterio de pertinencia del Problem Brief: varias organizaciones comparten y validan un historial sin depender de un custodio central.

### 4. ACTA — pieza complementaria

Relevante para las historias 1, 3 y 6 de Tracium (atribución de quién registró, inspeccionó y aprobó) mediante credenciales verificables y DID.

---

## 6. Diferenciador de Tracium

Frente a todos los proyectos anteriores, Tracium se diferencia por:

1. **Dominio aeronáutico específico** — solo AeroChain comparte el sector, y con otro objeto (piezas, no registros de mantenimiento).
2. **Cadena formal de responsabilidad** — ejecución → inspección → aprobación → auditoría, con roles definidos. Ningún proyecto adyacente modela este flujo.
3. **Verificación de integridad y secuencia de registros** — detección de modificaciones posteriores e inconsistencias en el historial.
4. **Cumplimiento regulatorio como núcleo** — preparación de evidencia para auditorías, investigaciones de discrepancias y revisiones regulatorias.

Los demás proyectos son trazabilidad de producto o materiales sin workflow de validación ni enfoque de cumplimiento.

---

## 7. Tabla resumen

| Proyecto | Qué hace | SCF | Similitud con Tracium |
| :--- | :--- | :---: | :--- |
| **AeroChain** (`aerochain`) | Identidades digitales inmutables de piezas aeronáuticas; ciclo de vida fabricación → reciclaje. OEM, aerolíneas, MROs | #37, #38 (Build) | **Alta** — misma industria, distinto objeto (pieza vs. registro de mantenimiento) |
| **Autify** (`autify`) | Supply chain con blockchain + AI para transparencia y trazabilidad global | #14 (Legacy v4.0) | **Media-alta** — mismo objetivo de trazabilidad, pero genérico |
| **TRAK** (`trak`) | Recorrido del producto en cada paso, de fábrica a retail; funciona con baja conectividad | #6 (Legacy v2.0) | **Media** — eventos encadenados sin roles ni validación de evidencia |
| **DeFarm** (`defarm`) | Trazabilidad agrícola con soberanía de datos y divulgación selectiva | #40 (Build) | **Media** — gobernanza multi-organizacional con datos fuera de la red |
| **AgTrail** (`agtrail`) | Trazabilidad food-tech con IoT y QR + pagos cross-border | #38 (Build) | **Media-baja** — captura desde el origen con referencia verificable |
| **TrustedPlastic** (`trustedplastic`) | Transparencia en recolección de plástico reciclable | — | **Baja** — solo transparencia de cadena de valor |
| **ACTA** (`acta`) | Identidad descentralizada y credenciales verificables W3C (DID `did:stellar`) | — | **Pieza complementaria** — sirve para atribución de identidad |

---

## Fuentes

- Directorio de proyectos Lumenloop (consulta 2026-10-08): `aerochain`, `autify`, `trak`, `defarm`, `agtrail`, `trustedplastic`, `acta`
- Scout Projects (consulta 2026-10-08)
- Stellar Community Fund: [SCF #37](https://communityfund.stellar.org/submissions/recKjIMN7PPwmh0Eo), [SCF #38](https://communityfund.stellar.org/submissions/recoPlhQ5fvz3OggB)
- Blueprint del proyecto: [ProductBlueprint.md](../semana2/ProductBlueprint.md)
