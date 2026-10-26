## 26/10/2026 — Meta automática del regalo

- Sustituida la meta fija por `product.price_max × 1.80`, redondeada a céntimos. Estable entre variantes y cantidades; progreso calculado con las líneas de la solicitud. Tarjeta, importe pendiente y modal comparten la referencia. Retirado el ajuste manual antiguo; productos sin precio positivo no muestran el incentivo.
- Titan: máximo S/ 300 → S/ 540. Una blanca S/ 279 → 52%, faltan S/ 261; blanca + negra S/ 579 → desbloqueado. Reducir el total vuelve a bloquearlo.
- 29/29 pruebas aprobadas: mayor precio, disponibilidad, comparación, valores antiguos ignorados, variantes combinadas, redondeo, límite exacto y precio cero. Tres archivos de tema validados con Shopify sin hallazgos. Ocho vistas y ZIP de 74 archivos regenerados y verificados.
- Commit `6583374` enviado a `main`, sincronizado y comprobado en Shopify (tema `188927803629`): meta y modal S/ 540; blanca S/ 279, pendiente S/ 261 (52%); cambio a negro conserva la meta y la selección; ambas S/ 579 desbloquean el regalo; quitar blanca deja negro S/ 300, pendiente S/ 240 (56%) y vuelve a bloquearlo. Consola sin errores. Evidencia: `outputs/titan-meta-80-porciento.png` en el chat de trabajo. Sin cambios de catálogo ni envío de solicitudes.

## 26/10/2026 — Solicitud con varios colores

- Incorporada lista por variante: elegir color/cantidad, agregar, repetir; controles independientes y eliminación. Cambiar de color conserva selección y formulario. Agregar un color repetido suma unidades.
- Total, meta del regalo y resumen del formulario usan todas las líneas con su precio y SKU. Lista vacía impide continuar. Errores de carga conservan la solicitud y permiten reintentar. Formulario aún en simulación, sin envío, reserva ni pagos; calculadoras PVC/SPC preservadas.
- 27/27 pruebas aprobadas, incluidos precios distintos, acumulación, edición, eliminación, límites, fallo de red y referencia estable por solicitud. Cuatro archivos validados con la herramienta nativa Shopify sin hallazgos. Ocho vistas y ZIP de 74 archivos válidos. Revisión visual local a 320/390 px y escritorio; consola sin errores.
- Commit `104c032` enviado a `main`, sincronizado y verificado en Shopify (tema `188927803629`): blanco ×1 + negro ×1 = S/ 579; blanco ×2 + negro ×1 = S/ 858; eliminación y cambio de color conservan cantidades y recalculan el total. El formulario muestra ambas líneas y la galería blanca conserva cuatro ángulos. Consola sin errores. Titan continúa en borrador y el formulario sigue en simulación.

## 26/10/2026 — Titan: galería ordenada por color

- Implementada galería desde `decokasa.gallery_images` de variante, con respaldo en la galería general para otros productos. Una foto principal visible, resto con carga diferida y miniaturas solo cuando hay varias fotos. Conserva cambio de color, cantidad, formulario y controles existentes.
- Configuradas y releídas en Shopify nueve imágenes: blanco cuatro ángulos (tres cuartos, frontal, lateral y reclinada con reposapiés); cinco colores con una imagen cada uno. Restaurada imagen nativa de blanco y textos alternativos descriptivos. Producto 15464341471469 continúa DRAFT; SKU, precios e inventario preservados.
- 24/24 pruebas aprobadas, incluyendo selección de ángulo, cambio de color sin mezclar fotos y conservación de cantidad/contacto. Validación nativa Shopify del snippet sin hallazgos. Vistas y ZIP regenerados. `lint`/`build` del manifiesto React no disponibles porque faltan tsc/vite en la instalación existente; no se modificó esa aplicación ni sus dependencias.
- Guía de mantenimiento actualizada en `docs/product-detail.md`. Commit `063e0be` enviado a `main`, sincronizado y comprobado en Shopify (tema 188927803629): cuatro ángulos blancos y cambio de los seis colores sin mezclar fotos; consola sin errores. Sheet del catálogo actualizado y releído en 16 celdas. Producto continúa en borrador; pendientes confirmación de precios actuales, unidad de venta y disponibilidad.

## 22/10/2026 — Corrección móvil SPC sincronizada y comprobada en Shopify

