# Avances y validación

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
