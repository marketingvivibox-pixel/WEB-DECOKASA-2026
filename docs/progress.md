## 10/11/2026 — Ventanas de tonos SPC

- [x] Separados visualmente los 11 acabados del catálogo original y agrupados en 3 cálidos, 4 oscuros y 4 neutros. Código, dimensiones y espesor propios por acabado; consulta manual por WhatsApp.
- [x] Ventana adaptable con filtros, cierre accesible, Escape, bloqueo del fondo y devolución del foco. El botón móvil persistente se oculta mientras está abierta.
- [x] Validado en navegador a 320/393/768/1024/1440 px: muestras cargadas, filtros, apertura, cierre, foco y ausencia de desbordamiento. Conservados cálculo de 20 m² + 10% = 11 cajas y formulario de compra progresivo.
- [ ] Confirmar integración final en GitHub/main y sincronización en el único tema oficial 188927803629.

## 10/11/2026 — Formularios de compra progresivos

- [x] Convertidas las solicitudes de las fichas compartidas y de piso SPC en ventanas de tres pasos con indicador de avance, navegación hacia atrás y validación de campos. Se conserva la selección y el cálculo de cajas.
- [x] Mantenido el aviso de modo de prueba y la simulación sin envío de datos; la conexión a un receptor sigue pendiente.
- [x] Probado en navegador a 375 y 1280 px en ficha y SPC, incluidas validaciones, conservación de datos, cálculo de 20 m² y cierre con Escape. 76 pruebas automáticas y Theme Check oficial sin hallazgos; vistas y paquete actualizados.
- [x] Publicado el commit `7f93fb5` en GitHub/main y verificada la sincronización de los seis archivos del tema oficial 188927803629. Comprobado el recorrido en las fichas públicas de Silla gamer Titan y piso SPC a 375 y 1280 px, con solicitudes de red de prueba bloqueadas y sin crear pedidos.

## 10/11/2026 — Datos de compra en el Libro de Reclamaciones

- [x] La página y el receptor incorporan fecha de compra, número de pedido y número de comprobante, con captura manual obligatoria.
- [x] Si el comprobante corresponde a otra persona, se solicitan nombre o razón social y documento; la hoja, constancia y avisos conservan la información y los ceros iniciales.
- [x] Migración no destructiva a cinco columnas adicionales; conservación de registros y reintentos antiguos. Verificación local de 80 pruebas.
- [ ] Revisar con el contador la conveniencia y requisitos legales de 48 respuestas obligatorias (50 si el titular es otra persona).

## 10/11/2026 — Libro de Reclamaciones: conexión terminada

- [x] El receptor de la cuenta de atención generó solicitudes de prueba numeradas. La copia de cliente y la ficha interna llegaron a los buzones de prueba; reintento automático configurado.
- [x] Preparados el formulario solicitado de 45 respuestas obligatorias, el enlace en el pie de página y la plantilla para el tema oficial; pruebas y Theme Check oficial sin incidencias.
- [x] La versión 3 desplegada conserva los ceros iniciales de documento y teléfono, verificado con la solicitud de prueba LR-2026-000004. Se corrigieron los datos de la prueba anterior en la hoja.
- [x] Publicado el commit `b19033f` mediante GitHub/main en el único tema oficial `188927803629`; creada y publicada la página `/pages/libro-de-reclamaciones` con acceso desde el pie de la tienda.
- [x] Prueba integral desde la tienda: LR-2026-000005 mostró la constancia, conservó los ceros iniciales y registró como enviados los avisos al cliente y a atención. La recepción efectiva de ambas copias se comprobó en una prueba anterior; «Enviado» no garantiza la entrega.
- [x] Receptor versión 3 y reintento horario activos. LR-2026-000001 a LR-2026-000005 son pruebas ficticias que figuran pendientes y no representan reclamos reales.
- [ ] Confirmar acceso operativo de Laiz, revisar con el contador los requisitos aplicables y el riesgo de exigir 45 respuestas y corregir SPF/DKIM/DMARC al cambiar el dominio.
## 10/11/2026 — Alternativas para escribir a atención

- [x] Añadidas opciones para abrir Gmail, Outlook u otra aplicación, y para copiar la dirección de atención cuando el navegador lo permite. La dirección queda visible en el menú.
- [x] Comprobados los enlaces, la copia y el manejo de errores en vistas de inicio y catálogo; revisado el diseño en cinco anchos y los accesos de teclado. Verificados los destinos web de los proveedores.
- [x] 61 pruebas correctas y Theme Check oficial sin hallazgos. Publicación mediante GitHub/main en el tema oficial 188927803629.

## 10/11/2026 — Atención al cliente y nuevo CRM de WhatsApp

- [x] El acceso «Atención al cliente» de la cabecera permite elegir correo `atencion.decokasa@checkazul.com.pe` o WhatsApp `+51 914 158 674`, con cierre mediante Escape o clic fuera. El acceso «Cómo comprar» continúa disponible.
- [x] Actualizado el número para el botón de inicio, el asesor del catálogo y las consultas de pisos PVC y SPC, conservando los ajustes existentes del editor.
- [x] Verificación local en cinco anchos de pantalla, 61 pruebas, Theme Check oficial y regeneración de las ocho vistas y el paquete del tema. Destino de integración: GitHub/main y el único tema oficial 188927803629.

## 09/11/2026 — Botón móvil PVC desde el primer desplazamiento

- [x] Incorporado «Realizar pedido / Calcula tus cajas de piso PVC» con el comportamiento aprobado en SPC: aparece al comenzar el scroll y se oculta al volver arriba, en la calculadora o con el catálogo abierto.
- [x] Acceso suave a la calculadora con foco accesible y respeto a movimiento reducido; espacio inferior y área segura del móvil contemplados. El escritorio conserva su diseño y la barra de vista previa de Shopify no se modifica.
- [x] Verificado en navegador a 320/393/1440 px, sin desbordamiento ni errores de consola; navegación a la calculadora y catálogo correctos. 59/59 pruebas, Theme Check oficial sin hallazgos, ocho vistas y ZIP de 174 archivos válidos. El comando lint no está disponible porque el proyecto no tiene instalado tsc; sintaxis JavaScript comprobada.
- [x] Preparado en codex/pvc-early-floating-cta sobre 0343ee6 para publicar mediante GitHub/main en el único tema oficial 188927803629.

## 09/11/2026 — Botón SPC desde el primer desplazamiento

- [x] «Realizar pedido» aparece en móvil en cuanto la página se desplaza, sin esperar a salir de la portada. Se oculta al volver arriba, al llegar a la calculadora o al abrir el formulario.
- [x] Verificado a 393 × 852 px: oculto en 0 px, visible tras 17 px y acceso a la calculadora correcto. En escritorio, a 1440 px, permanece oculto.
- [x] Integrada la actualización de catálogo c101e91; 59/59 pruebas, Theme Check oficial sin hallazgos; ocho vistas y ZIP de 174 archivos actualizados. Rama codex/spc-early-floating-cta, destino GitHub/main y tema oficial 188927803629.

## 09/11/2026 — Selección de color en tarjetas de catálogo

- [x] Selector automático para productos presentes y futuros con varias opciones de «Color», «Colores» o «Colour» en la ficha habitual. El color elegido actualiza la imagen, el estado de disponibilidad y el enlace a su variante.
- [x] Muestras configuradas en Shopify; colores comunes con respaldo y nombres de otros colores como texto. Si falta imagen de la variante, se identifica la imagen general como referencial o se indica que no hay imagen.
- [x] Conservados los destinos especiales de los productos, el precio a consultar y los productos sin variantes de color. Las tarjetas se comparten con inicio y búsqueda.
- [x] Comprobado a 320/393/768/1024/1440 px con fotos reales de la Silla gamer Titan; sin desbordamiento. 59/59 pruebas y Theme Check oficial sin hallazgos. Vistas previas y paquete del tema regenerados.
- [x] Publicación prevista por GitHub/main en el tema oficial 188927803629.

## 09/11/2026 — Capas móviles y skeletons PVC

- [x] Imagen ampliada y cinco referencias numeradas con conectores cortos; controles táctiles legibles y explicación de la capa elegida debajo de la imagen. Sustituye las etiquetas diminutas y el recorrido largo del adhesivo en móvil.
- [x] Skeletons proporcionales en las imágenes, con retirada al cargar o fallar; caché, copias del carrusel y limpieza al descargar la sección contemplados. Movimiento reducido respetado, textos y calculadora siempre disponibles.
- [x] Revisado a 320/393/768/1440 px, sin desbordamiento y con el diseño de escritorio conservado. 55/55 pruebas integradas, Theme Check oficial sin hallazgos, ocho vistas y ZIP de 174 archivos válidos.
- [x] Integrada la actualización SPC `7e53d62` conservando ambos cambios. Rama local `codex/pvc-loading-mobile`; único destino GitHub/main → tema oficial 188927803629.

