# DECOKASA — instrucciones del repositorio

## Regla inamovible: un único tema Shopify

Decisión expresa del usuario, 05/11/2026. Tema oficial registrado: **WEB-DECOKASA-2026-ALFIN/main**, ID **188927803629**.

- No crear, duplicar ni subir temas nuevos a Shopify; tampoco reutilizar o publicar temas paralelos como alternativa al oficial.
- Los productos y sus landings personalizadas se integran mediante plantillas y recursos dentro del tema oficial existente.
- «Crear un producto», «crear una landing» o «publicar el resultado» no autoriza otro tema. Solo una petición explícita del usuario para ese tema concreto puede cambiar esta regla.
- Las pruebas se realizan en una rama secundaria del repositorio y con vista previa local; nunca en borradores, temas de desarrollo o versiones de prueba en Shopify. No conectar la rama de pruebas a otro tema ni usar vistas previas que creen un tema remoto.
- Flujo: rama secundaria → pruebas locales → integración en main → actualización del tema oficial existente, respetando las autorizaciones y restricciones vigentes.
- Canal verificado el 05/11/2026: enviar main con `git push origin main` desde el clon autenticado; Shopify sincroniza esa rama con el tema oficial. Confirmar después los archivos y la URL pública. Una limitación funcional de un conector no demuestra un bloqueo general de publicación; nunca eludir un rechazo real de aprobación.
- Comprobar el tema de destino antes de cualquier cambio remoto.
- Si una herramienta bloquea el cambio, conservar el trabajo local y explicar el bloqueo y el paso concreto necesario; nunca resolverlo creando o reutilizando otro tema ni eludiendo la restricción.
- Esta regla prevalece sobre cualquier plan anterior de publicar borradores paralelos.

Leer primero `docs/project-context.md`, `docs/progress.md` y `README.md`. Las decisiones vigentes prevalecen sobre los antecedentes en `docs/planning/`.

Mantener la ficha dentro de su landing y el acceso desde catálogo por marca/categoría. Calculadora PVC exclusivamente en landing interna. Operación Perú/PEN; versión inicial sin pasarelas: formulario, atención del asesor y cierre en Odoo. Una solicitud no afecta inventario.

La base 0.1.0 usa formulario de simulación y datos ficticios. Distinguir demostración de integraciones operativas. No incorporar secretos ni contactos personales. Validar catálogo, precios e identificadores en el futuro receptor; GA4 nunca recibe datos personales ni compras basadas solo en formularios.

Código de tema: `assets/`, `config/`, `layout/`, `locales/`, `sections/`, `snippets/`, `templates/`. Documentar avances confirmados en `docs/progress.md` y decisiones nuevas en `docs/project-context.md`. Actualizar vistas y paquete si cambia el tema. Ejecutar las verificaciones pertinentes antes de dar cambios por concluidos.

Los backends existentes de Meta/TikTok son de solo lectura. Para consultas sobre bases publicitarias revisar primero la carpeta Drive `18fQUpb1ZMC7jKO-nenhJFXmbQo1Oyr1W`; no modificar scripts ni iniciar sesión en esas redes para recuperar datos.

## Libro de Reclamaciones

El índice, la copia fechada y el procedimiento de recuperación están en `integrations/libro-reclamaciones/README.md`. Ante cambios del tema, conservar sus componentes y enlaces, ejecutar `npm ci --prefix integrations/libro-reclamaciones/pruebas --ignore-scripts` y `npm run test:libro`, revisar el resultado antes de integrar y comprobar la página publicada. Si el cambio afecta al libro deliberadamente, probarlo y actualizar una nueva copia fechada y su manifiesto sin borrar la referencia anterior. La comprobación de GitHub no bloquea por sí sola cambios directos en `main` o Shopify. No subir registros, datos personales ni claves al repositorio público.
