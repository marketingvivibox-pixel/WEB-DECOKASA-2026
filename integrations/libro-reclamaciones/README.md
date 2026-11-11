# Libro de Reclamaciones DECOKASA

La página del tema y el enlace del pie conducen al formulario de reclamos y quejas. El receptor es un proyecto privado de Apps Script ejecutado con la cuenta de atención; su URL de recepción es pública y se configura en la plantilla. La hoja de seguimiento permanece privada en Google Drive.

El usuario solicitó un mínimo de 45 respuestas obligatorias. El formulario incluye 35 preguntas adicionales con «No sé» y «No aplica», además de los datos principales, fecha de compra, número de pedido y número de comprobante. Si el comprobante está a nombre de otra persona, también pide el nombre o razón social y el documento de su titular. Por indicación expresa del usuario, el teléfono es obligatorio. Departamento, provincia, distrito y dirección son obligatorios cuando se elige recibir la respuesta por carta. Es necesario que el contador o asesor legal revise el riesgo de que esta extensión y la exigencia del teléfono dificulten presentar una reclamación; Indecopi ha señalado que no se debe condicionar su registro al número telefónico.

## Operación

- Los datos de compra y, cuando corresponde, los del titular se guardan al final de la hoja (columnas AA a AE) y se incluyen en la constancia y en los avisos. Los identificadores se almacenan como texto para conservar ceros iniciales.
- Los nombres, apellidos, tipo de documento, departamento, provincia, distrito y dirección de la versión 3 del formulario se guardan por separado en las columnas AF a AL y se incluyen en la constancia y los avisos. Las listas de ubicación incluyen una opción para indicar un lugar que no figure.
- Cada envío válido se registra con un correlativo. El cliente puede imprimir la constancia; cuando indica correo, se intenta enviar una copia. Se remite una ficha al buzón de atención y se reintentan los mensajes pendientes cada hora.
- Laiz Guerrero revisa el correo y la hoja privada, da seguimiento, registra la respuesta y conserva la evidencia. El plazo legal informado por Indecopi es de 15 días hábiles improrrogables; confirmar los detalles aplicables con el contador.
- Los registros de prueba se identifican como PRUEBA y no representan reclamaciones reales. Revisar estados de envío y fallos en la hoja; una aceptación por Google no garantiza entrega al destinatario.
- El envío desde la cuenta de atención es provisional: al cambiar el dominio deben corregirse y comprobarse SPF, DKIM y DMARC. Existe un recordatorio para el viernes 13/11/2026 a las 10:00, hora de Lima.
- Mantener restringido el acceso a la hoja; el receptor admite solicitudes públicas y debe vigilarse ante abuso. El libro no sustituye un posible trámite ante Indecopi. Confirmar con el contador si corresponde SIREC.

El archivo `Code.gs` es la versión fuente guardada para mantenimiento. Los cambios locales no se activan en Google hasta copiarlos al proyecto y actualizar la implementación existente. No colocar claves ni contraseñas en este repositorio.