## 09/11/2026 — Skeletons de carga SPC

- [x] Placeholders proporcionales para las imágenes en móvil y escritorio, con brillo suave únicamente en pantalla y alternativa estática con movimiento reducido.
- [x] Carga, errores, caché, cambios de acabado, imágenes adaptables y clones del carrusel contemplados; limpieza al descargar la sección Shopify.
- [x] 54/54 pruebas y Theme Check sin hallazgos; ocho vistas y ZIP de 174 archivos válidos.
- [x] Comprobación visual con imágenes retenidas a 393 × 852 y 1440 × 1000: geometría estable, sin desbordamiento, calculadora operativa durante la carga.
- [x] Preparado en rama aislada `codex/spc-loading-skeletons` sobre `9e2db27`, conservando el trabajo PVC independiente. Destino: GitHub/main → tema oficial 188927803629.

## 09/11/2026 — Conexiones y explorador de capas PVC

- [x] Sustituidas las líneas flotantes por conectores SVG que comparten las coordenadas de la imagen y terminan en cada capa.
- [x] Desde 1024 px, selector de cinco capas como el aprobado en SPC: línea activa, explicación y navegación por teclado. En móvil se conserva el esquema compacto con conexiones alineadas.
- [x] Comprobado a 320/393/1024/1440 px; 51/51 pruebas, Theme Check oficial sin hallazgos, ocho vistas y ZIP de 174 archivos válidos.
- [x] Rama local `codex/pvc-layer-explorer` sobre `c2f59be`; publicación por GitHub/main en el único tema oficial 188927803629. Catálogo, calculadora, datos comerciales y trabajo SPC independiente conservados.

## 06/11/2026 — Nota inferior de SPC retirada en móvil

- [x] Eliminado el texto específico del contenido compartido, también en móvil; conservadas las etiquetas de ejemplos ilustrativos y el movimiento del carrusel.
- [x] Vista móvil a 393 × 852 px comprobada, sin nota ni desbordamiento horizontal.
- [x] 18/18 pruebas SPC y Theme Check sin hallazgos; vistas sincronizadas y paquete de 173 archivos regenerado.

## 06/11/2026 — Nota inferior de SPC en escritorio

- [x] Retirada visualmente la nota inferior indicada por el usuario en escritorio, conservando las etiquetas de ejemplos ilustrativos y la versión móvil.
- [x] Comprobado a 1440 px: nota oculta y etiquetas visibles. A 393 × 852 px: nota móvil conservada, sin desbordamiento horizontal.
- [x] Theme Check oficial sin hallazgos, vista previa sincronizada y paquete regenerado; integrado sobre la última actualización PVC sin modificarla.

## 06/11/2026 — Nota inferior del carrusel PVC

- [x] Retirada la nota inferior señalada por el usuario, junto con su estilo y referencia de accesibilidad. Se conserva «Ejemplos ilustrativos» en el encabezado y «Ejemplo ilustrativo» en cada tarjeta.
- [x] Seis pruebas PVC correctas; vistas sincronizadas y paquete del tema regenerado.

## 05/11/2026 — Capas y testimonios PVC recuperados

- [x] Láminas por delante del panel «Un piso, muchas posibilidades», con borde redondeado y transición de fondo conservados.
- [x] Composición de reseñas del PSD: cinco retratos, decoración y tarjetas legibles en móvil, identificadas como ejemplos ilustrativos. Los bloques reales autorizados sustituyen los ejemplos automáticamente.
- [x] Carrusel continuo con deslizamiento, teclado, flechas, pausa y respeto a movimiento reducido; catálogo de 20 acabados y calculadora conservados.
- [x] Verificación local a 320/393/1440 px; 50/50 pruebas, Theme Check sin hallazgos y ocho vistas/ZIP de 173 archivos. Rama `codex/pvc-layers-testimonials`, sobre main `87beef7`.
- [x] Publicados `3c525d3` y `cf0f594` por GitHub/main en el único tema oficial 188927803629. Se confirmó la sección y plantilla sincronizadas; URL pública revisada a 393 × 1000 px, con superposición correcta, flechas y pausa funcionales.
- [x] Nombre del bloque ajustado al límite Shopify de 25 caracteres («Testimonio autorizado»), con prueba de regresión. Las seis pruebas PVC y Theme Check pasan tras este ajuste. Evidencia en `C:/Users/D. Cordova/Documents/Codex/2026-11-05/pvc-layers-reviews`.

## 05/11/2026 — Espesor total del piso SPC

- Ficha técnica corregida por indicación del usuario: «Espesor total: 5,5 mm», incluyendo los 4 mm del piso y 1,5 mm de espuma. Se conserva la espuma como desglose.
- Ajuste de contenido compartido entre móvil y escritorio; sin cambios de estilos, distribución, imágenes ni calculadora.
- Vista previa sincronizada y ZIP regenerado. Theme Check sin hallazgos; ficha revisada en escritorio y móvil 393 × 852 sin desbordamiento. Se conserva el único destino Shopify 188927803629 mediante GitHub/main.

## 05/11/2026 — Integración del diseño SPC de escritorio

- [x] Integrada la propuesta aprobada de `codex/spc-desktop` (`86e5919`) con la última producción (`73c2657`), conservando las correcciones de PVC.
- [x] Mejoras de composición, navegación, imágenes WebP, explorador de capas, acabados, calculadora y animaciones limitadas a escritorio desde 1024 px.
- [x] Conservados los recursos y estilos móviles; enlaces de acabados y comentario de solicitud restauran el comportamiento móvil publicado. Pruebas añadidas para los cambios de breakpoint.
- [x] Integración validada: 49/49 pruebas, Theme Check sin hallazgos, ocho vistas y ZIP de 166 archivos. Navegación y calculadora comprobadas a 1440 px: 20 m² + 10% = 11 cajas.
- [x] Publicado el merge `e8b617e` mediante GitHub/main en el tema oficial 188927803629: 14/14 archivos cotejados por MD5, incluidos nueve archivos SPC actualizados y cinco archivos base/móvil/PVC preservados.
- [x] Tienda pública comprobada a 1440 × 1000: navegación, capas, Caoba y calculadora (20 m² + 10% → 11 cajas / 24.16 m² / S/ 1045). A 393 × 852 coinciden las fuentes y posiciones de las 49 imágenes visibles, la geometría principal y los tres enlaces WhatsApp con la versión anterior; sin desbordamiento.
- [x] Evidencia guardada en `C:/Users/D. Cordova/Documents/Codex/2026-10-21/este-mokup-es-para-la-pagina-4/work/spc-desktop/production-nov05`.

## 05/11/2026 — Instaladora PVC alineada con el mockup

- [x] Corregida la duplicación por desalineación entre fondo y recorte; geometría común basada en el PSD de 1080 px.
- [x] Ajustados el solapamiento con el panel anterior y la altura de la escena, conservando los cinco beneficios y las funcionalidades.
- [x] Comprobación visual a 320/393/1440 px; 39/39 pruebas, Theme Check sin hallazgos y ocho vistas/ZIP válidos.
- [x] Publicado `a2b77bc` por GitHub/main en el tema oficial 188927803629 y verificado en la URL pública a 393 × 852. Sin temas adicionales ni cambios comerciales; rama SPC preservada.

## 05/11/2026 — Landing PVC publicada y comprobada

- [x] Revisado el procedimiento de SPC y completado `git push origin main`: `46c3ab6` → `a61758a`.
- [x] Confirmados los 49 archivos sincronizados en el tema oficial MAIN 188927803629 y la landing personalizada en https://decokasaperu.myshopify.com/products/piso-pvc.
- [x] Verificación pública en escritorio y móvil 393 × 852: catálogo de 20 acabados, selección FD802, cálculo 20 m² + 10% → 5 cajas / 25 m² / S/ 495 estimados y enlace WhatsApp con SKU correcto; sin envío de mensajes.
- [x] Variante 7172-4 con precio pendiente: importe oculto y consulta disponible. Sin desbordamiento ni imágenes cargadas rotas.
- [x] Rectificada la interpretación de un bloqueo general: los límites de los conectores no impedían el flujo GitHub autorizado. Rama secundaria SPC preservada.
- [ ] Pendientes comerciales: tres tarifas LQ y cotejo visual de miniaturas.

## 05/11/2026 — Limpieza de contexto

- [x] Eliminados enlaces y registros del tema retirado; código y recursos de SPC/PVC conservados.

## 05/11/2026 — Producto PVC publicado

