## 27/10/2026 — Carrusel ilustrativo del mockup habilitado

- El usuario confirmó que las imágenes son generadas por IA y autorizó su uso. Esto no acredita opiniones reales: las cinco tarjetas se presentan como «Ejemplos ilustrativos», con aviso visible «Imágenes de IA · Textos de muestra. No son reseñas de clientes reales», sin estrellas ni insignias de verificación.
- Opción editable show_illustrative_testimonials, desactivada por defecto y activada en product.landing-spc.json. Los bloques reales tienen prioridad; no se habilitan sellos de certificación. Se conserva el diseño proporcional y el carrusel infinito con pausa, teclado, gesto táctil y movimiento reducido.
- Calculadora completa conservada: medidas/croquis, ambientes, área directa, cortes y transferencia a solicitud. 20 m² = 11 cajas con cortes y 10 sin cortes. Cobertura 2,196 pendiente de confirmación comercial; solicitud sigue simulada, sin POST ni Odoo.
- 33/33 pruebas y Theme Check sin hallazgos. Navegador a 320/393/768/1080/1440 px: cinco tarjetas, imágenes cargadas, autoplay/pausa/teclado, calculadora y solicitud correctos, sin errores ni desbordamiento. Deslizamiento táctil y movimiento reducido comprobados a 393 px. Evidencia illustrative-results.json e illustrative-393/1080.png en work/spc-redesign del chat.

## 27/10/2026 — Calculadora y testimonios: comportamiento vigente

La calculadora completa permanece visible dentro de la página, con ambientes/croquis y área directa, sin modal de cálculo ni resumen rápido. Su altura se adapta al contenido en todos los anchos; es una excepción intencional al mapa PSD para conservar la herramienta anterior y su legibilidad móvil. Mantener controles y acciones en flujo normal. La solicitud conserva su único dialog nativo. Testimonios siempre tiene sección visible: sin bloques reales muestra aviso de próximas experiencias y enlace al asesor; con bloques autorizados muestra carrusel. No publicar nombres/comentarios de muestra sin confirmar. La vista local predeterminada refleja el template; SPC_DESIGN_PREVIEW=1 permite muestras explícitas. Esta entrada reemplaza la descripción anterior de calculadora avanzada en diálogo.

## 27/10/2026 — Integración vigente del rediseño SPC

La integración incorpora main 2357831 y conserva la geometría PSD 1080 × 10004 (71 anclajes). El botón móvil usa data-spc-sticky-cta y las secciones v2; debe ocultarse al llegar a la calculadora y con diálogos abiertos. Mantener un único inicializador de solicitud y dialog nativo, con foco recuperado al acceso visible cuando procede de la calculadora avanzada. Usar precio real de la opción seleccionada; cero válido y datos inválidos/ausentes como importe por confirmar, sin respaldos monetarios fijos. Conservar ambos accesos del mockup. Formulario continúa simulado y cobertura comercial configurada sin cambios. El informe de integración sustituye el ensayo previo sin merge.

## 27/10/2026 — Capas visibles y referencias para la integración

Bloque de cinco capas sobre calculadora (z-index 2 frente a 1); tarjetas Click en 3. Filas móviles de 40 unidades con alineación flex y nota y=5995 en el mapa proporcional. No aumentar el recorte para ocultar el error. Main local comprobado en 23578318ee5509696abe2414037d06727573f9a9; producción conserva activos SPC de b70e0b2. Rediseño local en feature/spc-diseno-octubre, sin fusión. Resolver manualmente cinco archivos y adaptar controles al DOM v2; conservar composición del PSD y formulario explícitamente simulado. Informe en docs/landing-spc-merge-compatibility.md.

## 27/10/2026 — Geometría de resultados y envíos

Mapa vigente: 71 cajas sobre 1080 × 10004. Encabezado resultados x150/y8365/780×116; franja x0/y8599/1080×60; tarjeta x312/y8545/458×660; foto x343/y8638/398×451; título envío x245/y9246/590×40, texto x210/y9280/660×80 y nota x300/y9365/480×26. La foto usa el recorte de máscara PSD250; almacén combina solo capas fotográficas/sombras 3/4/6/7. Cabecera y acciones sociales, franja y banderas se construyen en código. Contador 15.328 solo en diseño; leyenda pública sin contador. Mantener estas proporciones compartidas entre móvil y escritorio.

