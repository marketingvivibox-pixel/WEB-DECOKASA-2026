# DECOKASA · tema Shopify 0.1.0

Tema Shopify 0.1.0 en construcción, conectado a GitHub/main y activo en Shopify. Acceso público verificado el 09/10/2026. Sin receptor de formularios ni sincronización de stock: el formulario está deliberadamente en modo simulación.

## Recorrido
Inicio → catálogo por marca o tipo → landing con ficha completa → formulario → asesor (integración pendiente). Sin pasarelas ni checkout. No emitir `purchase` desde el navegador.

## Archivos
- `templates/product.landing-spc.json`: landing SPC reconstruida con recursos del PSD, elementos HTML/CSS/SVG y calculadora. [Guía de configuración SPC](docs/landing-spc.md). Rama SPC fusionada en `main`; corrección móvil proporcional publicada en `95c644f` y verificada en Shopify el 22/10/2026.
- `templates/index.json`: portada multimarcas editable; imagen principal y colección destacada.
- `templates/collection.json`: catálogo adaptable con marcas, filtros nativos vendor/type cuando estén configurados, ordenación, tarjetas y paginación.
- `templates/product.json`: cada URL `/products/<handle>` es una landing que incluye ficha y formulario.
- `templates/page.pvc.json` + `sections/pvc-landing.liquid`: página interna PVC con selector de producto. Crear la página `pisos-pvc` y asignar plantilla cuando se trabaje en Shopify.
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
`npm test` aprueba 32 pruebas, entre lógica, navegación Liquid y pruebas DOM (filtros, variantes, galería por color, solicitud combinada, meta automática del regalo, formulario, consentimiento, ficha y landing SPC). Archivos de tema modificados validados con Shopify sin hallazgos; ocho HTML y ZIP de 109 archivos verificados. Ficha revisada en escritorio y celular sin desbordamiento. Reintentos conservan referencia solo en la página actual. Pendiente: confirmación comercial del catálogo y recepción idempotente en Odoo antes del lanzamiento comercial.

## Diseño según el mockup original

Cabecera con buscador, menú de categorías, banner negro/amarillo, cuatro marcas (DECOKASA, Xion, Biflex y Mundo Baby) y franja promocional adaptados a la imagen del 02/10/2026. Siete artes independientes regenerados con image_gen sustituyen los recortes del mockup y se entregan en WebP de alta resolución (1860–2172 px de ancho). Textos y botones siguen siendo HTML. DECOKASA muestra pisos PVC y SPC, paneles PVC, wall panel, alfombras y artículos para el hogar en una imagen propia con el logo integrado. Las tarjetas se distribuyen en cuatro columnas en escritorio, dos en tabletas y una en celular. Solo se mantiene el bloque mayorista inferior. La cabecera admite logo propio; la sección Inicio admite banner y cuatro tarjetas. Se adaptó el texto comercial al flujo con asesor y sin pagos en línea. Prompts en `docs/image-prompts.json`; dimensiones, peso y codificación en `docs/image-assets.json`.

Fuentes de arquitectura: https://shopify.dev/docs/storefronts/themes/architecture y https://shopify.dev/docs/api/liquid/filters/link_to_vendor .

La franja superior de servicios permanece fija al desplazarse. La portada incluye un botón flotante de WhatsApp que abre el chat con un mensaje prellenado para que el visitante lo revise y lo envíe manualmente. Número configurado: Perú, `+51 941 599 516`. No se envía nada automáticamente. La vista móvil local está en `preview/DECOKASA-movil.html` y muestra el inicio dentro de un marco de teléfono de 390 × 844 px.

## Registro del proyecto

- [Decisiones actuales y arquitectura](docs/project-context.md).
- [Avances, pruebas y pendientes](docs/progress.md).
- [Documentos de planificación y esquemas](docs/planning/README.md).
- [Referencia visual inicial](docs/references/mockup-inicial-decokasa-2026-10-02.jpeg).
- [Demostración navegable](preview/DECOKASA-inicio.html): descargar el repositorio y abrir este HTML en el navegador; GitHub muestra su código.
- [Vista móvil de la portada](preview/DECOKASA-movil.html): abrir este HTML en el navegador para verla dentro de un marco de teléfono. Para la tienda conectada, usar la vista móvil del editor de temas Shopify.
- [Paquete del tema](releases/DECOKASA-tema-0.1.0.zip): contiene solo los 74 archivos Shopify de la rama actual. GitHub/main ya sincroniza el tema activo.

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
