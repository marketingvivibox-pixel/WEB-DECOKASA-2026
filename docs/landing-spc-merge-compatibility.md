# Integración del rediseño SPC con main

Revisión: 27/10/2026. La integración semántica está terminada y validada contra la última actualización disponible de main, 23578318ee5509696abe2414037d06727573f9a9. El rediseño quedó preservado previamente en 2242eee, rama feature/spc-diseno-octubre. Este informe sustituye el ensayo preliminar anterior.

## Diseño conservado

- PSD 1080 × 10004, once secciones, 71 anclajes y 33 WebP independientes. Textos, tarjetas, controles y elementos de interfaz siguen en Liquid/CSS/SVG.
- Proporciones compartidas entre móvil y escritorio; correcciones de composición, instalación Click, testimonios, resultados/envíos y cinco capas.
- Diagrama de cinco capas sobre la calculadora, filas móviles alineadas y nota en y=5995. Separación lista/nota comprobada: 4,48 / 5,5 / 15 / 15 px a 320/393/1080/1440 px.
- Los dos accesos «Realizar pedido» y «Buscar asesoría» del mockup permanecen disponibles.

## Funciones reconciliadas

Los cinco archivos fuente con conflictos se resolvieron manualmente. Las vistas previas y el ZIP se regeneraron desde las fuentes finales.

- Calculadora rápida y avanzada por ambientes, cortes, cobertura configurada, redondeo y transferencia de cajas a solicitud.
- Un único flujo de solicitud con dialog nativo, cierre por Escape, bloqueo de fondo y recuperación del foco. Abrir solicitud desde la calculadora avanzada cierra ese diálogo y devuelve luego el foco a su acceso visible.
- Botón móvil persistente adaptado al DOM v2. Aparece después del hero, se oculta al llegar a la calculadora y durante los diálogos. Lleva a la calculadora sin abrir el teclado; respeta área segura y mantiene espacio para el pie.
- Eliminado respaldo fijo de precio. La solicitud usa el precio real configurado; cero se conserva como precio válido y datos ausentes o inválidos muestran «Importe por confirmar».
- Inicialización y limpieza de controles compatibles con recargas del editor Shopify; sin manejadores duplicados.
- Se conservan módulos generales de galería por variante, selección de varios colores y meta del regalo basada en precio máximo × 1,80.

## Validación del resultado integrado

- 33/33 pruebas automatizadas aprobadas.
- Theme Check mediante Shopify CLI: código 0, sin hallazgos. El validador del plugin no inicia por dependencia ausente @shopify/theme-check-common; se utilizó la CLI como alternativa.
- Ocho vistas generadas; enlaces, IDs, rutas y JSON válidos. Paquete de tema de 111 archivos regenerado.
- Calculadora, cantidades, solicitud, precios, foco y botón móvil comprobados a 320/393/768/1080/1440 px, sin errores JavaScript ni desbordamiento horizontal.
- Carrusel comprobado en esos cinco anchos: bucle, teclado, pausa, movimiento reducido y recarga del editor. Deslizamiento horizontal y desplazamiento vertical comprobados con entrada táctil a 393 px.
- Diagrama y nota de capas comprobados a 320/393/1080/1440 px, sin imágenes rotas.
- Evidencia fuera del tema en work/spc-redesign: interaction-results.json, testimonials-interactions.json, merge-interactions.json, layers-visual.json, merge-mobile-sticky.png y layers-after-*.png.

## Alcance comercial y publicación

No cambian SKU, inventario ni precios de catálogo. La cobertura permanece configurada: diferencia editorial entre 2,24 m²/caja del PSD y respaldo 2,196 pendiente de confirmar. Testimonios y certificaciones de muestra siguen restringidos a la vista de diseño; la tienda pública requiere contenido real autorizado.

El formulario continúa identificado como simulación: sin POST, pagos, reserva de existencias ni receptor Odoo operativo. La integración Git y su envío a main no acreditan por sí solos la sincronización del tema Shopify; comprobar el estado del despliegue por separado.

La auditoría pública anterior encontró cuatro activos SPC coincidentes con b70e0b2 en el tema 188927803629. Es un antecedente previo al merge, no una comprobación del despliegue actual.
