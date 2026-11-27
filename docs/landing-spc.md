# Landing SPC — construcción y configuración

Los cambios se desarrollan y prueban localmente en una rama secundaria antes de integrarse en `main`, conectado al único tema oficial Shopify. Plantilla: `templates/product.landing-spc.json`; sección: `sections/landing-piso-spc.liquid`; estilos y comportamiento: `assets/landing-piso-spc.css`, `landing-piso-spc-proportions.css`, `landing-piso-spc-layout.css` y `landing-piso-spc.js`; iconos y botones: `snippets/spc-icon.liquid` y `spc-actions.liquid`.

## 27/11/2026 — Ficha de tienda y landing para publicidad

`/products/piso-spc` muestra la ficha convencional, con cabecera, pie, galería, calculadora y productos relacionados. `/products/piso-spc/landing` conserva el diseño publicitario y su calculadora. Ambas rutas utilizan el producto `15442304925933`, con sufijo `landing-spc`, y la misma URL canónica base. El catálogo conserva el enlace base; los anuncios deben dirigirse a la ruta terminada en `/landing`. No se modifican anuncios automáticamente.

`snippets/flooring-route-view.liquid` selecciona la presentación de SPC y PVC mediante la ruta; ni UTM ni referente alteran la vista. El editor de Shopify mantiene la landing editable. La ficha reutiliza `product-landing` y `request-form`, con rendimiento de variante, después de producto y finalmente de la configuración de la sección. SPC conserva el respaldo configurado de 2,196 m²/caja; no se inventa un valor para otras fichas.

El producto SPC tiene 11 variantes nativas desde el 27/11/2026, con precio común S/95 y 1.000 cajas por acabado confirmados por el usuario. Las familias contienen 3 cálidos, 4 oscuros y 4 neutros. Cada variante tiene un ambiente ilustrativo y la textura original del PSD: `decokasa.finish_swatch` referencia la muestra; `decokasa.gallery_images` agrupa ambiente y muestra. El selector permite ver el ambiente y confirmar el acabado sin perder la superficie, cortes ni UTM. La ficha convencional usa los mismos datos.

`assets/flooring-pricing.js` y `snippets/floor-quantity-prices.liquid` usan la escala confirmada del Sheet: desde 1/6/12/50/100/200/300/400/500 cajas, S/95/90/85/83/80/78/75/73/70 por caja. Se aplica al estimado y la solicitud, sujeto a confirmación del asesor; no configura descuentos de checkout. Rendimiento: 2,196 m² por caja. Se mantienen cinco SKU confirmados y seis vacíos pendientes de correspondencia; SPC-002-1 requiere aclarar 5 mm comercial frente a 5,5 mm del PSD.

Verificación local vigente: 102 pruebas del tema, 24 casos del Libro, respaldo íntegro, 13 archivos aprobados por el validador oficial, once vistas y ZIP de 217 archivos. Ambas rutas SPC y PVC comprobadas a 320, 393 y 1440 px. Ejemplo SPC: 12 m² sin cortes = 6 cajas / S/540; 25 m² = 12 cajas / S/1.020. Ver publicación en [avances](progress.md).

Publicado el 27/11/2026 mediante `6cadfb9` en GitHub/main. Shopify sincronizó los seis archivos Liquid en el tema oficial `188927803629`; las rutas públicas SPC y PVC pasaron nuevamente la revisión a 320, 393 y 1440 px. La ficha y la landing SPC conservan la URL canónica `https://decokasa.pe/products/piso-spc`. Ver detalle en `docs/progress.md`.

## Antecedente — 10/11/2026: acabados disponibles por familia

La configuración de muestras sin variantes descrita a continuación fue sustituida el 27/11/2026 por variantes nativas, miniaturas independientes del PSD y ambientes. La distribución por familias se conserva.

Las muestras y botones «Ver más» abren `snippets/spc-tone-catalog.liquid`, con estilos en `assets/landing-piso-spc-tones.css` y lógica en `landing-piso-spc.js`. El catálogo usa un único JPG, `assets/spc-catalogo-tonos-2026-11.jpg` (1080 × 1544), idéntico al proporcionado por el usuario. Cada ventana de textura recorta 456 × 124 píxeles de esa fuente; no se muestran sus textos incrustados ni se reconstruyen sus vetas.