- [x] Activado y publicado el producto existente 15506629263597 en Tienda online; lectura posterior ACTIVE y publicación confirmada. URL: https://decokasaperu.myshopify.com/products/piso-pvc.
- [x] Conservadas 20 variantes con 10 000 cajas por SKU / 200 000 totales. Sin cambios de temas ni de fuentes originales.
- [x] Landing PVC incorporada al tema oficial y comprobada en su URL pública, escritorio y móvil; 49 archivos confirmados el 05/11 desde `a61758a`.
- [ ] Confirmar las tres tarifas LQ y cotejar las miniaturas.

## 05/11/2026 — Regla de un único tema oficial aplicada

- [x] Regla permanente en AGENTS.md: único tema oficial 188927803629; pruebas en rama secundaria y vista previa local.
- [x] PVC integrado y publicado en el tema oficial desde `a61758a`.
- [ ] Integrar por separado los cambios SPC pendientes de la rama secundaria, preservando PVC.

## 05/11/2026 — Proveedores de Titan y SPC corregidos

- [x] Shopify: Silla gamer Titan = Xion; Piso SPC = DECOKASA, sustituyendo «Mi tienda».
- [x] Lectura posterior de ambas fichas: proveedor correcto y demás campos retornados sin cambios.
- [x] Registrada la confirmación del usuario: marcas propias y actividad de fabricante/importador. Sin cambios de tema, commit ni push.
- [x] Catálogo editable actualizado y releído: Titan en Fichas!I13/L13 y 19 fichas SPC en L25:L41/L127:L128. Historial, formato, fórmulas y revisiones pendientes preservados; fuentes originales de solo lectura intactas.


## 05/11/2026 — Ficha PVC con los 20 acabados confirmados

- [x] Decisión del usuario: conservar los 20 acabados del mockup; no agregar los 11 restantes de la fuente.
- [x] Guardados y releídos los 20 SKU y precios de los 17 acabados FD a S/ 99 por caja de 36 planchas / 5 m².
- [x] Descripción actualizada con presentación, instalación, entrega y escala FD por cantidad para cotización con asesor; sin descuentos automáticos.
- [x] Auditoría en `docs/pvc-product-data.json`; originales de Drive conservados sin modificaciones.
- [ ] Confirmar tarifa de los tres LQ: 7172-4, 7172-8 y 7195-8; no asumir correspondencia con HM.
- [x] Configuradas y releídas 10 000 cajas por SKU según instrucción posterior del usuario; ver entrada superior.
- [ ] Cotejo visual de miniaturas.
- [x] Landing incorporada y comprobada en el tema activo el 05/11; producto ACTIVE y publicado.


## 05/11/2026 — Fuentes de SKU y precios indexadas

- [x] Verificados acceso, títulos, formato Excel y contenido de las dos fuentes compartidas; sin escrituras remotas.
- [x] Registrados enlaces, IDs, pestañas indicadas y regla de solo lectura en [catalog-sources.md](catalog-sources.md), README y contexto del proyecto.
- [x] Diferenciado el Sheet de trabajo de los originales; documentadas las escalas de precio, comisiones y limitación de imágenes en la lectura textual.
- [x] Conciliados los SKU de los 20 acabados que el usuario decidió conservar; la actualización posterior de Shopify consta en la entrada superior. Pendientes miniaturas y tarifa LQ; stock configurado posteriormente por instrucción del usuario, ver entrada superior.


## 05/11/2026 — Documentación PVC depurada

Consolidado el estado de PVC y retiradas referencias obsoletas a pedido del usuario. Se conservan el producto y su landing dentro del repositorio principal; sin cambios en código ni Shopify.

- Producto `15506629263597` en borrador: 20 acabados y 36 planchas / 5 m² por caja; 20 SKU y 17 precios FD cargados. Pendientes tres precios LQ y existencias comerciales.
- Comprobado directamente en Shopify el 05/11: sin publicaciones ni URL pública y sin los cinco archivos principales de PVC en el tema activo. Causa de invisibilidad confirmada; sin cambios remotos.
- Landing registrada en `b007802` e integrada con SPC en `3e7b29d`, sin push. Validación previa: 39/39 pruebas, Theme Check CLI 5.0.1 sin hallazgos, ocho vistas y ZIP de 160 archivos.
- Pendiente incorporar la plantilla al tema activo `188927803629` por un procedimiento permitido y publicar el producto para consultas. Detalle en [landing-pvc.md](landing-pvc.md).


## 04/11/2026 — Rediseño editorial de SPC solo para escritorio

Con autorización del usuario para cambiar el diseño de escritorio, se reemplaza la composición anterior desde 1024 px. Portada con fotografía amplia, titular «Un nuevo piso. Un nuevo hogar.», fondo cálido, acentos oliva y jerarquía más clara. Los colores se comparan en tres tarjetas amplias; composición, instalación, capas y ficha usan columnas; certificaciones forman una banda; calculadora con croquis visible; resultados, envíos y cierre se reorganizan. Se conservan recursos propios, funciones y aviso de testimonios ilustrativos.

Referencias de sector consultadas: https://www.quick-step.co.uk/en-gb/vinyl, https://www.karndean.com/en-gb/floors/ y https://home.tarkett.com/en_EU/node/id-range-all-in-one-flooring-22479. La adaptación usa la identidad y los recursos de Decokasa. Por debajo de 1024 px se mantiene la versión móvil aprobada, incluida la animación pausada de la calculadora. Sin cambios en JavaScript, datos comerciales ni plantilla PVC.

Validación: 35/35 pruebas, Theme Check CLI 4.9.4 sin hallazgos, ocho vistas y ZIP de 112 archivos verificados. Revisión visual a 1024/1440/1920 px sin desbordamiento; 45/45 medidas móviles a 393 px idénticas a la referencia. Calculadora comprobada con 20 m²: 11 cajas / S/ 1045 con cortes y 10 / S/ 950 sin cortes; entrada directa de 26 m²: 14 / S/ 1330; ocho ambientes con 62 m²: 32 / S/ 3040. Cantidad y detalle de solicitud correctos, sin enviar pedidos. Carrusel y conservación de datos al cambiar de tamaño verificados. Evidencias locales: work/spc-desktop/desktop-editorial/portada-local.png y calculadora-local.png del chat este-mokup-es-para-la-pagina-4.

Publicado 65e09bd en origin/main y verificado en Shopify: nueva portada a 1920 px, calculadora ampliada a 1440 px y versión móvil compacta a 393 px, sin desbordamiento. El cálculo de 20 m² mantiene 11 cajas / S/ 1045 al pasar a móvil. Evidencias: work/spc-desktop/desktop-editorial/portada-shopify.png, calculadora-shopify.png y movil-shopify.png del chat este-mokup-es-para-la-pagina-4. Tamaño temporal del navegador restablecido. Trabajo aislado en WEB-DECOKASA-SPC-DESKTOP para preservar los cambios concurrentes de PVC.



## 04/11/2026 — Versión de escritorio de la landing SPC

La versión móvil aprobada se conserva por debajo de 1024 px, incluida la calculadora compacta y su animación de 1,2 s con desfase de 160 ms. Desde 1024 px se aplica una composición propia para escritorio, de hasta 1600 px: portada horizontal, explicación/ficha y colores en columnas, seis sellos en fila, instalación y capas ampliadas, carrusel legible, resultados y envíos contiguos y cierre reorganizado. Esta decisión reemplaza la escala única de 1080 px solo para escritorio; el mapa del mockup móvil permanece vigente.

La calculadora muestra medidas y resultado a la izquierda, y croquis/desglose permanentemente visibles a la derecha. Admite ocho ambientes en dos filas; la lista de medidas tiene desplazamiento interno cuando es larga. Al cambiar de tamaño se mueven y restituyen los mismos nodos, preservando datos y funciones. Conserva precio de variante, 2,196 m²/caja, cortes opcionales del 10% y solicitud simulada.

Validación local: 35/35 pruebas, Theme Check CLI 4.9.4 sin hallazgos, ocho vistas y ZIP de 112 archivos verificados. Revisión en 320/393/767/1024/1440/1920 px sin desbordamiento; 45/45 medidas de referencia móvil coinciden con la versión anterior. Verificados 20 m² → 11 cajas / S/ 1045 con cortes; ocho ambientes, 62 m² → 32 cajas / S/ 3040, cantidad/detalle correctos en solicitud, entrada directa y cambio de tamaño sin perder datos. No se envió ningún pedido. Evidencia: work/spc-desktop/calculadora-escritorio.png del chat este-mokup-es-para-la-pagina-4.