## 27/10/2026 — Carrusel de testimonios

Geometría vigente: 68 cajas. Sección x=0/y=6839/1080×963; panel x=62/y=6886/956×916; tarjetas 224×581 con separación 22 y radio 46, escaladas por ancho del lienzo en móvil/escritorio. Fondo spc-2026-testimonios-fondo.webp 1080×1018 (y=6784–7802) combina solo fotografías/decoración PSD; no incluye textos ni tarjetas. Carrusel continuo a 24 unidades PSD/s, deslizamiento táctil, teclado, pausa y movimiento reducido; copias inertes y ocultas a lectores. Una tarjeta se centra; dos o más llenan el bucle. Mantener política de muestras solo en vista de diseño y testimonios públicos desde bloques autorizados. Campo opcional headline para frase destacada. Corrección local pendiente de revisión del usuario, sin publicar.

## 27/10/2026 — Geometría del bloque Click

El mapa vigente tiene 67 cajas. Fondo Click: x=0, y=4567, 1080 × 889, radio 44,5 unidades; título Click! en Raleway cursiva 251,6115, caja x=−47/y=4643. Instalador por encima del panel superior; borde dorado del tablón desde el trazado original como SVG independiente. Cinco tarjetas de 157–158 × 191, radio 44,5, x=120/294/468/642/816 e y=5353; el panel siguiente comienza en y=5392 detrás de ellas. Mantener textos y tarjetas en código y escalar todas las medidas con el ancho del lienzo, también en móvil. Corrección local pendiente de revisión del usuario.

## 27/10/2026 — Fidelidad del bloque de composición actualizado

El mapa vigente del PSD es 1080 × 10004 (docs/landing-spc-layout.json). La imagen sala-composicion combina únicamente fotografía, retoque de pared enmascarado y sombreado del suelo originales (capas 138/140/141). El texto SPC se construye con Raleway cursiva de 310,125 unidades, peso 400 y tracking −0,03em; nombre a la izquierda, fórmula en negrita y nota blanca. Mantener separados los niños/mascota y todos los textos, sin sustituir el bloque por una captura. Corrección actual en feature/spc-diseno-octubre, aún local.

## 26/10/2026 — Meta del regalo según el producto

Decisión del usuario: reemplazar la meta fija por el precio unitario más alto del producto multiplicado por 1.80 (80% adicional). Se usa `product.price_max`, sin precio de comparación ni filtro de disponibilidad, redondeado al céntimo. Cambiar color/modelo o cantidad conserva la meta; el total de las líneas controla el progreso. Titan: máximo S/ 300, meta S/ 540. Regla común a todas las fichas que incluyen la tarjeta de regalo; productos sin precio positivo no la muestran. No cambia el catálogo ni activa envío de solicitudes.

## 26/10/2026 — Galerías de fotos por variante

La ficha predeterminada admite el metacampo PRODUCTVARIANT `decokasa.gallery_images`, lista ordenada de archivos limitada a imágenes y editable como **Galería de la variante**. Usa el identificador del medio, no el de su preview_image, para enlazar paneles y miniaturas. La primera imagen es principal; al cambiar de variante se sustituye la galería completa mediante la actualización de sección existente. Sin el metacampo se conserva product.images. No requiere etiquetas de color en los archivos ni cambios de código para incorporar más ángulos.

Aplicado al borrador Silla gamer Titan / 919B: cuatro fotos de blanco y una por cada otro color. Se conservan los seis SKU 01 acordados, los SKU 03 solo como referencias en el Sheet y los precios/inventario existentes. El usuario está incorporando manualmente productos principales mientras sigue pendiente la aprobación de Odoo de pruebas. El Sheet de revisión continúa como registro de acuerdos. No se publica el producto ni se habilita recepción real de solicitudes.

