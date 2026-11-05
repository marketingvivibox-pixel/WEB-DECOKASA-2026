# Landing de Piso PVC autoadhesivo

Estado al 05/11/2026: **10 000 cajas disponibles por cada uno de los 20 SKU**, seguimiento activado y **200 000 cajas** totales, configuradas por instrucción del usuario y verificadas en Shopify. No supone auditoría física ni sincronización Odoo.

Los **48 archivos nuevos de PVC y el ajuste de `layout/theme.liquid` (49 cambios del tema)** están publicados en el tema oficial **188927803629 — WEB-DECOKASA-2026-ALFIN/main**. Se enviaron a GitHub mediante `git push origin main`, de `46c3ab6` a `a61758a6bc1f14db6a1a69ccf7b012b64c58af6f`, y Shopify los sincronizó. Rige la regla de un único tema oficial en [AGENTS.md](../AGENTS.md).

**Producto y landing publicados:** ACTIVE en Tienda online, con `templateSuffix: landing-pvc`. La URL [Piso PVC autoadhesivo](https://decokasaperu.myshopify.com/products/piso-pvc) carga la landing personalizada, verificada el 05/11/2026 en escritorio y móvil de 393 × 852 px.

## Publicación y comprobación — 05/11/2026

La causa era que los archivos preparados no se habían enviado a GitHub. Se revisó el flujo usado en SPC y se completó el envío desde el clon autenticado. La lectura posterior de Shopify confirma los 49 archivos en el tema MAIN oficial: plantilla, sección, CSS, JavaScript, snippet, 43 WebP y layout compartido.

Se corrige la interpretación anterior: la limitación del conector Shopify y el 403 del conector GitHub al crear una rama no acreditaban una prohibición general de publicar por el flujo habitual autorizado. El envío a main funcionó; no se constató un rechazo de aprobación de esa operación. No eludir rechazos reales ni crear temas alternativos.

Verificación pública: catálogo con 20 acabados; selección FD802; 20 m² con 10% de cortes → 5 cajas / 25 m² y S/ 495 estimados a precio base. El enlace de WhatsApp incluye el acabado, SKU y cálculo correctos, sin enviar mensajes. Al seleccionar 7172-4, cuyo precio está pendiente, se oculta el importe y permanece la consulta. Sin desbordamiento horizontal ni imágenes cargadas rotas. Se conservaron producto, inventario y el trabajo SPC pendiente de la rama secundaria.

## Corrección de la escena de instalación — 05/11/2026

Corregida la figura duplicada: la fotografía de fondo ya incluía a la instaladora y el recorte superpuesto tenía otro encuadre. Ambas capas ahora comparten las coordenadas del PSD de 1080 px: recorte a x=177, y=164 respecto al fondo, ancho 500; cabeza 44 px por encima del final del panel anterior. Ajustados también el cierre del panel y la altura proporcional de la escena para conservar la superposición del mockup.

Cambio `a2b77bc`, probado en rama local e incorporado/publicado por `main` en el único tema oficial. Verificación local a 320/393/1440 px y pública a 393 × 852: figura única, manos y pies alineados, beneficios visibles y sin desbordamiento horizontal. 39/39 pruebas, Theme Check sin hallazgos y comprobación de ocho vistas/ZIP de 160 archivos. Evidencia pública: `C:/Users/D. Cordova/Documents/Codex/2026-11-05/pvc-installation-fix/published-mobile.png`. Se mantienen catálogo, calculadora y datos comerciales.

## Producto y presentación

- Producto: **Piso PVC autoadhesivo**, ID `15506629263597`, handle `piso-pvc`, plantilla `landing-pvc`.
- Administración: https://admin.shopify.com/store/ruik4d-dn/products/15506629263597
- Confirmado por el usuario: **36 planchas / 5 m² por caja**.
- Metacampos de producto: `decokasa.coverage_m2` = `5.0` y `decokasa.planks_per_box` = `36`.
- Opción Shopify: **Acabado**, con 20 variantes: FD801, FD802, FD806, FD807, FD809, FD810, FD811, FD814, FD815, FD816, FD817, FD817-1, FD818, FD821, FD822, FD823, FD828, 7172-4, 7172-8 y 7195-8.
- El usuario confirmó el 05/11 conservar únicamente los **20 acabados del mockup**; los otros 11 registros PVC de la fuente no se incorporan.
- **20 SKU guardados y verificados** en Shopify. Los 17 acabados FD tienen precio base de **S/ 99 por caja**. Los acabados 7172-4, 7172-8 y 7195-8 corresponden a LQ7172-4, LQ7172-8 y LQ7195-8 en la fuente: sus SKU están completos, pero la tarifa LQ sigue pendiente; el cero administrativo provisional no representa un producto gratuito.
- Stock configurado y releído: 10 000 cajas por SKU, 200 000 en total. Producto ACTIVE y landing personalizada publicados en el tema oficial. Comprobado en la URL pública: la variante 7172-4 con precio pendiente oculta el importe y permite consultar; la landing no ofrece checkout. No habilitar otras superficies de venta con precios provisionales.

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
- 05/11: stock de 10 000 cajas en cada uno de los 20 SKU verificado; producto y landing publicados. Los 49 archivos están sincronizados en el tema oficial desde `a61758a`.
- Revisión pública en escritorio y móvil: catálogo, selección FD802, cálculo de 20 m², enlace WhatsApp y ocultación del importe pendiente para 7172-4 comprobados.
- Pendiente comercial: confirmar tarifa de los tres LQ y cotejar visualmente miniaturas. SKU y precios FD completados y releídos en Shopify el 05/11, al igual que la descripción.
