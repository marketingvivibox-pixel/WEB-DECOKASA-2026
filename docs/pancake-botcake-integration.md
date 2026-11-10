# Compra asistida: verificación y conexión con Pancake

Investigación del 10/11/2026. El usuario confirmó que el WhatsApp comercial +51 914 158 674 está conectado a Pancake y que la cuenta dispone de Botcake. La configuración concreta, los permisos y los resultados en esa cuenta todavía no se han podido comprobar. La web sigue usando una simulación: no envía códigos ni solicitudes, no registra pedidos y no modifica inventario.

## Resultado solicitado

El cliente deberá introducir una dirección completa y confirmar que controla su número mediante un código recibido. Después se necesita transmitir una ficha con los productos, cantidades, datos de contacto y entrega al WhatsApp comercial y llevarla al flujo operativo de Pancake/POS/CRM, con asignación nativa. El código ha de comprobarse realmente; validar el formato del número no verifica su titularidad.

## Verificación de teléfono

[Botcake documenta el envío de códigos por WhatsApp](https://docs.pancake.biz/pancake/st-f8/st-p4/st-s8?lang=vi): el código lo genera el sistema de la tienda y se envía mediante un flujo de Botcake vinculado a una plantilla de autenticación de WhatsApp aprobada. Hay que confirmar que dicha plantilla y flujo existen, que se pueden enviar al número de un contacto nuevo, los identificadores necesarios y las condiciones y costes de la cuenta. La documentación del envío menciona un identificador de cliente; no se debe suponer que acepta cualquier teléfono como identificador sin probarlo.

Se necesita un servicio privado, fuera del tema, que genere y valide el código, aplique caducidad, límites de intentos y reenvíos, evite su reutilización y vincule la verificación al número y a una única presentación de solicitud. Solo el servidor puede decidir que el número se verificó. Debe conservar las credenciales fuera del navegador, repositorio, mensajes y registros. No se ha seleccionado ni configurado ese servicio.

El envío de un código puede generar o actualizar una conversación antes de que llegue la ficha. Es preciso probar con contactos nuevos y recurrentes cuándo se asigna esa conversación y cómo conserva o cambia de asesor. Una marca escrita por el propio cliente en el chat no constituye prueba de verificación: el asesor necesitaría consultar un registro confiable.

## Llegada de la ficha y reparto

1. **Pedido borrador de Shopify a POS.** [Pancake documenta](https://docs.pancake.biz/pos/st-f11/st-p4?lang=en) que puede importar borradores de Shopify cuando la conexión, los permisos y la sincronización de borradores están habilitados. Un servicio privado tendría que crearlos tras validar el código. Queda por probar si el borrador importado entra en las reglas de asignación nativas, cómo se vincula al chat y al CRM, el mapeo de la dirección y productos, el efecto sobre inventario y la prevención de duplicados. No se ha comprobado que el borrador carezca de efectos sobre existencias en POS.
2. **Solicitud por WhatsApp y automatización desde la conversación.** Pancake dispone de [automatizaciones de pedidos](https://docs.pancake.biz/pos/st-f4/st-p2/st-s1?lang=en). Falta verificar su compatibilidad con este canal y cuenta, el reconocimiento de productos, la captura íntegra de la dirección, la deduplicación, el estado del pedido y su impacto en stock.

[POS permite asignar pedidos por turnos](https://docs.pancake.biz/pos/st-f4/st-p2/st-s7?lang=en); otras reglas pueden tener prioridad. La asignación de la conversación y la del pedido son mecanismos distintos, y no se debe afirmar que quedan enlazados o repartidos hasta probar el recorrido completo en la cuenta. Hay que comprobar también los horarios, los asesores elegibles y qué ocurre con clientes existentes.

La documentación de [conexión de Shopify con POS](https://docs.pancake.biz/pos/st-f2/st-p4/st-s2/st-ss1?lang=en) indica que los pedidos de Shopify importados a POS descuentan existencias del almacén vinculado. La regla vigente de Decokasa es que una solicitud no modifica inventario y el cierre se realiza en Odoo. Por ello, no se debe activar la importación de pedidos ordinarios ni sincronizar precios o inventario como atajo sin resolver explícitamente ese efecto.

Un enlace de WhatsApp abre el chat, pero el cliente aún debe enviar el mensaje. Para respetar el contrato de privacidad, no se deben insertar dirección, teléfono ni otros datos personales en la URL. Son opciones por verificar una ficha copiada para que el cliente la pegue en el chat, o una referencia sin datos personales respaldada por un registro privado; ninguna está activa. También debe evitarse presentar la solicitud como una compra confirmada.

## Acceso y puesta en marcha

El conector disponible de Pancake es de solo lectura y no cuenta con el token necesario. El acceso al panel POS mostró una solicitud de autorización que todavía no se ha aceptado. Se necesita acceso adecuado a la cuenta y un entorno privado para el servicio, sin publicar credenciales ni pedirlas por el chat. Confirmar la plantilla de autenticación, el flujo, identificadores, condiciones del plan y los permisos mínimos antes de implementar y probar el envío real.

Las pruebas finales deberán cubrir código correcto, erróneo, caducado y reutilizado; límites de envío; cambio de número; sesión abandonada; envío fallido y reintento sin duplicados; datos de entrega completos; clientes nuevos y recurrentes; conversación y pedido en el mismo asesor; y ausencia de cambios de stock y precios. Solo entonces se podrá retirar la identificación de simulación.