## 22/10/2026 — SPC móvil proporcional y continuidad en main

El usuario confirmó que el mockup de 1080 × 6491 px fue pensado para móvil y pidió conservar su distribución también en teléfonos. La composición completa usa una única escala según el ancho del lienzo, con máximo de 1080 px; se eliminó el cambio de distribución hasta 700 px. El JSON de geometría continúa siendo la fuente de posiciones y tamaños. Imágenes, SVG, textos y controles siguen siendo elementos independientes.

La rama SPC se fusionó en `e594fbf`; por instrucción expresa, los ajustes continúan en `main`. La corrección móvil se registró y envió a GitHub en `95c644f` el 22/10/2026. Shopify sincronizó el tema activo `WEB-DECOKASA-2026-ALFIN/main` (188927803629); se comprobó el producto `/products/piso-spc` en móvil y escritorio, con los tres CSS equivalentes al código local. La vista previa y el ZIP contienen la misma corrección.

## 21/10/2026 — Implementación vigente de la landing SPC

La plantilla `product.landing-spc.json` usa los recursos independientes del PSD y contenido HTML/CSS/SVG. No volver a integrar capturas completas de secciones; los recortes anteriores quedan archivados fuera del tema. `layout/theme.liquid` omite cabecera/pie y estilos globales únicamente para esta plantilla, respetando la composición del mockup.

La calculadora lee `product.selected_or_first_available_variant`, título/SKU y `decokasa.coverage_m2` de variante o producto; respaldo editorial 2.196 m² por caja. Tres colores de referencia (Madera natural, Caoba y Gris claro), sin inferir SKU ni seleccionar variantes por apariencia. Sin precios de demostración ni operación de inventario. WhatsApp abre una consulta preparada que el visitante revisa y envía manualmente.

La vista local inyecta `section.settings.spc_design_preview` exclusivamente al generar HTML; este ajuste no existe en el esquema del editor ni en la plantilla del tema. Los dos testimonios y seis sellos del mockup permiten revisar el diseño, claramente identificados como muestra. En Shopify, los testimonios se agregan con bloques autorizados y los sellos solo mediante el ajuste desactivado por defecto. Guía operativa: `docs/landing-spc.md`. Rama SPC fusionada en `main`; continuar según la decisión del 22/10/2026.

# DECOKASA — decisiones vigentes

## 21/10/2026 — Nomenclatura de recursos

Los recursos del mockup deben nombrarse por su contenido visual, incluso cuando la capa original no sea descriptiva. Considerar la integración con Adobe para operaciones compatibles. Convención y archivos actualizados en `docs/references/landing-spc-recursos/LEEME.md`.

## 21/10/2026 — Fuente gráfica de la landing SPC

El nuevo PSD `LANDING SPC_MOCK.psd` es la fuente de los recursos gráficos separados de la landing SPC. Paquete y mapa de integración: `docs/references/landing-spc-recursos/LEEME.md`; trazabilidad: `manifest.json`. Los textos, controles, iconos genéricos y efectos de interfaz se construyen con código; no usar capturas completas de secciones. Los recursos todavía no se conectaron a Liquid. Mantener como material del mockup los retratos y sellos hasta confirmar identidades/usos; los archivos no acreditan testimonios ni certificaciones. Los códigos de las tres muestras proceden de las capas, no sustituyen los SKU ni la fuente comercial de Odoo. Se preservó la rama y los cambios en curso.

## 20/10/2026 — Arquitectura de landings de producto personalizadas previas a Odoo

Decisión arquitectónica para construir landings enriquecidas de alta conversión para productos especiales antes de recibir el catálogo definitivo de Odoo:
1. **Aislamiento en Git y producción intacta**: El desarrollo de cada landing especializada se efectúa en una rama dedicada (`feature/landing-[producto]`). La rama `main` (desplegada activamente en Shopify) no se modifica durante la construcción, garantizando cero riesgo en la tienda en vivo.
2. **Plantilla alternativa nativa OS 2.0**: En lugar de prototipos estáticos o páginas `/pages/` desconectadas, cada landing se implementa directamente como una plantilla de producto nativa (`templates/product.landing-[handle].json`) y secciones modulares (`sections/`). Esto permite:
   - Mantener la URL canónica `/products/[handle]`.
   - Conexión nativa con el catálogo y las colecciones sin duplicación de URLs.
   - Reutilización inmediata de la ficha técnica, cálculo de monto estimado, galería y formulario de asesoría.