Trabajo aislado en WEB-DECOKASA-SPC-DESKTOP, rama codex/spc-desktop, para conservar intactos los cambios concurrentes de PVC del clon principal. Publicado b3c5a4c en origin/main y comprobado en Shopify: portada horizontal, calculadora ampliada a 1440 px y versión móvil compacta a 393 px; sin desbordamiento en ambos tamaños. El cálculo de 20 m² mantiene 11 cajas / S/ 1045 al pasar de escritorio a móvil y volver. Evidencias: work/spc-desktop/calculadora-escritorio-shopify.png y calculadora-movil-shopify.png del chat este-mokup-es-para-la-pagina-4. Tamaño temporal del navegador restablecido.


## 04/11/2026 — Animación de calculadora SPC más pausada

A pedido del usuario, cada cuadrito de la miniatura «Tu espacio» aparece en 1,2 s (antes 0,55 s), con desfase de 160 ms entre ambientes (antes 70 ms). Se mantienen tamaño, diseño, cálculo, movimiento reducido y croquis desplegable. Publicado 200e579 en origin/main y comprobado en Shopify móvil a 393 px: estilos efectivos de 1,2 s / 0,16 s, dos ambientes de 20 + 6 m² → 14 cajas / S/ 1330 con cortes, sin desbordamiento.

Validación: 34/34 pruebas, Theme Check CLI 4.9.4 sin hallazgos, ocho vistas y ZIP de 111 archivos verificados. Evidencia: C:/Users/D. Cordova/Documents/Codex/2026-10-21/este-mokup-es-para-la-pagina-4/work/spc-calculator/calculadora-animacion-lenta-mobile.png. Tamaño temporal del navegador restablecido.


## 03/11/2026 — Miniatura animada integrada en calculadora SPC

A pedido del usuario, la animación de cuadritos se mantiene visible en una miniatura «Tu espacio» junto al resultado compacto. Dibujo de 48 px de alto, área neta y hasta ocho ambientes en dos filas; también funciona con entrada directa de m². La animación aparece al cambiar geometría o agregar ambientes (0,55 s y desfase de 70 ms), sin repetirse por cambios de precio o nombre. Respeta movimiento reducido. El croquis completo permanece plegado en «Ver detalle y croquis», con sus capas visibles también al desactivar animaciones. Conservados cálculo, rendimiento comercial de 2,196 m²/caja, cortes del 10% y solicitud en simulación.

Publicado 289ff73 en origin/main. Validación: 34/34 pruebas, Theme Check CLI 4.9.4 sin hallazgos, ocho vistas y ZIP de 111 archivos verificados; el validador del plugin sigue sin dependencia local. Revisión local a 320/393/1440 px, de uno a ocho ambientes, m² directos y valores inválidos, sin desbordamiento. La miniatura añade unos 70 px al bloque móvil (aproximadamente 874 px a 393 px de ancho). Comprobación en Shopify a 393 px: 5 × 4 m → 20 m², 11 cajas y S/ 1045 con cortes; animación activa, detalle cerrado y sin desbordamiento. Evidencia: C:/Users/D. Cordova/Documents/Codex/2026-10-21/este-mokup-es-para-la-pagina-4/work/spc-calculator/calculadora-mini-animacion-mobile.png. Tamaño temporal del navegador restablecido.


## 03/11/2026 — Calculadora SPC compacta para móvil

Rediseñada para priorizar medidas, cajas y total estimado juntos, con una única acción «Solicitar esta cantidad». El detalle de superficies y el croquis quedan plegados en «Ver detalle y croquis». Conserva varios ambientes, entrada directa de m², cortes opcionales del 10%, rendimiento de 2,196 m²/caja y formulario de simulación existente. El precio usa la variante Shopify seleccionada; si no existe, indica «Por confirmar». Sin cambios al resto del mockup.

Validación: 34/34 pruebas, Theme Check CLI 4.9.4 sin hallazgos (validador del plugin sin dependencia local), ocho vistas y ZIP de 111 archivos verificados. Navegador: 320/393/1440 px sin desbordamiento; a 393 px la sección pasa de 2068 a 804 px aproximadamente, un 61% menos. Comprobados 20 m² → 11 cajas con cortes / 10 sin cortes, 35 m² → 18 cajas, dos ambientes de 20+6 m² → 14 cajas, campos inválidos y cantidad trasladada a solicitud. Precios de prueba de 95 PEN/caja coherentes. Publicado 3d0350e en origin/main y comprobado en Shopify a 393 px: cálculo y solicitud coinciden (20 m² con cortes → 11 cajas / S/ 1045), sin desbordamiento. Evidencia: C:/Users/D. Cordova/Documents/Codex/2026-10-21/este-mokup-es-para-la-pagina-4/work/spc-calculator/calculadora-movil-publicada.png. Tamaño temporal del navegador restablecido.


## 03/11/2026 — Esquinas y uso del piso SPC corregidos y publicados

Publicado 09cfcbb en origin/main y comprobado en Shopify. La foto del hero se recorta con el mismo radio inferior de 50 unidades que la tarjeta blanca; una extensión del fondo de pared cubre las esquinas expuestas. Se eliminan las puntas oscuras sin mover los elementos medidos del mockup. La definición ahora dice «revestimiento vinílico de alta gama para el suelo, con núcleo rígido». Sin cambios funcionales ni cobertura comercial de 2,196 m²/caja.

Validación: 33/33 pruebas, Theme Check CLI 4.9.4 sin hallazgos, ocho vistas y ZIP de 111 archivos verificados. Revisión visual local en móvil y escritorio; publicación comprobada a 393 px sin desbordamiento ni cruce del texto con la franja siguiente. Evidencia: C:/Users/D. Cordova/Documents/Codex/2026-10-21/este-mokup-es-para-la-pagina-4/work/spc-a2/esquinas-suelo-publicado-mobile.png. Tamaño temporal del navegador restablecido.


## 03/11/2026 — Bordes y escala SPC A2 corregidos y publicados

Publicado d4a41e2 en origin/main y verificado directamente en Shopify. El follaje ocultaba el borde redondeado inferior de la ficha técnica: ahora fondo técnico z1, follaje z0, panel de sellos z2 y tablones z3, sin crear contexto de apilado en la ficha. Texto introductorio a 36 unidades (27,17502 × transformación PSD 1,324746), interlineado 1,2. Geometría A2 preservada; sin cambios funcionales ni rendimiento comercial de 2,196 m²/caja.

33/33 pruebas, ocho vistas y ZIP de 111 archivos verificados; Theme Check CLI 4.9.4 sin hallazgos (validador plugin sin dependencia local). Revisión local 320/393/1080 px sin desbordamiento. En Shopify a 393 px se comprueban borde redondeado visible, superposición sobre panel de certificaciones, título libre, seis sellos cargados y calculadora presente. Evidencia: C:/Users/D. Cordova/Documents/Codex/2026-10-21/este-mokup-es-para-la-pagina-4/work/spc-a2/recortes-a2-publicado-mobile.png. Tamaño temporal del navegador restablecido.


## 03/11/2026 — Refinamiento de recorte y superposición SPC A2

El follaje cubría el borde inferior redondeado de la ficha técnica. Fondo blanco separado en una capa de nivel 1, follaje en 0, panel de certificaciones en 2 y tablones en 3; se conserva la geometría medida en el PSD. Texto introductorio corregido a 36 unidades de diseño: 27,17502 del texto PSD × transformación 1,324746. Interlineado 1,2. Sin cambios de funciones ni cobertura comercial.

Validación: 33/33 pruebas aprobadas, ocho vistas y ZIP de 111 archivos verificados; Theme Check CLI 4.9.4 sin hallazgos. Plugin de validación sin dependencia local; CLI oficial utilizado como alternativa. Navegador a 320/393/1080 px sin desbordamiento y composición móvil revisada visualmente. Evidencia local: work/spc-a2/recortes-corregidos-mobile.png del chat este-mokup-es-para-la-pagina-4.


## 03/11/2026 — Ajuste puntual SPC al mockup A2

Actualizadas la explicación «¿Qué es el piso SPC?», su párrafo, el borde dorado y el texto de colores según LANDING SPC_MOCK A2.psd (1080 × 10004; SHA256 8350e05c4d440358c4d538ea73f1b318d5ec1ff65b7bb3727978e28272fa747a). Corregido el orden de capas entre ficha técnica y sellos: el panel de certificaciones cubre el fondo técnico y los tablones terminan antes del título. Medidas y tipografías de estos bloques trasladadas al mapa proporcional; once secciones y 71 anclajes. El resto del diseño y las funciones conservados, incluido rendimiento comercial 2,196 m²/caja (no sustituido por 2,24 del PSD).

