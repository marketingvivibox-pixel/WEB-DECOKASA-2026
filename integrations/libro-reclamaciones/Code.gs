/* Libro de Reclamaciones DECOKASA. Datos y configuración quedan en Google, no en Git. */
const BOOK = Object.freeze({
  internalEmail: 'atencion.decokasa@checkazul.com.pe',
  responsible: 'Laiz Guerrero',
  provider: 'Check Azul S.A.C.',
  ruc: '20610129871',
  fiscalAddress: 'Av. José Leal n.º 375, Lima, Lima, Lima',
  sheetName: 'Reclamaciones',
  timeZone: 'America/Lima',
  additionalQuestions: [
    '¿La compra se realizó en la web de DECOKASA?',
    '¿La compra se realizó por redes sociales?',
    '¿La compra se realizó a través de WhatsApp?',
    '¿La compra se realizó en un establecimiento físico?',
    '¿La compra se realizó por otro canal?',
    '¿Tienes el número de pedido?',
    '¿Tienes un comprobante de pago?',
    '¿El comprobante está a tu nombre?',
    '¿El pago fue realizado en su totalidad?',
    '¿Se acordó una fecha de entrega?',
    '¿La entrega estaba dirigida a domicilio?',
    '¿El pedido fue entregado?',
    '¿El pedido llegó después de la fecha acordada?',
    '¿El pedido se entregó incompleto?',
    '¿El producto es diferente del que solicitaste?',
    '¿El producto presentó daños visibles?',
    '¿El embalaje estaba dañado?',
    '¿El producto presenta una falla de funcionamiento?',
    '¿El inconveniente apareció durante el primer uso?',
    '¿El producto ha sido utilizado?',
    '¿El servicio fue prestado?',
    '¿El servicio se prestó fuera del plazo acordado?',
    '¿El inconveniente se repitió?',
    '¿El problema persiste?',
    '¿Cuentas con fotos o videos de lo ocurrido?',
    '¿Cuentas con documentos adicionales sobre el caso?',
    '¿Te contactaste anteriormente con atención al cliente?',
    '¿Presentaste antes una solicitud por el mismo caso?',
    '¿Recibiste respuesta a tu comunicación anterior?',
    '¿Se te ofreció alguna solución?',
    '¿La solución ofrecida se cumplió?',
    '¿Solicitas un cambio?',
    '¿Solicitas una devolución de dinero?',
    '¿Solicitas una reparación?',
    '¿Solicitas otra solución distinta a las anteriores?'
  ],
  headers: [
    'Nº de hoja', 'Fecha y hora (Lima)', 'Tipo', 'Consumidor', 'Documento',
    'Domicilio', 'Correo', 'Teléfono', 'Menor de edad', 'Padre, madre o apoderado',
    'Bien o servicio', 'Monto reclamado (PEN)', 'Descripción del bien o servicio',
    'Detalle', 'Pedido', 'Medio de respuesta', 'Estado', 'Responsable',
    'Fecha de respuesta', 'Acciones y observaciones', 'Evidencia de respuesta',
    'Copia al consumidor', 'Aviso interno', 'Identificador de solicitud',
    'Huella de solicitud', 'Datos originales JSON'
  ]
});

/* La aplicación y el disparador deben ejecutarse con la cuenta de atención. */
function requireAttentionSender_() {
  const effective = String(Session.getEffectiveUser().getEmail() || '').trim().toLowerCase();
  if (effective !== BOOK.internalEmail.toLowerCase()) {
    throw new Error('El proyecto debe ejecutarse con la cuenta de atención.');
  }
}

/* Envío provisional con la cuenta de Google; requiere corregir DMARC al cambiar el dominio. */
function sendFromAttention_(message) {
  requireAttentionSender_();
  MailApp.sendEmail({
    to: message.to,
    subject: message.subject,
    body: message.body,
    name: 'Atención al Cliente DECOKASA',
    replyTo: BOOK.internalEmail
  });
}

