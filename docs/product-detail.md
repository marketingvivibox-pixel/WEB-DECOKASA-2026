# Administrar la ficha de producto

La plantilla predeterminada utiliza los productos nativos de Shopify. Presenta galería con miniaturas, marca, título, precio, variantes, cantidad y solicitud de atención. En celular, la galería aparece encima de los datos.

## Trabajo habitual del equipo

1. En **Productos**, abre el producto y edita título, marca/proveedor, fotos, descripción y opciones de variante. Cada variante mantiene su precio, precio de comparación, SKU e imagen. El orden de las fotos determina las miniaturas.
2. En **Tienda online > Temas > Editar tema**, abre **Productos > Producto predeterminado > Ficha de producto**. Puedes elegir imagen cuadrada o vertical, encajar o cubrir, mostrar marca/SKU/precio/descripción y cambiar el texto del botón y la nota del precio.
3. Añade hasta seis bloques **Información** para contenido compartido por la plantilla, por ejemplo instrucciones o cuidados. La descripción propia de cada producto se administra en Productos; los bloques de plantilla se comparten entre los productos que la usan. Para contenido distinto por producto, conecta una fuente dinámica compatible o utiliza su descripción.

Los colores nativos de Shopify se muestran como muestras cuando la opción dispone de ellas. En otros casos se usa una miniatura disponible o el nombre de la opción. Los cambios de presentación actualizan precio, SKU e imagen y conservan cantidad y datos escritos en la solicitud. Una combinación inexistente impide solicitar hasta elegir una combinación válida. Sin JavaScript, los enlaces de variantes siguen siendo navegables.

## Varias fotos de un mismo color

En **Productos > producto > variante > Metacampos > Galería de la variante**, selecciona las imágenes del color en el orden deseado. La primera será la principal y las demás aparecerán como miniaturas. Los archivos se pueden subir en Multimedia del producto y seleccionar después en este campo. La imagen nativa de la variante se conserva para tarjetas y otros usos de Shopify.

El campo `decokasa.gallery_images` es una lista ordenada de archivos de imagen de la variante. Al cambiar de color se reemplaza la galería completa. Con una sola foto no se muestran miniaturas redundantes; sin este campo se conserva la galería general del producto, por compatibilidad. Para filtrar por color hay que asignar el campo a cada variante.

Titan 919B: blanco tiene cuatro vistas (tres cuartos, frontal, lateral y reclinada con reposapiés); azul, gris, negro, rojo y verde tienen una foto cada uno. No se deduce el color a partir del nombre del archivo. El producto continúa en borrador.

## Combinar colores en una solicitud

En productos con variantes y sin calculadora por cobertura, el cliente elige un color y su cantidad, pulsa **Agregar a mi solicitud** y repite con los otros colores. **Tu solicitud** conserva una línea por variante, con cantidad editable, botones de aumentar/disminuir, subtotal y **Quitar**. Agregar de nuevo el mismo color suma unidades a esa línea.

El total y la meta de regalo suman las líneas agregadas usando el precio propio de cada variante. **Solicitar compra** abre el formulario con todos los colores, cantidades y SKU; requiere al menos una línea. Cambiar de color conserva la lista y los datos escritos, incluso si falla la carga de otra variante. La selección vive únicamente en la página y se pierde al recargarla. El flujo sigue siendo una simulación sin envío ni reserva; no es un carrito de pago.

La calculadora PVC y las landings especiales mantienen su flujo actual. Validación del 26/10/2026: 27 pruebas aprobadas, cuatro archivos de tema validados sin hallazgos, vistas y ZIP regenerados y revisión visual a 320/390 px.

## Meta automática del regalo

La meta de la ficha es **precio de venta unitario más alto del producto × 1.80**, redondeado a céntimos. Incluye todas sus variantes, aunque alguna esté agotada; no utiliza el precio de comparación. En un producto sin variantes se toma su precio único. La meta no cambia al seleccionar otro color/modelo ni al modificar cantidades; cambia el progreso, calculado con el total de la solicitud. Si el producto no tiene un precio positivo, no se muestra la meta.

Ejemplo Titan: precio máximo S/ 300 → meta S/ 540. Blanco ×1 (S/ 279) aporta 52% y faltan S/ 261; blanco ×1 + negro ×1 (S/ 579) desbloquea el regalo. Alcanzar exactamente la meta también califica. La etiqueta, la barra, el importe pendiente y el detalle del regalo comparten la misma referencia. Ya no hay una meta fija editable de S/ 1,000.

Esta regla aplica a la ficha compartida, incluida la que usa la calculadora PVC. No añade una tarjeta nueva a landings especiales que no la utilizan.

## Productos con una landing especial

La ficha estándar es la base. Desarrollo puede crear plantillas alternativas de producto y secciones específicas para cada familia; el equipo las asignará desde el campo **Plantilla del tema** del producto. Se conserva el mismo registro y URL de producto, con sus variantes y datos de Shopify. No es necesario duplicar productos. Las alternativas futuras y sus funciones requieren implementación y revisión propias.

La calculadora PVC existente también utiliza esta ficha. Requiere `decokasa.coverage_m2`, metacampo decimal positivo del producto o de la variante, expresado en m² por caja. La variante tiene prioridad. El resultado redondea hacia arriba a cajas completas y alimenta la cantidad de la solicitud. No inventar rendimientos.

## Estado operativo

La acción principal continúa siendo **Solicitar compra**, atendida por un asesor. El formulario todavía simula; no envía contactos, reserva inventario ni registra ventas. La disponibilidad y el importe final se confirman con el asesor. La captura de referencia orienta la distribución; descuentos por cantidad, puntos, entrega mañana y stock verde requieren reglas comerciales y datos reales antes de incorporarse.

Las ilustraciones y precios ficticios están solo en `preview/`, fuera del tema publicado. La tienda aún espera productos de Odoo. La galería actual admite fotos; otros tipos de medios requieren ampliación. Los estilos y comportamiento específicos de la ficha se cargan únicamente en las páginas que la utilizan. Rendimiento final pendiente de medir con fotos y catálogo reales.

## Validación del 09/10/2026

17 pruebas aprobadas: variantes nativas, combinaciones inexistentes, actualización mediante Shopify, conservación del formulario, navegación alternativa ante fallos y calculadora. Theme Check sin hallazgos. Siete vistas y ZIP de 39 archivos válidos. Navegador: escritorio de 1254 px y móvil de 390/375 px sin desbordamiento; galería, variantes, cantidad y apertura de solicitud comprobadas. La validación con productos reales en Shopify sigue pendiente.
