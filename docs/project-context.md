## 22/10/2026 — SPC móvil proporcional y continuidad en main

El usuario confirmó que el mockup de 1080 × 6491 px fue pensado para móvil y pidió conservar su distribución también en teléfonos. La composición completa usa una única escala según el ancho del lienzo, con máximo de 1080 px; se eliminó el cambio de distribución hasta 700 px. El JSON de geometría continúa siendo la fuente de posiciones y tamaños. Imágenes, SVG, textos y controles siguen siendo elementos independientes.

La rama SPC ya está fusionada: HEAD local `e594fbf` en `main`, coincidente con la referencia local `origin/main` al iniciar. Por instrucción expresa, continuar esta landing en `main`. El ajuste móvil de esta etapa es local, sin commit/push/despliegue. La vista previa y el ZIP se actualizaron; no se verificó el estado actual de Shopify.

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

Catálogo y fotos reales; configuración PEN y rutas; autoridad de precios y promociones; URL/permisos Odoo; SKU, variantes, unidades, almacenes y operación de cierre; receptor seguro de solicitudes, CRM, consentimiento y medición; pruebas de duplicados, fallos y conciliación antes del lanzamiento comercial. Portada revisada visualmente en Shopify en escritorio y celular el 06/10/2026.

Los backends existentes de Meta/TikTok son de solo lectura. Consultas sobre sus bases publicitarias parten de la carpeta de Drive `18fQUpb1ZMC7jKO-nenhJFXmbQo1Oyr1W`; no iniciar sesión en redes para buscar esos datos ni modificar sus scripts.

### Precisión visual SPC — 21/10/2026

Para los seis beneficios se usan los trazados originales del PSD, exportados como `spc-icono-*.svg`, en lugar de aproximaciones genéricas. La segunda captura entregada por el usuario es la referencia de esta corrección: persona caminando, tablones con encastre y rostro de perro, con texto y distribución editables en HTML/CSS.

### Distribución proporcional de toda la landing SPC — 21/10/2026

Por petición expresa del usuario, el mapa abarca toda la landing. La fuente editable de geometría es `docs/landing-spc-layout.json`: lienzo 1080 × 6491, ocho secciones, 47 cajas absolutas con referencia a las capas. El generador deriva porcentajes y CSS; editar las cajas en píxeles y ejecutar `npm run sync:preview`, sin retocar manualmente el CSS generado. Los porcentajes verticales de los elementos son relativos a su sección, y también se conservan porcentajes respecto de la página completa. Las superposiciones y recortes permiten valores negativos o mayores de 100%.

Desde la corrección del 22/10/2026, la composición escala con el lienzo en todos los anchos, hasta 1080 px; móvil conserva la misma distribución. Se verificó concordancia de las cajas con el mapa en 12 anchos de 320 a 1440 px; no se promete identidad rasterizada de tipografía con el PSD. El mapa de revisión usa la previsualización conservada como referencia, nunca como fondo sustitutivo de la landing. Siguen vigentes las restricciones comerciales de testimonios, sellos y correspondencia entre colores y variantes.