3. **Frontera de datos estricta (Odoo vs. Shopify)**:
   - *Odoo gobierna*: Título canónico, SKU, variantes reales, precio de lista oficial y disponibilidad/stock.
   - *Shopify/Tema gobierna*: Contenido editorial y publicitario de alta conversión (heroes promocionales, bloques de beneficios, videos, especificaciones enriquecidas, calculadoras de m² a cajas).
   - Durante el desarrollo previo a Odoo, la landing consume las variables estándar de Liquid (`product.title`, `current_variant.price`, etc.) con un objeto de respaldo (*fixture*) basado en la ficha técnica real. Al sincronizarse el producto desde Odoo, la landing consumirá automáticamente los datos vivos sin necesidad de rehacer el código visual.
4. **Vinculación inmediata**: Al ser importado el producto de Odoo a Shopify, solo se asigna la plantilla alternativa `landing-[handle]` al producto en el panel de Shopify (o mediante asignación automatizada por etiqueta/tipo).

## 09/10/2026 — Ficha de producto nativa basada en la referencia

Ficha predeterminada implementada con galería y miniaturas, datos a dos columnas en escritorio y una en móvil, precio/comparación real de la variante, opciones nativas, cantidad y solicitud al asesor. Título, proveedor, fotos, descripción, variantes, SKU y precios se administran en Productos; formato de imagen, visibilidad de datos, textos y hasta seis bloques informativos se ajustan en Productos > Producto predeterminado > Ficha de producto dentro del editor del tema. No se sobrescriben los ajustes guardados de Shopify.

La selección de opciones usa los IDs nativos y la respuesta de sección de Shopify para actualizar la ficha, con navegación normal ante fallos. No carga todas las variantes como JSON ni depende de consultas a Odoo durante la visita. Conserva los datos escritos en memoria, sin poner contactos en URLs o almacenamiento. Los recursos propios de la ficha se cargan donde se utiliza; rendimiento final pendiente de medir con catálogo real.

La calculadora PVC se conserva mediante decokasa.coverage_m2 positivo por producto/variante. Las landings especiales futuras serán plantillas alternativas asignables al mismo producto, sin duplicar registros; todavía no se han construido nuevas alternativas. Se conserva solicitud → asesor → cierre Odoo. El formulario sigue simulado; no se incorporan carrito, descuentos por cantidad, puntos, entrega prometida ni stock inventado. Las imágenes y precios ilustrativos están solo en la muestra local. Guía del equipo: docs/product-detail.md. Validación real con productos Shopify pendiente de disponer de ellos.

## 09/10/2026 — Navegación y operación sencilla en Shopify

Prioridad indicada por el usuario: personal nuevo debe operar desde Shopify con poca capacitación, código robusto y carga rápida. Mantener tema Liquid y herramientas nativas; evitar un catálogo paralelo, aplicaciones adicionales o consultas a Odoo al abrir una página.

Las marcas y categorías son colecciones Shopify reales, disponibles aunque no tengan productos. Los enlaces toman la URL del objeto colección; no dependen de rutas `/types` o `/vendors` vacías. Configuración central: editor del tema > Configuración del tema > Catálogo y navegación > Marcas del catálogo / Categorías de navegación. Selecciona y ordena hasta 12 colecciones por lista; las primeras cuatro categorías aparecen en la barra superior. Sin selección usa las colecciones iniciales disponibles; las eliminadas/no publicadas se omiten. Inicio multimarcas permite elegir la colección de cada tarjeta por separado. No se modifica `settings_data.json` ni se sobrescriben ajustes guardados en Shopify.

