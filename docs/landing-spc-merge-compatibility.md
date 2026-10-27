# Compatibilidad del rediseño SPC con main y producción

Revisión: 27/10/2026. Resultado: integración viable con resolución manual y validación funcional; no es una fusión automática segura. No se ha realizado merge, commit, push ni publicación.

## Versiones comprobadas

| Referencia | Estado confirmado |
|---|---|
| Rediseño | `feature/spc-diseno-octubre`, HEAD `b70e0b29e71b5463f3848cee173fb4d35619fd14`, más los cambios locales actuales. La comparación incluye esos cambios sin commit. |
| Base y origin/main | `b70e0b29e71b5463f3848cee173fb4d35619fd14` |
| main del checkout principal | `23578318ee5509696abe2414037d06727573f9a9`, árbol limpio al comprobarlo. Incluye calculadora por ambientes y controles móviles más recientes. |
| Tienda publicada | [Piso SPC](https://decokasaperu.myshopify.com/products/piso-spc), tema activo `WEB-DECOKASA-2026-ALFIN/main`, ID `188927803629`. Los cuatro archivos SPC contrastados coinciden con la base b70e0b2. |

Se descargaron únicamente HTML, CSS, JavaScript y mapas de fuentes públicos para comparar. Los archivos `landing-piso-spc.css`, `landing-piso-spc-proportions.css`, `landing-piso-spc-layout.css` y `landing-piso-spc.js` coinciden exactamente con b70e0b2 tras normalizar saltos de línea; para los tres últimos se recuperó el original de `sourcesContent` porque Shopify los comprime. No se ha verificado equivalencia de todo el tema publicado.

La producción todavía presenta la calculadora simple por área/cajas, colores de referencia y mensaje preparado de WhatsApp. No contiene los controles del modal de pedido ni del botón móvil persistente del main local. El nombre del tema no acredita que el último commit local esté desplegado.

## Corrección solicitada

La calculadora se dibujaba por encima del bloque de cinco capas y ocultaba el diagrama y su nota. Se elevó el bloque de capas a z-index 2, manteniendo calculadora en 1 y tarjetas Click en 3. En móvil, las filas ahora tienen altura proporcional de 40 unidades y alineación flex para evitar que la quinta fila invada la nota. El anclaje de la nota se ajustó a y=5995 en el mapa 1080 × 10004, según el PSD. Textos y diagrama siguen independientes.

Verificado a 320, 393, 1080 y 1440 px: diagrama visible, nota separada de la lista, sin desbordamiento horizontal, imágenes rotas ni errores JavaScript. Separación lista/nota: 4,48 / 5,5 / 15 / 15 px, respectivamente.

## Comparación de tres vías

Ensayo con copias temporales mediante `git merge-file`, sin modificar ninguna rama. Base b70e0b2, rediseño del árbol de trabajo actual y main local 2357831. Se normalizaron saltos de línea; se excluyeron vistas generadas y ZIP. Hay cinco archivos con conflictos textuales, 32 bloques en total:

| Archivo | Bloques | Resolución necesaria |
|---|---:|---|
| assets/landing-piso-spc-proportions.css | 1 | Conservar geometría del PSD y corrección de superposición. |
| assets/landing-piso-spc.css | 3 | Reconciliar estilos de controles con el rediseño. |
| assets/landing-piso-spc.js | 23 | Unificar calculadora, modales, solicitud y controles móviles. |
| sections/landing-piso-spc.liquid | 4 | Conservar composición y enlazar controles a sus nuevos elementos. |
| tests/spc.test.cjs | 1 | Mantener pruebas de ambas versiones, adaptadas al DOM final. |

`docs/progress.md`, `scripts/sync_preview.cjs` y `snippets/spc-actions.liquid` combinan sin conflicto textual; `scripts/serve_preview.py` se incorpora sin colisión. Esto no demuestra compatibilidad funcional: el snippet elimina en main el botón «Buscar asesoría», presente en el mockup actual. Conservar ambos botones del diseño al integrar, salvo nueva decisión del usuario. Las vistas previas y el ZIP deben regenerarse desde las fuentes reconciliadas.

## Funciones que deben conservarse y adaptarse

- Calculadora rápida y avanzada por ambientes: el rediseño ya incorporó esa funcionalidad. Reconciliar algoritmos, cortes, redondeo, cobertura configurada y transferencia de cajas, evitando duplicar inicializadores.
- Solicitud: el rediseño usa `<dialog>` nativo, mientras main contiene otro flujo de apertura con clases. Mantener una sola implementación, con apertura desde todos los botones, transferencia de cantidades, cierre por Escape y foco correcto.
- Botón móvil persistente: hay código parcial en el rediseño, pero busca `#spc-mobile-sticky-cta`, `.spc-hero`, `#calculadora` y `.spc-installation`, elementos/identificadores que no corresponden al nuevo DOM. Incorporar su marcado y adaptar los selectores sin alterar la distribución del PSD ni tapar contenido o teclado.
- Retirar manejadores heredados duplicados al integrar. Queda una ruta residual con respaldo fijo de 9500 céntimos, protegida por comprobaciones de inicialización; no se ha demostrado que esté activa. No reutilizarla: usar precio real configurado o estado sin precio disponible.
- Conservar la indicación de simulación del formulario. No mostrar «solicitud recibida» como si existiera un receptor: todavía no hay POST, pago, reserva ni conexión operativa a Odoo.
- Galería por variante, selección de varios colores y meta del regalo basada en precio máximo × 1,80 ya están en la base común. Mantener esos módulos sin cambios y ejecutar sus pruebas de regresión.
- Mantener precios, SKU, inventario, cobertura y configuración editorial. El PSD muestra 2,24 m²/caja y el respaldo existente 2,196; esta revisión no modifica datos comerciales. Testimonios de muestra siguen limitados al modo de diseño.

## Secuencia recomendada para la integración

1. Guardar una instantánea de todos los cambios del rediseño, incluidos archivos nuevos, y confirmar el HEAD de main antes de integrar. Trabajar en un checkout aislado del último main para evitar cruces con otras tareas.
2. Incorporar composición, mapa de 71 cajas, 33 WebP, fuentes y estilos del rediseño. Mantener el DOM y los datos Liquid necesarios para producto, variantes y formulario.
3. Resolver los cinco archivos manualmente y unificar los eventos de calculadora/solicitud. Adaptar el botón móvil y conservar los dos accesos del mockup. Eliminar rutas heredadas y respuestas engañosas.
4. Regenerar las ocho vistas y el paquete del tema. No resolver HTML generado o ZIP manualmente.
5. Validar a 320/393/768/1080/1440 px: cálculo rápido, varios ambientes, cortes, cobertura, precios, transferencia, solicitud, Escape/foco, botón móvil, teclado, carrusel y galería. Repetir pruebas generales y Theme Check.
6. Revisar el resultado en un tema de prueba antes de publicar. La aprobación visual y la publicación son pasos posteriores; esta tarea solo corrigió y auditó.

## Validación y evidencia

- 33/33 pruebas automatizadas aprobadas (`npm test`).
- Theme Check de Shopify CLI: salida vacía de hallazgos, código 0.
- El validador del plugin no inicia por dependencia ausente `@shopify/theme-check-common`; se usó la CLI como comprobación alternativa.
- `verify_store.py`: ocho páginas, enlaces/IDs/rutas/JSON válidos; ZIP regenerado de 111 archivos.
- `git diff --check`: sin errores de espacios; únicamente avisos de conversión LF/CRLF de Git.
- Evidencia local en `work/spc-redesign`: `layers-reference.png`, `layers-after-{320,393,1080,1440}.png`, `layers-visual.json`, `layers-check.cjs`.
- Ensayo reproducible: `merge-audit.py`, `merge-audit/report.json` y copias `.base/.ours/.theirs/.candidate`; HTML/activos/mapas públicos en esa carpeta. Los candidatos contienen marcadores de conflicto y no se usan en el tema.

La compatibilidad se evaluó contra las versiones indicadas. Si main cambia, repetir el ensayo antes del merge. El paso automático no sustituye la revisión semántica ni las pruebas del resultado integrado.