Validación local: 33/33 pruebas, Theme Check CLI 4.9.4 sin hallazgos, ocho vistas y ZIP de 111 archivos verificados. Revisión visual a 320/393/1080 px sin desbordamiento ni cruce con el título de certificaciones. Validador del plugin no inicia por dependencia ausente; utilizado CLI oficial. Publicado en origin/main (ee86941) y verificado en Shopify: nueva explicación presente, seis sellos cargados y calculadora conservada. A 393 px, los tablones terminan 3,16 px antes de la caja del título de certificaciones; sin desbordamiento horizontal. Evidencia: work/spc-a2/correccion-publicada-mobile.png del chat este-mokup-es-para-la-pagina-4.


## 03/11/2026 — Sellos SPC confirmados y habilitados

El usuario confirma expresamente que FloorScore, ANAB, ILAC, DAkkS, CNAS y EPH corresponden al piso SPC vendido. Sustituye el pendiente anterior de confirmación; no constituye una auditoría documental independiente. Activado `show_certifications` en `templates/product.landing-spc.json`; el esquema conserva su valor inicial desactivado para otras instancias. Composición original del PSD preservada: panel blanco, follaje, seis sellos en dos filas, entre ficha técnica y Click. Calculadora y testimonios sin cambios.

Validación: 6/6 pruebas SPC, Shopify Theme Check CLI 4.9.4 sin hallazgos, ocho vistas y ZIP de 111 archivos verificados. Navegador a 320/393/1080 px: seis imágenes cargadas y sin desbordamiento; calculadora 20 m² con 10% de cortes = 11 cajas. El validador del plugin no inicia por dependencia ausente; usado CLI como alternativa. Publicado en origin/main con commit fe404ba y verificado en Shopify: seis sellos visibles con sus imágenes cargadas, sin desbordamiento en la vista pública comprobada, y calculadora presente. Evidencia: work/spc-redesign/certifications-live.png en el chat este-mokup-es-para-la-pagina-4.


## 27/10/2026 — Carrusel ilustrativo del mockup habilitado

- El usuario confirmó que las imágenes son generadas por IA y autorizó su uso. Esto no acredita opiniones reales: las cinco tarjetas se presentan como «Ejemplos ilustrativos», con aviso visible «Imágenes de IA · Textos de muestra. No son reseñas de clientes reales», sin estrellas ni insignias de verificación.
- Opción editable show_illustrative_testimonials, desactivada por defecto y activada en product.landing-spc.json. Los bloques reales tienen prioridad; no se habilitan sellos de certificación. Se conserva el diseño proporcional y el carrusel infinito con pausa, teclado, gesto táctil y movimiento reducido.
- Calculadora completa conservada: medidas/croquis, ambientes, área directa, cortes y transferencia a solicitud. 20 m² = 11 cajas con cortes y 10 sin cortes. Cobertura 2,196 pendiente de confirmación comercial; solicitud sigue simulada, sin POST ni Odoo.
- 33/33 pruebas y Theme Check sin hallazgos. Navegador a 320/393/768/1080/1440 px: cinco tarjetas, imágenes cargadas, autoplay/pausa/teclado, calculadora y solicitud correctos, sin errores ni desbordamiento. Deslizamiento táctil y movimiento reducido comprobados a 393 px. Evidencia illustrative-results.json e illustrative-393/1080.png en work/spc-redesign del chat.


## 27/10/2026 — Calculadora completa en página y testimonios visibles

- Recuperada la calculadora anterior dentro de la landing: medidas, croquis, varios ambientes, área directa, cortes y cajas transferidas a solicitud. Retirados resumen rápido y diálogo adicional; se mantiene el diálogo de solicitud.
- Calculadora en flujo normal y altura adaptable para móvil: sin controles superpuestos, campos de 16 px y botones táctiles. El resto del diseño conserva sus proporciones. Separación corregida con cinco capas y testimonios.
- La sección Testimonios aparece también sin bloques configurados, con aviso de próximas experiencias y enlace al asesor. El carrusel se muestra al agregar testimonios reales; ejemplos del mockup siguen exclusivos del modo de diseño hasta confirmación. La vista local predeterminada reproduce la configuración pública; SPC_DESIGN_PREVIEW=1 habilita muestras.
- 33/33 pruebas y Theme Check CLI sin hallazgos. Cálculo por medidas, ambientes, área directa, cortes, cantidad de solicitud y ausencia de desbordamiento/errores comprobados a 320/393/768/1080/1440 px. Evidencias restoration-results.json y restored-*.png en work/spc-redesign del chat. Formulario continúa simulado, sin POST ni Odoo; cobertura 2,196 preservada.


## 27/10/2026 — Rediseño SPC integrado con la última actualización de main

- Rediseño preservado en 2242eee e integrado con main/origin main 2357831. Conflictos reconciliados manualmente conservando mapa PSD 1080 × 10004, once secciones, 71 anclajes y 33 WebP.
- Conservadas calculadora por ambientes, cortes, solicitud y funciones generales de variantes/regalo. Botón móvil adaptado al DOM v2; foco y diálogos unificados; respaldo fijo de precio eliminado, usando precio real o importe por confirmar. Ambos accesos del mockup conservados.
- 33/33 pruebas y Theme Check CLI sin hallazgos. Calculadora/solicitud/botón/carrusel comprobados en 320/393/768/1080/1440 px; cinco capas visibles en 320/393/1080/1440. Sin errores JS ni desbordamiento. Ocho vistas y ZIP de 111 archivos regenerados/verificados.
- Informe actualizado: docs/landing-spc-merge-compatibility.md. Formulario simulado, sin POST ni integración Odoo. La sincronización Shopify se comprueba separadamente del merge Git.


## 27/10/2026 — Cinco capas corregidas y compatibilidad de integración revisada

- Corregida superposición del bloque de cinco capas con la calculadora; filas móviles alineadas sin invadir la nota, anclada en y=5995. Mapa vigente: 71 cajas. Revisión 320/393/1080/1440 sin errores JS, imágenes rotas ni desbordamiento.
- 33/33 pruebas, Theme Check CLI sin hallazgos y ocho vistas/ZIP de 111 archivos verificados. Validador del plugin no inicia por dependencia ausente. Evidencias layers-after-*.png y layers-visual.json en work/spc-redesign.
- Auditados árbol actual del rediseño, base/origin main b70e0b2 y main local 2357831. Cinco archivos con 32 bloques de conflicto en ensayo sin merge. Cuatro activos SPC publicados coinciden con b70e0b2 mediante originales de CDN/mapas de fuentes; producción y main local son versiones distintas. Informe: docs/landing-spc-merge-compatibility.md.
- Pendiente integrar manualmente calculadora, modal y botón móvil, preservando geometría y funciones comunes. Cambios locales; sin commit, push, fusión ni publicación. Vista: http://127.0.0.1:8818/landing-piso-spc.html?revision=capas-corregidas .


## 27/10/2026 — Resultados y envíos ajustados al mockup

- Medidas del PSD trasladadas al título, franja dorada, tarjeta social, fotografía, acciones decorativas, banderas y textos. Mapa vigente: 71 cajas, once secciones y 33 WebP. Interfaz en Liquid/CSS; únicamente las fotografías y sombras originales se exportan.
- Foto de asesoría recortada según la máscara original a 398 × 451; almacén a 1080 × 1026 con sombras inferiores originales. Contador de vistas de muestra reservado al modo de diseño; versión pública muestra una leyenda de asesoría sin métricas ficticias.
- 33/33 pruebas aprobadas; Theme Check CLI sin hallazgos. Validador del plugin no inicia por dependencia ausente @shopify/theme-check-common. Revisión 320/393/1080/1440 sin errores JS, imágenes rotas ni desbordamiento; comparación visual 393/1080 contra PSD. Evidencias results-reference.png, results-after-*.png y results-visual.json en work/spc-redesign.
- Ocho vistas y ZIP de 111 archivos regenerados y verificados. Cambios locales en feature/spc-diseno-octubre, sin commit, push ni publicación. Vista: http://127.0.0.1:8818/landing-piso-spc.html?revision=resultados-envios . Pendiente revisión visual del usuario.


## 27/10/2026 — Testimonios proporcionales con carrusel infinito

