# Libro de Reclamaciones DECOKASA

Esta es la carpeta central para ubicar, mantener y recuperar el Libro de Reclamaciones. La [página pública](https://decokasaperu.myshopify.com/pages/libro-de-reclamaciones) funciona en el tema oficial de Shopify; el registro y el envío de correos funcionan en Google con la cuenta de Atención. La actualización del tema no actualiza el programa de Google.

## Índice

- [Programa de Google Apps Script](Code.gs): fuente conservada en GitHub. El [proyecto activo de Apps Script](https://script.google.com/home/projects/1BQrynaUnEZfCa4hf43guj3DBJ3vvfcej4NSLWw3ppoOPD-b6hRWKmQPy/edit) requiere ingresar con la cuenta de Atención.
- [Copia del 11 de noviembre de 2026](respaldo-2026-11-11/): contiene una copia de las piezas específicas del tema, el programa y el archivo de distribución general a modo de referencia. Corresponde al código de la revisión `c74f5b73465b01ebd3feb1061a652b67a136afb3`; fuente de Apps Script correspondiente a la implementación 6. Los siete archivos del tema se compararon con el tema oficial activo y coincidieron sus huellas el 11/11/2026.
- [Manifiesto e integridad](manifiesto-respaldo.json): relaciona cada archivo original y su copia con su huella SHA-256; los finales de línea se normalizan antes de compararlos.
- [Verificador de cambios](verificar-respaldo.cjs) y [pruebas funcionales simuladas](../../tests/libro-reclamaciones.test.cjs).
- Componentes activos del tema: [plantilla](../../templates/page.libro-reclamaciones.json), [sección](../../sections/libro-reclamaciones.liquid), [estilos](../../assets/libro-reclamaciones.css), [formulario](../../assets/libro-reclamaciones.js), [listas de ubicación](../../assets/libro-ubigeo.js) y [enlace del pie](../../snippets/book-link.liquid). El [archivo general del tema](../../layout/theme.liquid) incluye ese enlace.

Shopify requiere que los archivos activos del tema permanezcan en sus carpetas propias. Por eso esta carpeta los **copia y señala**, sin moverlos. Está excluida del paquete del tema por `.shopifyignore`.

## Funcionamiento y datos que deben conservarse

1. El cliente presenta una hoja en la web. El receptor público de Apps Script valida los datos, asigna un correlativo y registra la ficha en una hoja privada de la cuenta `atencion.decokasa@checkazul.com.pe`.
2. El cliente puede imprimir su constancia; si indica correo, se intenta enviarle una copia. Se envía una ficha al correo de Atención mediante `MailApp` de Google y el activador `reenviarPendientes` reintenta avisos pendientes cada hora. La aceptación por Google no garantiza la entrega final.
3. Laiz Guerrero revisa la bandeja y la hoja, atiende el caso y conserva las evidencias. El teléfono es opcional; la ubicación y la dirección son obligatorias si se solicita respuesta por carta. Ante la extensión y los campos obligatorios, mantener la revisión del contador o asesor legal sobre el acceso del consumidor.

El proyecto Google y la hoja son recursos externos a GitHub. La cuenta, los permisos, la implementación pública y su URL, las propiedades privadas del proyecto —en especial el identificador de la hoja y el siguiente correlativo—, el activador horario, el historial de casos y la configuración del correo **no se respaldan automáticamente en GitHub**. Su acceso debe mantenerse restringido. El repositorio es público: nunca subir hojas de reclamaciones, datos personales, contraseñas ni claves.

El 11/11/2026 se hizo una copia puntual de la hoja en el Drive privado de Atención, llamada `RESPALDO privado - Libro de Reclamaciones DECOKASA - 2026-11-11`. Las fichas posteriores no se copian solas: realizar copias periódicas privadas y comprobarlas. Una copia de la hoja no recupera por sí sola el programa, sus permisos ni el correlativo del proyecto.

## Antes de cambiar el tema

1. Trabajar en una rama secundaria sobre el único tema oficial `WEB-DECOKASA-2026-ALFIN/main` (`188927803629`); no crear temas paralelos. Mantener la asignación de la plantilla `page.libro-reclamaciones` a la página en Shopify.
2. Ejecutar `npm ci --prefix integrations/libro-reclamaciones/pruebas --ignore-scripts` y `npm run test:libro`. La primera parte simula el formulario y el receptor; la segunda comprueba la integridad de la copia, compara las piezas específicas del libro con el respaldo y revisa los puntos de enlace del tema. Las dependencias de estas pruebas están aisladas de las de la tienda.
3. La comprobación también está definida en GitHub Actions para cada push o pull request. Una alerta de GitHub no bloquea por sí sola un cambio directo a `main` ni una edición en Shopify: revisar el resultado antes de integrar y verificar la página publicada. Las pruebas simuladas no aseguran la entrega real de correos ni detectan todos los cambios de aspecto o configuración externa.
4. Si el cambio es deliberado y afecta al libro, revisar su funcionamiento, crear una nueva copia fechada, actualizar el manifiesto con las huellas correspondientes y conservar las copias anteriores. No borrar la referencia por el solo hecho de que una prueba falle.

## Recuperación

1. Identificar qué parte falló y conservar los registros existentes. Comparar primero los archivos activos con la copia fechada y el historial de GitHub. Restaurar únicamente las piezas específicas afectadas en sus rutas originales mediante una rama; no reemplazar todo el tema.
2. `layout/theme.liquid` también está guardado como referencia, pero contiene otras partes de la tienda: **no reemplazarlo completo**. Si falta el acceso, reponer únicamente el `render` de `book-link` y verificar la condición que evita mostrar en el libro el aviso general de simulación.
3. Si el problema está en Google, revisar la cuenta de Atención y el [proyecto activo](https://script.google.com/home/projects/1BQrynaUnEZfCa4hf43guj3DBJ3vvfcej4NSLWw3ppoOPD-b6hRWKmQPy/edit). Para recuperar el código, comparar con `Code.gs` o la copia fechada y actualizar la implementación existente tras la revisión. Confirmar que la URL configurada en la plantilla siga apuntando al servicio correcto. Guardar código en GitHub no publica una versión en Google.
4. Antes de configurar o desplegar, conservar y verificar la hoja real, sus permisos y las propiedades del proyecto, en especial `BOOK_SPREADSHEET_ID` y `BOOK_NEXT_NUMBER`, y el activador `reenviarPendientes`. No ejecutar `configurarLibro()` a ciegas: si falta el identificador, crea una hoja nueva y reinicia el correlativo. Una copia de la hoja no debe reemplazar la hoja real sin revisar continuidad y acceso.
5. Ejecutar las pruebas, verificar la página publicada y coordinar una prueba de extremo a extremo identificada como prueba, comprobando registro y llegada de correos. No eliminar ni modificar reclamaciones reales durante la revisión.

El envío desde la cuenta de Atención sigue siendo provisional: al cambiar el dominio se deben corregir y comprobar SPF, DKIM y DMARC. Ya se observó que algunos correos de prueba podían llegar a spam. El receptor es público y debe vigilarse ante intentos de abuso.