- El usuario no veía la corrección en la tienda: se confirmó que solo estaba en archivos locales, mientras el tema activo seguía sirviendo los tres CSS anteriores.
- Registrados los 13 archivos pendientes de la corrección y documentación en `95c644f` (`fix(spc): conservar proporciones del mockup en movil`); push a `origin/main` completado. La integración GitHub de Shopify actualizó el tema `WEB-DECOKASA-2026-ALFIN/main`, id 188927803629, role main.
- Producto público comprobado: https://decokasaperu.myshopify.com/products/piso-spc . Los tres CSS publicados tienen las mismas reglas CSSOM que los archivos locales; las diferencias de texto de dos archivos son normalización de Shopify. Desaparecieron las redistribuciones móviles anteriores.
- 50 cajas presentes verificadas respecto al mapa, con coordenadas relativas a cada sección, a 320/393/1080 px: error máximo 0,1035 px normalizado, sin desbordamiento horizontal, imágenes completas y sin errores JavaScript. Calculadora 20 m²: 11 cajas con cortes y 10 sin cortes; selección Caoba funcional. Captura móvil revisada.
- Cinco entradas del mapa no aparecen en Shopify por la configuración prevista de testimonios/sellos; no se publicaron opiniones ni certificaciones de muestra. Pendientes catálogo/variantes y contenido comercial real.
- Evidencia local: `work/shopify-spc-before.json`, `work/shopify-spc-verification.json` y `work/shopify-spc-mobile-full.png` en el chat `2026-10-21/este-mokup-es-para-la-pagina-4`. No hubo cambios adicionales en código de tema durante la verificación del despliegue.

## 22/10/2026 — Corrección de proporciones móviles de toda la landing SPC

- Fusión previa confirmada en `main`, HEAD `e594fbf`; trabajo continuado allí por petición del usuario. Se identificó que el mapa proporcional estaba limitado a anchos desde 701 px y las reglas móviles reorganizaban la página.
- Aplicado el mismo lienzo 1080 × 6491 en todos los anchos. Retiradas redistribuciones de 800/700/540 px; escalados texto, imágenes, botones, bordes y sombras. Modificados los tres CSS SPC, generador y modo del JSON; vistas y ZIP sincronizados. Liquid/HTML/JavaScript funcional sin cambios.
- Verificación de 55 cajas en 12 anchos de 320 a 1440 px: máximo 0,1094 px normalizado frente al mapa; sin desbordamiento. Comparación de escritorio 1080 px contra HEAD: estilos calculados y captura idénticos. Esto comprueba continuidad del escritorio y geometría del mapa, no igualdad píxel a píxel con el PSD.
- 22/22 pruebas; Theme Check sin hallazgos; ocho vistas/enlaces/IDs/JSON válidos; ZIP de 74 archivos. Calculadora, rechazo de entradas, colores y enlaces comprobados en navegador; pruebas móviles adicionales 320/390/600/700. Imágenes completas y sin errores JavaScript.
- Entrega local actualizada en `outputs/DECOKASA-SPC-landing` del chat `2026-10-21/este-mokup-es-para-la-pagina-4`: vista, mapa, JSON, capturas y validación. URL local: http://127.0.0.1:8817/?revision=movil-proporcional . Cambios sin commit/push/despliegue; pendientes revisión comercial y configuración con catálogo real.

## 22/10/2026 — Vista previa local restablecida

- El puerto 8817 no tenía servidor activo; los archivos de la landing seguían disponibles. Reiniciado el servidor HTTP local en 127.0.0.1:8817 desde outputs/DECOKASA-SPC-landing del chat del 21/10.
- Comprobación en navegador: HTTP 200, 28 imágenes cargadas, 3 hojas de estilo, sin solicitudes fallidas ni errores JavaScript. Vista de 1080 px con altura 6528 px. Sin cambios de diseño ni despliegue.

## 21/10/2026 — Mapa de proporciones aplicado a toda la landing SPC