- Reconstruido el bloque según el PSD: panel blanco, fondo fotográfico/decorativo independiente, título, tarjetas altas, retratos con borde dorado, ciudades, nombres, estrellas, frases y textos. Elementos de interfaz en Liquid/CSS; mapa 1080 × 10004 actualizado a 68 cajas y 33 WebP.
- Carrusel continuo automático, deslizamiento táctil nativo, teclado y pausa. Mantiene el desplazamiento vertical móvil, respeta movimiento reducido y suspende animación fuera de pantalla. Maneja una/dos tarjetas y selección/recarga del editor Shopify. Copias visuales ocultas a tecnologías de asistencia. Las muestras solo aparecen en la vista de diseño identificada; la tienda utiliza bloques reales autorizados.
- 33/33 pruebas aprobadas; Theme Check CLI sin hallazgos. El validador del plugin no arranca por falta de @shopify/theme-check-common. Interacciones verificadas en 320/393/768/1080/1440 px; gesto horizontal/vertical real simulado a 393 px, bucle, pausa, teclado, movimiento reducido y editor correctos. Sin errores JS, imágenes rotas ni desbordamiento. Evidencias testimonials-after-*.png, testimonials-interactions.json y scripts de comprobación en work/spc-redesign.
- Ocho vistas y ZIP de 111 archivos regenerados/verificados. Cambios locales en feature/spc-diseno-octubre, sin commit, push ni publicación. Vista: http://127.0.0.1:8818/landing-piso-spc.html?revision=testimonios-infinito . Pendiente revisión visual del usuario.


## 27/10/2026 — Bloque de instalación Click ajustado al PSD

- Corregidos encuadre y bordes redondeados del fondo, tamaño/degradado/posición de Click!, superposición del instalador, texto en dos líneas y cinco tarjetas. Medidas del PSD trasladadas al mapa proporcional 1080 × 10004, ahora con 67 cajas, compartido entre móvil y escritorio.
- Fondo fotográfico recortado a 1080 × 889 con sombreado original (capas 183/184); brillo del borde del tablón reconstruido desde el trazado original en spc-click-borde-tablon.svg. Textos, tarjetas, sombras y degradados permanecen en código. Mapa, manifest y vistas actualizados.
- 32/32 pruebas aprobadas y Theme Check CLI sin hallazgos; el validador del plugin sigue sin arrancar por dependencia ausente. Revisión visual a 393/1080/1440 sin errores JS, imágenes rotas ni desbordamiento. Evidencias click-reference.png, click-after-393.png, click-after-1080.png y visual-metrics.json en work/spc-redesign. Ocho vistas y ZIP regenerados y verificados.
- Cambios locales en feature/spc-diseno-octubre, sin commit, push ni publicación. Vista: http://127.0.0.1:8818/landing-piso-spc.html?revision=click-corregido . Pendiente revisión visual del usuario.


## 27/10/2026 — Corrección del bloque de composición frente al mockup

- Comparadas capturas del usuario con el compuesto del PSD en y=1711–2700. Corregidos tamaño/peso/espaciado y degradado de SPC, separador discontinuo, título alineado a la izquierda, cápsula redondeada/dorada, fórmula en negrita y nota blanca. Ajustes proporcionales en el mapa y CSS, sin mover el recorte de niños/mascota, que ya coincidía.
- Fondo exportado con las capas fotográficas 138/140/141: incorpora el retoque enmascarado que elimina el cuadro de la pared y el sombreado del suelo. Manifest actualizado; textos, degradados y controles siguen en código.
- 32/32 pruebas aprobadas y Theme Check sin hallazgos. Visual 393/1080/1440 sin imágenes rotas, desbordamiento ni errores JS. Ocho vistas y ZIP 109 archivos regenerados y verificados. Evidencias composition-reference.png, composition-final-393.png y composition-final-1080.png en work/spc-redesign. Corrección local, sin publicación.


## 27/10/2026 — Rediseño SPC según el PSD actualizado (local)

- Nueva composición proporcional 1080 × 10004: once secciones y 66 cajas en `docs/landing-spc-layout.json`, con las mismas posiciones relativas en móvil y escritorio. Textos, controles, ficha, iconos y calculadora siguen construidos con Liquid/HTML/CSS/SVG; las fotografías y recortes se exportaron individualmente a 32 WebP con nombres descriptivos. Fuente y huella PSD en `docs/landing-spc-assets-20261027.json`.
- Actualizados hero, composición, colores, ficha técnica, sellos, instalación Click, cinco capas, calculadora, testimonios, resultados, envíos y cierre. Raleway regular/cursiva local con licencia OFL; el título del hero aproxima Godshine Sans Bold, que no está instalado.
- Conservada calculadora avanzada por ambientes de `feature/calculadora-visual-spc`, con cálculo rápido, cortes opcionales, dimensiones/varios ambientes y transferencia de cajas a la solicitud. El formulario funciona también fuera del modo de muestra; continúa siendo simulación, sin POST, pago, reserva ni Odoo. Cobertura desde variante/producto/configuración; no se sobreescriben datos comerciales.
- Diferencia por revisar: el PSD indica 2,24 m²/caja (planchas 122 × 18,4 cm), mientras el respaldo existente es 2,196. Se conserva la cobertura configurada. Certificaciones ocultas por defecto; testimonios públicos solo desde bloques reales. La vista de diseño identifica sellos/retratos/textos de muestra pendientes de validación.
- 32/32 pruebas aprobadas. Revisión visual a 393/1080/1440 px: imágenes completas, sin errores JS ni desbordamiento. Pruebas de uso a 320/393/768/1080/1440 px: cálculo decimal, rechazo de valores inválidos, ambientes, cortes, reapertura, transferencia, simulación sin POST y cierre por Escape correctos. Theme Check de Shopify CLI sin hallazgos; el validador incluido en el plugin no arranca por dependencia ausente. Ocho vistas y paquete de 109 archivos verificados.
- Trabajo en `feature/spc-diseno-octubre`, basado en `main` b70e0b2, dentro de `work/spc-redesign/theme` del chat del 21/10. Los otros checkouts y cambios pendientes se preservaron. Sin commit, push, fusión ni publicación en Shopify. Vista local: http://127.0.0.1:8818/landing-piso-spc.html . Evidencias visuales/de uso en `work/spc-redesign/`.


## 27/10/2026 — Galería y distribución de producto

- Añadidos controles anterior/siguiente y deslizamiento a la galería, con miniaturas y cambio de variantes conservados. En escritorio, la compra se organiza en un panel compacto con secciones desplegables y límite ligado al borde inferior de la galería; la información del producto queda centrada debajo.
- 30 pruebas aprobadas, incluidas galería, gestos, variantes y cálculos de solicitud. Vistas de muestra y paquete regenerados y verificados. La herramienta de validación de Shopify no pudo iniciarse por una dependencia ausente; la plantilla se comprobó con las pruebas del proyecto.


## 27/10/2026 — Calculadora visual SPC por ambientes, modal de pedido y botón persistente móvil

- Registrados los cambios en `feature/calculadora-visual-spc`: cálculo por medidas de varios ambientes o ingreso directo de m², croquis esquemático dinámico en tiempo real (SVG con animación y proporciones), desglose jerárquico de superficie y cajas, acceso al catálogo y botón "Realizar pedido".
- Modal de pedido emergente (`#spc-order-modal`) con fondo difuminado, precarga de ambientes y cajas, completamente extraído del flujo del pie de página.
- Erradicación total de la línea azul en campos de medida (`outline: none !important; border: none !important; box-shadow: none !important;`).
- Botón persistente móvil inferior ("Realizar pedido ↗") con visibilidad selectiva por scroll (ocultamiento automático en zona de calculadora).
- Servidor local con cabeceras `Cache-Control: no-store` y control de versiones por query string (`?v=...`) en `scripts/sync_preview.cjs`.


## 26/10/2026 — Meta automática del regalo

- Sustituida la meta fija por `product.price_max × 1.80`, redondeada a céntimos. Estable entre variantes y cantidades; progreso calculado con las líneas de la solicitud. Tarjeta, importe pendiente y modal comparten la referencia. Retirado el ajuste manual antiguo; productos sin precio positivo no muestran el incentivo.
- Titan: máximo S/ 300 → S/ 540. Una blanca S/ 279 → 52%, faltan S/ 261; blanca + negra S/ 579 → desbloqueado. Reducir el total vuelve a bloquearlo.
- 29/29 pruebas aprobadas: mayor precio, disponibilidad, comparación, valores antiguos ignorados, variantes combinadas, redondeo, límite exacto y precio cero. Tres archivos de tema validados con Shopify sin hallazgos. Ocho vistas y ZIP de 74 archivos regenerados y verificados.
- Commit `6583374` enviado a `main`, sincronizado y comprobado en Shopify (tema `188927803629`): meta y modal S/ 540; blanca S/ 279, pendiente S/ 261 (52%); cambio a negro conserva la meta y la selección; ambas S/ 579 desbloquean el regalo; quitar blanca deja negro S/ 300, pendiente S/ 240 (56%) y vuelve a bloquearlo. Consola sin errores. Evidencia: `outputs/titan-meta-80-porciento.png` en el chat de trabajo. Sin cambios de catálogo ni envío de solicitudes.


