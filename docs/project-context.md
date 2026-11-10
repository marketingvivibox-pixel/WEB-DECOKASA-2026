## Libro de Reclamaciones — 10/11/2026

Se prepara una página de Shopify con 45 respuestas obligatorias por indicación expresa del usuario. El proveedor es Check Azul S.A.C. (RUC 20610129871), domicilio Av. José Leal n.º 375, Lima, Lima, Lima; responsable Laiz Guerrero. El receptor privado de la cuenta de atención registró pruebas numeradas y se confirmó la llegada de ambas copias. La versión 3 conserva los ceros iniciales de documentos y teléfonos, comprobado con la prueba LR-2026-000004. El correo automático es provisional hasta corregir SPF, DKIM y DMARC al cambiar el dominio. Detalle operativo: `integrations/libro-reclamaciones/README.md`.
## 10/11/2026 — Acceso al correo de atención

La opción de correo del menú «Atención al cliente» muestra la dirección **atencion.decokasa@checkazul.com.pe** y permite abrir un mensaje en Gmail, Outlook u otra aplicación de correo. También permite copiar la dirección cuando el navegador ofrece esta función. Así se dispone de alternativas si no hay una aplicación de correo predeterminada; Gmail y Outlook pueden solicitar el inicio de sesión. El acceso a WhatsApp del CRM se conserva.

## 10/11/2026 — Contacto de atención y CRM de Decokasa

Por indicación del usuario, el WhatsApp de atención y consultas de Decokasa pasa al CRM **+51 914 158 674** (`51914158674` en enlaces internacionales). El acceso «Atención al cliente» de la cabecera ofrece escribir al correo confirmado **atencion.decokasa@checkazul.com.pe** o abrir WhatsApp. El enlace de «Cómo comprar» conserva su destino. Se actualizan también el botón de inicio, la ayuda del catálogo y las landings PVC/SPC; los campos editables existentes se mantienen. Preparado para integrar a GitHub/main en el único tema oficial 188927803629.

## 09/11/2026 — PVC: acceso móvil persistente a la calculadora

La landing PVC incorpora el botón móvil «Realizar pedido» con el mismo criterio de SPC: aparece con cualquier desplazamiento positivo y se oculta en el inicio, mientras se utiliza la calculadora o se abre el catálogo. Se presenta hasta 767 px, con el estilo amarillo de la landing, espacio inferior y respeto al área segura. Al pulsarlo desplaza suavemente y enfoca la calculadora; con movimiento reducido el desplazamiento es inmediato. Los eventos se limpian al descargar la sección en Shopify. Escritorio, datos comerciales y barra de vista previa permanecen sin cambios.

Validación local a 320/393/1440 px, 59 pruebas correctas y Theme Check oficial sin hallazgos. Vistas y ZIP regenerados; publicación por GitHub/main en el único tema oficial MAIN 188927803629.

## 09/11/2026 — SPC: acceso persistente desde el primer scroll

El botón móvil «Realizar pedido» se muestra desde cualquier desplazamiento positivo de la página. Ya no depende de abandonar la portada. Conserva su diseño, la navegación suave a la calculadora y el respeto a movimiento reducido; se oculta al volver al inicio, mientras la calculadora está en su zona activa o si el formulario está abierto. El escritorio no incorpora este botón móvil.

## 09/11/2026 — Colores en tarjetas de productos

Las tarjetas de catálogo, inicio y búsqueda incorporan selección automática cuando una ficha habitual tiene varias variantes en una opción Shopify llamada «Color», «Colores» o «Colour». No se mantiene una lista de productos: también funciona con productos creados después. Se usan las muestras de Shopify si existen, una correspondencia para colores comunes y el nombre como texto para el resto. Cada elección actualiza la foto vinculada, la disponibilidad y los enlaces a la variante; sin JavaScript, la muestra abre la variante. Si no hay foto de variante, se identifica la foto general como referencial o se indica la falta de imagen. Las fichas con destino personalizado conservan su enlace y no muestran selector. Los precios siguen como «Precio a consultar».