/* Ejecutar una sola vez desde el editor, después de revisar el proyecto y sus permisos. */
function configurarLibro() {
  requireAttentionSender_();
  const properties = PropertiesService.getScriptProperties();
  if (!properties.getProperty('BOOK_SUPPLIER_ADDRESS')) {
    properties.setProperty('BOOK_SUPPLIER_ADDRESS', BOOK.fiscalAddress);
  }
  if (!properties.getProperty('BOOK_RESPONSIBLE')) {
    properties.setProperty('BOOK_RESPONSIBLE', BOOK.responsible);
  }
  if (!properties.getProperty('BOOK_SPREADSHEET_ID')) {
    const spreadsheet = SpreadsheetApp.create('DECOKASA - Libro de Reclamaciones (privado)');
    const sheet = spreadsheet.getSheets()[0];
    sheet.setName(BOOK.sheetName);
    sheet.getRange(1, 1, 1, BOOK.headers.length).setValues([BOOK.headers]);
    sheet.setFrozenRows(1);
    properties.setProperty('BOOK_SPREADSHEET_ID', spreadsheet.getId());
    properties.setProperty('BOOK_NEXT_NUMBER', '1');
    Logger.log('Registro privado: ' + spreadsheet.getUrl());
  }
  if (!ScriptApp.getProjectTriggers().some(t => t.getHandlerFunction() === 'reenviarPendientes')) {
    ScriptApp.newTrigger('reenviarPendientes').timeBased().everyHours(1).create();
  }
}

function doGet() {
  return HtmlService.createHtmlOutput('<!doctype html><html lang="es"><meta charset="utf-8"><title>Libro de Reclamaciones</title><p>Para presentar una reclamación, usa el formulario de la web de DECOKASA.</p></html>');
}

function doPost(e) {
  try {
    requireAttentionSender_();
  } catch (error) {
    return errorPage_('El libro todavía no está disponible. Por favor escríbenos a ' + BOOK.internalEmail + '.');
  }
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(20000)) return errorPage_('No se pudo procesar tu solicitud en este momento. Vuelve a intentarlo.');
  try {
    const p = e && e.parameter ? e.parameter : {};
    if (p.website) return errorPage_('No se pudo procesar tu solicitud.');
    const data = validate_(p);
    const supplierAddress = PropertiesService.getScriptProperties().getProperty('BOOK_SUPPLIER_ADDRESS');
    if (!supplierAddress) throw new Error('El domicilio del proveedor no está configurado.');
    const requestId = String(p.request_id || '').trim();
    if (!/^[a-zA-Z0-9-]{16,80}$/.test(requestId)) throw new Error('No se pudo verificar la solicitud. Regresa al formulario y vuelve a intentarlo.');
    const sheet = getSheet_();
    const digest = digest_(JSON.stringify(data));
    let row = findRequest_(sheet, requestId);
    if (row) {
      if (sheet.getRange(row, 25).getValue() !== digest) throw new Error('La solicitud cambió. Regresa al formulario para enviarla de nuevo.');
    } else {
      const properties = PropertiesService.getScriptProperties();
      const number = Number(properties.getProperty('BOOK_NEXT_NUMBER') || '1');
      if (!Number.isSafeInteger(number) || number < 1) throw new Error('El libro no está configurado correctamente.');
      properties.setProperty('BOOK_NEXT_NUMBER', String(number + 1));
      const now = new Date();
      const registeredAt = Utilities.formatDate(now, BOOK.timeZone, 'dd/MM/yyyy HH:mm:ss');
      const year = Utilities.formatDate(now, BOOK.timeZone, 'yyyy');
      const id = 'LR-' + year + '-' + String(number).padStart(6, '0');
      const values = [id, registeredAt, data.type, data.name, data.document, data.address,
        data.email, data.phone, data.minor, data.guardian, data.itemType, data.amount,
        data.itemDescription, data.details, data.request, data.responseChannel,
        'Pendiente', properties.getProperty('BOOK_RESPONSIBLE') || BOOK.responsible,
        '', '', '', 'Pendiente', 'Pendiente', requestId, digest,
        JSON.stringify(Object.assign({supplierAddress: supplierAddress}, data))];
      sheet.appendRow(values.map(sheetSafe_));
      SpreadsheetApp.flush();
      row = sheet.getLastRow();
      // appendRow can reinterpret identifiers as numbers even in preformatted cells.
      // A leading apostrophe forces text and preserves zeros without evaluating formulas.
      sheet.getRange(row, 5).setNumberFormat('@').setValue("'" + data.document);
      sheet.getRange(row, 8).setNumberFormat('@').setValue("'" + data.phone);
      SpreadsheetApp.flush();
    }
    const stored = sheet.getRange(row, 1, 1, BOOK.headers.length).getValues()[0];
    const originalData = JSON.parse(stored[25]);
    try {
      sendPending_(sheet, row);
      stored[21] = sheet.getRange(row, 22).getValue();
    } catch (error) {
      // The registration is already saved; a mail or status failure must not hide it.
      Logger.log('No se pudo completar el envío de las copias: ' + error.message);
    }
    return receipt_(stored, originalData);
  } catch (error) {
    const known = error && error.message && error.message.startsWith('Por favor') ? error.message :
      error && error.message && error.message.startsWith('La solicitud cambió') ? error.message :
      'No se pudo completar el envío. Vuelve al formulario y reinténtalo. Si el problema continúa, escríbenos a ' + BOOK.internalEmail + '.';
    return errorPage_(known);
  } finally {
    lock.releaseLock();
  }
}