- Alcance confirmado por el usuario: toda la landing. Registradas 8 secciones y 47 cajas de posición sobre el lienzo de 1080 × 6491 px, con coordenadas absolutas y porcentajes por sección/página en `docs/landing-spc-layout.json`. Fuente: inventario de capas y previsualización conservados de LANDING SPC_MOCK.psd; el original de Downloads no estuvo disponible en esta etapa.
- `scripts/generate_spc_layout.cjs` deriva porcentajes y `assets/landing-piso-spc-layout.css` de las cajas en píxeles; se ejecuta con `npm run sync:preview`. `landing-piso-spc-proportions.css` escala tipografía y contenido dentro de esas cajas. Composición proporcional desde 701 px, ancho máximo 1080 px; hasta 700 px se conserva la adaptación móvil legible.
- Aplicados posiciones, tamaños, encuadres y solapamientos de portada, introducción, beneficios, anatomía, instalación, testimonios, ambiente y cierre. Corregidas ubicación de marca de agua, orientación de las muestras en perspectiva y compensación de transparencia del producto final. Se conservan recursos independientes y texto/controles en código.
- Verificación geométrica: 8 secciones + 47 cajas en anchos 701/768/923/1080/1440, desviación máxima de 0,0761 px normalizada al lienzo frente al mapa. No representa igualdad de píxeles con el PSD; la tipografía y los controles funcionales pueden diferir. Revisión visual completa y móvil realizada.
- Validación: 22/22 pruebas; Theme Check sin hallazgos; ocho vistas, enlaces, IDs y JSON válidos; ZIP actualizado con 74 archivos de tema. Navegador 320/390/768/1080/1440 sin desbordamiento ni errores, imágenes cargadas y calculadora/colores/teclado operativos. Botones y cálculo comprobados además a 320/390/600/700 px.
- Entrega local actualizada: `outputs/DECOKASA-SPC-landing/` del chat `2026-10-21/este-mokup-es-para-la-pagina-4`, con landing, mapa interactivo, JSON, capturas y resumen de validación. Mapa comprobado en cuatro anchos, sus selectores y las 47 entradas. Rama `feature/landing-piso-spc`; cambios previos preservados, sin commit/push/despliegue en esta etapa.

## 21/10/2026 — Corrección de beneficios según referencia del usuario

- Sustituidos los seis iconos aproximados por trazados originales recuperados de los objetos inteligentes del PSD: agua, espuma, persona caminando, tablones con encastre, escoba y rostro de perro. Se guardan como SVG independientes con nombres descriptivos `spc-icono-*.svg`, sin texto ni capturas de interfaz.
- Ajustados encuadre de la sala, título con fondo amarillo redondeado, tamaños/espacios y negritas. Texto de limpieza: «Fácil de limpiar». Adaptación móvil conservada.
- Modificados sección SPC, CSS, snippet de iconos compartido y sincronizador para copiar SVG. Ocho vistas y ZIP regenerados (72 archivos). 22/22 pruebas aprobadas; Theme Check sin observaciones; cinco anchos de 320 a 1440 px sin desbordamiento, imágenes completas, interacciones correctas y cero errores JavaScript. Revisión visual a 923 y 390 px.
- Vista local y capturas de outputs actualizadas. Trabajo local en `feature/landing-piso-spc`; sin commit, push ni despliegue.

## 21/10/2026 — Landing SPC reconstruida con recursos independientes

- Trabajo local en `feature/landing-piso-spc` (base 54af9a1). Se reemplazó la composición basada en capturas por HTML/Liquid, CSS y SVG, con los 21 recursos separados del PSD. Cabecera, producto superpuesto, muestras, beneficios, anatomía, calculadora, testimonios de muestra, ambiente y cierre siguen la composición del mockup y se adaptan a móvil.
- Recursos antiguos y experimentos gráficos retirados de `assets/` y `preview/assets/`, preservados en `docs/references/landing-spc-recortes-anteriores/`; no se incluyen en el ZIP del tema. Nombres descriptivos y originales del paquete conservados.
- Calculadora corregida: área de 0.01 a 100 000 m², cajas completas, 10% opcional para cortes, resultados obsoletos ocultos al editar y consulta WhatsApp con cantidad/color. Se usan título/SKU del producto y rendimiento por metacampo de variante/producto, con respaldo de sección 2.196 m². Los tres colores son referencias visuales, todavía no variantes comerciales. No se muestran precios ficticios.
- Testimonios de muestra y sellos solo se muestran automáticamente en la previsualización local. En Shopify, testimonios mediante bloques editoriales y sellos desactivados por defecto hasta validación. Aislamiento de estilos/cabecera general solo en la plantilla `landing-spc`.
- Corregida la duplicación de metadatos al regenerar las ocho vistas. Validación: 22/22 pruebas aprobadas; Shopify Theme Check sin errores ni advertencias; ocho vistas, enlaces, IDs y JSON válidos; ZIP de 66 archivos regenerado. Navegador Edge: 320, 390, 768, 1080 y 1440 px sin desbordamiento horizontal, imágenes completas y cero errores JavaScript. Cálculo con/sin cortes, rechazo de entradas, color, flechas y teclado comprobados.
- Vista de diseño y capturas finales en los outputs de este chat. Guía: `docs/landing-spc.md`. Pendiente: validación comercial de colores/variantes/testimonios/sellos y revisión en Shopify con catálogo real. Sin commit, push ni despliegue; `main` no modificado.