Probado con combinaciones de color y talla, productos sin imágenes, colores sin disponibilidad y sin opciones de color, y enlaces personalizados. 59/59 pruebas, Theme Check oficial sin hallazgos y revisión local a 320/393/768/1024/1440 px con fotos de la Silla gamer Titan. Publicación por GitHub/main en el tema oficial 188927803629.

## 09/11/2026 — PVC: capas legibles en móvil y carga de imágenes

Por petición del usuario, en pantallas menores de 1024 px se reemplaza el esquema de etiquetas pequeñas por una imagen ampliada con cinco números y conectores cortos. Debajo se utiliza el mismo selector accesible de escritorio, en dos columnas táctiles, con una explicación de la capa elegida. El escritorio conserva su composición. La numeración evita depender solo del color para identificar cada capa.

Las imágenes PVC muestran un fondo neutro animado mientras cargan, manteniendo su geometría. La caché se muestra directamente y los errores retiran el estado pendiente; se contemplan las copias del carrusel y la limpieza del editor Shopify. El brillo se desactiva con movimiento reducido. La carga no tapa textos, botones ni calculadora. Se incorpora la actualización SPC `7e53d62`, sin modificar sus fuentes. Verificación local a 320/393/768/1440 px, 55 pruebas integradas y Theme Check oficial correctos. Publicación mediante GitHub/main en el tema oficial 188927803629.

## 09/11/2026 — SPC: skeletons en móvil y escritorio

Las imágenes de la landing SPC muestran un fondo neutro con brillo suave mientras cargan, manteniendo sus dimensiones y posiciones. La animación solo funciona en elementos visibles y respeta la preferencia de movimiento reducido. Las imágenes listas o almacenadas en caché aparecen directamente, sin demora; los errores de descarga detienen el placeholder. Se contemplan cambios de acabado, imágenes de escritorio/móvil y copias del carrusel. Textos, botones y calculadora siguen disponibles durante la carga. El diseño y los datos comerciales se conservan.

Validación local: 54/54 pruebas, Theme Check oficial sin hallazgos, ocho vistas y paquete de 174 archivos correctos. Prueba con imágenes retenidas a 393 × 852 y 1440 × 1000: sin desbordamiento ni cambios de geometría al cargar; cálculo de 20 m² + 10% correcto mientras las imágenes esperan. Publicación por el flujo GitHub/main en el único tema oficial 188927803629.

## 09/11/2026 — PVC: exploración de las cinco capas

Por petición del usuario, la sección «Cada capa cuenta» adopta desde 1024 px la interacción aprobada en SPC: selector numerado, conector resaltado y explicación de la capa elegida. Los conectores parten del borde de cada control y terminan en puntos de la imagen; el adhesivo se señala por el borde inferior para evitar cruces. Imagen y SVG comparten un marco proporcional. En móvil se mantiene la composición compacta del mockup, con líneas y puntos corregidos. Se admite clic, Tab, flechas, Inicio y Fin; los eventos se limpian al descargar la sección en el editor Shopify. No se modifica el contenido comercial ni el diseño SPC.

## 06/11/2026 — SPC: nota inferior retirada también en móvil

El usuario extiende la retirada de la nota «Imágenes de IA · Textos de muestra. No son reseñas de clientes reales» a móvil. Se elimina el párrafo compartido y sus estilos ya innecesarios. El encabezado «Ejemplos ilustrativos», las etiquetas de las tarjetas y el carrusel permanecen. Comprobado a 393 × 852 px sin desbordamiento, con 18 pruebas SPC correctas y Theme Check sin hallazgos. Vista previa y ZIP actualizados; publicación por GitHub/main en el único tema oficial 188927803629.

## 06/11/2026 — SPC: nota inferior de escritorio retirada