function validate_(p) {
  function field(key, title, max, required) {
    const value = String(p[key] || '').replace(/\r\n?/g, '\n').trim();
    if ((required && !value) || value.length > max || /[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(value)) {
      throw new Error('Por favor revisa el campo «' + title + '».');
    }
    return value;
  }
  function choice(key, title, allowed) {
    const value = field(key, title, 100, true);
    if (!allowed.includes(value)) throw new Error('Por favor selecciona una opción válida en «' + title + '».');
    return value;
  }
  const data = {
    name: field('name', 'nombres y apellidos', 150, true),
    document: field('document', 'documento de identidad', 60, true),
    address: field('address', 'domicilio', 250, false),
    email: field('email', 'correo electrónico', 254, false),
    phone: field('phone', 'teléfono', 40, false),
    minor: choice('minor', 'menor de edad', ['Sí', 'No']),
    guardian: field('guardian', 'padre, madre o apoderado', 150, false),
    itemType: choice('item_type', 'bien o servicio', ['Producto', 'Servicio']),
    amount: field('amount', 'monto reclamado', 20, false),
    itemDescription: field('item_description', 'descripción del bien o servicio', 500, true),
    type: choice('type', 'tipo de reclamación', ['Reclamo', 'Queja']),
    details: field('details', 'detalle', 5000, true),
    request: field('request', 'pedido', 3000, true),
    responseChannel: choice('response_channel', 'medio de respuesta', ['Correo electrónico', 'Carta al domicilio'])
  };
  if (data.minor === 'Sí' && !data.guardian) throw new Error('Por favor indica el nombre del padre, madre o apoderado.');
  if (data.responseChannel === 'Carta al domicilio' && !data.address) throw new Error('Por favor indica el domicilio para recibir la respuesta.');
  if (data.responseChannel === 'Correo electrónico' && !data.email) throw new Error('Por favor indica el correo para recibir la respuesta.');
  if (data.email && (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(data.email) || /[\r\n,;]/.test(data.email))) throw new Error('Por favor revisa el campo «correo electrónico».');
  if (data.amount && !/^\d{1,12}(?:[.,]\d{1,2})?$/.test(data.amount)) throw new Error('Por favor revisa el campo «monto reclamado».');
  data.additional = BOOK.additionalQuestions.map((question, index) => ({
    question: question,
    answer: choice('q_' + (index + 1), question, ['Sí', 'No', 'No sé', 'No aplica'])
  }));
  return data;
}

function getSheet_() {
  const id = PropertiesService.getScriptProperties().getProperty('BOOK_SPREADSHEET_ID');
  if (!id) throw new Error('El libro aún no está configurado.');
  const sheet = SpreadsheetApp.openById(id).getSheetByName(BOOK.sheetName);
  if (!sheet) throw new Error('No se encontró el registro.');
  return sheet;
}

function findRequest_(sheet, requestId) {
  const last = sheet.getLastRow();
  if (last < 2) return 0;
  const values = sheet.getRange(2, 24, last - 1, 1).getValues();
  const index = values.findIndex(row => row[0] === requestId);
  return index < 0 ? 0 : index + 2;
}

/* A leading apostrophe stops Sheets from interpreting customer input as a formula. */
function sheetSafe_(value) {
  return typeof value === 'string' && /^[=+\-@]/.test(value) ? "'" + value : value;
}

function digest_(value) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, value, Utilities.Charset.UTF_8)
    .map(byte => ('0' + (byte & 255).toString(16)).slice(-2)).join('');
}

function sendPending_(sheet, row) {
  const record = sheet.getRange(row, 1, 1, BOOK.headers.length).getValues()[0];
  const data = JSON.parse(record[25]);
  const receipt = receiptText_(record[0], record[1], data);
  if (!data.email && record[21] !== 'No indicado') {
    sheet.getRange(row, 22).setValue('No indicado');
  } else if (data.email && record[21] !== 'Enviado') {
    try {
      sendFromAttention_({to: data.email,
        subject: 'Tu Hoja de Reclamación DECOKASA ' + record[0],
        body: 'Hemos recibido tu solicitud. Conserva esta copia.\n\n' + receipt});
      sheet.getRange(row, 22).setValue('Enviado');
    } catch (error) { sheet.getRange(row, 22).setValue('Pendiente'); }
  }
  if (record[22] !== 'Enviado') {
    try {
      sendFromAttention_({to: BOOK.internalEmail,
        subject: '[LIBRO DE RECLAMACIONES] ' + record[0] + ' - ' + data.type,
        body: 'Se recibió una hoja de reclamación. Asígnala y registra su respuesta y evidencia.\n\n' + receipt});
      sheet.getRange(row, 23).setValue('Enviado');
    } catch (error) { sheet.getRange(row, 23).setValue('Pendiente'); }
  }
  SpreadsheetApp.flush();
}