# Avances y validación

## 21/10/2026 — Adobe y nombres descriptivos de los recursos

El usuario recuerda la integración disponible con Adobe y pide nombrar cada recurso por su contenido real, aunque la capa carezca de nombre útil. Aplicar esta convención en próximas extracciones; evaluar primero las herramientas Adobe pertinentes. En las capacidades expuestas revisadas no se encontró extracción de capas PSD, por lo que se conserva la extracción local ya validada. Se precisaron siete nombres (escenas, cajas con tablones, muestras en perspectiva y despiece), se actualizaron guía, catálogo y manifiesto tanto en entregables como en repositorio, y se regeneró el ZIP. 21 recursos verificados por huella; enlaces comprobados. Código de la landing sin modificar.

## 21/10/2026 — Recursos separados del PSD para landing SPC

- Fuente: `C:\Users\D. Cordova\Downloads\LANDING SPC_MOCK.psd` (1080 × 6491), SHA-256 `22fe04daa860fe33538d8076c8a04ecbaf6510586ecb47b1f23b64b476ad74ed`.
- Rama verificada: `feature/landing-piso-spc`; se conservaron los cambios existentes y no se modificó la implementación Liquid/CSS ni sus recursos actuales.
- Paquete preparado en `docs/references/landing-spc-recursos/`: 21 recursos (2 logotipos PNG, 4 fotografías WebP, 3 productos transparentes WebP, 3 muestras WebP, 1 diagrama transparente WebP, 2 retratos WebP y 6 sellos PNG), con `indice.html`, `LEEME.md` y `manifest.json`.
- Extracción de originales incrustados y máscaras del PSD; sin capturas de interfaz, textos, botones, controles ni iconos genéricos. Logotipos/sellos renderizados desde PDF a 4× para conservar transparencia y degradados sin problemas de recorte SVG.
- Validación: 21/21 imágenes decodificadas, dimensiones y huellas verificadas; transparencia comprobada en marca/productos/diagrama/sellos; enlaces del catálogo y copia en repositorio comprobados; lámina de contacto revisada visualmente. PSD original intacto. No se repitieron pruebas de aplicación porque no cambió código.
- Aclaración frente a notas anteriores: el PSD por sí solo no acredita identidades de los retratos, testimonios reales ni certificaciones. Se entregan como recursos del mockup. Solo hay tres muestras individuales; no inferir un cuarto SKU. Diagrama limitado a 559 × 583 px y tablón isométrico recortado de origen.
- Pendiente de otra etapa: integrar recursos seleccionados en `assets/`, ajustar encuadres y reemplazar referencias actuales siguiendo el LEEME. No se hizo commit, push ni publicación.

## 20/10/2026 — Despliegue a producción y verificación en vivo en Shopify (main)

- Rama principal: `main` (commit `ef55844`).
- Despliegue y verificación en la tienda en vivo (`https://decokasaperu.myshopify.com/products/piso-spc`):
  - Tema activo `188927803629` sincronizado automáticamente por Shopify desde GitHub `main`.
  - Tarjeta de monto estimado a pagar (`.product-estimate-card`) verificada en el HTML en vivo de la tienda.
  - Recursos CDN de Shopify (`product-detail.css` y `product-detail.js`) entregados con HTTP 200 conteniendo los estilos y la lógica de cálculo en tiempo real.
  - Soporte de desglose por unidades o cajas (para pisos PVC/SPC), resumen de solicitud en el formulario de contacto y meta de objetivo/regalo especial.
- Validación técnica: 19 de 19 pruebas unitarias aprobadas (`npm test`) y verificación estática de 8 vistas (`verify_store.py`).

## 19/10/2026 — Mejora de botón de objetivo y modal interactivo de regalo especial

- Rama secundaria: `feature/monto-estimado`.
- Se perfeccionó el botón de objetivo en la cabecera de la meta (`snippets/product-landing.liquid`, `assets/product-detail.css`, `assets/product-detail.js`):
  - Diseño y acabado profesional: se transformó el elemento estático en un botón de acción interactivo (`.reward-badge-action`), con icono de regalo SVG, tipografía nítida, micro-interacción con elevación suave en hover y compresión táctil en click.
  - Apertura de modal explicativo (`<dialog class="reward-modal-dialog">`): describe con claridad las condiciones del beneficio comercial (obsequio de cortesía a partir de S/. 1,000 PEN, sin cupones, confirmado por el asesor comercial en Odoo y válido para todo el catálogo).
  - Estado dinámico de desbloqueo: al alcanzar los S/. 1,000.00 PEN, el botón actualiza su texto a `¡Regalo Desbloqueado! · Ver detalles` con tonalidades esmeralda, borde verde y resplandor festivo.
  - Accesibilidad completa: cierre con tecla Escape, clic en fondo translúcido con desenfoque (`backdrop-filter`) o botón de cierre, atributos ARIA (`aria-haspopup="dialog"`, `aria-expanded`).
  - Optimización táctil de los botones de cantidad (`+`/`-`) y el botón principal de compra (`.product-cta`).