Se crearon nueve colecciones vacías (registro en `catalog-collections.json`). Su origen de productos sigue manual/sin condiciones; no presentarlo como automatización activa. Pendiente confirmar cómo Odoo entrega marca y categoría, y configurar condiciones nativas para que el equipo no asigne repetidamente cada producto. Vendor/product_type son candidatos, no un mapeo aprobado. Los filtros nativos conservarán su función cuando estén configurados y existan productos. No se importaron ejemplos.

El cambio añade configuración y renderizado Liquid, sin JavaScript adicional ni solicitudes a Odoo en la carga. 24 productos por página, imágenes adaptables y carga diferida fuera de la principal. No hay medición de rendimiento con catálogo real ni garantía de Core Web Vitals: validar cuando existan productos/fotos y la integración definitiva.


Actualizado: 09/10/2026. Este documento prevalece sobre las propuestas históricas de `planning/`.

## Confirmado por el usuario

- Shopify alojará la tienda; Odoo.sh Enterprise 18.0+e será el sistema de inventario y ventas. No existe conector activo.
- Operación en Perú, moneda PEN (soles). El usuario indica promoción Shopify US$1 por tres meses y después US$25; nombre del plan y condiciones de facturación pendientes de verificar en la cuenta.
- Portada multimarcas, en este orden: DECOKASA, Xion, Biflex y Mundo Baby; información para mayoristas.
- Catálogo accesible por categoría o marca. Cada enlace abre una landing con su ficha completa y formulario. Cada landing tiene su propia ruta.
- Calculadora PVC únicamente en landing interna. La portada ofrece acceso a ella.
- Versión inicial sin pasarelas de pago. El recorrido termina en formulario de solicitud y atención por un asesor.
- Enviar el formulario no reserva ni descuenta inventario. El asesor confirma y cierra la venta en Odoo; deben comprobarse las acciones operativas de reserva y entrega en pruebas.
- Se puede construir mientras se aprueba el entorno Odoo de pruebas. URL y accesos todavía pendientes.
- El usuario autorizó registrar todo el trabajo del proyecto en este repositorio el 06/10/2026 y conectó GitHub/main a Shopify. En la revisión del 09/10/2026 se verificó el tema activo `188927803629`, visibilidad Público en el administrador y acceso anónimo HTTP 200 al catálogo. No se cambió la visibilidad durante esta tarea. Los cambios de main se sincronizan con ese tema.
- Favicon del tema: símbolo amarillo de DECOKASA derivado del logo aprobado, en PNG transparente 128 × 128 px y enlazado desde el `<head>` global.
- Diseño de portada ajustado al mockup original aportado por el usuario: cabecera, buscador, categorías, banner y cuatro tarjetas en este orden: DECOKASA, Xion, Biflex y Mundo Baby. DECOKASA muestra pisos PVC y SPC, paneles PVC, wall panel, alfombras y artículos para el hogar en una imagen propia con el logo integrado; las otras imágenes se conservan. Cuatro columnas en escritorio, dos en tabletas y una en celular. Se retiró la tarjeta mayorista superior; se conserva el bloque inferior #mayorista y su enlace de navegación. Siete artes independientes regenerados con image_gen y codificados en WebP sustituyen los recortes CSS del mockup; logo, banner y tarjetas admiten imágenes propias desde el editor. Los textos evitan prometer pagos o promociones todavía no configurados.

- El teléfono de atención WhatsApp compartido por el usuario es `+51 941 599 516`. La portada ofrece un acceso flotante con mensaje prellenado para consultas/cotizaciones. El enlace abre WhatsApp, pero no envía el mensaje hasta que el cliente lo revise y pulse enviar. La franja negra de servicios queda fija en la parte superior durante todo el desplazamiento; el tema reserva su altura y la recalcula si cambia el tamaño de la barra. Hay una vista local adaptada a teléfono en `preview/DECOKASA-movil.html`; es una ayuda de revisión, no un emulador del editor Shopify.

## Funcionalidades y uso

Inicio → catálogo por marca/categoría → landing con ficha → formulario de solicitud → atención del asesor → venta confirmada/cerrada en Odoo.