/* El disparador reintenta avisos sin modificar la respuesta al consumidor. */
function reenviarPendientes() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(20000)) return;
  try {
    const sheet = getSheet_();
    const last = sheet.getLastRow();
    if (last < 2) return;
    const statuses = sheet.getRange(2, 22, last - 1, 2).getValues();
    statuses.forEach((status, index) => {
      if ((status[0] !== 'Enviado' && status[0] !== 'No indicado') || status[1] !== 'Enviado') sendPending_(sheet, index + 2);
    });
  } finally { lock.releaseLock(); }
}

function receiptText_(id, registeredAt, data) {
  return [
    'HOJA DE RECLAMACIÓN Nº ' + id,
    'Fecha y hora de registro (Lima): ' + registeredAt,
    'Proveedor: ' + BOOK.provider + ' · RUC ' + BOOK.ruc,
    'Domicilio fiscal del proveedor: ' + data.supplierAddress,
    '', 'IDENTIFICACIÓN DEL CONSUMIDOR',
    'Nombres y apellidos: ' + data.name, 'Documento: ' + data.document,
    'Domicilio: ' + (data.address || 'No indicado'), 'Correo: ' + (data.email || 'No indicado'), 'Teléfono: ' + (data.phone || 'No indicado'),
    '¿Menor de edad?: ' + data.minor, 'Padre, madre o apoderado: ' + (data.guardian || 'No aplica'),
    '', 'BIEN O SERVICIO', 'Tipo: ' + data.itemType,
    'Monto reclamado: ' + (data.amount ? 'S/ ' + data.amount : 'No indicado'),
    'Descripción: ' + data.itemDescription, '', 'RECLAMACIÓN', 'Tipo: ' + data.type,
    'Detalle: ' + data.details, 'Pedido: ' + data.request,
    'Medio solicitado para la respuesta: ' + data.responseChannel,
    '', 'INFORMACIÓN ADICIONAL',
    ...(data.additional || []).map(item => item.question + ' ' + item.answer),
    '', 'DECOKASA responderá por escrito en un plazo máximo de 15 días hábiles, improrrogables.',
    'La presentación de esta reclamación no impide acudir a otras vías de solución ni es requisito previo para denunciar ante Indecopi.'
  ].join('\n');
}

function escapeHtml_(value) {
  return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function receipt_(record, data) {
  const emailStatus = !data.email ? 'No se indicó un correo. Guarda o imprime esta constancia.' :
    record[21] === 'Enviado' ? 'Se solicitó el envío de una copia al correo indicado. Revisa tu bandeja de entrada y spam.' :
    'La copia por correo está pendiente. Guarda o imprime esta constancia; reintentaremos el envío.';
  const body = escapeHtml_(receiptText_(record[0], record[1], data));
  return HtmlService.createHtmlOutput('<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Constancia de reclamación</title><style>body{font:16px/1.55 system-ui,sans-serif;color:#222;max-width:760px;margin:32px auto;padding:0 20px}h1{font-size:1.65rem}pre{font:inherit;white-space:pre-wrap;overflow-wrap:anywhere;border:1px solid #ddd;border-radius:8px;padding:20px}button{background:#f4cb36;border:0;border-radius:6px;padding:12px 20px;font:inherit;font-weight:bold;cursor:pointer}@media print{button{display:none}}</style></head><body><h1>Tu reclamación fue registrada</h1><p>' + escapeHtml_(emailStatus) + '</p><button type="button" onclick="window.print()">Imprimir o guardar como PDF</button><pre>' + body + '</pre></body></html>');
}

function errorPage_(message) {
  return HtmlService.createHtmlOutput('<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Revisa tu solicitud</title><body style="font:16px/1.5 system-ui,sans-serif;max-width:620px;margin:3rem auto;padding:0 1rem"><h1>No pudimos confirmar el envío</h1><p>' + escapeHtml_(message) + '</p><p>Regresa con el botón Atrás de tu navegador para revisar la información.</p></body></html>');
}