Por petición del usuario se oculta la nota inferior «Imágenes de IA · Textos de muestra. No son reseñas de clientes reales» en escritorio (desde 1024 px). El encabezado y cada tarjeta conservan su identificación como ejemplos ilustrativos. La versión móvil aprobada y el funcionamiento del carrusel se mantienen. Cambio limitado al CSS de escritorio, su copia de vista previa y el paquete del tema.

## 06/11/2026 — PVC: nota inferior retirada

Por petición del usuario se elimina la nota inferior «Contenido ilustrativo del diseño. No son reseñas de clientes reales». Se conserva la identificación de ejemplos ilustrativos en el encabezado y las tarjetas. No cambia el carrusel ni el catálogo.

## 05/11/2026 — PVC: composición de reseñas y orden de capas

La petición posterior del usuario recupera la sección de reseñas del PSD PVC en lugar del carrusel de texturas. Como no se han confirmado opiniones reales autorizadas, los cinco ejemplos del diseño se identifican como ilustrativos en encabezado, tarjetas y nota; no se agregan estrellas, verificación ni datos estructurados de reseñas. El editor admite bloques «Testimonio autorizado», que reemplazan los ejemplos automáticamente. El catálogo conserva sus 20 acabados.

Las láminas decorativas quedan por encima del panel siguiente, con sus bordes y la transición de fondo del mockup. Probado en rama local `codex/pvc-layers-testimonials` y publicado mediante `3c525d3` y `cf0f594` en GitHub/main → tema oficial 188927803629. Sección y plantilla sincronizadas; composición y controles del carrusel verificados en la página pública móvil. El nombre de bloque respeta el máximo Shopify de 25 caracteres. Sin cambios comerciales ni modificaciones del diseño SPC.

## 05/11/2026 — Espesor total del piso SPC

- Ficha técnica corregida por indicación del usuario: «Espesor total: 5,5 mm», incluyendo los 4 mm del piso y 1,5 mm de espuma. Se conserva la espuma como desglose.
- Ajuste de contenido compartido entre móvil y escritorio; sin cambios de estilos, distribución, imágenes ni calculadora.
- Vista previa sincronizada y ZIP regenerado. Theme Check sin hallazgos; ficha revisada en escritorio y móvil 393 × 852 sin desbordamiento. Se conserva el único destino Shopify 188927803629 mediante GitHub/main.

## 05/11/2026 — SPC de escritorio: alcance de la publicación autorizada

El usuario autoriza publicar las mejoras aprobadas exclusivamente en escritorio (desde 1024 px): composición editorial, imágenes WebP, navegación con desplazamiento suave, capas interactivas, selección de acabados, calculadora ampliada y animaciones con respeto a movimiento reducido. La versión móvil aprobada conserva su composición, imágenes, enlaces y generación de la solicitud. El JavaScript compartido restablece esos comportamientos al volver a móvil.

Integración de `codex/spc-desktop` (`86e5919`) sobre la producción `73c2657`, preservando la landing PVC y sus últimas correcciones. Único destino: tema oficial MAIN **188927803629 — WEB-DECOKASA-2026-ALFIN/main**, por sincronización GitHub/main. No se modifican productos, precios, existencias ni configuración comercial. Merge `e8b617e` publicado y verificado el 05/11/2026: los 14 archivos cotejados por MD5 coinciden con Git (nueve actualizados y cinco preservados). La página pública funciona a 1440 × 1000; a 393 × 852 conserva fuentes y geometría de las 49 imágenes visibles, composición principal y tres enlaces WhatsApp. Validación integrada: 49/49 pruebas, Theme Check sin hallazgos, ocho vistas y ZIP de 166 archivos. Calculadora publicada: 20 m² + 10% → 11 cajas / 24.16 m² / S/ 1045; capas y selector Caoba correctos, sin enviar solicitudes.

## 05/11/2026 — Landing PVC publicada mediante el flujo GitHub de SPC

Envío completado desde el clon autenticado: `git push origin main`, de `46c3ab6` a `a61758a6bc1f14db6a1a69ccf7b012b64c58af6f`. Shopify sincronizó los 49 cambios de tema en **188927803629 — WEB-DECOKASA-2026-ALFIN/main**; todos se confirmaron por API. El producto conserva `templateSuffix: landing-pvc` y carga su landing en https://decokasaperu.myshopify.com/products/piso-pvc.