## 26/10/2026 — Solicitud con varios colores

- Incorporada lista por variante: elegir color/cantidad, agregar, repetir; controles independientes y eliminación. Cambiar de color conserva selección y formulario. Agregar un color repetido suma unidades.
- Total, meta del regalo y resumen del formulario usan todas las líneas con su precio y SKU. Lista vacía impide continuar. Errores de carga conservan la solicitud y permiten reintentar. Formulario aún en simulación, sin envío, reserva ni pagos; calculadoras PVC/SPC preservadas.
- 27/27 pruebas aprobadas, incluidos precios distintos, acumulación, edición, eliminación, límites, fallo de red y referencia estable por solicitud. Cuatro archivos validados con la herramienta nativa Shopify sin hallazgos. Ocho vistas y ZIP de 74 archivos válidos. Revisión visual local a 320/390 px y escritorio; consola sin errores.
- Commit `104c032` enviado a `main`, sincronizado y verificado en Shopify (tema `188927803629`): blanco ×1 + negro ×1 = S/ 579; blanco ×2 + negro ×1 = S/ 858; eliminación y cambio de color conservan cantidades y recalculan el total. El formulario muestra ambas líneas y la galería blanca conserva cuatro ángulos. Consola sin errores. Titan continúa en borrador y el formulario sigue en simulación.


## 26/10/2026 — Titan: galería ordenada por color

- Implementada galería desde `decokasa.gallery_images` de variante, con respaldo en la galería general para otros productos. Una foto principal visible, resto con carga diferida y miniaturas solo cuando hay varias fotos. Conserva cambio de color, cantidad, formulario y controles existentes.
- Configuradas y releídas en Shopify nueve imágenes: blanco cuatro ángulos (tres cuartos, frontal, lateral y reclinada con reposapiés); cinco colores con una imagen cada uno. Restaurada imagen nativa de blanco y textos alternativos descriptivos. Producto 15464341471469 continúa DRAFT; SKU, precios e inventario preservados.
- 24/24 pruebas aprobadas, incluyendo selección de ángulo, cambio de color sin mezclar fotos y conservación de cantidad/contacto. Validación nativa Shopify del snippet sin hallazgos. Vistas y ZIP regenerados. `lint`/`build` del manifiesto React no disponibles porque faltan tsc/vite en la instalación existente; no se modificó esa aplicación ni sus dependencias.
- Guía de mantenimiento actualizada en `docs/product-detail.md`. Commit `063e0be` enviado a `main`, sincronizado y comprobado en Shopify (tema 188927803629): cuatro ángulos blancos y cambio de los seis colores sin mezclar fotos; consola sin errores. Sheet del catálogo actualizado y releído en 16 celdas. Producto continúa en borrador; pendientes confirmación de precios actuales, unidad de venta y disponibilidad.


## 22/10/2026 — Corrección móvil SPC sincronizada y comprobada en Shopify

- El usuario no veía la corrección en la tienda: se confirmó que solo estaba en archivos locales, mientras el tema activo seguía sirviendo los tres CSS anteriores.
- Registrados los 13 archivos pendientes de la corrección y documentación en `95c644f` (`fix(spc): conservar proporciones del mockup en movil`); push a `origin/main` completado. La integración GitHub de Shopify actualizó el tema `WEB-DECOKASA-2026-ALFIN/main`, id 188927803629, role main.
- Producto público comprobado: https://decokasaperu.myshopify.com/products/piso-spc . Los tres CSS publicados tienen las mismas reglas CSSOM que los archivos locales; las diferencias de texto de dos archivos son normalización de Shopify. Desaparecieron las redistribuciones móviles anteriores.
- 50 cajas presentes verificadas respecto al mapa, con coordenadas relativas a cada sección, a 320/393/1080 px: error máximo 0,1035 px normalizado, sin desbordamiento horizontal, imágenes completas y sin errores JavaScript. Calculadora 20 m²: 11 cajas con cortes y 10 sin cortes; selección Caoba funcional. Captura móvil revisada.
- Cinco entradas del mapa no aparecen en Shopify por la configuración prevista de testimonios/sellos; no se publicaron opiniones ni certificaciones de muestra. Pendientes catálogo/variantes y contenido comercial real.
- Evidencia local: `work/shopify-spc-before.json`, `work/shopify-spc-verification.json` y `work/shopify-spc-mobile-full.png` en el chat `2026-10-21/este-mokup-es-para-la-pagina-4`. No hubo cambios adicionales en código de tema durante la verificación del despliegue.


## 22/10/2026 — Corrección de proporciones móviles de toda la landing SPC

- Fusión previa confirmada en `main`, HEAD `e594fbf`; trabajo continuado allí por petición del usuario. Se identificó que el mapa proporcional estaba limitado a anchos desde 701 px y las reglas móviles reorganizaban la página.
- Aplicado el mismo lienzo 1080 × 6491 en todos los anchos. Retiradas redistribuciones de 800/700/540 px; escalados texto, imágenes, botones, bordes y sombras. Modificados los tres CSS SPC, generador y modo del JSON; vistas y ZIP sincronizados. Liquid/HTML/JavaScript funcional sin cambios.
- Verificación de 55 cajas en 12 anchos de 320 a 1440 px: máximo 0,1094 px normalizado frente al mapa; sin desbordamiento. Comparación de escritorio 1080 px contra HEAD: estilos calculados y captura idénticos. Esto comprueba continuidad del escritorio y geometría del mapa, no igualdad píxel a píxel con el PSD.
- 22/22 pruebas; Theme Check sin hallazgos; ocho vistas/enlaces/IDs/JSON válidos; ZIP de 74 archivos. Calculadora, rechazo de entradas, colores y enlaces comprobados en navegador; pruebas móviles adicionales 320/390/600/700. Imágenes completas y sin errores JavaScript.
- Entrega local actualizada en `outputs/DECOKASA-SPC-landing` del chat `2026-10-21/este-mokup-es-para-la-pagina-4`: vista, mapa, JSON, capturas y validación. URL local: http://127.0.0.1:8817/?revision=movil-proporcional . Cambios sin commit/push/despliegue; pendientes revisión comercial y configuración con catálogo real.


## 22/10/2026 — Vista previa local restablecida

- El puerto 8817 no tenía servidor activo; los archivos de la landing seguían disponibles. Reiniciado el servidor HTTP local en 127.0.0.1:8817 desde outputs/DECOKASA-SPC-landing del chat del 21/10.
- Comprobación en navegador: HTTP 200, 28 imágenes cargadas, 3 hojas de estilo, sin solicitudes fallidas ni errores JavaScript. Vista de 1080 px con altura 6528 px. Sin cambios de diseño ni despliegue.


## 21/10/2026 — Mapa de proporciones aplicado a toda la landing SPC

- Alcance confirmado por el usuario: toda la landing. Registradas 8 secciones y 47 cajas de posición sobre el lienzo de 1080 × 6491 px, con coordenadas absolutas y porcentajes por sección/página en `docs/landing-spc-layout.json`. Fuente: inventario de capas y previsualización conservados de LANDING SPC_MOCK.psd; el original de Downloads no estuvo disponible en esta etapa.
- `scripts/generate_spc_layout.cjs` deriva porcentajes y `assets/landing-piso-spc-layout.css` de las cajas en píxeles; se ejecuta con `npm run sync:preview`. `landing-piso-spc-proportions.css` escala tipografía y contenido dentro de esas cajas. Composición proporcional desde 701 px, ancho máximo 1080 px; hasta 700 px se conserva la adaptación móvil legible.
- Aplicados posiciones, tamaños, encuadres y solapamientos de portada, introducción, beneficios, anatomía, instalación, testimonios, ambiente y cierre. Corregidas ubicación de marca de agua, orientación de las muestras en perspectiva y compensación de transparencia del producto final. Se conservan recursos independientes y texto/controles en código.
- Verificación geométrica: 8 secciones + 47 cajas en anchos 701/768/923/1080/1440, desviación máxima de 0,0761 px normalizada al lienzo frente al mapa. No representa igualdad de píxeles con el PSD; la tipografía y los controles funcionales pueden diferir. Revisión visual completa y móvil realizada.
- Validación: 22/22 pruebas; Theme Check sin hallazgos; ocho vistas, enlaces, IDs y JSON válidos; ZIP actualizado con 74 archivos de tema. Navegador 320/390/768/1080/1440 sin desbordamiento ni errores, imágenes cargadas y calculadora/colores/teclado operativos. Botones y cálculo comprobados además a 320/390/600/700 px.
- Entrega local actualizada: `outputs/DECOKASA-SPC-landing/` del chat `2026-10-21/este-mokup-es-para-la-pagina-4`, con landing, mapa interactivo, JSON, capturas y resumen de validación. Mapa comprobado en cuatro anchos, sus selectores y las 47 entradas. Rama `feature/landing-piso-spc`; cambios previos preservados, sin commit/push/despliegue en esta etapa.


