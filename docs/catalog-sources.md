# Fuentes del catálogo: SKU, imágenes y precios

Registradas y consultadas el **05/11/2026**, por indicación del usuario. Son fuentes originales de **solo lectura**: no modificar celdas, imágenes, fórmulas, estructura ni permisos; tampoco convertirlas o reemplazarlas. Consultar los originales cuando se necesiten datos vigentes. Este índice guarda referencias, no una copia del catálogo ni una sincronización con Shopify.

## 1. SKU y referencias visuales

- **Documento:** `20_Lista_de_productos_de_pauta_con_imagenes.xlsx`.
- **Enlace:** [Lista de productos con SKU e imágenes](https://docs.google.com/spreadsheets/d/168VY-d5YYd3VqwHhvtnHIPzKnJ_g9Tp1/edit?gid=1422187063#gid=1422187063).
- **ID:** `168VY-d5YYd3VqwHhvtnHIPzKnJ_g9Tp1`; pestaña indicada por el usuario: `gid=1422187063`.
- **Uso:** identificar modelos disponibles de piso PVC y principales productos de la tienda, sus nombres en pauta/Odoo, SKU y miniaturas de referencia.
- **Columnas verificadas:** `Nombre Producto en Pauta`, `Nombre Producto Odoo`, `Sku`, `Imagen`, `Colores`.
- La lectura textual recuperó 228 registros de productos, incluidos **31 de PISO PVC**. No equivale a una validación de cantidades de inventario.
- Las imágenes embebidas no aparecen en la extracción textual: su existencia como referencia fue indicada por el usuario; el cruce visual de cada acabado sigue pendiente. No deducir un acabado solo por su parecido o por un código abreviado.
- Conservar SKU como texto, incluidos ceros iniciales, guiones y demás caracteres. No sustituirlos por códigos de diseño.

## 2. Precios vigentes

- **Documento:** `ESCALA DE PRECIO - ACTUALIZADA`.
- **Enlace:** [Escala de precios actualizada](https://docs.google.com/spreadsheets/d/1FCYUJLGpAZ3I2qcok2lyHfS4bz3iDols/edit?gid=645245379#gid=645245379).
- **ID:** `1FCYUJLGpAZ3I2qcok2lyHfS4bz3iDols`; pestaña indicada por el usuario: `gid=645245379`.
- **Uso:** consultar los precios actuales por producto, presentación y cantidad. El usuario identifica este archivo como su referencia vigente.
- La lectura muestra escalas por cantidad y familias PVC **FD** y **HM**, además de columnas de **ESCALA ANTERIOR** y **COMISION**. Distinguirlas antes de elegir un precio: la escala anterior no es el precio vigente y la comisión no es el importe de venta al cliente.
- Antes de trasladar un importe a Shopify, comprobar familia/modelo, unidad de venta y tramo de cantidad. Si no hay correspondencia inequívoca, registrar el caso pendiente en el documento de trabajo y consultar al usuario.

## Acceso y aplicación al proyecto

Ambos enlaces se abren en Google Sheets, pero Drive identifica los originales como archivos Excel (`application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`). Se verificaron mediante metadatos y lectura del contenido, sin conversión. La extracción no resuelve los nombres de las pestañas; los `gid` anteriores se conservan exactamente como fueron compartidos.

El [Sheet de trabajo para fichas y variantes](https://docs.google.com/spreadsheets/d/1-LGE4HZnFAEaJbEM_VBQnbWNnC5224v_CYO08GWgfTg/edit) mantiene su función de registrar acuerdos y revisiones autorizados por el usuario. Es distinto de estas dos fuentes protegidas; no se reemplaza ni se actualiza por registrar estos enlaces.

Para la [landing PVC](landing-pvc.md), el usuario confirmó conservar **los 20 acabados del mockup**, aunque la fuente contiene 31 modelos. Después de la indexación, y por petición expresa de actualizar la ficha, se guardaron los 20 SKU y el precio base FD de S/ 99 en sus 17 variantes. Los códigos 7172-4, 7172-8 y 7195-8 se vinculan a sus modelos LQ del catálogo; falta confirmar la tarifa LQ, que no puede deducirse de la escala HM. Descripción con presentación y escala FD por cantidad actualizada. Aplicación y comprobación documentadas en [pvc-product-data.json](pvc-product-data.json).

No se modificaron los originales, las existencias ni el número de variantes. El cotejo visual de miniaturas sigue pendiente. La tabla de cantidad en la descripción sirve para cotizar con el asesor; no configura descuentos automáticos. Producto todavía en borrador, pendiente de incorporar su landing al tema activo.