Comprobados escritorio y móvil 393 × 852, catálogo de 20 acabados, FD802, cálculo de 20 m² + 10% → 5 cajas / 25 m², S/ 495 estimados y enlace WhatsApp con SKU correcto. La variante 7172-4 con tarifa pendiente oculta el importe; permite consulta. Sin desbordamiento ni imágenes cargadas rotas; no se enviaron mensajes ni se cambiaron datos de producto. La propuesta SPC de la rama secundaria continúa aparte.

Corrección del diagnóstico anterior: la restricción funcional del conector Shopify y el 403 del conector GitHub no demostraban una prohibición global de publicar por el flujo habitual autorizado. No hubo rechazo de aprobación del envío a main. En adelante usar el flujo comprobado y verificar Shopify; nunca eludir un rechazo real ni crear temas alternativos.

## 05/11/2026 — Contexto depurado

Retiradas por petición del usuario las referencias y registros del tema eliminado. Código, recursos y ramas de trabajo conservados; único destino Shopify: el tema oficial existente.

## 05/11/2026 — Producto PVC publicado en Tienda online

Por instrucción explícita del usuario se activó el producto existente **Piso PVC autoadhesivo (15506629263597)** y se publicó en **Tienda online (221215064301)**. Lectura posterior de Shopify: **ACTIVE**, `publishedOnPublication: true`, URL pública **https://decokasaperu.myshopify.com/products/piso-pvc** y plantilla asignada `landing-pvc`. Se conservaron las 20 variantes, los SKU, los precios y las **10 000 cajas por SKU / 200 000 totales**. No se modificaron otros canales, temas ni fuentes comerciales.

La ficha y la landing están publicadas y verificadas en el tema oficial **188927803629 — WEB-DECOKASA-2026-ALFIN/main**. El envío de main desde `46c3ab6` a `a61758a` activó la sincronización nativa de Shopify; se releyeron los 49 archivos y se comprobó la URL pública en escritorio y móvil. Catálogo de 20 acabados, cálculo y enlace WhatsApp correctos; 7172-4 oculta el importe pendiente. Siguen pendientes las tres tarifas LQ y el cotejo de miniaturas. Esta entrada sustituye los estados históricos de DRAFT/no publicado y landing pendiente.

## 05/11/2026 — Regla definitiva: trabajar en el único tema oficial

Tema oficial único: **WEB-DECOKASA-2026-ALFIN/main**, ID **188927803629**. Productos y landings se integran en ese tema. Pruebas exclusivamente en rama secundaria y vista previa local; después, integración en main y actualización del tema oficial mediante un procedimiento permitido. No crear, duplicar ni reutilizar otros temas sin una petición explícita para ese tema concreto; no eludir bloqueos. Regla permanente en AGENTS.md.

## 05/11/2026 — Marcas propias y proveedor de las fichas

Confirmación del usuario: Xion y DECOKASA son marcas propias; la empresa opera como fabricante/importador. El campo Proveedor de Shopify representa aquí la marca comercial: Silla gamer Titan (`15464341471469`) = `Xion`; Piso SPC (`15442304925933`) = `DECOKASA`. Ambos valores sustituyen «Mi tienda» y quedaron verificados mediante lectura posterior. No se deduce país de fabricación ni fabricante concreto por SKU. Se conservaron estado ACTIVE, variantes, SKU, precios, inventario, fotos, etiquetas y descripción. Esta corrección no modifica PVC, el tema ni las fuentes comerciales de solo lectura.

La decisión está también registrada en el catálogo editable `Decokasa_Catalogo_hibrido_revision`: Titan en `Fichas!I13` y `L13`; marca SPC en `Fichas!L25:L41` y `L127:L128`. Se conservaron el historial, las fórmulas y los estados de revisión pendientes.


