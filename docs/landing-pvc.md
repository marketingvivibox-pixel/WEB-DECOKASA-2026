# Landing de Piso PVC autoadhesivo

Estado al 05/11/2026: **10 000 cajas disponibles por cada uno de los 20 SKU**, seguimiento activado y **200 000 cajas** totales, configuradas por instrucción del usuario y verificadas en Shopify. No supone auditoría física ni sincronización Odoo.

Los **48 archivos nuevos de PVC y el ajuste de `layout/theme.liquid` (49 cambios del tema)** están preparados en el repositorio. El código PVC está registrado en b007802 e integrado localmente con SPC en 3e7b29d, sin push. Rige la regla de un único tema oficial en [AGENTS.md](../AGENTS.md).

**Producto publicado:** ACTIVE y disponible en Tienda online, verificado por lectura posterior de Shopify: [https://decokasaperu.myshopify.com/products/piso-pvc](https://decokasaperu.myshopify.com/products/piso-pvc). La plantilla `landing-pvc` está asignada, pero el tema oficial MAIN 188927803629 — WEB-DECOKASA-2026-ALFIN/main todavía carece de sus cinco archivos principales consultados. **La landing personalizada sigue pendiente** de incorporarse y verificarse mediante un procedimiento permitido. No crear, duplicar, reutilizar ni publicar un tema paralelo. La integración impide escrituras en MAIN y publicación de temas. La consulta pública no permitió comprobar el diseño; la publicación sí quedó confirmada por API.

## Diagnóstico y aplicación pendiente — 05/11/2026

Consulta directa de Shopify: el producto tiene `templateSuffix: landing-pvc`, pero el tema oficial no contiene la plantilla, la sección, el CSS, el JavaScript ni el snippet PVC. La consulta de `assets/pvc-*.webp` tampoco devuelve recursos. Su `layout/theme.liquid` solo reconoce `landing-spc`. Esto explica que el producto publicado muestre la ficha general: publicar el producto no incorpora los archivos del repositorio al tema.

La solución local incluye los cinco archivos principales, 43 imágenes WebP y el layout compartido que reconoce ambas landings. Las 39 pruebas pasan de nuevo. No se requieren cambios de producto, inventario ni asignación de plantilla.

Para aplicar el cambio, una persona con permisos debe sincronizar la rama `main` local de este repositorio con su `origin/main` conectado al tema oficial existente. Después debe comprobar en Shopify que estén `templates/product.landing-pvc.json` y sus dependencias, y abrir el producto en móvil y escritorio. No subir el ZIP como otro tema. El agente no puede ejecutar esa sincronización mientras siga vigente el rechazo de la revisión automática sobre escrituras en el tema MAIN; tampoco debe usar otro canal para eludirlo.

## Producto y presentación

- Producto: **Piso PVC autoadhesivo**, ID `15506629263597`, handle `piso-pvc`, plantilla `landing-pvc`.
- Administración: https://admin.shopify.com/store/ruik4d-dn/products/15506629263597
- Confirmado por el usuario: **36 planchas / 5 m² por caja**.
- Metacampos de producto: `decokasa.coverage_m2` = `5.0` y `decokasa.planks_per_box` = `36`.
- Opción Shopify: **Acabado**, con 20 variantes: FD801, FD802, FD806, FD807, FD809, FD810, FD811, FD814, FD815, FD816, FD817, FD817-1, FD818, FD821, FD822, FD823, FD828, 7172-4, 7172-8 y 7195-8.
- El usuario confirmó el 05/11 conservar únicamente los **20 acabados del mockup**; los otros 11 registros PVC de la fuente no se incorporan.
- **20 SKU guardados y verificados** en Shopify. Los 17 acabados FD tienen precio base de **S/ 99 por caja**. Los acabados 7172-4, 7172-8 y 7195-8 corresponden a LQ7172-4, LQ7172-8 y LQ7195-8 en la fuente: sus SKU están completos, pero la tarifa LQ sigue pendiente; el cero administrativo provisional no representa un producto gratuito.
- Stock configurado y releído: 10 000 cajas por SKU, 200 000 en total. Producto ACTIVE y publicado en Tienda online. Queda pendiente incorporar y comprobar `product.landing-pvc` en el tema activo. La landing local muestra «Consultar» cuando no hay precio positivo y no ofrece checkout; no se ha comprobado ese comportamiento en la ficha pública actual. No habilitar otras superficies de venta con precios provisionales.

## Fuentes comerciales

El 05/11/2026 se recibieron y verificaron las [fuentes de SKU, miniaturas y precios](catalog-sources.md), protegidas por instrucción de **solo lectura**. Se cruzaron los 20 acabados actuales con sus códigos y SKU únicos, y se aplicó la escala vigente FD. La coincidencia de códigos no sustituye el cotejo visual de miniaturas, aún pendiente. No inferir stock ni elegir una escala anterior o una comisión como precio de venta; tampoco equiparar LQ con HM sin confirmación.

La descripción Shopify incluye presentación, instalación, asesoría/entrega y la escala FD por caja: **1–2: S/ 99; 3–5: S/ 92; 6–11: S/ 85; 12–19: S/ 78; 20–49: S/ 71; 50 o más: S/ 65**. Es información para cotización del asesor: no se implementaron descuentos automáticos ni tramos en la calculadora. Registro verificado de los datos aplicados: [pvc-product-data.json](pvc-product-data.json). Los originales de Drive permanecen intactos.

## Diseño y funcionamiento

Fuente: `C:/Users/D. Cordova/Documents/SHOPIFY/LANDING PVC/LANDING PVC_MOCK_FULL.psd` (1080 × 10758) y catálogo complementario. Se extrajeron 43 imágenes WebP, nombradas por contenido. El manifiesto está en `docs/assets/landing-pvc/manifest.json`; textos, botones y distribución se construyen con HTML/CSS, sin capturas completas como secciones.

Archivos principales: `sections/landing-piso-pvc.liquid`, `assets/landing-piso-pvc.css`, `assets/landing-piso-pvc.js`, `snippets/pvc-icon.liquid` y `templates/product.landing-pvc.json`. La página antigua `page.pvc` se conserva como plantilla independiente; este producto utiliza su nueva plantilla de producto.

- Catálogo modal con 20 acabados y selección sincronizada con variantes. Usa SKU cuando exista; mientras esté vacío, compara el valor único de Acabado. Nunca empareja variantes por un SKU vacío.
- Carrusel continuo con pausa, teclado, controles, interacción táctil y preferencia de movimiento reducido.
- Calculadora compacta: área directa, cortes opcionales del 10%, cajas completas, cobertura y miniatura animada. Ejemplo: 12,5 m² con cortes → 3 cajas / 15 m². Se permiten coma o punto decimal y áreas de 0,1 a 10000 m².
- Consulta por WhatsApp al `+51 941 599 516`, con acabado, medidas, cajas y precio/stock por confirmar. Solo abre un mensaje para que el cliente lo revise y envíe; no conecta Odoo ni crea pedidos.
- El usuario aprobó sustituir afirmaciones sin respaldo y testimonios del mockup por características verificables y una galería de inspiración. No se publica «100% ignífugos» ni se atribuyen opiniones ficticias a clientes.

## Vista previa

Vista local: http://127.0.0.1:8818/landing-pisos-pvc.html?revision=pvc-20-acabados


## Verificación y pendientes

- 39/39 pruebas aprobadas tras integrar SPC; Shopify Theme Check CLI 5.0.1 sin errores, advertencias ni hallazgos. El validador del plugin no inicia por una dependencia ausente, por lo que se utilizó la herramienta oficial.
- Ocho vistas locales y ZIP del tema con 160 archivos verificados.
- Revisión local a 320, 393 y 1440 px sin desbordamiento ni imágenes rotas. Selección FD802, cálculo, enlace WhatsApp, teclado, cierre del catálogo y recuperación del foco comprobados.
- Evidencias: `C:/Users/D. Cordova/Documents/Codex/2026-11-04/pvc-landing/landing-pvc-mobile.png` y `calculadora-mobile.png` en la misma carpeta.
- 05/11: stock de 10 000 cajas en cada uno de los 20 SKU verificado; producto activo y publicado en Tienda online. La landing personalizada sigue pendiente de integración y verificación visual en el tema oficial.
- Pendiente: incorporar los archivos PVC al tema oficial existente 188927803629 mediante un procedimiento permitido y verificar la plantilla en su URL pública.
- Confirmar tarifa de los tres LQ y cotejar visualmente miniaturas. SKU y precios FD completados y releídos en Shopify el 05/11, al igual que la descripción. El bloqueo anterior de la revisión automática sobre escrituras en MAIN sigue vigente; no usar CLI, navegador o push para eludirlo.
