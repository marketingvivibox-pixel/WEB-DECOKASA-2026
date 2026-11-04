# Landing de Piso PVC autoadhesivo

Estado al 04/11/2026: producto creado en borrador y landing instalada en un tema de prueba sin publicar. Implementación local sobre `main`, base `200e579`, todavía sin commit ni push. La landing SPC publicada se conserva.

## Producto y presentación

- Producto: **Piso PVC autoadhesivo**, ID `15506629263597`, handle `piso-pvc`, plantilla `landing-pvc`.
- Administración: https://admin.shopify.com/store/ruik4d-dn/products/15506629263597
- Confirmado por el usuario: **36 planchas / 5 m² por caja**.
- Metacampos de producto: `decokasa.coverage_m2` = `5.0` y `decokasa.planks_per_box` = `36`.
- Opción Shopify: **Acabado**, con 20 variantes: FD801, FD802, FD806, FD807, FD809, FD810, FD811, FD814, FD815, FD816, FD817, FD817-1, FD818, FD821, FD822, FD823, FD828, 7172-4, 7172-8 y 7195-8.
- Precio, SKU y existencias comerciales pendientes. Las variantes tienen precio administrativo provisional de cero, SKU vacío e inventario cero. No activar el producto con esos valores. La landing personalizada muestra «Consultar» cuando no hay precio positivo; no ofrece compra ni presenta el producto como gratuito.

## Diseño y funcionamiento

Fuente: `C:/Users/D. Cordova/Documents/SHOPIFY/LANDING PVC/LANDING PVC_MOCK_FULL.psd` (1080 × 10758) y catálogo complementario. Se extrajeron 43 imágenes WebP, nombradas por contenido. El manifiesto está en `docs/assets/landing-pvc/manifest.json`; textos, botones y distribución se construyen con HTML/CSS, sin capturas completas como secciones.

Archivos principales: `sections/landing-piso-pvc.liquid`, `assets/landing-piso-pvc.css`, `assets/landing-piso-pvc.js`, `snippets/pvc-icon.liquid` y `templates/product.landing-pvc.json`. La página antigua `page.pvc` se conserva como plantilla independiente; este producto utiliza su nueva plantilla de producto.

- Catálogo modal con 20 acabados y selección sincronizada con variantes. Usa SKU cuando exista; mientras esté vacío, compara el valor único de Acabado. Nunca empareja variantes por un SKU vacío.
- Carrusel continuo con pausa, teclado, controles, interacción táctil y preferencia de movimiento reducido.
- Calculadora compacta: área directa, cortes opcionales del 10%, cajas completas, cobertura y miniatura animada. Ejemplo: 12,5 m² con cortes → 3 cajas / 15 m². Se permiten coma o punto decimal y áreas de 0,1 a 10000 m².
- Consulta por WhatsApp al `+51 941 599 516`, con acabado, medidas, cajas y precio/stock por confirmar. Solo abre un mensaje para que el cliente lo revise y envíe; no conecta Odoo ni crea pedidos.
- El usuario aprobó sustituir afirmaciones sin respaldo y testimonios del mockup por características verificables y una galería de inspiración. No se publica «100% ignífugos» ni se atribuyen opiniones ficticias a clientes.

## Tema de prueba y vista previa

Tema **Decokasa PVC - revision 04 nov 2026**, ID `190067343597`, estado `UNPUBLISHED`, duplicado del tema activo `188927803629`. Se cargaron y verificaron 49 archivos: 43 imágenes y seis archivos de plantilla/código, incluido `layout/theme.liquid`. Procesamiento finalizado sin errores.

Editor: https://admin.shopify.com/store/ruik4d-dn/themes/190067343597/editor

Vista local: http://127.0.0.1:8818/landing-pisos-pvc.html?revision=pvc-20-acabados

La revisión automática rechazó modificar el tema activo porque solo permite escrituras en temas sin publicar. No se eludió la restricción mediante CLI, interfaz o push. El enlace de vista previa del producto en borrador abre el tema activo y no es una prueba válida de esta plantilla; el editor requiere la sesión Shopify del usuario. La comprobación visual se realizó localmente y la instalación del tema se comprobó mediante la API.

## Verificación y pendientes

- 38/38 pruebas aprobadas; Shopify Theme Check CLI 4.9.4 sin hallazgos. El validador del plugin no inicia por una dependencia ausente, por lo que se utilizó la herramienta oficial.
- Ocho vistas locales y ZIP del tema con 159 archivos verificados.
- Revisión local a 320, 393 y 1440 px sin desbordamiento ni imágenes rotas. Selección FD802, cálculo, enlace WhatsApp, teclado, cierre del catálogo y recuperación del foco comprobados.
- Evidencias: `C:/Users/D. Cordova/Documents/Codex/2026-11-04/pvc-landing/landing-pvc-mobile.png` y `calculadora-mobile.png` en la misma carpeta.
- Pendiente completar precio, SKU y existencias; revisar dentro del editor Shopify; decidir y realizar la publicación mediante un flujo permitido. El producto permanece en borrador y el tema sin publicar.