## 05/11/2026 — Ficha PVC actualizada con datos comerciales

El usuario confirma conservar únicamente los 20 acabados del mockup. Actualizado y releído el producto Shopify `15506629263597`: 20 SKU cotejados por código con el catálogo, 17 variantes FD a S/ 99 por caja de 36 planchas / 5 m², y descripción con presentación, instalación, atención y escala FD por cantidad. Tarifas por caja: 1–2 a S/ 99; 3–5 a S/ 92; 6–11 a S/ 85; 12–19 a S/ 78; 20–49 a S/ 71; desde 50 a S/ 65. La escala es informativa para cotización con asesor; no se implementaron descuentos automáticos ni cambios a la calculadora.

Pendiente confirmar el precio de 7172-4, 7172-8 y 7195-8 (familia LQ en la fuente); no equiparar LQ a HM. Esas tres variantes conservan el cero administrativo provisional, no un precio comercial. Existencias sin verificar ni modificar. Producto todavía DRAFT; falta incorporar y comprobar la landing en el tema activo antes de publicar. Originales de Drive intactos y de solo lectura. Auditoría de SKU, IDs, precios, descripción y pendientes: `docs/pvc-product-data.json` del repositorio. Sin cambios de código, temas, commit ni push; trabajo concurrente SPC preservado.


## 05/11/2026 — Fuentes de catálogo de solo lectura

El usuario incorpora dos fuentes originales: lista de productos con SKU y miniaturas (`168VY-d5YYd3VqwHhvtnHIPzKnJ_g9Tp1`, gid `1422187063`) y precios actuales (`1FCYUJLGpAZ3I2qcok2lyHfS4bz3iDols`, gid `645245379`). **Solo consultar; no modificar ni convertir estos documentos ni cambiar sus permisos.** Enlaces, alcance y reglas en [catalog-sources.md](catalog-sources.md).

Estas fuentes no reemplazan el Sheet de trabajo para acuerdos de fichas/variantes. El listado tiene 31 registros PVC; el usuario confirmó conservar los 20 acabados del mockup y sus SKU ya fueron conciliados. Pendientes el cotejo visual de miniaturas y la tarifa LQ. La tabla contiene escala anterior y comisiones, que no deben confundirse con el precio vigente al cliente. La indexación original no aplicó datos; la actualización posterior de Shopify consta en la entrada superior.


## 05/11/2026 — Producto PVC con landing dentro del tema principal

Destino: tema activo `188927803629`, WEB-DECOKASA-2026-ALFIN/main. Producto **Piso PVC autoadhesivo** (`15506629263597`, handle `piso-pvc`), plantilla `landing-pvc`, 20 variantes Acabado; 36 planchas / 5 m² por caja. Los 20 SKU y los 17 precios FD están cargados; pendientes los tres precios LQ y las existencias comerciales. El usuario autoriza mostrarlo para consultas por WhatsApp, con «Consultar» y sin checkout, después de verificar su plantilla en el tema activo; hasta entonces permanece DRAFT.

Landing integrada localmente con SPC en `3e7b29d`, sin push. Incluye recursos separados del PSD, catálogo, calculadora compacta animada y galería de inspiración con características verificables. Guía vigente: [docs/landing-pvc.md](landing-pvc.md). Pendiente incorporación al tema activo por un procedimiento permitido y publicación del producto. La revisión automática rechazó escrituras en MAIN; no eludirla mediante CLI, navegador o push.


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


## 27/10/2026 — Calculadora y testimonios: comportamiento vigente

La calculadora completa permanece visible dentro de la página, con ambientes/croquis y área directa, sin modal de cálculo ni resumen rápido. Su altura se adapta al contenido en todos los anchos; es una excepción intencional al mapa PSD para conservar la herramienta anterior y su legibilidad móvil. Mantener controles y acciones en flujo normal. La solicitud conserva su único dialog nativo. Testimonios siempre tiene sección visible: sin bloques reales muestra aviso de próximas experiencias y enlace al asesor; con bloques autorizados muestra carrusel. No publicar nombres/comentarios de muestra sin confirmar. La vista local predeterminada refleja el template; SPC_DESIGN_PREVIEW=1 permite muestras explícitas. Esta entrada reemplaza la descripción anterior de calculadora avanzada en diálogo.


