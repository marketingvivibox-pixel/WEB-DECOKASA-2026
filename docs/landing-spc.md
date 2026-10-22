# Landing SPC — construcción y configuración

La implementación está en la rama `feature/landing-piso-spc`. Plantilla: `templates/product.landing-spc.json`; sección: `sections/landing-piso-spc.liquid`; estilos y comportamiento: `assets/landing-piso-spc.css`, `landing-piso-spc-proportions.css`, `landing-piso-spc-layout.css` y `landing-piso-spc.js`; iconos y botones: `snippets/spc-icon.liquid` y `spc-actions.liquid`.

## Recursos y composición

Los 21 recursos `spc-*` proceden del PSD. Fotos/productos/logotipos conservan su contenido y transparencias. Textos, controles, beneficios, bordes y degradados son código. El original y manifiesto se conservan en `docs/references/landing-spc-recursos/`. Los recortes antiguos están en `docs/references/landing-spc-recortes-anteriores/`, fuera de las carpetas del tema; no reutilizarlos para construir la página.

La sección conserva la composición vertical del mockup, con un ancho máximo de 1080 px y adaptación para móvil. El diagrama conserva el recorte derecho de su recurso original. Los iconos de beneficios son SVG. La cabecera y el pie generales del tema se omiten solo en la plantilla SPC.

## Configuración en Shopify

Asignar la plantilla alternativa `landing-spc` al producto correcto cuando se revise/publica la rama. En la sección se configuran aviso superior, teléfono WhatsApp, enlace al catálogo, rendimiento de respaldo y visibilidad de sellos. Sin enlace de catálogo, los botones llevan a las muestras en la misma página.

Título y SKU para consultas se obtienen del producto/variante actual. Rendimiento: metacampo `decokasa.coverage_m2` de variante, luego producto, luego ajuste de sección (2.196 m²). La calculadora acepta 0.01–100 000 m², redondea a cajas completas y permite añadir 10% para cortes. Al cambiar área/margen se oculta el resultado anterior. El enlace de consulta incluye área, cajas y color; no envía mensajes automáticamente ni reserva stock.

Madera natural, Caoba y Gris claro son nombres visuales de las tres muestras. No equivalen a SKU ni cambian la variante comercial. Confirmar el mapeo con el catálogo antes de implementar selección de compra. No se muestra el precio ilustrativo del fixture.

Agregar hasta dos testimonios reales mediante bloques de nombre, retrato y texto autorizados. Los sellos están desactivados por defecto; activarlos únicamente si los seis corresponden al producto. La vista local muestra la composición completa con textos de muestra, sin presentarlos como opiniones reales. El indicador `spc_design_preview` se inyecta solo en el generador local y está ausente del esquema y la plantilla Shopify.

## Revisión y validación

`npm run sync:preview` regenera ocho vistas. `npm test` ejecuta 22 pruebas. `python scripts/verify_store.py` comprueba vistas/enlaces/IDs/JSON y genera `releases/DECOKASA-tema-0.1.0.zip`. `npx --yes @shopify/cli@4.9.4 theme check --output json` terminó sin hallazgos el 21/10/2026.

Revisión en Edge a 320, 390, 768, 1080 y 1440 px: sin desbordamiento horizontal, todas las imágenes completas, sin errores JavaScript. Probados cálculo con/sin cortes, entradas inválidas, actualización de consulta por color y teclado. Pendiente revisión en Shopify con catálogo real. No se desplegó esta reconstrucción.

## Iconos originales de beneficios — corrección 21/10/2026

Los seis `assets/spc-icono-*.svg` conservan los trazados vectoriales de los objetos inteligentes del PSD. Fuentes: capas 96 (agua), 97 (espuma), 98 (tránsito residencial), 99 (sistema click), 103 (limpieza) y 100 (pet friendly). Los tres primeros proceden del PDF anidado en el PSB; los restantes, de las máscaras vectoriales del PDF. Se unificó el dorado a `#f4d65e`, sin imágenes incrustadas. Texto, fondo del título y distribución siguen siendo HTML/CSS. Sustituyen únicamente los seis dibujos aproximados del snippet compartido. Total de recursos SPC integrados: 21 imágenes y 6 iconos SVG.


## Mapa de proporciones de toda la landing — 21/10/2026

`docs/landing-spc-layout.json` registra el lienzo original de 1080 × 6491 px, 8 secciones y 47 cajas de posición. Incluye origen/tamaño absolutos, capa de referencia, porcentajes por sección y porcentajes de página completa. Las medidas proceden del inventario de capas y la previsualización conservados; el PSD original no estuvo disponible en esta etapa. Algunas cajas compensan márgenes transparentes o métricas de texto, con notas en el mapa.

Para modificar la geometría, editar `box` en píxeles dentro del JSON y ejecutar `npm run sync:preview`. El sincronizador llama a `scripts/generate_spc_layout.cjs`, que recalcula los porcentajes, escribe `assets/landing-piso-spc-layout.css` y copia los estilos a las vistas. No editar a mano ese CSS generado. El estilo interior y las escalas tipográficas están en `assets/landing-piso-spc-proportions.css`; la adaptación móvil parte del CSS base.

Fórmulas por sección: `left = x / 1080 × 100`; `top = (y − section.y) / section.height × 100`; `width = box.width / 1080 × 100`; `height = box.height / section.height × 100`. Los porcentajes de página usan 6491 como denominador vertical. Los bloques se superponen; sus alturas no deben sumarse como si no hubiera solapamientos. Recortes y elementos superpuestos pueden tener coordenadas negativas o exceder 100%.

La geometría proporcional se aplica desde 701 px, con ancho máximo 1080 px. Hasta 700 px se reordena el contenido para conservar lectura y manejo. Se verificaron los 55 rectángulos (8 secciones + 47 elementos) a 701/768/923/1080/1440 px: máximo 0,0761 px de diferencia normalizada frente al mapa. Esta prueba mide cajas, no igualdad de cada píxel ni exactitud de la fuente tipográfica del PSD. Botones y cálculo también se probaron en móvil 320/390/600/700 px.

El documento de revisión `mapa-distribucion.html`, entregado junto a la vista local en outputs del chat, permite alternar referencia/landing, elegir sección y consultar ambos sistemas de porcentajes. La referencia compuesta se usa únicamente allí; la landing conserva imágenes independientes, SVG, texto y controles nativos.