- Validación: 18 de 18 pruebas unitarias y DOM aprobadas (`npm test`), vistas sincronizadas (`npm run sync:preview`).

## 19/10/2026 — Meta de objetivo con jerarquía superior para regalo especial desde S/. 1,000 PEN

- Rama secundaria: `feature/monto-estimado`.
- Se implementó la meta de objetivo con jerarquía superior en pantalla para todos los productos (`snippets/product-landing.liquid`, `assets/product-detail.css`, `assets/product-detail.js`, `preview/product-demo.js`):
  - Ubicación preferente: posicionada en la cabecera de la columna de detalles del producto con alta jerarquía visual (`.reward-goal-card.hierarchy-top`), destacando el objetivo antes de la selección de variantes.
  - Indicador de meta con umbral de S/. 1,000.00 PEN (`reward_threshold` configurable por sección, por defecto 1000 PEN / 100,000 centavos).
  - Barra de progreso dinámica e interactiva con porcentaje en tiempo real, cálculo de diferencia restante (`S/. XX.XX PEN restantes`) y estado de desbloqueo con felicitación (`¡Felicidades! Has alcanzado la meta y desbloqueaste tu Regalo Especial 🎁`).
  - Sincronización completa con el selector de cantidad (`+`/`-`), ingreso manual, calculadora de cajas PVC y cambios de variantes/presentaciones.
  - Insignia de regalo especial reflejada de forma complementaria en la tarjeta de monto estimado bajo los controles de compra.
- Validación: 17 de 17 pruebas unitarias y DOM aprobadas (`npm test`), vistas de demostración sincronizadas (`npm run sync:preview`) y probadas en todos los productos.

## 19/10/2026 — Previsualización dinámica de monto estimado en ficha de producto

- Rama secundaria: `feature/monto-estimado`.
- Se implementó la previsualización del monto estimado en la ficha de producto (`snippets/product-landing.liquid`, `assets/product-detail.css`, `assets/product-detail.js`):
  - Tarjeta de cálculo dinámico: refleja el subtotal calculado en tiempo real según la cantidad seleccionada y el precio unitario de la variante activa (`data-estimated-bar`).
  - Muestra desglose claro: `${cantidad} unidades × S/. ${precio_unitario} PEN` (o cajas en revestimientos PVC/SPC).
  - Actualización inmediata con los botones de incremento/decremento (`+`/`-`), ingreso manual o cálculo de cajas PVC.
  - Sincronización con variantes activas y conservación en la simulación de solicitud para el asesor.
- Validación: 17 de 17 pruebas aprobadas (`node --test`), vistas locales sincronizadas y publicadas en la rama secundaria.

## 09/10/2026 — Ficha predeterminada de producto

- Implementada la ficha solicitada a partir de la captura: galería con miniaturas, marca, título, precio, variantes, cantidad, SKU, descripción y bloques informativos. Dos columnas en escritorio, una en móvil. Configuración desde el editor nativo y datos desde Productos.
- Opciones nativas con actualización mediante Shopify Section Rendering, conservación de la solicitud y navegación normal como alternativa ante errores. No se serializa el catálogo completo de variantes. Calculadora PVC integrada, sin modificar el flujo comercial ni enviar formularios.
- 17 pruebas aprobadas; Theme Check sin hallazgos; siete vistas, enlaces, IDs y JSON válidos; ZIP de 39 archivos regenerado. Navegador: 1254, 390 y 375 px sin desbordamiento, imágenes completas, galería/variantes/cantidad/apertura de solicitud comprobadas, sin errores de consola.
- Guía creada en docs/product-detail.md. Muestra y capturas de escritorio/móvil disponibles en outputs del chat; productos ilustrativos no importados a Shopify. Recursos específicos limitados a la ficha. Pendientes: revisión con productos/fotos/precios reales, integración del receptor/Odoo, medición de rendimiento y nuevas plantillas especiales.
- Publicación verificada: commit `07af4a8` enviado a GitHub/main, referencia remota coincidente. Administrador Shopify confirma tema activo `188927803629`, conexión a main, estado Correcto y último guardado reciente. Recursos product-detail.css/js y decokasa.js públicos HTTP 200 con cambios presentes (Shopify minifica JavaScript). El editor muestra Producto predeterminado asignado a cero productos y deshabilitado: comprobar sus controles y la ficha con datos reales cuando exista al menos un producto. No se importaron ejemplos para eludir esta limitación.