## 27/10/2026 — Integración vigente del rediseño SPC

La integración incorpora main 2357831 y conserva la geometría PSD 1080 × 10004 (71 anclajes). El botón móvil usa data-spc-sticky-cta y las secciones v2; debe ocultarse al llegar a la calculadora y con diálogos abiertos. Mantener un único inicializador de solicitud y dialog nativo, con foco recuperado al acceso visible cuando procede de la calculadora avanzada. Usar precio real de la opción seleccionada; cero válido y datos inválidos/ausentes como importe por confirmar, sin respaldos monetarios fijos. Conservar ambos accesos del mockup. Formulario continúa simulado y cobertura comercial configurada sin cambios. El informe de integración sustituye el ensayo previo sin merge.


## 27/10/2026 — Capas visibles y referencias para la integración

Bloque de cinco capas sobre calculadora (z-index 2 frente a 1); tarjetas Click en 3. Filas móviles de 40 unidades con alineación flex y nota y=5995 en el mapa proporcional. No aumentar el recorte para ocultar el error. Main local comprobado en 23578318ee5509696abe2414037d06727573f9a9; producción conserva activos SPC de b70e0b2. Rediseño local en feature/spc-diseno-octubre, sin fusión. Resolver manualmente cinco archivos y adaptar controles al DOM v2; conservar composición del PSD y formulario explícitamente simulado. Informe en docs/landing-spc-merge-compatibility.md.


## 27/10/2026 — Geometría de resultados y envíos

Mapa vigente: 71 cajas sobre 1080 × 10004. Encabezado resultados x150/y8365/780×116; franja x0/y8599/1080×60; tarjeta x312/y8545/458×660; foto x343/y8638/398×451; título envío x245/y9246/590×40, texto x210/y9280/660×80 y nota x300/y9365/480×26. La foto usa el recorte de máscara PSD250; almacén combina solo capas fotográficas/sombras 3/4/6/7. Cabecera y acciones sociales, franja y banderas se construyen en código. Contador 15.328 solo en diseño; leyenda pública sin contador. Mantener estas proporciones compartidas entre móvil y escritorio.


## 27/10/2026 — Carrusel de testimonios

Geometría vigente: 68 cajas. Sección x=0/y=6839/1080×963; panel x=62/y=6886/956×916; tarjetas 224×581 con separación 22 y radio 46, escaladas por ancho del lienzo en móvil/escritorio. Fondo spc-2026-testimonios-fondo.webp 1080×1018 (y=6784–7802) combina solo fotografías/decoración PSD; no incluye textos ni tarjetas. Carrusel continuo a 24 unidades PSD/s, deslizamiento táctil, teclado, pausa y movimiento reducido; copias inertes y ocultas a lectores. Una tarjeta se centra; dos o más llenan el bucle. Mantener política de muestras solo en vista de diseño y testimonios públicos desde bloques autorizados. Campo opcional headline para frase destacada. Corrección local pendiente de revisión del usuario, sin publicar.


## 27/10/2026 — Geometría del bloque Click

El mapa vigente tiene 67 cajas. Fondo Click: x=0, y=4567, 1080 × 889, radio 44,5 unidades; título Click! en Raleway cursiva 251,6115, caja x=−47/y=4643. Instalador por encima del panel superior; borde dorado del tablón desde el trazado original como SVG independiente. Cinco tarjetas de 157–158 × 191, radio 44,5, x=120/294/468/642/816 e y=5353; el panel siguiente comienza en y=5392 detrás de ellas. Mantener textos y tarjetas en código y escalar todas las medidas con el ancho del lienzo, también en móvil. Corrección local pendiente de revisión del usuario.


## 27/10/2026 — Fidelidad del bloque de composición actualizado

