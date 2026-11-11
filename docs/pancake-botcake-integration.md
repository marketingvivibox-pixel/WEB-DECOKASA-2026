# Compra asistida: verificación y conexión con Pancake

## Situación comprobada

- El destino temporal elegido por el usuario para las solicitudes de compra es el WhatsApp **+51 914 158 397**. Está conectado a la tienda de Pancake POS con el logo rojo, identificada como `1636129454`. El número **+51 914 158 674** continúa como destino general de atención al cliente.
- La página de Pancake del 397 tiene configurada la asignación de conversaciones por turnos entre siete integrantes. Esta configuración no demuestra por sí sola cómo se asignará una solicitud nueva ni cómo se tratará a un contacto existente; se debe probar. La asignación automática de pedidos en POS está desactivada y es independiente del reparto de conversaciones.
- En la página de Pancake está activada la creación automática de pedidos en POS cuando los mensajes contienen números de teléfono. La automatización de POS incluye el canal de WhatsApp y exige teléfono. Antes de enviar fichas reales hay que comprobar su efecto y evitar que la solicitud cree pedidos o afecte inventario, de acuerdo con el contrato del proyecto. No se modificó esta configuración compartida.
- En Botcake se creó y aprobó la plantilla de autenticación `verificacion_decokasa`, ID `4563456277233141`. Presenta un código con botón para copiarlo e informa de una caducidad de cinco minutos. El aviso de caducidad no sustituye su comprobación en un servicio privado.
- Se preparó y guardó el flujo independiente [Verificación Decokasa](https://botcake.io/waba_1474651969056962/flows/453474934/flow_preview), ID `453474934`, para el canal `waba_1474651969056962`. El cuerpo y el botón de la plantilla usan la variable `{{code}}`. No se configuró un disparador automático ni se enviaron mensajes de prueba.
- El formulario de la web sigue en modo de demostración: no envía códigos, no verifica teléfonos y no transmite fichas. Conservar esa indicación hasta que toda la ruta esté implementada y probada.

## Alojamiento elegido: proyecto Firebase creado

Con autorización del usuario se aceptaron las condiciones de Firebase y se creó **Decokasa Solicitudes**, identificador `decokasa-solicitudes`, en la cuenta `atencion.decokasa@checkazul.com.pe`. La consola confirmó el proyecto y el plan gratuito Spark. Todavía no se han configurado ni desplegado servicios para el formulario.

Crear un proyecto en el plan Spark no requiere medio de pago. La opción prevista de Cloud Functions para generar y comprobar códigos necesita el plan Blaze de pago por uso y una cuenta de facturación; tiene cuotas gratuitas y pueden existir otros cargos. No se ha activado facturación ni se ha desplegado ningún servicio. Antes de contratar o vincular facturación debe explicarse y autorizarse el gasto. Consultar [planes de Firebase](https://firebase.google.com/docs/projects/billing/firebase-pricing-plans) y [precios](https://firebase.google.com/pricing/). Los envíos por WhatsApp pueden tener cargos separados.

## Verificación de teléfono pendiente

La [documentación de Botcake para códigos OTP](https://docs.pancake.biz/pancake/st-f8/st-p4/st-s8?lang=vi) describe el uso de una plantilla y un flujo. La [API de Botcake](https://docs.pancake.biz/botcake/st-f7/st-p2?lang=en) documenta el envío de flujos a un identificador de cliente de la página. Aún se debe comprobar cómo iniciar el envío a un número que nunca haya escrito al canal y si el servicio o la cuenta imponen costes o requisitos adicionales.

Una respuesta exitosa de la API no demuestra por sí sola que WhatsApp haya entregado el código: también hay que comprobar el estado real de entrega o fallo, como indican las [novedades de Botcake](https://docs.pancake.biz/botcake/st-f9/st-p1?lang=en). El [emulador local de Firebase](https://firebase.google.com/docs/functions/faq-and-troubleshooting) permite desarrollar y probar partes de la solución sin vincular una cuenta de facturación, pero no acredita la entrega real ni el comportamiento del reparto en Pancake.

Firebase Authentication ofrece como alternativa el envío de códigos por SMS. Requiere facturación, puede generar cargos por SMS y precisa consentimiento informado, reCAPTCHA, autorización del dominio y una política de regiones; las tarifas se deben comprobar al momento de la configuración. Esta opción no se ha elegido ni activado y tampoco resuelve por sí sola la entrega de la ficha a Pancake. Fuentes: [verificación telefónica en la web](https://firebase.google.com/docs/auth/web/phone-auth), [precios de Identity Platform](https://cloud.google.com/identity-platform/pricing) y [preguntas frecuentes de Firebase Authentication](https://firebase.google.com/docs/auth/faq-and-troubleshooting).

Hace falta elegir e implementar un servicio privado que genere el código con aleatoriedad segura, lo vincule al teléfono y la solicitud, compruebe su caducidad real de cinco minutos y limite intentos, reenvíos y abuso. Debe impedir reutilizaciones, proteger las credenciales en el servidor, tratar fallos de entrega y evitar exponer datos personales en URLs, analítica o registros. Ningún token se generó ni se registró durante esta investigación.

El proyecto tiene un Apps Script para el Libro de Reclamaciones, pero no se ha elegido como alojamiento de esta conexión ni se ha evaluado su idoneidad para la verificación y protección contra abuso.

## Entrega de la ficha y reparto

La ficha consolidada debe llegar al equipo asociado al 397 y conservar la verificación del teléfono, sin poner datos personales en enlaces públicos. Todavía se debe diseñar y probar una entrega privada compatible con una conversación de WhatsApp iniciada por el cliente y con la asignación nativa de Pancake. Un enlace de WhatsApp solo abre el chat; el cliente debe enviar el mensaje. Entre las posibilidades que requieren prueba están copiar la ficha para que el cliente la pegue o enviar una referencia sin datos personales respaldada por un registro privado. Ninguna está implementada. No se ha establecido que la API de Botcake pueda abrir por sí sola esa conversación para cualquier número nuevo.

El envío del código podría generar o actualizar una conversación antes de la ficha. Es preciso probar cuándo se asigna y qué sucede con contactos que ya tienen asesor. Una marca escrita por el cliente no acredita que el teléfono se haya verificado: el resultado debe poder consultarse en un registro confiable. La [asignación de pedidos](https://docs.pancake.biz/pos/st-f4/st-p2/st-s7?lang=en) es distinta de la asignación de conversaciones.

La [API pública de Pancake](https://developer.pancake.biz/) documenta la creación de una nota de texto para un cliente identificado y, en determinados eventos, el [webhook](https://developer.pancake.biz/webhook) incluye identificadores de conversación y cliente. Podría estudiarse una nota para entregar los datos al equipo sin incluirlos en el enlace de WhatsApp, pero la documentación consultada no demuestra todavía su visibilidad y permisos, la vinculación segura con el teléfono verificado, la asignación, ni su efecto sobre las automatizaciones. Una referencia nunca debe permitir por sí sola consultar datos personales. Tampoco se ha comprobado cómo autenticar los eventos entrantes. Esta opción no está implementada ni probada.

Pancake indica que activar el webhook de una página consume una conexión adicional de la suscripción; hay que verificar la disponibilidad y el coste antes de activarlo. El servicio receptor también debe responder con rapidez, tolerar eventos repetidos y vigilar errores, ya que Pancake puede suspender el webhook si acumula fallos. No se ha activado ninguno. La API documenta credenciales en parámetros de URL: cualquier integración debe mantenerlas en el servidor y evitar registrarlas o exponerlas. Regenerar una credencial de página invalida la anterior y podría afectar otras integraciones; no se ha generado ni cambiado ninguna.

El contrato de la solicitud prohíbe crear pedidos o reservas y modificar inventario. No usar la importación de pedidos de Shopify como sustituto: la [documentación de Pancake POS](https://docs.pancake.biz/pos/st-f2/st-p4/st-s2/st-ss1?lang=en) indica que la conexión de pedidos puede afectar existencias. Se debe resolver la automatización existente antes de activar una ruta real, sin alterar otras operaciones sin comprobar sus consecuencias.

## Validaciones pendientes

1. Configurar los servicios de Firebase; evaluar y autorizar la facturación y los permisos necesarios sin exponer credenciales. El proyecto ya existe en Spark.
2. Comprobar, con un número autorizado, el primer contacto, la entrega del código y el tratamiento de errores.
3. Implementar la comprobación real y probar códigos correctos, erróneos, caducados y reutilizados, cambios de teléfono, límites de intentos, reenvíos y protección de datos.
4. Probar la entrega de la ficha y el reparto para contactos nuevos y existentes, incluyendo sesiones abandonadas, fallos y reintentos sin duplicados.
5. Verificar que no se creen pedidos ni se modifique inventario; solo después retirar el modo de demostración.