## 09/10/2026 — Corrección de categorías y marcas, configuración nativa

- Causa: rutas dinámicas de tipo/proveedor y listas derivadas de productos quedaban vacías en una tienda sin productos. Se crearon nueve colecciones vacías y el tema usa sus objetos y enlaces nativos.
- Marcas visibles sin productos; navegación por cinco categorías, selección activa y ordenación que conserva la colección. El estado vacío indica que los productos están en preparación.
- Listas de marcas/categorías seleccionables y ordenables en Configuración del tema > Catálogo y navegación. Cada tarjeta de Inicio tiene selector de colección. Se preservan los ajustes existentes de Shopify; no se introduce configuración global guardada desde el repositorio.
- Validación local: 13 pruebas aprobadas, incluidas selección del editor, colecciones no disponibles y catálogo sin productos; Theme Check sin advertencias/errores; siete vistas y ZIP de 39 archivos válidos.
- Publicación verificada: commit `9f0ad89` enviado a GitHub/main y sincronizado en el tema activo `188927803629`. Las nueve colecciones responden HTTP 200 sin autenticación y muestran las marcas y el estado de preparación. Tecnología abre sin 404; Xion conserva la colección con orden Z–A. Editor nativo comprobado con los selectores Marcas del catálogo/Categorías de navegación. Móvil 390 px sin desbordamiento y filtros plegados al cargar. Captura del catálogo publicado guardada en outputs del chat.
- Pendientes: configuración automática según campos reales de Odoo, filtros/productos reales y medición de rendimiento con imágenes finales. No se han activado condiciones automáticas, importado productos, instalado aplicaciones ni conectado Odoo.


## 09/10/2026 — Estructura visual del catálogo publicada en Shopify

- Se preparó la sección de catálogo con introducción, navegación por marcas, filtros, ordenación, tarjetas con acceso a la landing única y bloque de ayuda del asesor. Conserva amarillo/negro/blanco; tres columnas en escritorio y dos en móvil, con filtros plegables. Título y descripción editables en Shopify.
- La vista navegable usa cinco productos ficticios e ilustraciones marcadas como muestra. Permite buscar sin distinguir acentos, combinar marca/categoría, ordenar por nombre y limpiar una selección vacía. Las tarjetas muestran «Precio a consultar», sin inventar disponibilidad ni importar productos de Odoo.
- El tema utiliza productos y fotos de la colección Shopify, paginación de 24 y filtros nativos vendor/product_type si están configurados; ofrece enlaces por marca/tipo como alternativa. Los filtros nativos deben habilitarse y probarse en la tienda cuando exista el catálogo real. La búsqueda de la muestra es local; la búsqueda real usa el buscador global de Shopify.
- Siete pruebas Node aprobadas, ampliada la suite DOM del catálogo; siete HTML/enlaces/IDs/JSON/esquemas válidos; ZIP regenerado con 38 archivos; Theme Check sin errores ni advertencias. Comprobación visual en navegador a 1440, 768, 844, 390 y 375 px sin desbordamiento horizontal; comprobados filtros, búsqueda, orden, fichas, movimiento reducido y texto del catálogo al 200%.
- El usuario autorizó publicar esta estructura el 09/10/2026. Commit `98ddff4` enviado a GitHub/main, hash remoto confirmado. Catálogo comprobado en el tema activo Shopify `188927803629`: acceso público HTTP 200 sin autenticación, introducción/estilos actualizados, colección real vacía y cero tarjetas de muestra. Revisión visual de escritorio y móvil 390 px sin desbordamiento; filtros plegados en móvil y ordenación nativa Z–A conserva `sort_by=title-descending`. Captura de publicación guardada en outputs del chat.
- El administrador muestra visibilidad Público y el tema conectado a GitHub/main; no se cambió la visibilidad durante esta tarea. Los ejemplos ilustrados permanecen solo en la muestra local. Pendientes: productos/fotos reales, autoridad de precios y configuración de filtros con productos. Odoo, formularios y medición continúan pendientes.

## 07/10/2026 — Franja superior visible en todo el recorrido