El mapa vigente del PSD es 1080 × 10004 (docs/landing-spc-layout.json). La imagen sala-composicion combina únicamente fotografía, retoque de pared enmascarado y sombreado del suelo originales (capas 138/140/141). El texto SPC se construye con Raleway cursiva de 310,125 unidades, peso 400 y tracking −0,03em; nombre a la izquierda, fórmula en negrita y nota blanca. Mantener separados los niños/mascota y todos los textos, sin sustituir el bloque por una captura. Corrección actual en feature/spc-diseno-octubre, aún local.


## 26/10/2026 — Meta del regalo según el producto

Decisión del usuario: reemplazar la meta fija por el precio unitario más alto del producto multiplicado por 1.80 (80% adicional). Se usa `product.price_max`, sin precio de comparación ni filtro de disponibilidad, redondeado al céntimo. Cambiar color/modelo o cantidad conserva la meta; el total de las líneas controla el progreso. Titan: máximo S/ 300, meta S/ 540. Regla común a todas las fichas que incluyen la tarjeta de regalo; productos sin precio positivo no la muestran. No cambia el catálogo ni activa envío de solicitudes.


## 26/10/2026 — Galerías de fotos por variante

La ficha predeterminada admite el metacampo PRODUCTVARIANT `decokasa.gallery_images`, lista ordenada de archivos limitada a imágenes y editable como **Galería de la variante**. Usa el identificador del medio, no el de su preview_image, para enlazar paneles y miniaturas. La primera imagen es principal; al cambiar de variante se sustituye la galería completa mediante la actualización de sección existente. Sin el metacampo se conserva product.images. No requiere etiquetas de color en los archivos ni cambios de código para incorporar más ángulos.

Aplicado al borrador Silla gamer Titan / 919B: cuatro fotos de blanco y una por cada otro color. Se conservan los seis SKU 01 acordados, los SKU 03 solo como referencias en el Sheet y los precios/inventario existentes. El usuario está incorporando manualmente productos principales mientras sigue pendiente la aprobación de Odoo de pruebas. El Sheet de revisión continúa como registro de acuerdos. No se publica el producto ni se habilita recepción real de solicitudes.


## 22/10/2026 — SPC móvil proporcional y continuidad en main

El usuario confirmó que el mockup de 1080 × 6491 px fue pensado para móvil y pidió conservar su distribución también en teléfonos. La composición completa usa una única escala según el ancho del lienzo, con máximo de 1080 px; se eliminó el cambio de distribución hasta 700 px. El JSON de geometría continúa siendo la fuente de posiciones y tamaños. Imágenes, SVG, textos y controles siguen siendo elementos independientes.

La rama SPC se fusionó en `e594fbf`; por instrucción expresa, los ajustes continúan en `main`. La corrección móvil se registró y envió a GitHub en `95c644f` el 22/10/2026. Shopify sincronizó el tema activo `WEB-DECOKASA-2026-ALFIN/main` (188927803629); se comprobó el producto `/products/piso-spc` en móvil y escritorio, con los tres CSS equivalentes al código local. La vista previa y el ZIP contienen la misma corrección.


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

Decisión del 26/10/2026: los productos con varias presentaciones y sin calculadora de cobertura permiten combinar variantes en una misma solicitud. Cada variante conserva su SKU, precio y cantidad; total y regalo se calculan sobre la lista agregada. Cambiar la presentación visible no reemplaza las líneas. El formulario sigue en simulación y la lista vive solo en memoria, sin checkout, reservas, persistencia de contactos ni conexión Odoo.

Catálogo y fotos reales; configuración PEN y rutas; autoridad de precios y promociones; URL/permisos Odoo; SKU, variantes, unidades, almacenes y operación de cierre; receptor seguro de solicitudes, CRM, consentimiento y medición; pruebas de duplicados, fallos y conciliación antes del lanzamiento comercial. Portada revisada visualmente en Shopify en escritorio y celular el 06/10/2026.

