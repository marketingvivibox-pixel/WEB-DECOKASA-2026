# DECOKASA · tema Shopify 0.1.0

**Regla inamovible:** un único tema Shopify, el oficial existente `WEB-DECOKASA-2026-ALFIN/main` (`188927803629`). No crear, duplicar ni reutilizar temas paralelos. Cada landing se integra dentro de ese tema. Las pruebas se hacen en una rama secundaria y vista previa local, sin borradores ni versiones de prueba en Shopify; después se integra en main y se actualiza el tema oficial según las autorizaciones vigentes. Ver [AGENTS.md](AGENTS.md).

Tema Shopify 0.1.0 en construcción, conectado a GitHub/main y activo en Shopify. Acceso público verificado el 09/10/2026. Sin receptor de formularios ni sincronización de stock: el formulario está deliberadamente en modo simulación.


## Recorrido
Inicio → catálogo por marca o tipo → landing con ficha completa → formulario → asesor (integración pendiente). Sin pasarelas ni checkout. No emitir `purchase` desde el navegador.


## Archivos
- `templates/product.landing-spc.json`: landing SPC reconstruida con recursos del PSD, elementos HTML/CSS/SVG y calculadora. [Guía de configuración SPC](docs/landing-spc.md). Rama SPC fusionada en `main`; corrección móvil proporcional publicada en `95c644f` y verificada en Shopify el 22/10/2026.
- `templates/product.landing-pvc.json`: landing de Piso PVC autoadhesivo con catálogo de 20 acabados, calculadora compacta y consulta por WhatsApp. Producto activo y publicado en Tienda online (05/11/2026); 10 000 cajas por SKU (20 SKU, 200 000 cajas en total) verificadas. Pendiente integrar la landing en el tema oficial existente 188927803629. 36 planchas / 5 m² por caja confirmados. [Guía y estado PVC](docs/landing-pvc.md).
- `templates/index.json`: portada multimarcas editable; imagen principal y colección destacada.
- `templates/collection.json`: catálogo adaptable con marcas, filtros nativos vendor/type cuando estén configurados, ordenación, tarjetas y paginación.
- `templates/product.json`: cada URL `/products/<handle>` es una landing que incluye ficha y formulario.
- `templates/page.pvc.json` + `sections/pvc-landing.liquid`: plantilla antigua de página PVC, conservada como alternativa independiente. El nuevo producto `piso-pvc` utiliza `product.landing-pvc`.
- `assets/decokasa.css` / `.js`: estilos compartidos, calculadora y simulación; no bibliotecas ni servicios externos.
- `assets/product-detail.css` / `.js`: galería, variantes y cantidad de la ficha; se cargan solo donde se utiliza. [Guía para administrar la ficha](docs/product-detail.md).
- `assets/favicon.png`: símbolo DECOKASA transparente usado como favicon en todas las páginas del tema.
- `docs/request-contract.json`: propuesta de contrato para Odoo/CRM y medición; aún sin implementación de transporte.


## Configuración pendiente
Moneda de tienda PEN/Perú. Cargar catálogo real y fotos; precios y promociones por definir. Nunca inferir stock de Odoo a partir de disponibilidad Shopify.
Metacampos propuestos: `decokasa.coverage_m2` (decimal, producto o variante, m² por caja); `decokasa.landing_url` (URL relativa de landing, si usa página interna en lugar del producto). El catálogo debe apuntar a la landing única de cada producto. La página PVC debe enlazar al mismo producto que su metacampo de ruta.
Asignar SKU único por variante, unidad/almacén y mapeo Odoo tras validación. El calculador requiere rendimiento válido; no usa un rendimiento ficticio en el tema. La cobertura PVC debe corresponder a la presentación seleccionada.
El formulario solo simula y no persiste datos personales. Consentimiento de seguimiento de prueba en sessionStorage; rechazar elimina atribución e identificador de visitante. Referencia de solicitud necesaria separada de analítica. UTMs deben contener nombres de campaña sin datos personales. Primer/último origen se conserva en navegación directa durante la sesión si se autoriza; no hay atribución entre sesiones todavía. GA4 y Meta/TikTok pendientes. No hay enlace al CRM activo.


## Verificación
`npm test` aprueba 39 pruebas, entre lógica, navegación Liquid y pruebas DOM (filtros, variantes, galería por color, solicitud combinada, meta automática del regalo, formulario, consentimiento, ficha y landings SPC/PVC). Shopify Theme Check CLI 5.0.1 sin hallazgos; ocho HTML y ZIP de 160 archivos verificados. Ficha y landing PVC revisadas en escritorio y celular sin desbordamiento. Reintentos conservan referencia solo en la página actual. Pendiente: datos comerciales del catálogo y recepción idempotente en Odoo. PVC conserva los 20 acabados aprobados: SKU completos y 17 precios FD de S/ 99 por caja verificados el 05/11; tres tarifas LQ pendientes. Stock configurado por instrucción del usuario: 10 000 cajas por SKU, 200 000 en total, con seguimiento activado. [Datos aplicados a Shopify](docs/pvc-product-data.json). Producto activo y publicado: https://decokasaperu.myshopify.com/products/piso-pvc. Pendiente incorporar los 48 archivos nuevos de su landing y el ajuste del layout compartido (49 cambios) al tema oficial existente por un procedimiento permitido y verificar su diseño. No publicar un tema paralelo.


## Diseño según el mockup original