- La franja de servicios ahora permanece fija al borde superior durante todo el desplazamiento de la página, no solo dentro de la sección de cabecera. El tema reserva el espacio inicial y mide la altura de la franja para escritorio y móvil.
- Se regeneraron las siete vistas locales y el ZIP Shopify de 37 archivos.
- Validación: siete pruebas Node aprobadas; siete páginas, rutas, enlaces y JSON válidos; Shopify Theme Check sin hallazgos. Commit `448fce6` enviado a GitHub/main y árbol limpio. La sincronización depende de la conexión existente; queda pendiente confirmar visualmente en el administrador Shopify.

## 07/10/2026 — Favicon DECOKASA

- Se añadió `assets/favicon.png`, un favicon PNG transparente de 128 × 128 px basado en el símbolo amarillo del logo DECOKASA. El `<head>` global del tema lo carga en todas las páginas.
- El sincronizador copia el icono a las vistas locales y el ZIP Shopify actualizado contiene 37 archivos.
- Validación: siete pruebas Node aprobadas; siete páginas, enlaces y JSON válidos; Shopify Theme Check sin hallazgos. Commit `9d93471` enviado a GitHub/main y referencia remota confirmada. La conexión existente sincroniza los cambios con el tema Shopify; no se realizó verificación visual del favicon en el administrador durante este turno.

## 07/10/2026 — Barra fija y acceso a WhatsApp

- La franja superior de servicios permanece visible al desplazarse. La portada incorpora un botón flotante accesible y adaptable que abre WhatsApp al `+51 941 599 516` con un texto prellenado; el cliente lo revisa y envía manualmente.
- Se añadió una vista local de teléfono (390 × 844 px) en `preview/DECOKASA-movil.html`; muestra la portada de la demostración dentro de un marco y no sustituye la vista previa del tema en Shopify.
- Número y mensaje se pueden editar en los ajustes de la sección Inicio. Se actualizaron las siete vistas locales y el ZIP del tema.
- Validación local: siete pruebas Node aprobadas; siete páginas/rutas/JSON/enlaces verificados; ZIP de 36 archivos. Commit 8508428 enviado a GitHub/main y hash remoto confirmado. La vista de Shopify debe recibir la sincronización por la conexión existente; no se comprobó visualmente en el administrador en este turno.

## 06/10/2026 — DECOKASA con revestimientos y hogar

- Nueva imagen independiente con pisos PVC y SPC, paneles PVC, wall panel, alfombras y artículos para el hogar; logo integrado y composición acorde a las otras marcas. Generada con image_gen, 1860 × 846 px, WebP calidad 94. Original preservado; prompt y dimensiones registrados.
- Sustituido el fondo de logo por la nueva imagen; conservados el enlace por marca, el selector del editor y el orden DECOKASA, Xion, Biflex, Mundo Baby. Otras imágenes sin cambios.
- Siete vistas regeneradas; ZIP actualizado a 36 archivos. Siete pruebas aprobadas, HTML/enlaces/IDs/rutas/JSON válidos y Shopify Theme Check sin hallazgos.
- Commit 5be5172 enviado a GitHub/main y verificado en Shopify: las cuatro imágenes cargan en el orden solicitado; escritorio de 1905 px sin desbordamiento horizontal. Captura: outputs/DECOKASA-marca-hogar-shopify.png del chat de trabajo. Memoria canónica e índice actualizados.

## 06/10/2026 — DECOKASA encabeza Nuestras marcas

- Orden solicitado: DECOKASA, Xion, Biflex y Mundo Baby. Nueva tarjeta DECOKASA con el logo WebP aprobado sobre fondo amarillo suave y enlace al catálogo por marca; imagen sustituible desde el editor del tema.
- Se conservan sin cambios los seis WebP existentes y el único bloque mayorista inferior. Cuatro columnas en escritorio, dos en tabletas y una en celular.
- Siete vistas regeneradas y ZIP de 35 archivos actualizado. Siete pruebas aprobadas, enlaces/IDs/rutas/JSON válidos y Shopify Theme Check sin hallazgos.
- Commit 0a47458 enviado a GitHub/main y verificado en Shopify: cuatro imágenes cargadas en el orden solicitado; escritorio 1905 px, tableta 753 px y celular 375 px útiles sin desbordamiento horizontal. Captura: outputs/DECOKASA-cuatro-marcas-escritorio.png del chat de trabajo. Memoria canónica e índice actualizados.

## 06/10/2026 — WebP de alta resolución y mayorista sin duplicación

