# DECOKASA · Recursos de la landing Piso SPC

Extraídos de `LANDING SPC_MOCK.psd` el 21/10/2026. **21 recursos**, separados por función y con nombres únicos. Abrir `indice.html` para verlos. `manifest.json` registra la capa de origen, dimensiones, método de extracción y huellas de los archivos.

## Carpetas y uso

| Carpeta | Recursos | Uso |
| --- | --- | --- |
| `01-marca` | 2 PNG transparentes | Símbolo DK y logotipo Decokasa Premium. Reutilizar el símbolo como marca de agua mediante CSS. |
| `02-ambientes` | 4 WebP | Fondo del hero, ambiente de beneficios, ambiente terminado y fotografía de instalación. |
| `03-producto` | 3 WebP transparentes | Caja y tablones del hero, caja y tablón del cierre, tablones en perspectiva. |
| `04-muestras` | 3 WebP | Muestras SPC-001-B, SPC-019-B y SPC-007-B, conservando los códigos de las capas. |
| `05-diagrama` | 1 WebP transparente | Despiece multicapa sin etiquetas ni líneas de interfaz. |
| `06-retratos-mockup` | 2 WebP | Retratos cuadrados; círculo y borde se construyen con CSS. |
| `07-sellos-mockup` | 6 PNG transparentes | EPH, ILAC-MRA, ANAB, DAkkS, FloorScore y CNAS, separados. |

Los WebP de producto, muestras y diagrama se guardan sin pérdida. Las fotos usan calidad 90. Los logotipos y sellos se renderizan del vector a 4×. No hay imágenes agrandadas artificialmente ni contenido generado.

## Correspondencia con la implementación actual

La rama revisada es `feature/landing-piso-spc`. Estos archivos **todavía no están conectados a la sección Liquid**. Están preparados en `docs/references/landing-spc-recursos/`; al integrarlos, copiar solamente los recursos elegidos a `assets/` y referenciarlos con `asset_url`. No subir esta documentación como contenido de la landing.

| Referencia actual | Recurso nuevo |
| --- | --- |
| `spc_hero_banner.jpg` | `02-ambientes/spc-sala-comedor-piso-madera-hero.webp` como fondo; contenido del hero en HTML. |
| `spc_hero_packshot_clean.jpg` | `03-producto/spc-caja-tres-tablones-verticales.webp` |
| `spc_benefits_bg.jpg` | `02-ambientes/spc-sala-divan-piso-gris-beneficios.webp` + superposición oscura CSS |
| `spc_showcase_room.jpg` | `02-ambientes/spc-sala-sofa-gris-piso-madera.webp` |
| `spc_installation.jpg` | `02-ambientes/spc-instalacion-click.webp` |
| `spc_diagonal_box_footer.jpg` | `03-producto/spc-caja-tablon-diagonal.webp` |
| `spc_isometric_planks_left.jpg` | `03-producto/spc-cuatro-muestras-perspectiva.webp` |
| `spc_diagram_exploded.jpg` | `05-diagrama/spc-despiece-capas-piso.webp` |
| `spc_carousel_swatches.jpg` | Las tres imágenes de `04-muestras/` como elementos independientes del selector. |
| `spc_avatar_elena.jpg`, `spc_avatar_raul.jpg` | Retratos de `06-retratos-mockup/`; los nombres de persona no están acreditados por los archivos. |

Esta tabla propone equivalencias visuales, no sustituciones automáticas: los nuevos recursos tienen transparencia y encuadres distintos de los recortes JPG actuales. Revisar `object-fit`, tamaño y posición al integrarlos. Mantener las dimensiones o la proporción para evitar saltos de diseño. Cargar de forma diferida las imágenes fuera de la primera pantalla.

## Construir con código

Se excluyeron títulos, párrafos, precios, especificaciones, testimonios escritos, botones, formularios, calculadora, tarjetas, flechas, estrellas, checks, iconos genéricos de beneficios/redes/WhatsApp, círculos, bordes, sombras y degradados de interfaz. Deben ser HTML/CSS o iconos SVG del sistema del sitio.

No se incluyen capturas completas de secciones ni imágenes con esos elementos superpuestos. El texto impreso en las cajas se conserva como parte de la fotografía del producto. No se incluyen fuentes tipográficas, archivos de Photoshop, capas ocultas ni duplicados de exportación que puedan confundirse con recursos finales.

## Detalles de la fuente que deben respetarse

- **Hero:** el original vertical ya tiene desenfoque y oscurecimiento en el piso. **Instalación:** la capa disponible ya está oscurecida. No se intentó inventar versiones más claras.
- **Beneficios:** se recuperó el original claro incrustado; reproducir el oscurecimiento con CSS.
- **Productos:** se recortó únicamente el espacio transparente. En el producto del cierre se aplicó la máscara original y se retiraron residuos ajenos a las dos piezas visibles.
- **Tablones en perspectiva:** el tablón gris llega cortado al borde derecho en el original. **Diagrama multicapa:** también está recortado por la derecha y dispone de aproximadamente 559 × 583 píxeles; evitar mostrarlo mayor que su resolución nativa. No se reconstruyeron los bordes.
- **Muestras:** el PSD aporta tres imágenes individuales. No deducir un cuarto SKU ni inventar nombres comerciales a partir de los tablones agrupados.
- **Marca:** el logotipo original tiene letras gris oscuro y PREMIUM dorado; no asumir que es una versión blanca. Los PNG conservan la transparencia y los degradados del original, evitando incompatibilidades de recorte en la exportación SVG.
- **Retratos y sellos:** proceden de la maqueta. El PSD no verifica identidades, testimonios ni certificaciones del producto. Deben tratarse como recursos del mockup hasta confirmar esos usos.

El PSD original, el código de la landing y los cambios que ya estaban en curso se conservaron. No se realizó publicación ni commit.

## Convención de nombres

Los nombres describen el objeto o escena comprobados visualmente; la sección de destino es un dato complementario. Nombres genéricos como `Capa 13`, `Capa 18` o `Objeto inteligente vectorial` se conservan solo en el manifiesto para localizar el origen. La integración con Adobe debe considerarse cuando ofrezca la operación requerida; esta extracción se realizó localmente sobre las capas y sus originales incrustados.