Los backends existentes de Meta/TikTok son de solo lectura. Consultas sobre sus bases publicitarias parten de la carpeta de Drive `18fQUpb1ZMC7jKO-nenhJFXmbQo1Oyr1W`; no iniciar sesión en redes para buscar esos datos ni modificar sus scripts.

### Precisión visual SPC — 21/10/2026

Para los seis beneficios se usan los trazados originales del PSD, exportados como `spc-icono-*.svg`, en lugar de aproximaciones genéricas. La segunda captura entregada por el usuario es la referencia de esta corrección: persona caminando, tablones con encastre y rostro de perro, con texto y distribución editables en HTML/CSS.

### Distribución proporcional de toda la landing SPC — 21/10/2026

Por petición expresa del usuario, el mapa abarca toda la landing. La fuente editable de geometría es `docs/landing-spc-layout.json`: lienzo 1080 × 6491, ocho secciones, 47 cajas absolutas con referencia a las capas. El generador deriva porcentajes y CSS; editar las cajas en píxeles y ejecutar `npm run sync:preview`, sin retocar manualmente el CSS generado. Los porcentajes verticales de los elementos son relativos a su sección, y también se conservan porcentajes respecto de la página completa. Las superposiciones y recortes permiten valores negativos o mayores de 100%.

Desde la corrección del 22/10/2026, la composición escala con el lienzo en todos los anchos, hasta 1080 px; móvil conserva la misma distribución. Se verificó concordancia de las cajas con el mapa en 12 anchos de 320 a 1440 px; no se promete identidad rasterizada de tipografía con el PSD. El mapa de revisión usa la previsualización conservada como referencia, nunca como fondo sustitutivo de la landing. Siguen vigentes las restricciones comerciales de testimonios, sellos y correspondencia entre colores y variantes.


### Revisión SPC del PSD actualizado — 27/10/2026

Esta revisión sustituye la geometría anterior de 1080 × 6491: el PSD actual tiene 1080 × 10004, once secciones y 66 cajas. La fuente editable continúa siendo `docs/landing-spc-layout.json`; ejecutar `node scripts/sync_preview.cjs` para regenerar CSS y vistas. `docs/landing-spc-assets-20261027.json` registra la fuente, huella SHA-256 y recursos exportados. Fotos/recortes separados en `spc-2026-*.webp`; textos, trazados y controles editables en código, sin usar capturas de secciones. Raleway local bajo OFL; la tipografía Godshine del hero se aproxima con Raleway.

El mismo lienzo proporcional se aplica de 320 a 1080 px y se centra a anchos mayores. Los diálogos de calculadora/solicitud conservan tipografía legible de 16 px y controles táctiles propios, independientes del escalado del arte. La calculadora rápida y avanzada comparten cobertura; soporta ambientes, dimensiones, cortes y transferencia de cantidad a solicitud. El formulario sigue simulado y no transmite datos.

Se preserva la prioridad de `decokasa.coverage_m2` de variante, luego producto y después configuración de sección. No cambiar automáticamente el respaldo 2,196 a los 2,24 m² del nuevo PSD: confirmar presentación/rendimiento con negocio. Las especificaciones del PSD describen una presentación, sin modificar SKU, precio o inventario. Las tres muestras de tonos son referencias visuales y enlazan al catálogo; no inventan variantes.

`spc_design_preview` es false por defecto y se activa solo en la muestra local para revisar la composición completa. No activar en una tienda pública: incluye retratos, opiniones y sellos de muestra identificados como pendientes. `show_certifications` permanece false hasta validar los sellos; testimonios en Shopify solo desde bloques reales con contenido autorizado. Al omitir bloques condicionales, el flujo se compacta.

Desarrollo aislado en `feature/spc-diseno-octubre` (base main b70e0b2), ruta Documents/Codex/2026-10-21/este-mokup-es-para-la-pagina-4/work/spc-redesign/theme. No fusionado, confirmado en Git ni enviado a Shopify en esta tarea. Checkout principal con calculadora avanzada y cambios pendientes preservado.