Cabecera con buscador, menú de categorías, banner negro/amarillo, cuatro marcas (DECOKASA, Xion, Biflex y Mundo Baby) y franja promocional adaptados a la imagen del 02/10/2026. Siete artes independientes regenerados con image_gen sustituyen los recortes del mockup y se entregan en WebP de alta resolución (1860–2172 px de ancho). Textos y botones siguen siendo HTML. DECOKASA muestra pisos PVC y SPC, paneles PVC, wall panel, alfombras y artículos para el hogar en una imagen propia con el logo integrado. Las tarjetas se distribuyen en cuatro columnas en escritorio, dos en tabletas y una en celular. Solo se mantiene el bloque mayorista inferior. La cabecera admite logo propio; la sección Inicio admite banner y cuatro tarjetas. Se adaptó el texto comercial al flujo con asesor y sin pagos en línea. Prompts en `docs/image-prompts.json`; dimensiones, peso y codificación en `docs/image-assets.json`.

Fuentes de arquitectura: https://shopify.dev/docs/storefronts/themes/architecture y https://shopify.dev/docs/api/liquid/filters/link_to_vendor .

La franja superior de servicios permanece fija al desplazarse. La portada incluye un botón flotante de WhatsApp que abre el chat con un mensaje prellenado para que el visitante lo revise y lo envíe manualmente. Número configurado: Perú, `+51 941 599 516`. No se envía nada automáticamente. La vista móvil local está en `preview/DECOKASA-movil.html` y muestra el inicio dentro de un marco de teléfono de 390 × 844 px.


## Registro del proyecto

- [Decisiones actuales y arquitectura](docs/project-context.md).
- [Avances, pruebas y pendientes](docs/progress.md).
- [Fuentes de SKU, imágenes y precios — solo lectura](docs/catalog-sources.md).
- [Documentos de planificación y esquemas](docs/planning/README.md).
- [Referencia visual inicial](docs/references/mockup-inicial-decokasa-2026-10-02.jpeg).
- [Demostración navegable](preview/DECOKASA-inicio.html): descargar el repositorio y abrir este HTML en el navegador; GitHub muestra su código.
- [Vista móvil de la portada](preview/DECOKASA-movil.html): abrir este HTML en el navegador para verla dentro de un marco de teléfono. Para la tienda conectada, usar la vista móvil del editor de temas Shopify.
- [Paquete del tema](releases/DECOKASA-tema-0.1.0.zip): contiene los 160 archivos Shopify de la versión local, incluida la landing PVC y el diseño editorial SPC de escritorio publicado en `65e09bd`. GitHub/main está vinculado al tema activo `188927803629`, que se conserva como destino. No se ha hecho push de PVC.


## Reproducir las verificaciones

Con Node.js 20 o superior: `npm ci` y `npm test`. Incluye pruebas de lógica, seis pruebas de navegación Liquid y la prueba DOM simulada; esta última no comprueba presentación visual ni validación nativa de formularios.

Con Python 3: `python scripts/verify_store.py` revisa las ocho páginas, enlaces, anclas, IDs, JSON y esquemas de secciones y regenera el ZIP del tema a partir del código actual.

Después de cambiar portada/cabecera/catálogo/estilos: `node scripts/sync_preview.cjs` regenera las vistas locales desde las secciones Liquid y copia los recursos; luego ejecutar el verificador y las pruebas. La demostración conserva su catálogo ficticio.

Shopify Theme Check: `npx @shopify/cli theme check --path . --output json`. La herramienta no requiere conexión a la tienda para esta revisión estática. `.shopifyignore` excluye documentos, pruebas, vistas y herramientas del tema.


## Catálogo — 09/10/2026

Estructura visual publicada en el tema activo conectado a GitHub/main mientras llegan los productos de Odoo. [Catálogo en Shopify](https://ruik4d-dn.myshopify.com/collections/all), verificado en escritorio y celular; colección real todavía vacía. Abrir `preview/catalogo.html` para explorar los cinco ejemplos ilustrados, filtros, búsqueda y fichas. Tres columnas en escritorio y dos en celular; precio a consultar. Shopify utiliza sus productos reales: los ejemplos no se importan. Los filtros y la ordenación reales usan Shopify y requieren configuración/pruebas con el catálogo final. El ZIP contiene la misma estructura del tema.


## Administrar marcas y categorías sin código

1. Tienda online > Temas > Editar tema > Configuración del tema > **Catálogo y navegación**: selecciona y ordena las colecciones de marcas y categorías. La misma selección alimenta cabecera y catálogo. Sin selección conserva las colecciones iniciales disponibles.
2. En **Inicio multimarcas**, cambia fotos y selecciona la colección de destino de cada tarjeta. No es necesario escribir URLs.
3. **Productos > Colecciones** administra nombres, imágenes y origen de productos. Las nueve colecciones creadas están vacías y todavía sin condiciones automáticas; confirmar los campos de Odoo antes de configurarlas. El registro de IDs y pendientes está en `docs/catalog-collections.json`.

El catálogo usa Liquid, ordenación, filtros y paginación de Shopify. No añade aplicaciones ni llamadas a Odoo al cargar. Rendimiento con productos y fotos reales pendiente de medición.



## SPC — mockup actualizado del 27/10/2026

Rediseño local proporcional de 1080 × 10004, once secciones y 66 cajas. Consultar `docs/progress.md` para estado y pendientes, `docs/landing-spc-layout.json` para geometría y `docs/landing-spc-assets-20261027.json` para recursos/fuente. Vista generada: `preview/landing-piso-spc.html`; paquete: `releases/DECOKASA-tema-0.1.0.zip`. La muestra activa sellos/testimonios identificados como pendientes; el tema los condiciona a contenido validado. Sin publicación de esta revisión.