| Familia | Códigos del catálogo |
| --- | --- |
| Cálidos | spc-0018-2, spc-0013, spc-002-1 |
| Oscuros | spc-001-2, spc-004-1, spc-0022, spc-0021 |
| Neutros | spc-0020-1, spc-0022-2, spc-007, spc-0020 |

Las medidas del catálogo son 18 × 122 cm. `spc-0013`, `spc-0020` y `spc-0020-1` indican 5 mm; los otros ocho indican 5,5 mm. Para modificar la selección comercial de la calculadora es necesario confirmar primero SKU/variante y rendimiento por código: estas fichas son muestras con consulta al asesor, no variantes de compra nuevas. Los filtros mantienen la familia de referencia de la calculadora. El enlace WhatsApp incluye el acabado concreto, espesor y medidas y solo abre un mensaje para que el cliente decida enviarlo.

La ventana conserva el foco, se cierra con Escape, botón o fondo y admite desplazamiento interno en pantallas pequeñas. Cada filtro informa cuántos acabados contiene. Se respeta movimiento reducido y se retira el botón móvil persistente mientras la ventana está abierta.

## 03/11/2026 — Certificaciones confirmadas

El usuario confirmó que FloorScore, ANAB, ILAC, DAkkS, CNAS y EPH corresponden al piso SPC. `show_certifications` queda activado en la plantilla `product.landing-spc.json`, conservando el diseño proporcional del PSD para móvil y escritorio. La opción del esquema sigue desactivada por defecto para otras instancias; las referencias históricas a certificaciones pendientes quedan sustituidas por esta confirmación. Calculadora y testimonios conservados.

## Recursos y composición

Los 21 recursos `spc-*` proceden del PSD. Fotos/productos/logotipos conservan su contenido y transparencias. Textos, controles, beneficios, bordes y degradados son código. El original y manifiesto se conservan en `docs/references/landing-spc-recursos/`. Los recortes antiguos están en `docs/references/landing-spc-recortes-anteriores/`, fuera de las carpetas del tema; no reutilizarlos para construir la página.

La sección conserva la composición vertical del mockup, con un ancho máximo de 1080 px y adaptación para móvil. El diagrama conserva el recorte derecho de su recurso original. Los iconos de beneficios son SVG. La cabecera y el pie generales del tema se omiten solo en la ruta publicitaria terminada en `/landing`.

## Configuración en Shopify

Asignar la plantilla alternativa `landing-spc` al producto correcto al revisar la configuración del tema. En la sección se configuran aviso superior, teléfono WhatsApp, enlace al catálogo, rendimiento de respaldo y visibilidad de sellos. Sin enlace de catálogo, los botones llevan a las muestras en la misma página.

Título y SKU para consultas se obtienen del producto/variante actual. Rendimiento: metacampo `decokasa.coverage_m2` de variante, luego producto, luego ajuste de sección (2.196 m²). La calculadora acepta 0.01–100 000 m², redondea a cajas completas y permite añadir 10% para cortes. Al cambiar área/margen se oculta el resultado anterior. El enlace de consulta incluye área, cajas y color; no envía mensajes automáticamente ni reserva stock.

Madera natural, Caoba y Gris claro son nombres visuales de las tres muestras. No equivalen a SKU ni cambian la variante comercial. Confirmar el mapeo con el catálogo antes de implementar selección de compra. No se muestra el precio ilustrativo del fixture.

Agregar hasta dos testimonios reales mediante bloques de nombre, retrato y texto autorizados. Los sellos están desactivados por defecto; activarlos únicamente si los seis corresponden al producto. La vista local muestra la composición completa con textos de muestra, sin presentarlos como opiniones reales. El indicador `spc_design_preview` se inyecta solo en el generador local y está ausente del esquema y la plantilla Shopify.

## Antecedente — Revisión y validación inicial

`npm run sync:preview` regenera ocho vistas. `npm test` ejecuta 22 pruebas. `python scripts/verify_store.py` comprueba vistas/enlaces/IDs/JSON y genera `releases/DECOKASA-tema-0.1.0.zip`. `npx --yes @shopify/cli@4.9.4 theme check --output json` terminó sin hallazgos el 22/10/2026.