El tema contiene portada, catálogo, búsqueda, landing de producto, landing PVC, página informativa y 404. En Shopify las landings estándar usan `/products/<handle>`; PVC propone `/pages/pisos-pvc`. La carga de productos y asignación de páginas sigue pendiente. El catálogo debe apuntar a una sola landing por producto; `decokasa.landing_url` permite enlazar una página interna. Las vistas HTML en `preview/` representan el recorrido y usan datos ficticios.

## Catálogo visual publicado

La estructura visual del catálogo se adelantó por petición del usuario el 09/10/2026 mientras se espera Odoo. Presenta navegación por marca, filtros laterales/plegables, tres columnas en escritorio y dos en móvil, tarjetas hacia fichas y ayuda del asesor. La muestra usa ilustraciones explícitas y «Precio a consultar». El tema utiliza imágenes/productos Shopify y filtros nativos por marca y tipo; configuración en la tienda y validación con datos reales pendientes. El usuario autorizó publicar la estructura en el tema activo mediante GitHub/main el 09/10/2026; commit `98ddff4` sincronizado y catálogo revisado en escritorio y móvil. URL: https://ruik4d-dn.myshopify.com/collections/all. La colección real está vacía; los productos ficticios permanecen solo en la muestra y no se importan a la tienda.

## Trazabilidad y CRM propuestos

Objetivo: anuncio → solicitud → cliente → oportunidad → pedido → venta real. Recomendación pendiente de implementación: registro protegido de solicitudes vinculado a Odoo, y GA4 para análisis. GA4 no sustituye el registro operativo.

- `request_id` UUID por solicitud, persistido en el futuro receptor, para reintentos idempotentes.
- IDs disponibles de plataforma, cuenta, campaña, grupo/anuncio/creativo; UTMs y click IDs según disponibilidad y consentimiento. Conservar primer y último origen y una copia del origen al recibir cada solicitud.
- Visitante/sesión pseudónimos y referencias GA4 cuando corresponda. Nunca enviar nombres, teléfonos, correos ni direcciones a GA4.
- Reutilizar los IDs nativos de Odoo: contacto (`partner`), lead/oportunidad, cotización/pedido, asesor, equipo y etapa. Una persona puede tener varias solicitudes; las fusiones deben preservar vínculos y atribución.
- `generate_lead` después de recibir y guardar una solicitud real. `purchase` solo después de una venta real validada, con identificador de transacción y PEN. Marcar una oportunidad como Ganada, por sí solo, no implica compra ni cambio de stock.
- Validar precios y productos en servidor, evitar duplicados y conservar correspondencia SKU/variante/unidad/almacén. El contrato propuesto está en `request-contract.json`.

## Estado real de la base 0.1.0

El formulario solo simula una referencia, sin transmitir ni persistir contactos; no crea clientes, leads ni pedidos. La referencia se reutiliza para reintentos idénticos dentro de la misma página; persistencia duradera pendiente. La atribución de prueba usa `sessionStorage` solo con consentimiento. No hay conexiones Odoo, GA4 ni redes publicitarias. El catálogo, los precios y rendimientos de la demostración son ficticios. La portada usa artes regenerados a partir del mockup original; las ilustraciones de productos demo no son fotografías de catálogo verificadas.

## Pendientes

Decisión del 26/10/2026: los productos con varias presentaciones y sin calculadora de cobertura permiten combinar variantes en una misma solicitud. Cada variante conserva su SKU, precio y cantidad; total y regalo se calculan sobre la lista agregada. Cambiar la presentación visible no reemplaza las líneas. El formulario sigue en simulación y la lista vive solo en memoria, sin checkout, reservas, persistencia de contactos ni conexión Odoo.

Catálogo y fotos reales; configuración PEN y rutas; autoridad de precios y promociones; URL/permisos Odoo; SKU, variantes, unidades, almacenes y operación de cierre; receptor seguro de solicitudes, CRM, consentimiento y medición; pruebas de duplicados, fallos y conciliación antes del lanzamiento comercial. Portada revisada visualmente en Shopify en escritorio y celular el 06/10/2026.