## 21/10/2026 — Corrección de beneficios según referencia del usuario

- Sustituidos los seis iconos aproximados por trazados originales recuperados de los objetos inteligentes del PSD: agua, espuma, persona caminando, tablones con encastre, escoba y rostro de perro. Se guardan como SVG independientes con nombres descriptivos `spc-icono-*.svg`, sin texto ni capturas de interfaz.
- Ajustados encuadre de la sala, título con fondo amarillo redondeado, tamaños/espacios y negritas. Texto de limpieza: «Fácil de limpiar». Adaptación móvil conservada.
- Modificados sección SPC, CSS, snippet de iconos compartido y sincronizador para copiar SVG. Ocho vistas y ZIP regenerados (72 archivos). 22/22 pruebas aprobadas; Theme Check sin observaciones; cinco anchos de 320 a 1440 px sin desbordamiento, imágenes completas, interacciones correctas y cero errores JavaScript. Revisión visual a 923 y 390 px.
- Vista local y capturas de outputs actualizadas. Trabajo local en `feature/landing-piso-spc`; sin commit, push ni despliegue.


## 21/10/2026 — Landing SPC reconstruida con recursos independientes

- Trabajo local en `feature/landing-piso-spc` (base 54af9a1). Se reemplazó la composición basada en capturas por HTML/Liquid, CSS y SVG, con los 21 recursos separados del PSD. Cabecera, producto superpuesto, muestras, beneficios, anatomía, calculadora, testimonios de muestra, ambiente y cierre siguen la composición del mockup y se adaptan a móvil.
- Recursos antiguos y experimentos gráficos retirados de `assets/` y `preview/assets/`, preservados en `docs/references/landing-spc-recortes-anteriores/`; no se incluyen en el ZIP del tema. Nombres descriptivos y originales del paquete conservados.
- Calculadora corregida: área de 0.01 a 100 000 m², cajas completas, 10% opcional para cortes, resultados obsoletos ocultos al editar y consulta WhatsApp con cantidad/color. Se usan título/SKU del producto y rendimiento por metacampo de variante/producto, con respaldo de sección 2.196 m². Los tres colores son referencias visuales, todavía no variantes comerciales. No se muestran precios ficticios.
- Testimonios de muestra y sellos solo se muestran automáticamente en la previsualización local. En Shopify, testimonios mediante bloques editoriales y sellos desactivados por defecto hasta validación. Aislamiento de estilos/cabecera general solo en la plantilla `landing-spc`.
- Corregida la duplicación de metadatos al regenerar las ocho vistas. Validación: 22/22 pruebas aprobadas; Shopify Theme Check sin errores ni advertencias; ocho vistas, enlaces, IDs y JSON válidos; ZIP de 66 archivos regenerado. Navegador Edge: 320, 390, 768, 1080 y 1440 px sin desbordamiento horizontal, imágenes completas y cero errores JavaScript. Cálculo con/sin cortes, rechazo de entradas, color, flechas y teclado comprobados.
- Vista de diseño y capturas finales en los outputs de este chat. Guía: `docs/landing-spc.md`. Pendiente: validación comercial de colores/variantes/testimonios/sellos y revisión en Shopify con catálogo real. Sin commit, push ni despliegue; `main` no modificado.

# Avances y validación


## 21/10/2026 — Adobe y nombres descriptivos de los recursos

El usuario recuerda la integración disponible con Adobe y pide nombrar cada recurso por su contenido real, aunque la capa carezca de nombre útil. Aplicar esta convención en próximas extracciones; evaluar primero las herramientas Adobe pertinentes. En las capacidades expuestas revisadas no se encontró extracción de capas PSD, por lo que se conserva la extracción local ya validada. Se precisaron siete nombres (escenas, cajas con tablones, muestras en perspectiva y despiece), se actualizaron guía, catálogo y manifiesto tanto en entregables como en repositorio, y se regeneró el ZIP. 21 recursos verificados por huella; enlaces comprobados. Código de la landing sin modificar.


## 21/10/2026 — Recursos separados del PSD para landing SPC

- Fuente: `C:\Users\D. Cordova\Downloads\LANDING SPC_MOCK.psd` (1080 × 6491), SHA-256 `22fe04daa860fe33538d8076c8a04ecbaf6510586ecb47b1f23b64b476ad74ed`.
- Rama verificada: `feature/landing-piso-spc`; se conservaron los cambios existentes y no se modificó la implementación Liquid/CSS ni sus recursos actuales.
- Paquete preparado en `docs/references/landing-spc-recursos/`: 21 recursos (2 logotipos PNG, 4 fotografías WebP, 3 productos transparentes WebP, 3 muestras WebP, 1 diagrama transparente WebP, 2 retratos WebP y 6 sellos PNG), con `indice.html`, `LEEME.md` y `manifest.json`.
- Extracción de originales incrustados y máscaras del PSD; sin capturas de interfaz, textos, botones, controles ni iconos genéricos. Logotipos/sellos renderizados desde PDF a 4× para conservar transparencia y degradados sin problemas de recorte SVG.
- Validación: 21/21 imágenes decodificadas, dimensiones y huellas verificadas; transparencia comprobada en marca/productos/diagrama/sellos; enlaces del catálogo y copia en repositorio comprobados; lámina de contacto revisada visualmente. PSD original intacto. No se repitieron pruebas de aplicación porque no cambió código.
- Aclaración frente a notas anteriores: el PSD por sí solo no acredita identidades de los retratos, testimonios reales ni certificaciones. Se entregan como recursos del mockup. Solo hay tres muestras individuales; no inferir un cuarto SKU. Diagrama limitado a 559 × 583 px y tablón isométrico recortado de origen.
- Pendiente de otra etapa: integrar recursos seleccionados en `assets/`, ajustar encuadres y reemplazar referencias actuales siguiendo el LEEME. No se hizo commit, push ni publicación.


## 20/10/2026 — Despliegue a producción y verificación en vivo en Shopify (main)

- Rama principal: `main` (commit `ef55844`).
- Despliegue y verificación en la tienda en vivo (`https://decokasaperu.myshopify.com/products/piso-spc`):
  - Tema activo `188927803629` sincronizado automáticamente por Shopify desde GitHub `main`.
  - Tarjeta de monto estimado a pagar (`.product-estimate-card`) verificada en el HTML en vivo de la tienda.
  - Recursos CDN de Shopify (`product-detail.css` y `product-detail.js`) entregados con HTTP 200 conteniendo los estilos y la lógica de cálculo en tiempo real.
  - Soporte de desglose por unidades o cajas (para pisos PVC/SPC), resumen de solicitud en el formulario de contacto y meta de objetivo/regalo especial.
- Validación técnica: 19 de 19 pruebas unitarias aprobadas (`npm test`) y verificación estática de 8 vistas (`verify_store.py`).


## 19/10/2026 — Mejora de botón de objetivo y modal interactivo de regalo especial

- Rama secundaria: `feature/monto-estimado`.
- Se perfeccionó el botón de objetivo en la cabecera de la meta (`snippets/product-landing.liquid`, `assets/product-detail.css`, `assets/product-detail.js`):
  - Diseño y acabado profesional: se transformó el elemento estático en un botón de acción interactivo (`.reward-badge-action`), con icono de regalo SVG, tipografía nítida, micro-interacción con elevación suave en hover y compresión táctil en click.
  - Apertura de modal explicativo (`<dialog class="reward-modal-dialog">`): describe con claridad las condiciones del beneficio comercial (obsequio de cortesía a partir de S/. 1,000 PEN, sin cupones, confirmado por el asesor comercial en Odoo y válido para todo el catálogo).
  - Estado dinámico de desbloqueo: al alcanzar los S/. 1,000.00 PEN, el botón actualiza su texto a `¡Regalo Desbloqueado! · Ver detalles` con tonalidades esmeralda, borde verde y resplandor festivo.
  - Accesibilidad completa: cierre con tecla Escape, clic en fondo translúcido con desenfoque (`backdrop-filter`) o botón de cierre, atributos ARIA (`aria-haspopup="dialog"`, `aria-expanded`).
  - Optimización táctil de los botones de cantidad (`+`/`-`) y el botón principal de compra (`.product-cta`).
- Validación: 18 de 18 pruebas unitarias y DOM aprobadas (`npm test`), vistas sincronizadas (`npm run sync:preview`).


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