- Retirada la cuarta tarjeta mayorista de Nuestras marcas. Se mantienen Xion, Mundo Baby y Biflex, y el bloque inferior #mayorista. Tres columnas en escritorio; una en celular para mostrar mejor cada imagen.
- Seis imágenes regeneradas individualmente con image_gen siguiendo el mockup aprobado: logo, hero, Xion, Mundo Baby, Biflex y franja. WebP a resolución nativa, calidad 94 y logo sin pérdida; originales preservados en generated_images local. Prompts y manifiesto incorporados a docs. La referencia original permanece en docs/references.
- Reemplazados los recortes CSS ampliados por imágenes independientes; actualizados selectores del editor, siete vistas y paquete de 35 archivos.
- Verificación: siete pruebas Node aprobadas; siete HTML, enlaces, IDs, rutas, JSON y ZIP válidos; Shopify Theme Check sin hallazgos.
- Publicado en la rama conectada main mediante da2caab y verificado en Shopify: tres marcas, un bloque #mayorista y seis WebP cargados a sus dimensiones nativas. Escritorio 1905 px y móvil 375 px útiles, sin desbordamiento horizontal; tamaño del navegador restablecido. Capturas guardadas en outputs del chat.
- Sin cambios de operación: formulario simulado y conexiones CRM/Odoo/GA4 pendientes. Catálogo y fotografías comerciales reales pendientes.

Las secciones siguientes describen estados anteriores.

## Estado actual — 06/10/2026, diseño según mockup original

- Tema activo en Shopify, conectado a GitHub/main, tienda privada con contraseña. Estado observado en el administrador; no se cambió publicación ni contraseña durante este ajuste.
- Cabecera, buscador, categorías, banner negro/amarillo, cuatro marcas y franja promocional adaptados al mockup del usuario. Fotos provisionales tomadas de la referencia original sin alterar el archivo; logo, banner y tarjetas reemplazables desde el editor. Titular y botones reales, con texto adaptado al flujo de compra con asesor.
- Cambios de diseño registrados en `aec5ac8` y `a665821`, push confirmado. Portada comprobada directamente en Shopify después de la sincronización: escritorio de 1905 px y móvil de 375 px de ancho útil, sin desbordamiento horizontal. Imágenes cargadas y tarjetas en dos columnas en móvil; tamaño temporal del navegador restablecido.
- Modificados cabecera, portada, estilos y ubicación del aviso demo; añadidos iconos SVG, snippet de referencia y recurso original. Siete vistas locales regeneradas mediante `scripts/sync_preview.cjs`; ZIP actualizado a 30 archivos de tema.
- Validaciones: siete pruebas Node aprobadas; siete HTML, enlaces/anclas/IDs/JSON/esquemas y ZIP válidos; Theme Check `[]`; auditoría de dependencias sin vulnerabilidades. Capturas de escritorio y móvil entregadas en outputs del chat.
- Pendientes: artes separados y catálogo real; revisión funcional con esos productos; receptor/CRM/Odoo, consentimiento y GA4. Formulario sigue simulado, sin envíos ni afectación de stock.

Las entradas siguientes son históricas y describen el estado anterior a esta revisión.

## 06/10/2026 — primera base 0.1.0

Tema Shopify con 27 archivos, siete vistas HTML navegables, calculadora PVC interna y formulario simulado. Documentación histórica y referencia visual preservadas; decisiones actuales en `project-context.md`. Contrato de solicitudes/CRM propuesto, sin conexión real.

Validación previa: Shopify Theme Check sin errores ni advertencias; seis pruebas de lógica aprobadas; siete páginas con enlaces, anclas, IDs y esquemas válidos; prueba DOM simulada aprobada para filtros, variantes, cálculo, referencias y consentimiento, sin envíos de red.

Las pruebas DOM sustituyen la validación nativa de campos por un doble de prueba. No confirman aspecto visual, comportamiento móvil ni integración Shopify/Odoo. Revisión visual pendiente; el navegador de herramientas bloqueó archivos locales y se respetó esa limitación.

## 06/10/2026 — registro en GitHub

Autorizado por el usuario: guardar todo el trabajo del proyecto. Se incluyen código del tema, demostración, datos ficticios, pruebas portátiles, paquete instalable, propuesta, plan de trabajo, contexto, esquemas de fase 1 y mockup inicial. Los documentos de planificación anteriores se conservan como antecedentes y no sustituyen las decisiones vigentes.

No se ha instalado ni publicado el tema, ni conectado Odoo o GA4. Próxima fase: revisión de la presentación y catálogo real, seguida de pruebas de integración cuando se habilite Odoo.