Los backends existentes de Meta/TikTok son de solo lectura. Consultas sobre sus bases publicitarias parten de la carpeta de Drive `18fQUpb1ZMC7jKO-nenhJFXmbQo1Oyr1W`; no iniciar sesión en redes para buscar esos datos ni modificar sus scripts.

### Precisión visual SPC — 21/10/2026

Para los seis beneficios se usan los trazados originales del PSD, exportados como `spc-icono-*.svg`, en lugar de aproximaciones genéricas. La segunda captura entregada por el usuario es la referencia de esta corrección: persona caminando, tablones con encastre y rostro de perro, con texto y distribución editables en HTML/CSS.

### Distribución proporcional de toda la landing SPC — 21/10/2026

Por petición expresa del usuario, el mapa abarca toda la landing. La fuente editable de geometría es `docs/landing-spc-layout.json`: lienzo 1080 × 6491, ocho secciones, 47 cajas absolutas con referencia a las capas. El generador deriva porcentajes y CSS; editar las cajas en píxeles y ejecutar `npm run sync:preview`, sin retocar manualmente el CSS generado. Los porcentajes verticales de los elementos son relativos a su sección, y también se conservan porcentajes respecto de la página completa. Las superposiciones y recortes permiten valores negativos o mayores de 100%.

Desde la corrección del 22/10/2026, la composición escala con el lienzo en todos los anchos, hasta 1080 px; móvil conserva la misma distribución. Se verificó concordancia de las cajas con el mapa en 12 anchos de 320 a 1440 px; no se promete identidad rasterizada de tipografía con el PSD. El mapa de revisión usa la previsualización conservada como referencia, nunca como fondo sustitutivo de la landing. Siguen vigentes las restricciones comerciales de testimonios, sellos y correspondencia entre colores y variantes.


### Revisión SPC del PSD actualizado — 27/10/2026

Esta revisión sustituye la geometría anterior de 1080 × 6491: el PSD actual tiene 1080 × 10004, once secciones y 66 cajas. La fuente editable continúa siendo `docs/landing-spc-layout.json`; ejecutar `node scripts/sync_preview.cjs` para regenerar CSS y vistas. `docs/landing-spc-assets-20261027.json` registra la fuente, huella SHA-256 y recursos exportados. Fotos/recortes separados en `spc-2026-*.webp`; textos, trazados y controles editables en código, sin usar capturas de secciones. Raleway local bajo OFL; la tipografía Godshine del hero se aproxima con Raleway.

El mismo lienzo proporcional se aplica de 320 a 1080 px y se centra a anchos mayores. Los diálogos de calculadora/solicitud conservan tipografía legible de 16 px y controles táctiles propios, independientes del escalado del arte. La calculadora rápida y avanzada comparten cobertura; soporta ambientes, dimensiones, cortes y transferencia de cantidad a solicitud. El formulario sigue simulado y no transmite datos.

Se preserva la prioridad de `decokasa.coverage_m2` de variante, luego producto y después configuración de sección. No cambiar automáticamente el respaldo 2,196 a los 2,24 m² del nuevo PSD: confirmar presentación/rendimiento con negocio. Las especificaciones del PSD describen una presentación, sin modificar SKU, precio o inventario. Las tres muestras de tonos son referencias visuales y enlazan al catálogo; no inventan variantes.

`spc_design_preview` es false por defecto y se activa solo en la muestra local para revisar la composición completa. No activar en una tienda pública: incluye retratos, opiniones y sellos de muestra identificados como pendientes. `show_certifications` permanece false hasta validar los sellos; testimonios en Shopify solo desde bloques reales con contenido autorizado. Al omitir bloques condicionales, el flujo se compacta.

Desarrollo aislado en `feature/spc-diseno-octubre` (base main b70e0b2), ruta Documents/Codex/2026-10-21/este-mokup-es-para-la-pagina-4/work/spc-redesign/theme. No fusionado, confirmado en Git ni enviado a Shopify en esta tarea. Checkout principal con calculadora avanzada y cambios pendientes preservado.