Revisión en Edge a 320, 390, 768, 1080 y 1440 px: sin desbordamiento horizontal, todas las imágenes completas, sin errores JavaScript. Probados cálculo con/sin cortes, entradas inválidas, actualización de consulta por color y teclado. Corrección móvil publicada en `95c644f` y comprobada en https://decokasaperu.myshopify.com/products/piso-spc el 22/10/2026. El tema activo `WEB-DECOKASA-2026-ALFIN/main` (188927803629) sirve los tres CSS con reglas equivalentes a los archivos locales. En la tienda se verificaron 50 cajas presentes a 320/393/1080 px: error máximo 0,1035 px normalizado, sin desbordamiento ni errores JavaScript; imágenes completas, calculadora con/sin cortes y colores funcionales. Testimonios y sellos permanecen ausentes por su configuración comercial prevista. Pendiente validar catálogo/variantes, testimonios y certificaciones reales.

## Iconos originales de beneficios — corrección 21/10/2026

Los seis `assets/spc-icono-*.svg` conservan los trazados vectoriales de los objetos inteligentes del PSD. Fuentes: capas 96 (agua), 97 (espuma), 98 (tránsito residencial), 99 (sistema click), 103 (limpieza) y 100 (pet friendly). Los tres primeros proceden del PDF anidado en el PSB; los restantes, de las máscaras vectoriales del PDF. Se unificó el dorado a `#f4d65e`, sin imágenes incrustadas. Texto, fondo del título y distribución siguen siendo HTML/CSS. Sustituyen únicamente los seis dibujos aproximados del snippet compartido. Total de recursos SPC integrados: 21 imágenes y 6 iconos SVG.


## Mapa de proporciones de toda la landing — 21/10/2026

`docs/landing-spc-layout.json` registra el lienzo original de 1080 × 6491 px, 8 secciones y 47 cajas de posición. Incluye origen/tamaño absolutos, capa de referencia, porcentajes por sección y porcentajes de página completa. Las medidas proceden del inventario de capas y la previsualización conservados; el PSD original no estuvo disponible en esta etapa. Algunas cajas compensan márgenes transparentes o métricas de texto, con notas en el mapa.

Para modificar la geometría, editar `box` en píxeles dentro del JSON y ejecutar `npm run sync:preview`. El sincronizador llama a `scripts/generate_spc_layout.cjs`, que recalcula los porcentajes, escribe `assets/landing-piso-spc-layout.css` y copia los estilos a las vistas. No editar a mano ese CSS generado. El estilo interior y las escalas tipográficas están en `assets/landing-piso-spc-proportions.css`; el mismo mapa se aplica a móvil, tableta y escritorio, sin reglas que reordenen los bloques por debajo de 701 px.

Fórmulas por sección: `left = x / 1080 × 100`; `top = (y − section.y) / section.height × 100`; `width = box.width / 1080 × 100`; `height = box.height / section.height × 100`. Los porcentajes de página usan 6491 como denominador vertical. Los bloques se superponen; sus alturas no deben sumarse como si no hubiera solapamientos. Recortes y elementos superpuestos pueden tener coordenadas negativas o exceder 100%.

Desde el 22/10/2026 la geometría proporcional se aplica en todos los anchos, con máximo de 1080 px. El usuario confirmó que el mockup se diseñó para móvil: imágenes, posiciones, tipografía, bordes y espacios se reducen juntos con `ancho del lienzo / 1080`. Se eliminaron las redistribuciones móviles anteriores. Se verificaron los 55 rectángulos (8 secciones + 47 elementos) a 320/360/390/430/540/600/700/701/768/923/1080/1440 px: máximo 0,1094 px de diferencia normalizada frente al mapa, sin desbordamiento horizontal. La comparación de escritorio a 1080 px frente a HEAD produjo estilos calculados y captura idénticos en Edge. Esta prueba mide cajas, no igualdad de cada píxel ni exactitud de la fuente tipográfica del PSD. Botones y cálculo también se probaron en móvil 320/390/600/700 px.

El documento de revisión `mapa-distribucion.html`, entregado junto a la vista local en outputs del chat, permite alternar referencia/landing, elegir sección y consultar ambos sistemas de porcentajes. La referencia compuesta se usa únicamente allí; la landing conserva imágenes independientes, SVG, texto y controles nativos.
